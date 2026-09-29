# 🛡️ VeriCert — Next-Gen Blockchain Certificate Platform

A decentralized, tamper-proof platform for issuing, managing, and verifying academic and professional credentials anchored to the **Polygon Amoy** blockchain.

Built with high security, privacy-preserving cryptographic hashing, and a fullstack modern architecture.

---

## 🚀 Key Highlights & Features

- **Tamper-Proof On-Chain Anchoring**: Certificates are hashed using SHA-256 and immutably registered on Polygon smart contracts.
- **Next.js App Router Backend**: Modern, high-performance TypeScript backend Route Handlers with CORS, security headers, and rate limiting.
- **Visual Certificate Template Designer**: Customizable drag-and-drop template editor with live canvas preview, dynamic placeholders, and custom fonts.
- **Automated PDF & QR Generation**: Generates high-resolution vector PDFs with embedded QR codes that link directly to the verification portal.
- **Single & Batch Issuance**: Issue individual certificates or upload CSV spreadsheets to anchor thousands of credentials in bulk.
- **Instant Public Verification**: Anyone can verify credentials without an account by:
  - Scanning certificate QR code
  - Entering certificate UUID
  - Uploading original PDF file (computes SHA-256 in real time to detect even 1-bit alterations)
- **Revocation Engine**: On-chain and database revocation for compromised or expired credentials.
- **Enterprise Security**:
  - JWT Access & Refresh Token rotation
  - 2FA Multi-Factor Authentication with TOTP (Google Authenticator / Authy compatible)
  - Bcrypt password hashing
  - Role-based authorization

---

## 🛠️ Architecture & Tech Stack

```
                                  ┌───────────────────────────┐
                                  │      Verifier / Public    │
                                  │   (Scan QR / Upload PDF)  │
                                  └─────────────┬─────────────┘
                                                │
┌─────────────────────────────┐                 │
│    Issuer / University      │                 │
│      (Vite + React UI)      │                 │
└──────────────┬──────────────┘                 │
               │                                │
               ▼                                ▼
       ┌────────────────────────────────────────────────┐
       │   VeriCert Backend API (Next.js App Router)     │
       │   - Authentication & 2FA (JWT + TOTP)          │
       │   - Certificate Engine (pdf-lib, QR, SHA-256)  │
       │   - PostgreSQL Database (Prisma ORM)           │
       │   - Storage Engine (Supabase / Local Fallback) │
       └───────────────────────┬────────────────────────┘
                               │
                               ▼
       ┌────────────────────────────────────────────────┐
       │         Polygon Amoy Blockchain Network        │
       │     (Smart Contract: CertificateVerification)   │
       │     - Permanent SHA-256 Hash Ledger            │
       │     - Timestamped Proof of Authenticity        │
       └────────────────────────────────────────────────┘
```

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Redux Toolkit Query, Lucide Icons |
| **Backend API** | Next.js 15 App Router (TypeScript, Route Handlers, Node.js runtime) |
| **Database** | PostgreSQL via Prisma ORM |
| **Storage** | Supabase Storage (with automatic local filesystem fallback) |
| **Blockchain** | Polygon Amoy Testnet, Solidity 0.8.19, Ethers.js v6 |
| **Smart Contract Tooling** | Hardhat, Ethers.js |
| **PDF & QR Engine** | `pdf-lib`, `@pdf-lib/fontkit`, `qrcode` |
| **Authentication** | JWT (Access + Refresh tokens), Bcrypt, 2FA TOTP |

---

## 📂 Project Structure

