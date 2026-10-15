#!/usr/bin/env python3
"""Build author manuscripts and research images from read-only Git snapshots.

Requires TeX Live (latexmk, biber, epstopdf), Poppler, and ImageMagick.
All compilation and intermediate writes stay inside this site's ignored tmp/ tree.
"""
import argparse
import concurrent.futures
import hashlib
import io
import json
import os
from pathlib import Path
import platform
import shutil
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parent.parent
STAGE = ROOT / 'tmp/papers'
SPECS = [
    dict(venue='tro', repo='Distributed-Cooperative-Planning-for-Heterogeneous-Vehicles',
         commit='bb3d1c3', paths=['final/source', 'photo/experiment/intersection_6/2.png'], directory='final/source', tex='manuscript.tex',
         key='wu_cooperative_2026', year=2026),
    dict(venue='ral', repo='manuver_interpolation_paper', commit='8872254',
         paths=['RAL_version', 'photo', 'bibtex'], directory='RAL_version', tex='main.tex', key='wu_quaternion-based_2024', year=2024,
         staged_correction=r'Empty figure reference on manuscript page 6: \ref{} -> \ref{fig:quaternion_interpolation} (Fig. 3), authorized by the author'),
    dict(venue='iros', repo='Collision-free Smooth Control Barrier Function for Convex Primitives',
         commit='b4064a0', paths=['paper', 'reference/IEEEabrv.bib', 'reference/papers.bib'], directory='paper', tex='main.tex', key='wu_collision-free_2025', year=2025),
    dict(venue='icra', repo='GPU-Accelerated-Optimization-Based-Collision-Avoidance',
         commit='3843ccd', paths=['note', 'photo', 'reference/IEEEabrv.bib', 'reference/papers.bib'], directory='note', tex='main.tex', key='wu_gpu-accelerated_2024', year=2024),
]
IMAGES = [
    ('tro', 'final/source/distributed_framework.pdf', 'tro-framework.png'),
    ('ral', 'photo/ellipsoid_interp.eps', 'ral-formation.png'),
    ('iros', 'paper/photo/separating_hyperplane.eps', 'iros-separating-hyperplane.png'),
    ('icra', 'photo/overview_new.jpg', 'icra-framework.jpg'),
]
VIDEO_NAMES = ['tro-2026', 'iros-2025', 'icra-2024']



def run(args, cwd=None, log=None, env=None):
    if log:
        with log.open('w') as stream:
            subprocess.run(args, cwd=cwd, env=env, stdout=stream, stderr=subprocess.STDOUT, check=True)
    else:
        subprocess.run(args, cwd=cwd, env=env, check=True)


def git(repo, *args):
    return subprocess.check_output(['git', *args], cwd=repo)


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def snapshot(repo):
    files = git(repo, 'ls-files', '-z').decode().split('\0')
    return dict(path=str(repo), head=git(repo, 'rev-parse', 'HEAD').decode().strip(),
                status=git(repo, 'status', '--porcelain=v1', '-uall').decode(),
                tracked={f: sha(repo / f) if (repo / f).is_file() else None for f in files if f})


def build(spec):
    work = STAGE / spec['venue'] / spec['directory']
    run(['latexmk', '-gg', '-pdf', '-interaction=nonstopmode', '-halt-on-error',
         '-shell-escape', spec['tex']], cwd=work, log=STAGE / (spec['venue'] + '-build.log'))
    print('Compiled', spec['venue'], flush=True)


def biber_env():
    env = os.environ.copy()
    binary = shutil.which('biber')
    if platform.system() == 'Darwin' and 'universal binary' in subprocess.check_output(['file', binary]).decode():
        native = STAGE / 'bin'
        native.mkdir(exist_ok=True)
        run(['lipo', binary, '-thin', platform.machine(), '-o', str(native / 'biber')])
        (native / 'biber').chmod(0o755)
        env['PATH'] = str(native) + os.pathsep + env['PATH']
    return env


