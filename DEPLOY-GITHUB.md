# Hosting on GitHub Pages (free)

Same flow as the Anchor and Cardworks sites. All paths in this folder are relative, so it works
from a repo subfolder URL like https://YOUR-USERNAME.github.io/epic-media-site/

## Option A: in a terminal (Claude Code or any shell) with the GitHub CLI
    cd /path/to/epic-media-site
    git init
    git add .
    git commit -m "Epic Media Networks site"
    gh repo create epic-media-site --public --source=. --push
    gh api -X POST repos/YOUR-USERNAME/epic-media-site/pages -f "source[branch]=main" -f "source[path]=/"

The site is live a minute later at:  https://YOUR-USERNAME.github.io/epic-media-site/

## Option B: no terminal
1. github.com -> New repository -> name it epic-media-site -> Public -> Create.
2. "uploading an existing file" -> drag the CONTENTS of this folder in (index.html at the top level) -> Commit.
3. Repo Settings -> Pages -> Source: "Deploy from a branch" -> Branch: main, folder: / (root) -> Save.
4. The URL appears on that Pages screen within a minute or two.

## After it's live
- Edit js/config.js in the repo (pencil icon) to add the Web3Forms key and the Calendly link; commit and it updates.
- Share the Pages URL with the owner. When he's ready for his own domain, Settings -> Pages -> Custom domain.

Notes: the repo is about 15 MB (3D engine, wood catalog, photos), well under GitHub's limits.
The .nojekyll file in this folder is required; it stops GitHub from ignoring the js/ and assets/ folders.
