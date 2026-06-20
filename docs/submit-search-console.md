# Google Search Console & Bing Webmaster Tools Submission Guide

This document outlines the step-by-step process to submit and verify the site, submit the sitemap, and request indexing.

---

## 1. Google Search Console

### Step 1: Add Site to Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Add property** in the property dropdown.
3. Select **URL prefix** and enter the production URL:
   `https://collector-dream-factory.vercel.app/`
4. Choose the **HTML tag** verification method.
5. You will see a meta tag like:
   `<meta name="google-site-verification" content="YOUR_TOKEN" />`
6. Note: We have already added the token to Next.js metadata. The tag is currently active on the live site:
   ```tsx
   // app/layout.tsx
   export const metadata: Metadata = {
     verification: {
       google: "-m72jumF11WFDvngFQWLUWemcllRZQGuA_yMkGFEfOw",
     },
   };
   ```
7. Go back to Search Console and click **Verify**.

### Step 2: Submit Sitemap
1. Inside Google Search Console, go to the left sidebar and click **Sitemaps**.
2. Under **Add a new sitemap**, type `sitemap.xml`.
3. The full URL will be:
   `https://collector-dream-factory.vercel.app/sitemap.xml`
4. Click **Submit**.

### Step 3: Inspect URL & Request Indexing
1. At the top search bar in Search Console, paste your home page URL or any page URL (e.g., `https://collector-dream-factory.vercel.app/`).
2. Search Console will inspect the URL from the index.
3. If it says "URL is not on Google", click **Request Indexing**.
4. This forces Google to crawl the page immediately.

---

## 2. Bing Webmaster Tools

### Step 1: Add Site to Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters/).
2. Sign in and select **Add a site**.
3. You can either import your verified properties directly from Google Search Console (recommended - instant verification) or add it manually.
4. If adding manually:
   - Select **URL prefix** and enter `https://collector-dream-factory.vercel.app/`.
   - Download the `BingSiteAuth.xml` file.
5. Note: We have already uploaded this file to the site's root directory:
   `https://collector-dream-factory.vercel.app/BingSiteAuth.xml`
6. Click **Verify** in Bing Webmaster Tools.

### Step 2: Submit Sitemap
1. In the left navigation pane, click **Sitemaps**.
2. Click **Submit sitemap**.
3. Enter the full sitemap URL:
   `https://collector-dream-factory.vercel.app/sitemap.xml`
4. Click **Submit**.

---

## 3. SEO & AI Bot Verification Checks

### Check Robots.txt
1. Verify that `robots.txt` is accessible and formatted correctly at:
   `https://collector-dream-factory.vercel.app/robots.txt`
2. It must list the sitemap path and allow search and AI crawlers:
   - Googlebot
   - Bingbot
   - GPTBot
   - OAI-SearchBot
   - ChatGPT-User
   - ClaudeBot
   - PerplexityBot
   - CCBot

### Check LLMs.txt
1. Verify that `llms.txt` is accessible and formatted correctly at:
   `https://collector-dream-factory.vercel.app/llms.txt`
2. This file helps AI discovery engines (like ChatGPT, Claude, and Perplexity) read structured information about the site services, taglines, and key URLs.