def notices():
    work = STAGE / 'notices'
    work.mkdir(exist_ok=True)
    header = r'''\documentclass[11pt,a4paper]{article}
\usepackage[T1]{fontenc}
\usepackage[default]{sourcesanspro}
\usepackage[margin=27mm]{geometry}
\usepackage{microtype,xcolor}
\definecolor{accent}{HTML}{254F70}
\usepackage[backend=biber,style=ieee,maxbibnames=99,maxcitenames=99,doi=true,url=false,isbn=false]{biblatex}
\usepackage[colorlinks=true,urlcolor=accent,linkcolor=accent]{hyperref}
\AtEveryCitekey{\clearfield{addendum}\clearfield{note}}
\setlength{\parindent}{0pt}
\setlength{\parskip}{12pt}
\pagestyle{empty}
'''
    header += '\\addbibresource{' + str(ROOT / 'assets/bibliography/publications.bib') + '}\n\\begin{document}\n'
    pages = []
    for spec in SPECS:
        pages.append(r'''{\small\color{accent} ZEMING WU\quad /\quad RESEARCH PUBLICATIONS}\par
\vspace{22mm}
{\Huge\bfseries Author-accepted\\[3pt] manuscript}\par
\vspace{9mm}
{\large Published citation}\par
\fullcite{''' + spec['key'] + r'''}\par
\vspace{6mm}
This is the author's accepted manuscript. Please cite the published IEEE article using the DOI above.
The manuscript follows this notice page.\par
\vfill
{\small
\textcopyright\ ''' + str(spec['year']) + r''' IEEE. Personal use of this material is permitted.
Permission from IEEE must be obtained for all other uses, in any current or future media,
including reprinting/republishing this material for advertising or promotional purposes,
creating new collective works, for resale or redistribution to servers or lists, or reuse
of any copyrighted component of this work in other works.}\par
''')
    (work / 'notices.tex').write_text(header + '\\newpage\n'.join(pages) + '\\end{document}\n')
    run(['latexmk', '-pdf', '-interaction=nonstopmode', '-halt-on-error', 'notices.tex'],
        cwd=work, env=biber_env(), log=STAGE / 'notice-build.log')
    run(['pdfseparate', str(work / 'notices.pdf'), str(work / 'notice-%d.pdf')])
    return work


def export_images():
    provenance = []
    figure_numbers = dict(tro=4, ral=1, iros=1, icra=3)
    for venue, source, output in IMAGES:
        original = STAGE / venue / source
        vector = original
        if original.suffix == '.eps':
            vector = STAGE / (venue + '-source-figure.pdf')
            run(['epstopdf', str(original), '--outfile=' + str(vector)])
        if vector.suffix == '.pdf':
            prefix = STAGE / (Path(output).stem + '-render')
            run(['pdftoppm', '-singlefile', '-r', '180', '-png', str(vector), str(prefix)])
            raster = prefix.with_suffix('.png')
        else:
            raster = original
        # Only RA-L needs a standalone figure. Other figures are thumbnail inputs.
        dest = (ROOT / 'assets/img/research' if venue == 'ral' else STAGE) / output
        run(['magick', str(raster), '-auto-orient', '-resize', '1600x1600>', '-strip', '-quality', '88', str(dest)])
        thumb = ROOT / 'assets/img/publication_preview' / output
        run(['magick', str(dest), '-resize', '640x640>', '-strip', '-quality', '86', str(thumb)])
        record = dict(venue=venue, source=source, figure=figure_numbers[venue],
                      source_sha256=sha(original), thumbnail=str(thumb.relative_to(ROOT)), thumbnail_sha256=sha(thumb))
        if venue == 'ral':
            record.update(asset=str(dest.relative_to(ROOT)), sha256=sha(dest))
        provenance.append(record)
    return provenance


def probe(path):
    return json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(path)]))


