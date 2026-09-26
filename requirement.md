
1. Introduction 
1.1. Purpose 
The purpose of this system is to provide a secure, tamper-proof platform for issuing and verifying educational certificates using blockchain technology. The system ensures that certificates cannot be forged or altered without detection. 

1.2. Scope 
This system allows institutions to issue certificates digitally and store their cryptographic hash on a blockchain. Users (e.g., employers) can verify authenticity by comparing uploaded certificates or IDs with blockchain records.
Key functionalities:
Certificate issuance with blockchain hash
QR/ID-based verification
Tamper detection system

1.3. Definitions, Acronyms, and Abbreviations
This document defines system requirements including functional and non-functional requirements, architecture, workflows, risks, and success criteria.

2. Overall Description
2.1. User Classes
1. Issuer (Institution / Course Provider)
Admin-level users
Create and manage certificates
Upload student data and generate certificates
2. Verifier (HR / Employer / Public User)
No login required (optional)
Upload certificate or scan QR
View verification results

2.2. Technical Stack
Frontend : Next.js / React 
Backend: Node.js / Express 
Database: PostgreSQL / MongoDB
Blockchain : Ethereum / Polygon (changable)
Storage : IPFS / Cloud Storage 
Authentication: JWT/OAuth




3. Functional Requirements
FR1: User Authentication
Issuers must register and log in securely
Role-based access control
FR2: Certificate Creation
Issuers input student data
System generates certificate (PDF)
FR3: Hash Generation
System generates SHA-256 hash of certificate data
FR4: Blockchain Storage
Hash is stored on blockchain with timestamp
FR5: QR Code Generation
Each certificate includes QR code linked to verification page
FR6: Certificate Verification
User uploads PDF or enters ID
System recomputes hash and compares
FR7: Result Display
Show verification status:
Verified
Tampered / Not Found

3.1. Data Quality & Content Moderation
Validate input fields (name, date, course)
Prevent duplicate certificate entries
Admin moderation for suspicious issuers



3.2. Technical Feasibility
Blockchain APIs (e.g., smart contracts) are widely available
Hashing algorithms are lightweight and efficient
Cloud infrastructure ensures scalability

3.3. Data Lifecycle
Data Input → Issuer submits student data
Processing → Hash generated
Storage → Blockchain + database
Distribution → PDF sent to student
Verification → User checks authenticity


3.4. Organizers Workflow
Issuer logs in
Creates certificate record
System generates hash
Hash stored on blockchain
Certificate generated with QR code
Student receives certificate


4. Non-Functional Requirements 
4.1. Performance
Verification response time < 1 minute
Support 100+ concurrent users

4.2. Security
Use HTTPS encryption
Blockchain ensures immutability
Secure authentication (JWT)

4.3. Usability
Simple UI for non-technical users
QR-based quick verification
Mobile-friendly design

4.4. Software Quality Attributes
Scalability: Cloud-based deployment
Reliability: 99% uptime
Maintainability: Modular architecture
Availability: 24/7 system access
