# Setup Guide — Step by Step

## Step 1: Clerk (Authentication)
1. Go to https://clerk.com → Sign up for free
2. Create a new application
3. Name it: Apex Resume
4. Enable Google as a sign-in option
5. Copy your keys to frontend/.env.local

## Step 2: Supabase (Database + Storage)
1. Go to https://supabase.com → Sign up for free
2. Create a new project
3. Name it: apex-resume
4. Wait for it to set up (2 minutes)
5. Go to Settings → API → copy URL and keys
6. Go to Storage → Create bucket named: resumes (make it Private)
7. Go to SQL Editor → run the migration in backend/alembic/manual_migration.sql

## Step 3: Anthropic (Claude API)
1. Go to https://console.anthropic.com → Sign up
2. Go to API Keys → Create key
3. Copy key to backend/.env

## Step 4: OpenAI (GPT-4o + Embeddings)
1. Go to https://platform.openai.com → Sign up
2. Go to API Keys → Create key
3. Copy key to backend/.env

## Step 5: Run it
```bash
# Terminal 1
cd frontend && npm install && npm run dev

# Terminal 2
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
```
