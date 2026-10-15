#!/usr/bin/env python3
"""Serve the local Jekyll build with byte ranges for native video seeking."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        self.byte_range = None
        header = self.headers.get('Range')
        path = Path(self.translate_path(self.path))
        if not header or not path.is_file():
            return super().send_head()
        match = re.fullmatch(r'bytes=(\d*)-(\d*)', header.strip())
        length = path.stat().st_size
        try:
            if not match or not any(match.groups()) or length == 0:
                raise ValueError('Invalid range')
            left, right = match.groups()
            if left:
                start = int(left)
                end = min(int(right), length - 1) if right else length - 1
            else:
                count = int(right)
                if count <= 0:
                    raise ValueError('Invalid suffix range')
                start, end = max(0, length - count), length - 1
            if start > end or start >= length:
                raise ValueError('Unsatisfiable range')
        except ValueError:
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{length}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        stream = path.open('rb')
        stream.seek(start)
        self.byte_range = (start, end)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(str(path)))
        self.send_header('Content-Range', f'bytes {start}-{end}/{length}')
        self.send_header('Content-Length', str(end - start + 1))
        self.send_header('Last-Modified', self.date_time_string(path.stat().st_mtime))
        self.end_headers()
        return stream

    def copyfile(self, source, outputfile):
        if self.byte_range is None:
            return super().copyfile(source, outputfile)
        start, end = self.byte_range
        remaining = end - start + 1
        while remaining:
            data = source.read(min(65536, remaining))
            if not data:
                break
            outputfile.write(data)
            remaining -= len(data)

    def do_GET(self):
        try:
            super().do_GET()
        except (BrokenPipeError, ConnectionResetError):
            # Native players cancel requests when pausing or seeking.
            pass


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=4000)
    parser.add_argument('--directory', type=Path, default=Path(__file__).resolve().parent.parent / '_site')
    args = parser.parse_args()
    handler = partial(PreviewHandler, directory=str(args.directory.resolve()))
    server = ThreadingHTTPServer(('127.0.0.1', args.port), handler)
    print(f'Local preview: http://127.0.0.1:{args.port}/', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
