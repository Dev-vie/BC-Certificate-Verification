# 🤝 VeriCert Project Coordination & Competition Roadmap

This document outlines team responsibilities, API contracts, environment checklists, and competition presentation goals for **VeriCert**.

---

## 🎯 Competition Project Overview

- **Project Name**: VeriCert (Next-Gen Blockchain Certificate Platform)
- **Tagline**: Decentralized, tamper-proof academic and professional credential verification powered by Polygon
- **Target Audience / Judges**: Universities, accreditation bodies, employers, and competition review panels

---

## 👥 Core Technical Roles

| Role | Domain | Responsibilities |
|---|---|---|
| **Fullstack Lead** | Next.js API & Architecture | Next.js App Router Route Handlers, authentication (JWT + 2FA), PDF generation, storage integration |
| **Frontend Lead** | UI/UX & Portal | React 19 UI, dashboard analytics, visual template designer, QR scanner, public verification |
| **Blockchain Lead** | Web3 & Smart Contracts | Solidity contract design, Polygon Amoy deployment, gas optimization, ethers.js v6 integration |

---

## 📋 Integration Specifications

### 1. Database Schema (Prisma / PostgreSQL)
- **`Institution`**: Authentication credentials, 2FA secret, profile information.
- **`Template`**: Visual certificate templates, background asset paths, dynamic field coordinates (`placeholders`).
- **`Certificate`**: Student/recipient details, issuance dates, SHA-256 cryptographic hash, on-chain transaction hash (`txHash`), block number, contract address.

### 2. Cryptographic Hash Agreement
- **Algorithm**: Standard SHA-256
- **Format**: 64-character lowercase hexadecimal string (`hash`)
- **Blockchain Storage**: Converted to `bytes32` (`0x...`) when writing to the Solidity smart contract.

### 3. Public Verification Endpoint (`GET /api/verification/:certificateId`)
```json
{
  "valid": true,
  "blockchainStatus": "VALID",
  "certificate": {
    "certificateId": "VC-2026-DEMO-0001",
    "recipientName": "Alex Rivera",
    "recipientId": "STU-88921",
    "course": "Advanced Blockchain Architecture",
    "grade": "Distinction",
    "issueDate": "2026-09-29T00:00:00.000Z",
    "status": "issued",
    "issuedBy": "VeriCert Institute of Technology",
    "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "txHash": "0x3f5c71b689a946e3d23f2b45e7587efc37cf3a9033320f7961b7ee9c4456942c",
    "blockNumber": 12948201,
    "contractAddress": "0x1234567890123456789012345678901234567890"
  },
  "onChain": {
    "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "exists": true,
    "revoked": false,
    "issuerAddress": "0x...",
    "issuedAt": "2026-09-29T00:00:00.000Z",
    "certId": "VC-2026-DEMO-0001"
  }
}
```

### 4. QR Code Format
- **Target URL**: `{FRONTEND_URL}/verify/{certificateId}`
- **Example**: `http://localhost:5173/verify/VC-2026-DEMO-0001`
- Instantly directs camera scans and mobile devices to the public verification portal.

---

## 🏆 Competition Presentation Checklist

- [x] Modern Next.js App Router backend implemented
- [x] Zero-warning compilation and clean CORS configuration
- [x] Visual template canvas designer with coordinate mapping
- [x] Vector PDF generator with high-resolution QR integration
- [x] Real-time SHA-256 file upload tamper analysis
- [x] Polygon Amoy testnet smart contract anchoring
- [x] One-command database seeder for live jury demonstrations (`npm run db:seed`)
- [x] Consistent **VeriCert** branding across frontend, backend, and documentation
