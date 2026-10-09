# APEX Teacher Analytics Dashboard

A static React dashboard for teacher-level and pseudonymous student-level analysis of APEX card-sort responses.

## Access requirements

This repository and its deployment must remain private. The browser build includes pseudonymous student IDs, attempt counts, completion status, time measurements, and instructor names.

For Vercel, enable Deployment Protection for all deployments and distribute only revocable Vercel Shareable Links to authorized users.

## Deploy to Vercel

Vercel reads the deployment settings in `vercel.json`:

- Build command: `npm run build`
- Output directory: `dist`

## Local development

```sh
npm install
npm run dev
```

## Pages

- **Home** (`#/?class=<instructor>__<term>&q=<question>`): the instant view for one class and
  one question. It shows five at-a-glance numbers, the cards worth watching, the top 5 incorrect
  boards, and a table of every card sort this class did.
- **In-depth** (`#/details?...`): checks needed to solve, a card-by-card table with distractor
  flags, the placement heatmap by check number, timing and idle time, and the student roster.

A **check** is one press of Runestone's "Check Me" button.

## Updating the data

From the repository root:

```sh
python pipelines/apex/extract_dragndrop.py   # slow; re-run only when raw DataShop files change
python pipelines/apex/build_dashboard.py     # writes src/data/*.json and src/index.json
```

To add a class, add its raw file to `FILES` in `extract_dragndrop.py` with an instructor and a
term code (`F25`, `S26`, …), and add the term label to `TERM_LABELS` in `build_dashboard.py`.
Thresholds such as the distractor flags (>50% / <10% of students) are constants at the top of
`build_dashboard.py`.

Card moves (`dragNdrop-drop`) were only logged from 2025-10-14. Before that date, timing starts
at a student's first check, and the page labels it that way.
