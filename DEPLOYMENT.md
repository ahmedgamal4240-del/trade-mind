# Deployment Guide for TradeMind

Since your app has a separate **Frontend (Next.js)** and **Backend (Python FastAPI)**, we will deploy them to the best platforms for each:

*   **Frontend** -> **Vercel** (Best for Next.js)
*   **Backend** -> **Render** (Best for Python/Docker)

## Part 1: Backend Deployment (Render)

1.  **Sign Up/Login**: Go to [dashboard.render.com](https://dashboard.render.com/) and log in (you can use your GitHub account).
2.  **New Blueprint**: Click **New +** and select **Blueprint**.
3.  **Connect GitHub**: Connect your GitHub account and select the `trade-mind` repository.
4.  **Auto-Deploy**: Render will detect the `render.yaml` file I just added and automatically configure the backend service.
5.  **Environment Variables**:
    *   During setup (or in Settings > Environment), you will need to enter your real API keys:
        *   `SUPABASE_URL`
        *   `SUPABASE_KEY`
        *   `GEMINI_API_KEY`
6.  **Apply**: Click **Apply** to start the build.
    *   *Note: Free tier spins down after inactivity, so the first request might be slow.*

## Part 2: Frontend Deployment (Vercel)

1.  **Sign Up/Login**: Go to [vercel.com](https://vercel.com/) and log in with GitHub.
2.  **Add New Project**: Click **Add New...** -> **Project**.
3.  **Import Repo**: Find `trade-mind` and click **Import**.
4.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `frontend`. **(Crucial Step!)**
    *   **Framework Preset**: It should auto-detect **Next.js**.
    *   **Environment Variables**: Add any variables from your `.env.local` (if secure).
        *   Note: Since the backend URL will change, you'll need to update the frontend to point to the new Render URL properly (usually via `NEXT_PUBLIC_API_URL` environment variable).
5.  **Deploy**: Click **Deploy**.

## Part 3: Connecting Them

1.  Once the **Backend** is live on Render, copy its URL (e.g., `https://trade-mind-backend.onrender.com`).
2.  Go to your **Vercel Project Settings** -> **Environment Variables**.
3.  Add a new variable:
    *   Key: `NEXT_PUBLIC_API_URL`
    *   Value: `https://trade-mind-backend.onrender.com` (Your Render URL)
4.  **Redeploy** the Frontend on Vercel for this to take effect.
