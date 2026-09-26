/**
 * Week 11: Smart contract unit tests.
 * Run: npx hardhat test
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");
const crypto = require("crypto");

function makeHash(data) {
  const hex = crypto.createHash("sha256").update(data).digest("hex");
  return "0x" + hex.padStart(64, "0");
}

describe("CertificateVerification", function () {
  let contract;
  let owner, issuer1, issuer2, stranger;

  beforeEach(async () => {
    [owner, issuer1, issuer2, stranger] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("CertificateVerification");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  describe("storeCertificate()", () => {
    it("stores a certificate and emits CertificateStored", async () => {
      const hash = makeHash("cert-001");
      const certId = "uuid-cert-001";

      const tx = await contract.connect(issuer1).storeCertificate(hash, certId);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(contract, "CertificateStored")
        .withArgs(hash, issuer1.address, block.timestamp, certId);
    });

    it("reverts when storing duplicate hash", async () => {
      const hash = makeHash("duplicate");
      await contract.connect(issuer1).storeCertificate(hash, "id-1");
      await expect(
        contract.connect(issuer1).storeCertificate(hash, "id-2")
      ).to.be.revertedWith("Certificate already exists");
    });

    it("reverts when certId is empty", async () => {
      const hash = makeHash("empty-certid");
      await expect(
        contract.connect(issuer1).storeCertificate(hash, "")
      ).to.be.revertedWith("certId cannot be empty");
    });
  });

  describe("verifyCertificate()", () => {
    it("returns exists=true for a stored hash", async () => {
      const hash = makeHash("verify-test");
      await contract.connect(issuer1).storeCertificate(hash, "uuid-verify");

      const [exists, revoked, issuer, , certId] = await contract.verifyCertificate(hash);
      expect(exists).to.be.true;
      expect(revoked).to.be.false;
      expect(issuer).to.equal(issuer1.address);
      expect(certId).to.equal("uuid-verify");
    });

    it("returns exists=false for an unknown hash", async () => {
      const hash = makeHash("unknown");
      const [exists] = await contract.verifyCertificate(hash);
      expect(exists).to.be.false;
    });
  });

  describe("revokeCertificate()", () => {
    it("allows issuer to revoke their own certificate", async () => {
      const hash = makeHash("revoke-issuer");
      await contract.connect(issuer1).storeCertificate(hash, "uuid-revoke");

      const tx = await contract.connect(issuer1).revokeCertificate(hash);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(contract, "CertificateRevoked")
        .withArgs(hash, issuer1.address, block.timestamp);

      const [, revoked] = await contract.verifyCertificate(hash);
      expect(revoked).to.be.true;
    });

    it("allows contract owner to revoke any certificate", async () => {
      const hash = makeHash("revoke-owner");
      await contract.connect(issuer1).storeCertificate(hash, "uuid-owner-revoke");
      await contract.connect(owner).revokeCertificate(hash);

      const [, revoked] = await contract.verifyCertificate(hash);
      expect(revoked).to.be.true;
    });

    it("reverts when a stranger tries to revoke", async () => {
      const hash = makeHash("revoke-stranger");
      await contract.connect(issuer1).storeCertificate(hash, "uuid-stranger");
      await expect(
        contract.connect(stranger).revokeCertificate(hash)
      ).to.be.revertedWith("Not authorized to revoke");
    });

    it("reverts when revoking a non-existent certificate", async () => {
      const hash = makeHash("nonexistent");
      await expect(
        contract.connect(owner).revokeCertificate(hash)
      ).to.be.revertedWith("Certificate not found");
    });

    it("reverts double-revocation", async () => {
      const hash = makeHash("double-revoke");
      await contract.connect(issuer1).storeCertificate(hash, "uuid-double");
      await contract.connect(issuer1).revokeCertificate(hash);
      await expect(
        contract.connect(issuer1).revokeCertificate(hash)
      ).to.be.revertedWith("Already revoked");
    });
  });

  describe("transferOwnership()", () => {
    it("transfers ownership to a new address", async () => {
      await contract.connect(owner).transferOwnership(issuer1.address);
      expect(await contract.owner()).to.equal(issuer1.address);
    });

    it("reverts for non-owner", async () => {
      await expect(
        contract.connect(stranger).transferOwnership(stranger.address)
      ).to.be.revertedWith("Not authorized: not owner");
    });
  });
});

// Helper: get latest block timestamp (rounded to seconds)
async function latestTimestamp() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp;
}
