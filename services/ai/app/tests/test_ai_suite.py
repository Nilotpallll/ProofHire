import io
import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.resumes import ResumeAnalyzeRequest
from app.schemas.jobs import JobMatchRequest
from app.schemas.claims import ClaimsCheckRequest, ClaimItem, OnChainEvidence

client = TestClient(app)

class TestAiIntelligenceSuite(unittest.TestCase):
    def test_health_and_readiness_endpoints(self):
        r_health = client.get("/health")
        self.assertEqual(r_health.status_code, 200)
        self.assertEqual(r_health.json()["status"], "healthy")

        r_ready = client.get("/ready")
        self.assertEqual(r_ready.status_code, 200)
        self.assertTrue(r_ready.json()["ready"])

    def test_resume_parsing_endpoint(self):
        sample_resume = (
            "Alex Rivera\n"
            "alex.rivera@example.com | (555) 123-4567\n"
            "Education: Stanford University, BS in Computer Science\n"
            "Skills: TypeScript, Solidity, Next.js, Python, PostgreSQL, Smart Contracts\n"
            "Experience: Software Engineer at Decentralized Labs. Built verifiable smart contracts.\n"
        ).encode("utf-8")

        file_obj = io.BytesIO(sample_resume)
        response = client.post(
            "/api/v1/resumes/parse",
            files={"file": ("resume.txt", file_obj, "text/plain")}
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], "Alex Rivera")
        self.assertEqual(data["email"], "alex.rivera@example.com")
        self.assertIn("TypeScript", data["skills"])
        self.assertIn("Solidity", data["skills"])
        self.assertEqual(data["fileFormat"], "TEXT")

    def test_resume_analysis_rubric_and_verified_boost(self):
        req = ResumeAnalyzeRequest(
            rawText=(
                "Alex Rivera | alex.rivera@example.com\n"
                "Stanford University, Bachelor of Science in Computer Science.\n"
                "Experienced engineer. Developed smart contract registry on Ethereum. "
                "Built high performance frontend reducing latency by 45%. Managed 50k transactions. "
                "Skills: Solidity, TypeScript, Python, Next.js, Hardhat."
            ),
            verifiedSkills=["Solidity", "TypeScript"]
        )
        response = client.post("/api/v1/resumes/analyze", json=req.model_dump())
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertGreaterEqual(data["totalScore"], 70)
        self.assertGreaterEqual(data["verifiedSkillsCount"], 2)
        self.assertGreater(data["verifiedBoostApplied"], 0)
        self.assertIn("rubric", data)
        self.assertGreaterEqual(data["rubric"]["quantifiedImpactScore"], 10)
        self.assertGreater(len(data["strengthHighlights"]), 0)

    def test_job_match_scoring_and_cryptographic_boost(self):
        req = JobMatchRequest(
            candidateSkills=["TypeScript", "Solidity", "Next.js", "Python"],
            candidateProjects=["Decentralized Registry", "AI Parser"],
            requiredSkills=["TypeScript", "Solidity"],
            preferredSkills=["Docker", "AWS"],
            verifiedSkills=["Solidity", "TypeScript"]
        )
        response = client.post("/api/v1/jobs/match", json=req.model_dump())
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["requiredSkillsCoverage"], 1.0)
        self.assertEqual(data["verificationBonusPercentage"], 15.0)  # Full verified bonus
        self.assertGreaterEqual(data["overallMatchScore"], 80)
        self.assertIn("Solidity", data["verifiedSkillsMatched"])
        self.assertIn("ranking is based strictly on demonstrated skills", data["fairnessNotice"].lower())

    def test_unverified_claim_detection_engine(self):
        claims = [
            ClaimItem(
                claimText="BS in Computer Science from Stanford University",
                credentialId="cred-valid-stanford-001",
                documentHash="0xHASH123",
            ),
            ClaimItem(
                claimText="Senior Blockchain Architect at Fake Corp",
                credentialId="cred-revoked-002",
                documentHash="0xHASH_REVOKED",
            ),
            ClaimItem(
                claimText="Modified Certificate with altered GPA",
                credentialId="cred-tampered-003",
                documentHash="0xTAMPERED_HASH",
            ),
            ClaimItem(
                claimText="Self-reported enthusiast in Rust",
                credentialId=None,
            ),
        ]

        evidence = [
            OnChainEvidence(
                credentialId="cred-valid-stanford-001",
                exists=True,
                isValid=True,
                isRevoked=False,
                issuer="0xStanford123",
                issuerName="Stanford University",
                onChainDigest="0xHASH123",
            ),
            OnChainEvidence(
                credentialId="cred-revoked-002",
                exists=True,
                isValid=False,
                isRevoked=True,
                issuer="0xCorp456",
                issuerName="Decentralized Tech",
                onChainDigest="0xHASH_REVOKED",
            ),
            OnChainEvidence(
                credentialId="cred-tampered-003",
                exists=True,
                isValid=True,
                isRevoked=False,
                issuer="0xUni789",
                issuerName="Partner University",
                onChainDigest="0xORIGINAL_DIGEST_DOES_NOT_MATCH",
            ),
        ]

        req = ClaimsCheckRequest(claims=claims, availableEvidence=evidence)
        response = client.post("/api/v1/claims/check", json=req.model_dump())
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["totalClaimsChecked"], 4)
        self.assertEqual(data["verifiedCount"], 1)
        self.assertEqual(data["revokedCount"], 1)
        self.assertEqual(data["mismatchCount"], 1)
        self.assertEqual(data["unverifiedCount"], 1)

        # Check statuses match
        statuses = [r["status"] for r in data["results"]]
        self.assertIn("VERIFIED", statuses)
        self.assertIn("REVOKED", statuses)
        self.assertIn("MISMATCH", statuses)
        self.assertIn("NOT_PROVIDED", statuses)

if __name__ == "__main__":
    unittest.main()
