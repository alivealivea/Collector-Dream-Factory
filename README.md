# Collector Dream Factory

Premium light-theme website for custom figures, life-size collectibles, and made-to-order Hero Pieces in Thailand.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS 4
- Framer Motion

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

## Environment variables

Copy `.env.example` to `.env.local` and provide the required values.

```env
NEXT_PUBLIC_SITE_URL=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
```

If Google Sheet variables are missing, the lead API runs in mock mode and logs submitted lead data.

## Adding Hero Pieces

1. Put images in `public/pieces/[slug]`.
2. Add a row to `content/pieces.sample.csv`.
3. Run:

```bash
npm run import-pieces
```

4. Verify with:

```bash
npm run build
```

See [docs/how-to-add-new-piece.md](docs/how-to-add-new-piece.md) for details.

## Main routes

- `/`
- `/collection/[slug]`
- `/story`
- `/dream-project`
- `/project-status`
- `/faq`
- `/thank-you`

## Notes

- Local development uploads are stored in `public/uploads/leads` and are ignored by Git.
- Replace local upload storage with cloud storage before deploying uploads to a serverless platform.
- The project uses `next.config.ts`.
- Tailwind CSS 4 is configured through `postcss.config.mjs`; a separate Tailwind config file is not required.
