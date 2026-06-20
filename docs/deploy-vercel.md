# Vercel Deployment Guide

This guide explains how to deploy the **Collector Dream Factory** Next.js project to Vercel.

## Deployment Steps

1. **Import Project to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/) and click **Add New** > **Project**.
   - Connect your GitHub/GitLab repository and select this project.

2. **Configure Build Settings**:
   - Vercel automatically detects Next.js. Keep the default build command and output directory settings:
     - **Framework Preset**: `Next.js`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Set Environment Variables**:
   Configure the following Environment Variables in the project settings on Vercel:

   | Variable Name | Description | Example Value |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | The production URL of your deployment | `https://yourdomain.com` |
   | `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google Cloud Service Account Email | `your-service-account@project.iam.gserviceaccount.com` |
   | `GOOGLE_PRIVATE_KEY` | Google Service Account Private Key (escape newlines as `\n` or copy-paste directly) | `your-google-private-key` |
   | `GOOGLE_SHEET_ID` | The ID of your target Google Sheet | `1abc123xyz...` |

4. **Deploy**:
   - Click **Deploy**. Vercel will build and host your application.

## Vercel Environment Notes

### ⚠️ Local Image Uploads Limitation

The current image upload API (`app/api/upload/route.ts`) writes files to the local directory `public/uploads/leads`.
- **Issue**: Vercel runs Next.js in a serverless function environment where the filesystem is **read-only** at runtime (except for `/tmp`, which is temporary and not served statically).
- **Behavior on Vercel**: Submitting the Dream Project form with image uploads will fail with a file system write error.
- **Recommended Production Fix**: Replace the local filesystem write in `app/api/upload/route.ts` with a cloud-based storage service, such as:
  - **Cloudinary** (via their Node.js SDK)
  - **Supabase Storage**
  - **AWS S3**
  - **Google Cloud Storage** / Google Drive (to keep it unified with Sheets)
