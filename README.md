<div align="center">

<img src="https://img.shields.io/badge/apex-resume-6366f1?style=for-the-badge&logo=lightning&logoColor=white" alt="Apex Resume" />

# Apex Resume

### AI-Powered Resume Optimization Platform

**Don't just pass the ATS. Make humans remember you.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-apex--resume-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://apex-resume-ivory.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Python](https://img.shields.io/badge/Python%203.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

</div>

---

## What is Apex Resume?

Apex Resume is a **production-deployed SaaS platform** that helps job seekers optimize their resumes using AI-powered analysis. Upload a PDF or DOCX resume and get instant feedback across 6 dimensions — ATS compatibility, content quality, language confidence, impact scoring, readability, and rejection risk detection.

> Built as a real product with real users, not a tutorial project.

---

## Live Demo

**[apex-resume-ivory.vercel.app](https://apex-resume-ivory.vercel.app)**

- Sign up with Google (via Clerk)
- Upload your resume (PDF or DOCX)
- Get a full ATS analysis in under 60 seconds
- Practice interview questions and generate cover letters

---

## Key Features

| Feature | Description |
|---|---|
| 🎯 **ATS Score Engine** | Scores resumes across 6 weighted dimensions |
| 🚨 **Rejection Risk Radar** | Identifies specific red flags causing silent rejections |
| ✍️ **Bullet Point Analyzer** | Detects passive language, missing metrics, weak verbs |
| 🤖 **AI Bullet Rewriter** | Rewrites weak bullets using Claude AI (with rule-based fallback) |
| 🎤 **Interview Prep** | Role-specific question banks with STAR framework hints |
| 📝 **Cover Letter Generator** | Template-based generator with download support |
| 📊 **Resume Dashboard** | Manage multiple resume versions with analysis history |
| ⚙️ **Settings & Profile** | Real account info powered by Clerk authentication |

---

## Tech Stack

### Frontend
- **Next.js 15** (App Router, TypeScript, Server Components)
- **Tailwind CSS v4** (CSS-based config, no tailwind.config.ts)
- **Framer Motion** — premium animations
- **shadcn/ui + Radix UI** — accessible component system
- **TanStack Query** — server state management
- **Zustand** — client state management
- **Clerk** — authentication (Google OAuth, email)

### Backend
- **FastAPI** (Python 3.11, async)
- **SQLAlchemy** (async ORM with NullPool for PgBouncer)
- **Pydantic v2** — request/response validation
- **pdfplumber** — PDF text extraction
- **python-docx** — DOCX parsing
- **Anthropic SDK** — Claude AI integration
- **Celery + Redis** — background task queue (architecture ready)

### Infrastructure
- **Supabase** — PostgreSQL database + file storage
- **Vercel** — frontend deployment (CI/CD from GitHub)
- **Render** — backend deployment
- **Clerk** — auth + user management

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (Frontend)                     │
│   Next.js 15 · TypeScript · Tailwind v4 · Clerk Auth   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS + JWT
┌──────────────────────▼──────────────────────────────────┐
│                   Render (Backend)                       │
│        FastAPI · Python 3.11 · SQLAlchemy               │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│   │  PDF Parser │  │  ATS Scorer  │  │  AI Engine   │  │
│   │ pdfplumber  │  │ Rule-based   │  │ Claude API   │  │
│   └─────────────┘  └──────────────┘  └──────────────┘  │
└──────────┬──────────────────────┬───────────────────────┘
           │                      │
┌──────────▼──────┐    ┌──────────▼──────┐
│    Supabase     │    │    Supabase     │
│   PostgreSQL    │    │    Storage      │
│   (Users,       │    │   (PDF/DOCX     │
│   Resumes,      │    │    files)       │
│   Analyses)     │    │                 │
└─────────────────┘    └─────────────────┘
```

---

## ATS Scoring Algorithm

The scoring engine analyzes resumes across 6 weighted dimensions:

```
Overall Score = (ATS Keywords × 20%) + (ATS Format × 15%) +
                (Content Quality × 20%) + (Confidence × 20%) +
                (Impact × 15%) + (Readability × 10%)
```

| Dimension | What it checks |
|---|---|
| ATS Keywords | Keyword match against job description |
| ATS Format | Contact info, section presence, length |
| Content Quality | Power verbs, specificity, bullet structure |
| Confidence | Passive vs active language ratio |
| Impact | Quantification and measurable results |
| Readability | Sentence complexity and structure |

---

## Project Structure

```
apex-resume/
├── frontend/                    # Next.js 15 app
│   ├── app/
│   │   ├── (marketing)/        # Landing page
│   │   ├── (auth)/             # Sign in / Sign up
│   │   └── (app)/              # Dashboard, Resume, Analysis
│   ├── components/
│   │   ├── analysis/           # ScoreReveal, RejectionRadar, BulletAnalyzer
│   │   ├── layout/             # Sidebar, TopNav, MobileNav
│   │   └── resume/             # UploadDropzone
│   └── lib/                    # API clients, hooks, stores
│
└── backend/                     # FastAPI app
    └── app/
        ├── routers/            # API endpoints
        ├── services/           # PDF parser, ATS scorer, AI
        ├── models/             # SQLAlchemy models
        ├── schemas/            # Pydantic schemas
        └── prompts/            # Claude prompt builders
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # Add your API keys
npm run dev                   # http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate         # Windows
pip install -r requirements.txt
cp .env.example .env          # Add your API keys
uvicorn app.main:app --reload # http://localhost:8000
```

### Required Services (all free tiers)
| Service | Purpose | Free Tier |
|---|---|---|
| [Clerk](https://clerk.com) | Authentication | 10K MAU |
| [Supabase](https://supabase.com) | Database + Storage | 500MB DB, 1GB Storage |
| [Anthropic](https://anthropic.com) | Claude AI | Pay per use |
| [Vercel](https://vercel.com) | Frontend hosting | Free |
| [Render](https://render.com) | Backend hosting | Free |

---

## API Endpoints

```
POST   /api/v1/resumes/upload        Upload and parse resume
GET    /api/v1/resumes               List all resumes
GET    /api/v1/resumes/{id}          Get resume details
DELETE /api/v1/resumes/{id}          Delete resume

POST   /api/v1/analyses              Trigger AI analysis
GET    /api/v1/analyses/{id}/status  Poll analysis status
GET    /api/v1/analyses/{id}         Get analysis results
GET    /api/v1/analyses/by-resume/{id} Get all analyses for resume

POST   /api/v1/ai/rewrite-bullet     AI bullet rewriter
GET    /api/v1/users/me              Get current user
POST   /api/v1/users/sync            Sync Clerk user to DB
```

Full interactive docs: `https://apex-resume-backend.onrender.com/docs`

---

## What I Built (Resume Highlights)

- Designed and shipped a **full-stack SaaS product** from scratch — PRD → architecture → deployment
- Built a **6-dimension ATS scoring engine** with weighted algorithm and rule-based NLP
- Integrated **Claude AI (Anthropic)** for intelligent resume analysis and bullet rewriting
- Implemented **async FastAPI backend** with SQLAlchemy, NullPool for PgBouncer compatibility
- Configured **production CI/CD pipeline** — GitHub → Vercel (frontend) + Render (backend)
- Solved **cross-origin authentication** with Clerk JWT + custom Bearer token verification
- Built **real-time analysis polling** with exponential status checking and graceful error handling

---

## Roadmap

- [x] Core ATS analysis engine
- [x] Resume upload + PDF parsing
- [x] Rejection Risk Radar
- [x] AI Bullet Rewriter
- [x] Interview Prep question bank
- [x] Cover Letter Generator
- [x] Mobile responsive UI
- [ ] Clerk production keys
- [ ] Stripe payment integration
- [ ] Real-time AI analysis (Claude streaming)
- [ ] LinkedIn profile analyzer
- [ ] Resume version comparison

---

## Author

**Prashik Dongre**
B.Tech Computer Science · Xavier Institute of Engineering, Mumbai

[![GitHub](https://img.shields.io/badge/GitHub-PRASHIK16-181717?style=flat&logo=github)](https://github.com/PRASHIK16)

---

<div align="center">
<sub>Built with ❤️ for job seekers everywhere · © 2026 Prashik Dongre</sub>
</div>