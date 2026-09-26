# Blockchain-Based Certificate Verification

A web platform for tamper-proof issuance and verification of academic/professional certificates, using blockchain to guarantee authenticity. Built as a capstone project.

## Overview

This platform lets institutions issue certificates that are cryptographically anchored on-chain, and lets anyone verify a certificate's authenticity without relying on the issuing institution being reachable or trustworthy at verification time. Once issued, a certificate's record can't be silently altered or forged.

| Role | Name | Responsibilities |
|------|------|-----------------|
| UX/UI + Frontend | March Lyhour | React UI, Verify Portal, Dashboard, Template Editor |
| Backend (API + Blockchain) | **Pery Somnang** | Express API, PDF, hashing, smart contracts |
| Backend (Database) | Sean Pheavyrak Sonya | PostgreSQL schema, DB logic, ethers.js |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Node.js + Express 5 (MVC Architecture) |
| Database | PostgreSQL / Supabase via Prisma ORM |
| Blockchain | Polygon Amoy testnet + Solidity 0.8.19 |
| Smart Contract Tooling | Hardhat 3, Ethers.js v6 |
| Auth | JWT + bcrypt + 2FA |
| PDF & QR | pdf-lib, @pdf-lib/fontkit, qrcode |

---

## Project Structure

```
BC_Certificate_verification/
├── backend/                  # Node.js + Express API
│   ├── server.js
│   ├── src/
│   │   ├── config/database.js
│   │   ├── middleware/auth.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── certificateController.js
│   │   │   └── verifyController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── certificateRoutes.js
│   │   │   └── verifyRoutes.js
│   │   └── utils/
│   │       ├── hash.js
│   │       ├── pdfGenerator.js
│   │       ├── qrGenerator.js
│   │       └── blockchain.js
│   ├── prisma/schema.prisma  # Database schema
│   └── uploads/              # Generated PDFs
├── contracts/
│   └── CertificateVerification.sol  # Smart contract
├── scripts/
│   └── deploy.js             # Hardhat deploy to Polygon Amoy
├── test/
│   └── CertificateVerification.test.js
├── deployments/              # Auto-generated after deploy
└── frontend/                 # React UI + Vite
```

---

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register issuer account |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/auth/2fa/setup` | Setup 2FA TOTP |

### Certificates (requires Bearer token)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/certificates` | Create single certificate + generate PDF + QR |
| POST | `/api/certificates/bulk` | Bulk issue certificates from CSV |
| GET | `/api/certificates` | List certificates |
| GET | `/api/certificates/:id` | Get certificate details + QR code |

### Verification (public)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/verification/:id` | Verify by certificate ID (QR scan) |
| POST | `/api/verification/verify-file` | Verify by uploading original PDF hash |

---

## Local Setup

### 1. Backend

```bash
cd backend
npm install
npm run db:generate  # generate Prisma client
npm run db:migrate   # run migrations
npm run dev          # starts on port 5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev          # starts on Vite dev server
```

### 3. Smart Contract (Hardhat)

```bash
# From project root
npm install

# Run tests
npx hardhat test

# Deploy to Polygon Amoy testnet
npx hardhat run scripts/deploy.js --network amoy
```

---

## Environment Variables (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

# Blockchain
WALLET_PRIVATE_KEY=0x...
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
CONTRACT_ADDRESS=0x...
POLYGONSCAN_API_KEY=

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/authentix
```

---

## Project Documentation

- IEEE-structured SRS document: [Specification Document](https://docs.google.com/document/d/1Xw0oKuLr86iDyYGZbIhXWEj7BV_rlc9PoqxNlMEruTc/edit?tab=t.0)
- Testnet Explorer: [Polygon Amoy Explorer](https://amoy.polygonscan.com)
