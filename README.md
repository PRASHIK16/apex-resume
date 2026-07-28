# Apex Resume — AI-Powered Resume Optimization

> Don't just pass the ATS. Make humans remember you.

## Quick Start

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # fill in your keys
npm run dev                   # http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate    # Mac/Linux
pip install -r requirements.txt
cp .env.example .env          # fill in your keys
uvicorn app.main:app --reload # http://localhost:8000
```

## Required Services (all have free tiers)
| Service | Purpose | URL |
|---|---|---|
| Clerk | Authentication | clerk.com |
| Supabase | Database + Storage | supabase.com |
| Anthropic | Claude AI | anthropic.com |
| OpenAI | GPT-4o + Embeddings | platform.openai.com |
| Upstash | Redis Cache | upstash.com |

## Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind v4, Framer Motion, shadcn/ui
- **Backend**: FastAPI, SQLAlchemy, Celery, pdfplumber
- **Database**: PostgreSQL via Supabase + pgvector
- **AI**: Claude 3.5 Sonnet + GPT-4o
