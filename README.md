# Nocta Studios website

Next.js 15, React 19, TypeScript, Tailwind CSS. One-page site with a multi-step order form that emails every order to edimitriou47@gmail.com.

## 1. Install and run locally
Requires Node.js 18.18 or newer.
```
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000.

## 2. Configure email delivery (Resend)

When a customer presses SUBMIT PROJECT, the form posts to `POST /api/submit-project`. The server validates and sanitizes the data, calculates the price from the chosen package (the browser's price is never trusted), generates an order ID and sends the email through the official Resend SDK. The customer sees the confirmation with the order ID only after Resend accepts the email. If it fails, the customer sees a clear, non-technical error and keeps their answers, and the real reason is written to the server logs.

1. Create a free account at https://resend.com and create an API key. Sign up with edimitriou47@gmail.com.
2. Set the variables (see `.env.example`). Locally use `.env.local`, on Vercel use Settings, Environment Variables:
   - `RESEND_API_KEY`: your key (server-side only, never prefix it with NEXT_PUBLIC_)
   - `EMAIL_FROM`: `Nocta Studios <onboarding@resend.dev>` while testing
   - `EMAIL_TO`: `edimitriou47@gmail.com`
3. Testing with `onboarding@resend.dev`: Resend only delivers this sender to the email address of your own Resend account, so use edimitriou47@gmail.com there.
4. Production: in Resend add and verify your domain (DNS records), then set `EMAIL_FROM=Nocta Studios <orders@your-domain.com>`.
5. Set `NEXT_PUBLIC_SITE_URL` to your real URL.

Protections: server-side validation, a 20 KB request limit, input sanitizing, a hidden spam-trap field, a basic per-IP rate limit, and duplicate protection for retries. The rate limit and duplicate memory are per server instance, so they are best-effort on serverless hosting.

## 3. Build
```
npm run build
npm start
```

## 4. Deploy (Vercel)
1. Push the project to a GitHub repository.
2. In Vercel choose Add New, Project, import the repository.
3. Add the variables from `.env.example` under Environment Variables, then Deploy.

## 5. Connect your domain
Vercel project, Settings, Domains, add your domain and follow the DNS records shown at your registrar. Update `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy.

## 6. Google Search Console
1. Go to https://search.google.com/search-console and add your domain as a property.
2. Verify with the DNS TXT record at your registrar.
3. Open Sitemaps and submit `sitemap.xml`. It is generated at `https://your-domain.com/sitemap.xml`, and `robots.txt` points to it.

## Test the order flow
Homepage, Pricing, Order Now, complete the 8 steps, check the summary, Submit project, confirm the email arrives at edimitriou47@gmail.com.

## Editing
Prices, services, FAQ and form options live in `lib/data.ts`.
