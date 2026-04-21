This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Auth setup

Uses NextAuth with Google and Email (magic link) via Resend, with Prisma Adapter.

Add to `.env.local`:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-long-random-secret

DATABASE_URL=postgres://...
DIRECT_URL=postgres://...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

RESEND_API_KEY=...
EMAIL_FROM=InaClub <no-reply@yourdomain.com>

# Optional: Cloudinary unsigned upload for profile images
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dqqez4og6
NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET=unsigned_preset
```

Notes:

- Create a free Resend account and get an API key. You can use a free test domain or a verified custom domain for production.
- The Email provider sends a magic link (OTP-like). First login creates the user automatically via Prisma Adapter.
- Ensure Prisma migrations are applied: `npx prisma migrate dev`.