```
BC_Certificate_verification/
├── backend/                  # Next.js App Router Backend API
│   ├── app/
│   │   ├── api/              # API Route Handlers
│   │   │   ├── auth/         # Register, Login, 2FA, Refresh, Me
│   │   │   ├── certificates/ # Single & Bulk Issuance, Revocation, Details
│   │   │   ├── templates/    # Template Uploads & Coordinates
│   │   │   ├── verification/ # Public QR/ID & File Verification
│   │   │   ├── dashboard/    # Analytics & Metrics
│   │   │   └── health/       # Health Check Endpoint
│   │   ├── layout.tsx
│   │   ├── page.tsx          # API Status & Interactive Dashboard
│   │   └── route.ts          # API Root Info
│   ├── lib/                  # Shared Business Logic & Utilities
│   │   ├── prisma.ts         # Singleton Prisma Client
│   │   ├── auth.ts           # JWT & Bcrypt Utilities
│   │   ├── blockchain.ts     # Ethers.js Polygon Amoy Integration
│   │   ├── pdfGenerator.ts   # pdf-lib PDF Generator
│   │   ├── qrGenerator.ts    # QR Code Generator
│   │   ├── storage.ts        # Supabase / Local Storage Handler
│   │   ├── totp.ts           # 2FA TOTP Generator & Validator
│   │   └── email.ts          # Notification Dispatcher
│   ├── prisma/
│   │   ├── schema.prisma     # PostgreSQL Database Schema
│   │   └── seed.ts           # Demo Database Seeder
│   └── public/uploads/       # Local Asset & Certificate Storage
├── frontend/                 # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── components/       # UI Components & Layouts
│   │   ├── pages/            # Landing, Dashboard, Templates, Verify
│   │   └── redux/            # RTK Query API Services & State
│   └── vite.config.ts        # Vite Dev Server & API Proxy
└── blockchain/               # Smart Contracts & Deployment Scripts
    ├── contracts/
    │   └── CertificateVerification.sol
    ├── scripts/
    │   └── deploy.js
    └── hardhat.config.js
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+ or v24+
- **npm**: v9+
- **PostgreSQL**: (Local PostgreSQL, Supabase, Neon, or Railway)

### 2. Environment Setup

#### Backend (`backend/.env`)
Copy the example configuration:
```bash
cp backend/.env.example backend/.env
```
Key configuration values in `backend/.env`:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vericert?schema=public"

# Blockchain (Polygon Amoy Testnet)
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
CONTRACT_ADDRESS=0x...
WALLET_PRIVATE_KEY=0x...
```

### 3. Database Initialization & Seeding

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed demo data for presentations
npm run db:seed
```
> **Demo Account seeded:**
> - Email: `demo@vericert.edu`
> - Password: `VeriCert2026!`

### 4. Running the Development Servers

In two separate terminals:

```bash
# Terminal 1: Start Next.js Backend API (runs on http://localhost:3000)
npm run dev:backend

# Terminal 2: Start Vite Frontend (runs on http://localhost:5173)
npm run dev:frontend
```

Now open:
- **Web Platform**: [http://localhost:5173](http://localhost:5173)
- **Backend API & Status**: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Reference

### Authentication
- `POST /api/auth/register` — Register a new institution
- `POST /api/auth/verify-email` — Verify email code
- `POST /api/auth/login` — Login with email/password (+ 2FA if enabled)
- `POST /api/auth/refresh-token` — Refresh access token via httpOnly cookie
- `GET /api/auth/me` — Get authenticated institution profile
- `PUT /api/auth/profile` — Update institution name or avatar
- `POST /api/auth/2fa/setup` — Generate 2FA TOTP secret & QR
- `POST /api/auth/2fa/enable` — Enable 2FA verification

### Certificates
- `GET /api/certificates` — List all certificates for institution
- `POST /api/certificates/issue` — Issue single certificate (PDF + QR + Polygon Anchor)
- `POST /api/certificates/issue-bulk` — Bulk issuance from CSV file
- `GET /api/certificates/:id` — Get certificate details
- `PATCH /api/certificates/:id/revoke` — Revoke certificate on-chain
- `DELETE /api/certificates/:id` — Delete certificate record & storage

### Templates
- `GET /api/templates` — List certificate templates
- `POST /api/templates` — Create template with PDF background & placeholder schema
- `PATCH /api/templates/:id` — Update field coordinates & styling
- `DELETE /api/templates/:id` — Delete template

### Public Verification
- `GET /api/verification/:certificateId` — Verify by ID or hash (returns validity & blockchain status)
- `POST /api/verification/verify-file` — Verify by uploading original certificate PDF (SHA-256 comparison)

### Dashboard
- `GET /api/dashboard` — Live metrics (total issued, verified today, active recipients, verification rate)

---

## 📜 Smart Contract Deployment (Polygon Amoy)

```bash
cd blockchain
npm install

# Run contract tests
npx hardhat test

# Deploy to Polygon Amoy testnet
npx hardhat run scripts/deploy.js --network amoy
```

---

## ⚖️ License

Distributed under the MIT License.
