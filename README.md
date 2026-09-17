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
