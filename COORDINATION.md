# 🤝 Coordination: Pery Somnang ↔ Sean Pheavyrak Sonya

This file lists everything Pery needs from Sean (and vice versa) to keep the project moving.
Discuss at every Monday meeting.

---

## Week 1 — Confirm DB choice

**Ask Sean:**
> "Are we using PostgreSQL (Prisma) or MongoDB (Mongoose)? Both are installed. I've configured Prisma + PostgreSQL — please confirm so I don't set up the wrong connection."

**Action for Sean:** Confirm database. If PostgreSQL, share the `DATABASE_URL` for the shared dev server.
Current setup: Prisma + PostgreSQL (see `backend/prisma/schema.prisma`).

---

## Week 2 — User schema

**Ask Sean:**
> "I've defined the `User` model in `prisma/schema.prisma` (id, email, password, name, role). Does it match what you're building for user schema + password hashing? Let me know if you need extra fields."

**What Pery provides:** JWT auth middleware (`src/middleware/auth.js`) using the `User.id` from the DB.
**What Sean provides:** Confirm the User model matches. Sean runs `npm run db:migrate` for Week 2.

---

## Week 3 — Certificate model

**Ask Sean:**
> "The Certificate model is in `prisma/schema.prisma`. It has: title, recipientName, recipientEmail, issuedAt, expiresAt, fileUrl, hash, txHash, blockNumber. Is that enough for your certificate storage logic, or do you need more fields?"

**What Pery provides:** Certificate creation API that creates the DB record.
**What Sean provides:** Confirm the model, run migrations, verify data is stored correctly.

---

## Week 4 — File storage path

**Ask Sean:**
> "PDFs are saved to `/uploads/cert_<id>.pdf` on the server and the URL is stored as `fileUrl` in the Certificate record. Is that format okay for your storage handling, or do you want to use Supabase Storage / S3?"

**If using cloud storage:** Tell Pery which bucket/URL format to save in `fileUrl`.

---

## Week 5 — Hash format agreement

**Ask Sean:**
> "The hash I generate is a hex SHA-256 string (64 chars, e.g. `a3f2c1...`). Is that the format you'll be storing and comparing in the DB? Confirm so we don't have a mismatch on verification."

**Agreed format:** `String` field `hash` on the `Certificate` model, `@unique`. SHA-256 hex, 64 chars.

---

## Week 6 — Verification response shape

**Ask Sean:**
> "When a user uploads a PDF to verify it, my API hashes it and looks it up in the DB. Your Week 6 task is to compare the hash and return ✅/❌. Can we agree on the response shape so the frontend knows what to display?"

**Agreed response (from `verifyController.js`):**
```json
{
  "valid": true | false,
  "status": "VALID" | "INVALID" | "NOT_FOUND",
  "certificate": { "id", "title", "recipientName", "issuedAt", "issuerName", "txHash" },
  "blockchain": { "exists", "revoked", "issuerAddress", "issuedAt", "certId" },
  "hash": "sha256hex..."
}
```

---

## Week 7 — Wallet + testnet environment

**Ask Sean:**
> "For Week 7-8, you're setting up the MetaMask wallet and testnet environment. I need:
> 1. The **wallet private key** for the deployer account (exported from MetaMask, never commit to git)
> 2. The **RPC URL** for Polygon Amoy (default: `https://rpc-amoy.polygon.technology`)
> 3. A PolygonScan API key (optional, for contract verification)
> 4. Some testnet MATIC — get it from https://faucet.polygon.technology/
>
> Once you have these, add them to `backend/.env` as `WALLET_PRIVATE_KEY`, `POLYGON_RPC_URL`, `POLYGONSCAN_API_KEY`."

**What Pery provides:** Smart contract code in `contracts/CertificateVerification.sol` (ready to deploy).

---

## Week 8 — Share contract address + ABI after deployment

**Pery tells Sean after deploying:**
> "Contract deployed at `CONTRACT_ADDRESS=0x...` on Polygon Amoy. Add it to `backend/.env`.
> The ABI is in `backend/src/utils/blockchain.js` (the `CONTRACT_ABI` constant). Use this for your ethers.js integration."

**What Sean does with it:** Week 8 — integrate ethers.js, call `storeCertificate()` when anchoring hashes.

---

## Week 9 — Sync DB + blockchain logic

**Discuss with Sean:**
> "My `verifyController.js` does:
> 1. Look up certificate in DB by ID or file hash
> 2. If `CONTRACT_ADDRESS` is set, call `verifyCertificate(hash)` on-chain
> 3. Return both DB result + blockchain result
>
> Your task is to sync DB + blockchain. Can you make sure the `txHash` and `blockNumber` fields are stored in the Certificate record after anchoring? I read those fields in the verify response."

---

## Week 10 — QR code URL format

**Already agreed:**
QR encodes: `{CLIENT_URL}/verify/{certId}`
Example: `http://localhost:3000/verify/uuid-abc-123`

This hits `GET /api/verify/:id` on the backend.
March (frontend) needs to handle the `/verify/:id` route.

**Tell March:** QR points to `/verify/:id`, display the verification result from `GET /api/verify/:id`.

---

## Week 11 — Edge cases (Sean's task, Pery to support)

Sean handles edge cases. Pery's API already supports:
- ✅ Tampered file → hash mismatch → `status: "INVALID"`
- ✅ Unknown certificate ID → `status: "NOT_FOUND"`
- ✅ Revoked certificate → `revoked: true` in blockchain response

**Ask Sean to test:** Upload a slightly modified PDF and confirm the API returns `INVALID`.

---

## Summary Table

| Week | What to ask Sean | Sean provides |
|------|-----------------|---------------|
| 1 | Confirm PostgreSQL vs MongoDB | Confirm, share DATABASE_URL |
| 2 | Confirm User schema fields | User model + migrations |
| 3 | Confirm Certificate schema fields | Certificate model |
| 4 | Confirm fileUrl / storage format | Confirm or provide cloud storage URL |
| 5 | Confirm hash string format (SHA-256 hex) | Confirm storage, uniqueness |
| 6 | Agree on verify response shape | Confirm / adjust DB queries |
| 7 | **Share wallet private key + testnet MATIC** | WALLET_PRIVATE_KEY, RPC URL |
| 8 | After deploy: share CONTRACT_ADDRESS + ABI | Ethers.js integration |
| 9 | Confirm txHash/blockNumber stored in DB | DB-blockchain sync |
| 10 | Confirm QR URL format with March | QR verification endpoint |
| 11 | Test edge cases together | Edge case DB handling |
