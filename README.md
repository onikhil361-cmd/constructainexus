# CONSTRUCTAI — Agentic Procurement OS

**PREDICT. DECIDE. PROCURE. VERIFY.**

A fully functional, end-to-end Agentic Construction Material Risk Prediction and Procurement Platform built for a hackathon.

## Tech Stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4**
- **React Router DOM v7**
- **Lucide React** icons

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `VITE_N8N_WEBHOOK_URL` if needed (defaults to the real n8n endpoint):

```
VITE_N8N_WEBHOOK_URL=https://nikhilnick04.app.n8n.cloud/webhook/procurement-schedule-change
```

## Features

- **Real n8n webhook integration** — POSTs to your n8n Cloud workflow
- **Risk Prediction** — LOW / MEDIUM / HIGH / CRITICAL classification
- **Procurement Decision** — WAIT, MONITOR, RESERVE, ORDER_NOW, ESCALATE, etc.
- **Approval Simulation** — Prototype approval flow
- **Verification Console** — End-to-end workflow integrity checks
- **Recovery Protocol** — Automatic failure recovery flow
- **Audit Trail** — localStorage-based prototype audit log
- **Demo Mode** — Full UI with simulated data, no n8n calls
- **Failure Demo** — Simulate verification failure and recovery
- **Presentation Mode** — Fullscreen mode for hackathon judges
- **Agent Architecture** — Interactive clickable system diagram

## Pages

| Route | Page |
|-------|------|
| `/` | Dashboard |
| `/schedule` | Schedule Intelligence (form + analysis) |
| `/risk` | Risk Intelligence |
| `/procurement` | Procurement (decision + action + verification) |
| `/approvals` | Approvals |
| `/audit` | Audit Trail |
| `/architecture` | Agent Architecture |
| `/settings` | Settings + Demo Mode |

## User Journey

```
User → Schedule Change Form
       ↓
       n8n Webhook POST
       ↓
       Data Ingestion (Schedule + Inventory + Suppliers + Weather)
       ↓
       Risk Prediction Agent → risk_level, reason
       ↓
       Procurement Decision Agent → recommended_action, supplier
       ↓
       Approval (Prototype Simulation)
       ↓
       Procurement Action (Simulated)
       ↓
       Verification
       ↓ (success)
       Audit Log
       ↓ (failure)
       Recovery → Recheck Supplier → Reassess → Escalate → Audit
```

## Security

- No API keys in the frontend
- Webhook URL is environment-variable driven
- No credentials stored in code

## Architecture

```
src/
  components/    # Reusable UI components
  pages/         # Route-level pages
  layouts/       # AppLayout, Sidebar, MobileNav
  services/      # n8nService, historyService
  hooks/         # useWorkflow, useDemoMode, usePresentationMode
  types/         # TypeScript interfaces
  utils/         # normalizeN8nResponse, riskColors, formatters, demoData
```