def export_poster(name):
    video = ROOT / 'assets/video/web' / (name + '.mp4')
    poster = ROOT / 'assets/img/research' / (name + '-poster.jpg')
    seconds = 2.0
    command = ['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(seconds), '-i', str(video),
               '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '3', str(poster)]
    run(command)
    portable = [str(Path(arg).relative_to(ROOT)) if arg.startswith(str(ROOT) + os.sep) else arg for arg in command]
    return dict(poster=str(poster.relative_to(ROOT)), poster_time_seconds=seconds,
                poster_sha256=sha(poster), poster_command=portable)


def export_video(name):
    source = ROOT / 'assets/video' / (name + '.mp4')
    dest = ROOT / 'assets/video/web' / (name + '.mp4')
    staged = STAGE / (name + '-web.mp4')
    info = probe(source)
    original_video = next(stream for stream in info['streams'] if stream['codec_type'] == 'video')
    command = ['ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
               '-map', '0:v:0', '-map', '0:a?']
    if original_video['codec_name'] == 'h264':
        command += ['-c', 'copy']
    else:
        command += ['-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '160k']
    command += ['-movflags', '+faststart', str(staged)]
    run(command, log=STAGE / (name + '-video.log'))
    shutil.move(str(staged), dest)
    final = probe(dest)
    output_video = next(stream for stream in final['streams'] if stream['codec_type'] == 'video')
    assert output_video['codec_name'] == 'h264'
    assert (original_video['width'], original_video['height']) == (output_video['width'], output_video['height'])
    assert abs(float(info['format']['duration']) - float(final['format']['duration'])) < 0.25
    assert sum(s['codec_type'] == 'audio' for s in info['streams']) == sum(s['codec_type'] == 'audio' for s in final['streams'])
    # Record portable commands rather than machine-specific paths.
    portable = [str(Path(arg).relative_to(ROOT)) if arg.startswith(str(ROOT) + os.sep) else arg for arg in command]
    print('Prepared video', name, flush=True)
    return dict(source=str(source.relative_to(ROOT)), source_sha256=sha(source),
                asset=str(dest.relative_to(ROOT)), sha256=sha(dest), codec=output_video['codec_name'],
                width=output_video['width'], height=output_video['height'],
                duration_seconds=float(final['format']['duration']),
                audio=any(stream['codec_type'] == 'audio' for stream in final['streams']),
                command=portable, **export_poster(name))


def export_videos():
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        return list(pool.map(export_video, VIDEO_NAMES))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--papers-root', type=Path, default=Path.home() / 'Papers')
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument('--media-only', action='store_true', help='Update images/videos while retaining existing manuscript PDFs')
    modes.add_argument('--posters-only', action='store_true', help='Extract 0:02 title frames from existing web videos; no paper repositories needed')
    args = parser.parse_args()
    STAGE.mkdir(parents=True, exist_ok=True)
    for directory in ['assets/pdf', 'assets/img/research', 'assets/img/publication_preview', 'assets/video/web']:
        (ROOT / directory).mkdir(parents=True, exist_ok=True)
    if args.posters_only:
        manifest_path = ROOT / 'docs/research-assets.json'
        manifest = json.loads(manifest_path.read_text())
        for video in manifest['videos']:
            assert sha(ROOT / video['asset']) == video['sha256'], video['asset']
            name = Path(video['asset']).stem
            video.update(export_poster(name))
            assert sha(ROOT / video['asset']) == video['sha256'], video['asset']
            print('Updated 0:02 poster:', name, flush=True)
        manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
        return
    before = {s['venue']: snapshot(args.papers_root / s['repo']) for s in SPECS}
    (STAGE / 'source-state-build-before.json').write_text(json.dumps(before, indent=2))
    try:
        for spec in SPECS:
            target = STAGE / spec['venue']
            target.mkdir(exist_ok=True)
            paths = [source for venue, source, _ in IMAGES if venue == spec['venue']] if args.media_only else spec['paths']
            archive = git(args.papers_root / spec['repo'], 'archive', spec['commit'], '--', *paths)
            with tarfile.open(fileobj=io.BytesIO(archive)) as stream:
                stream.extractall(target, filter='data')
            if spec['venue'] == 'ral' and not args.media_only:
                tex = target / spec['directory'] / spec['tex']
                content = tex.read_text()
                old = r'as shown in Fig. \ref{}.'
                new = r'as shown in Fig. \ref{fig:quaternion_interpolation}.'
                if content.count(old) != 1:
                    raise RuntimeError('Expected exactly one authorized RA-L reference correction.')
                tex.write_text(content.replace(old, new))
        manifest_path = ROOT / 'docs/research-assets.json'
        if args.media_only:
            papers = json.loads(manifest_path.read_text())['papers']
            for paper in papers:
                assert sha(ROOT / paper['asset']) == paper['sha256'], paper['asset']
        else:
            with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
                list(pool.map(build, SPECS))
            covers = notices()
            papers = []
            for page, spec in enumerate(SPECS, 1):
                manuscript = STAGE / spec['venue'] / spec['directory'] / Path(spec['tex']).with_suffix('.pdf')
                dest = ROOT / 'assets/pdf' / f"{spec['venue']}-{spec['year']}-accepted.pdf"
                staged_pdf = STAGE / dest.name
                run(['pdfunite', str(covers / f'notice-{page}.pdf'), str(manuscript), str(staged_pdf)])
                shutil.move(str(staged_pdf), dest)
                papers.append(dict(venue=spec['venue'], source_repository=spec['repo'],
                                   commit=git(args.papers_root / spec['repo'], 'rev-parse', spec['commit']).decode().strip(),
                                   tex=spec['directory'] + '/' + spec['tex'],
                                   staged_correction=spec.get('staged_correction'),
                                   manuscript_sha256=sha(manuscript), asset=str(dest.relative_to(ROOT)), sha256=sha(dest)))
        manifest = dict(papers=papers, images=export_images(), videos=export_videos(),
                        ieee_policy='https://journals.ieeeauthorcenter.ieee.org/become-an-ieee-journal-author/publishing-ethics/guidelines-and-policies/post-publication-policies/')
        manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')

    finally:
        after = {s['venue']: snapshot(args.papers_root / s['repo']) for s in SPECS}
        (STAGE / 'source-state-build-after.json').write_text(json.dumps(after, indent=2))
        if before != after:
            raise RuntimeError('A paper repository changed during the build; inspect the before/after snapshots.')
        print('Verified all four paper repositories unchanged.', flush=True)


if __name__ == '__main__':
    main()
