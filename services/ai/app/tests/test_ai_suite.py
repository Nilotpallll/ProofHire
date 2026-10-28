import io
import zipfile
import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.resumes import ResumeAnalyzeRequest
from app.schemas.jobs import JobMatchRequest
from app.schemas.claims import ClaimsCheckRequest, ClaimItem, OnChainEvidence
from app.services.analyzer import analyze_resume_text

client = TestClient(app)

class TestAiIntelligenceSuite(unittest.TestCase):
    # -------------------------------------------------------------
    # 1. Health and Readiness
    # -------------------------------------------------------------
    def test_health_and_readiness_endpoints(self):
        r_health = client.get("/health")
        self.assertEqual(r_health.status_code, 200)
        self.assertEqual(r_health.json()["status"], "healthy")

        r_ready = client.get("/ready")
        self.assertEqual(r_ready.status_code, 200)
        self.assertTrue(r_ready.json()["ready"])

    # -------------------------------------------------------------
    # 2. Valid Text Resume Parsing
    # -------------------------------------------------------------
    def test_resume_parsing_valid_text(self):
        sample_resume = (
            "Alex Rivera\n"
            "alex.rivera@example.com | (555) 123-4567\n"
            "Education: Stanford University, BS in Computer Science\n"
            "Skills: TypeScript, Solidity, Next.js, Python, PostgreSQL, Smart Contracts\n"
            "Experience: Software Engineer at Decentralized Labs. Built verifiable smart contracts.\n"
        ).encode("utf-8")

        response = client.post(
            "/api/v1/resumes/parse",
            files={"file": ("resume.txt", io.BytesIO(sample_resume), "text/plain")}
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["extractionStatus"], "SUCCESS")
        self.assertTrue(data["isTextExtractable"])
        self.assertEqual(data["name"], "Alex Rivera")
        self.assertEqual(data["email"], "alex.rivera@example.com")
        self.assertIn("TypeScript", data["skills"])
        self.assertIn("Solidity", data["skills"])
        self.assertEqual(data["fileFormat"], "TEXT")
        self.assertIsNotNone(data["extractedFacts"])
        self.assertIn("TypeScript", data["extractedFacts"]["skills"])

    # -------------------------------------------------------------
    # 3. Valid DOCX Document Parsing (OpenXML In-Memory)
    # -------------------------------------------------------------
    def test_resume_parsing_valid_docx(self):
        docx_buffer = io.BytesIO()
        with zipfile.ZipFile(docx_buffer, "w") as z:
            xml_content = (
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
                '<w:body>'
                '<w:p><w:r><w:t>Morgan Vance</w:t></w:r></w:p>'
                '<w:p><w:r><w:t>morgan.vance@example.org | 555-987-6543</w:t></w:r></w:p>'
                '<w:p><w:r><w:t>Education: MIT, Master of Science in Engineering</w:t></w:r></w:p>'
                '<w:p><w:r><w:t>Skills: Rust, Docker, Kubernetes, AWS</w:t></w:r></w:p>'
                '<w:p><w:r><w:t>Experience: Backend Developer. Optimized microservices reducing latency by 40%.</w:t></w:r></w:p>'
                '</w:body></w:document>'
            )
            z.writestr("word/document.xml", xml_content)
        docx_bytes = docx_buffer.getvalue()

        response = client.post(
            "/api/v1/resumes/parse",
            files={"file": ("candidate_profile.docx", io.BytesIO(docx_bytes), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["fileFormat"], "DOCX")
        self.assertTrue(data["isTextExtractable"])
        self.assertEqual(data["name"], "Morgan Vance")
        self.assertEqual(data["email"], "morgan.vance@example.org")
        self.assertIn("Rust", data["skills"])
        self.assertIn("Docker", data["skills"])

    # -------------------------------------------------------------
    # 4. Valid PDF Document Parsing (Standard Operators)
    # -------------------------------------------------------------
    def test_resume_parsing_valid_pdf_stream(self):
        # Construct standard uncompressed PDF stream with Tj operator
        pdf_bytes = (
            b"%PDF-1.4\n"
            b"1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
            b"2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n"
            b"3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj\n"
            b"4 0 obj << /Length 120 >> stream\n"
            b"BT\n"
            b"/F1 12 Tf\n"
            b"(Jordan Hayes) Tj\n"
            b"(jordan.hayes@example.edu) Tj\n"
            b"(Skills: Python, FastAPI, PostgreSQL, Docker) Tj\n"
            b"ET\n"
            b"endstream\n"
            b"endobj\n"
            b"xref\n0 5\n"
            b"trailer << /Size 5 /Root 1 0 R >>\n"
            b"startxref\n350\n%%EOF\n"
        )
        response = client.post(
            "/api/v1/resumes/parse",
            files={"file": ("resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["fileFormat"], "PDF")
        self.assertTrue(data["isTextExtractable"])
        self.assertIn("Python", data["skills"])
        self.assertIn("FastAPI", data["skills"])

    # -------------------------------------------------------------
    # 5. Empty File Handling (0 bytes -> HTTP 400)
    # -------------------------------------------------------------
    def test_empty_file_handling(self):
        response = client.post(
            "/api/v1/resumes/parse",
            files={"file": ("empty_resume.pdf", io.BytesIO(b""), "application/pdf")}
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("empty", response.json()["detail"].lower())

    # -------------------------------------------------------------
    # 6. Oversized File Handling (> 10MB -> HTTP 413)
    # -------------------------------------------------------------
    def test_oversized_file_handling(self):
        # 11 MB payload
        oversized_data = b"A" * (11 * 1024 * 1024)
        response = client.post(
            "/api/v1/resumes/parse",
            files={"file": ("huge_resume.pdf", io.BytesIO(oversized_data), "application/pdf")}
        )
        self.assertEqual(response.status_code, 413)
        self.assertIn("exceeds maximum", response.json()["detail"].lower())

    # -------------------------------------------------------------
    # 7. Malformed Document Handling (Corrupted Binary -> FAILED status, Zero Fabrication)
    # -------------------------------------------------------------
    def test_malformed_document_handling(self):
        corrupted_bytes = b"CORRUPTED_NON_PDF_BINARY_DATA_\x00\xFF\xFE\xAA" * 10
        response = client.post(
            "/api/v1/resumes/parse",
            files={"file": ("corrupted.pdf", io.BytesIO(corrupted_bytes), "application/pdf")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["extractionStatus"], "FAILED")
        self.assertFalse(data["isTextExtractable"])
        self.assertIn("Malformed PDF", data["failureReason"])
        # Strict zero-fabrication check:
        self.assertIsNone(data["name"])
        self.assertIsNone(data["email"])
        self.assertEqual(data["skills"], [])
        self.assertEqual(data["education"], [])

    # -------------------------------------------------------------
    # 8. Scanned Document Detection (Image-only PDF -> SCANNED_OR_UNREADABLE)
    # -------------------------------------------------------------
    def test_scanned_image_pdf_handling(self):
        scanned_pdf_bytes = (
            b"%PDF-1.4\n"
            b"1 0 obj << /Type /Page /Resources << /XObject << /Im1 2 0 R >> >> >> endobj\n"
            b"2 0 obj << /Type /XObject /Subtype /Image /Width 800 /Height 1000 >> stream\n"
            b"RAW_SCANNED_PIXEL_IMAGE_DATA_NO_TEXT_LAYER\n"
            b"endstream\n"
            b"endobj\n"
            b"xref\n0 3\n"
            b"trailer << /Size 3 >>\n"
            b"startxref\n250\n%%EOF\n"
        )
        response = client.post(
            "/api/v1/resumes/parse",
            files={"file": ("scanned_paper.pdf", io.BytesIO(scanned_pdf_bytes), "application/pdf")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["extractionStatus"], "SCANNED_OR_UNREADABLE")
        self.assertFalse(data["isTextExtractable"])
        self.assertIn("OCR", data["failureReason"])
        self.assertEqual(data["skills"], [])
        self.assertIn("Education", data["missingSections"])

    # -------------------------------------------------------------
    # 9. Unsupported File Extension Handling
    # -------------------------------------------------------------
    def test_unsupported_file_extension(self):
        response = client.post(
            "/api/v1/resumes/parse",
            files={"file": ("resume.exe", io.BytesIO(b"executable content"), "application/octet-stream")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["extractionStatus"], "FAILED")
        self.assertEqual(data["fileFormat"], "UNSUPPORTED")
        self.assertIn("Unsupported file type", data["failureReason"])

    # -------------------------------------------------------------
    # 10. Missing Skills & Missing Sections (Zero Hallucination)
    # -------------------------------------------------------------
    def test_resume_with_missing_skills_and_missing_sections(self):
        narrative_resume = (
            "Samual Adams\n"
            "samual@example.com\n"
            "Passionate individual interested in high impact opportunities. "
            "Attentive team collaborator with strong verbal presentation abilities."
        )
        response = client.post(
            "/api/v1/resumes/parse",
            files={"file": ("narrative.txt", io.BytesIO(narrative_resume.encode("utf-8")), "text/plain")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        # Zero fabrication: No technical skills hallucinated
        self.assertEqual(data["skills"], [])
        self.assertIn("Skills", data["missingSections"])
        self.assertIn("Education", data["missingSections"])
        self.assertIn("Experience", data["missingSections"])

        # Test analysis with zero skills:
        req = ResumeAnalyzeRequest(rawText=narrative_resume)
        a_resp = client.post("/api/v1/resumes/analyze", json=req.model_dump())
        self.assertEqual(a_resp.status_code, 200)
        a_data = a_resp.json()
        self.assertEqual(a_data["rubric"]["skillCoverageScore"], 0)
        self.assertEqual(a_data["extractedSkills"], [])
        self.assertEqual(a_data["uncertaintyLevel"], "HIGH")

    # -------------------------------------------------------------
    # 11. Deterministic Scoring Repeatability (Identical Output across 20 Runs)
    # -------------------------------------------------------------
    def test_deterministic_scoring_repeatability(self):
        req = ResumeAnalyzeRequest(
            rawText=(
                "Taylor Reed | taylor.reed@example.com\n"
                "BS in Computer Science, University of California Berkeley\n"
                "Software Engineer at CloudScale. Developed distributed microservices in Go and Python. "
                "Optimized database queries reducing p99 latency by 45%. Scaled system to 50k users. "
                "Skills: Go, Python, PostgreSQL, Docker, AWS, Git"
            ),
            verifiedSkills=["Go", "Python"]
        )
        baseline = analyze_resume_text(req)

        for _ in range(20):
            repeated = analyze_resume_text(req)
            self.assertEqual(repeated.totalScore, baseline.totalScore)
            self.assertEqual(repeated.rubric.skillCoverageScore, baseline.rubric.skillCoverageScore)
            self.assertEqual(repeated.rubric.experienceQualityScore, baseline.rubric.experienceQualityScore)
            self.assertEqual(repeated.rubric.quantifiedImpactScore, baseline.rubric.quantifiedImpactScore)
            self.assertEqual(repeated.rubric.formattingAndStructureScore, baseline.rubric.formattingAndStructureScore)
            self.assertEqual(repeated.verifiedBoostApplied, baseline.verifiedBoostApplied)
            self.assertEqual(repeated.uncertaintyLevel, baseline.uncertaintyLevel)

    # -------------------------------------------------------------
    # 12. Job Matching with Missing Requirements and Component Scores
    # -------------------------------------------------------------
    def test_job_match_missing_requirements_and_reasoning(self):
        req = JobMatchRequest(
            candidateSkills=["Python", "FastAPI"],
            candidateProjects=["Simple Blog API"],
            requiredSkills=["Solidity", "Rust", "Smart Contracts"],
            preferredSkills=["Docker", "Kubernetes"],
            verifiedSkills=[]
        )
        response = client.post("/api/v1/jobs/match", json=req.model_dump())
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["requiredSkillsCoverage"], 0.0)
        self.assertEqual(len(data["matchedRequiredSkills"]), 0)
        self.assertEqual(set(data["missingRequiredSkills"]), {"Solidity", "Rust", "Smart Contracts"})
        self.assertEqual(data["componentScores"]["requiredSkillsScore"], 0.0)
        self.assertEqual(data["verificationBonusPercentage"], 0.0)

        # Confirm each missing requirement has clear reasoning
        evidence_dict = {e["skill"]: e for e in data["skillEvidenceBreakdown"]}
        for missing in ["Solidity", "Rust", "Smart Contracts"]:
            self.assertIn(missing, evidence_dict)
            self.assertEqual(evidence_dict[missing]["evidenceType"], "MISSING_REQUIREMENT")
            self.assertIn("not identified", evidence_dict[missing]["reasoning"].lower())

    # -------------------------------------------------------------
    # 13. Job Matching with Empty Requirements
    # -------------------------------------------------------------
    def test_job_match_empty_requirements_handled_safely(self):
        req = JobMatchRequest(
            candidateSkills=["TypeScript", "React"],
            candidateProjects=["Web Dashboard"],
            requiredSkills=[],
            preferredSkills=[],
            verifiedSkills=[]
        )
        response = client.post("/api/v1/jobs/match", json=req.model_dump())
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["requiredSkillsCoverage"], 1.0)
        self.assertEqual(data["preferredSkillsCoverage"], 0.0)
        self.assertGreaterEqual(data["overallMatchScore"], 0)

    # -------------------------------------------------------------
    # 14. Responsible Hiring & Fairness Disclaimers
    # -------------------------------------------------------------
    def test_responsible_hiring_and_fairness_disclaimers(self):
        req = JobMatchRequest(
            candidateSkills=["Solidity", "TypeScript"],
            requiredSkills=["Solidity", "TypeScript"],
        )
        response = client.post("/api/v1/jobs/match", json=req.model_dump())
        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Check protected characteristics exclusion
        self.assertIn("protectedCharacteristicsIgnored", data)
        self.assertIn("Race", data["protectedCharacteristicsIgnored"])
        self.assertIn("Age", data["protectedCharacteristicsIgnored"])
        self.assertIn("Sex", data["protectedCharacteristicsIgnored"])

        # Check responsible hiring notices
        self.assertIn("decision support", data["humanDecisionSupportNotice"].lower())
        self.assertIn("prohibits automated rejection", data["humanDecisionSupportNotice"].lower())
        self.assertIn("do not predict", data["employmentPredictionWarning"].lower())

    # -------------------------------------------------------------
    # 15. Credential Claim Taxonomy and Absence of Credential
    # -------------------------------------------------------------
    def test_credential_claim_taxonomy_and_absence_fairness(self):
        claims = [
            ClaimItem(
                claimText="B.S. in Computer Science",
                credentialId="cred-valid-001",
                documentHash="0xCORRECT_HASH",
            ),
            ClaimItem(
                claimText="Revoked Certificate",
                credentialId="cred-revoked-002",
            ),
            ClaimItem(
                claimText="Tampered Certificate",
                credentialId="cred-tampered-003",
                documentHash="0xTAMPERED_HASH",
            ),
            ClaimItem(
                claimText="Self-Taught Skill (No Credential)",
                credentialId=None,
            ),
            ClaimItem(
                claimText="Unanchored Credential",
                credentialId="cred-unanchored-999",
            ),
        ]

        evidence = [
            OnChainEvidence(
                credentialId="cred-valid-001",
                exists=True,
                isValid=True,
                isRevoked=False,
                issuer="0xUni1",
                issuerName="Leading University",
                onChainDigest="0xCORRECT_HASH",
            ),
            OnChainEvidence(
                credentialId="cred-revoked-002",
                exists=True,
                isValid=False,
                isRevoked=True,
                issuer="0xUni2",
                issuerName="Former Institution",
            ),
            OnChainEvidence(
                credentialId="cred-tampered-003",
                exists=True,
                isValid=True,
                isRevoked=False,
                issuer="0xUni3",
                issuerName="Certification Org",
                onChainDigest="0xDIFFERENT_HASH",
            ),
        ]

        req = ClaimsCheckRequest(claims=claims, availableEvidence=evidence)
        response = client.post("/api/v1/claims/check", json=req.model_dump())
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["totalClaimsChecked"], 5)
        self.assertEqual(data["verifiedCount"], 1)
        self.assertEqual(data["revokedCount"], 1)
        self.assertEqual(data["mismatchCount"], 1)
        self.assertEqual(data["unverifiedCount"], 2)

        # Check legal disclaimer: absence of blockchain credential != fraud
        self.assertIn("does not constitute evidence of fraud", data["legalDisclaimer"].lower())
        self.assertIn("authoritative", data["cryptographicAuthorityNotice"].lower())

        statuses = [r["status"] for r in data["results"]]
        self.assertIn("VERIFIED", statuses)
        self.assertIn("REVOKED", statuses)
        self.assertIn("MISMATCH", statuses)
        self.assertIn("NOT_PROVIDED", statuses)
        self.assertIn("UNVERIFIED", statuses)

    # -------------------------------------------------------------
    # 16. Separation of Extracted Facts from Inferred Suggestions
    # -------------------------------------------------------------
    def test_extracted_facts_versus_inferred_suggestions(self):
        sample = (
            "Dana Scully\n"
            "dana@fbi.gov | 555-123-4567\n"
            "Education: University of Maryland, BS in Physics\n"
            "Skills: Python, Machine Learning\n"
            "Experience: Forensic Scientist. Analyzed forensic data."
        )
        response = client.post(
            "/api/v1/resumes/parse",
            files={"file": ("resume.txt", io.BytesIO(sample.encode("utf-8")), "text/plain")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Facts are concrete extracted records
        self.assertEqual(data["extractedFacts"]["name"], "Dana Scully")
        self.assertEqual(data["extractedFacts"]["email"], "dana@fbi.gov")
        self.assertIn("Python", data["extractedFacts"]["skills"])

        # Suggestions are advisory, actionable suggestions
        self.assertGreater(len(data["inferredSuggestions"]), 0)
        for suggestion in data["inferredSuggestions"]:
            self.assertIsInstance(suggestion, str)
            self.assertTrue(any(w in suggestion.lower() for w in ["add", "quantify", "consider", "links"]))

if __name__ == "__main__":
    unittest.main()
