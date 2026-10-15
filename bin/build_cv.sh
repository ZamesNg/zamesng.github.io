#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root/cv"
mkdir -p ../tmp/cv ../assets/pdf

# TeX Live's macOS universal Biber can fail while extracting its own executable.
# Use a native copy in the ignored build directory; leave the installation intact.
if [[ "$(uname -s)" == Darwin ]]; then
  biber_binary="$(command -v biber)"
  case "$(file "$biber_binary")" in
    *"universal binary"*)
      mkdir -p ../tmp/cv/bin
      lipo "$biber_binary" -thin "$(uname -m)" -o ../tmp/cv/bin/biber
      chmod +x ../tmp/cv/bin/biber
      export PATH="$repo_root/tmp/cv/bin:$PATH"
      ;;
  esac
fi

latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=../tmp/cv zeming-wu-cv.tex
cp ../tmp/cv/zeming-wu-cv.pdf ../assets/pdf/zeming-wu-cv.pdf
