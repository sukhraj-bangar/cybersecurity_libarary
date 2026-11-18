
"use client";

import { useEffect, useState } from "react";

type Baseline = {
  id: number;
  file_name: string;
  file_size: string;
  sha256_hash: string;
};

export default function FileIntegrityPage() {
  const [baselines, setBaselines] = useState<Baseline[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [baselineId, setBaselineId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [currentHash, setCurrentHash] = useState("");

  async function loadBaselines() {
    try {
      const response = await fetch("/api/baseline");
      const data = await response.json();

      if (data.success) {
        setBaselines(data.baselines);
      }
    } catch (error) {
      console.error("Failed to load baselines:", error);
    }
  }

  useEffect(() => {
    loadBaselines();
  }, []);

  async function createBaseline() {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setStatus("");
    setCurrentHash("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/baseline", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("File baseline created successfully!");
      setSelectedFile(null);
      await loadBaselines();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function verifyFile() {
    if (!selectedFile || !baselineId) {
      setMessage("Select a file and a baseline first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setStatus("");
    setCurrentHash("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("baselineId", baselineId);

      const response = await fetch("/api/verify", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Verification failed");
      }

      setStatus(data.status);
      setMessage(data.message);
      setCurrentHash(data.currentHash);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <span className="eyebrow">SECURITY CENTER / FILE INTEGRITY</span>
          <h1>File Integrity Monitoring</h1>
          <p>
            Create secure baselines and detect unauthorized file modifications.
          </p>
        </div>

        <div className="secure-badge">
          <span />
          SYSTEM SECURE
        </div>
      </header>

      <section className="events-card">
        <span className="eyebrow">BASELINE MANAGEMENT</span>
        <h2>Create File Baseline</h2>

        <input
          type="file"
          onChange={(event) => {
            setSelectedFile(event.target.files?.[0] || null);
            setMessage("");
            setStatus("");
            setCurrentHash("");
          }}
        />

        <button
          onClick={createBaseline}
          disabled={loading || !selectedFile}
          style={{ padding: "12px 20px", margin: "15px 0" }}
        >
          Create Baseline
        </button>

        <hr />

        <span className="eyebrow">INTEGRITY VERIFICATION</span>
        <h2>Verify Protected File</h2>

        <select
          value={baselineId}
          onChange={(event) => setBaselineId(event.target.value)}
          style={{ padding: "12px", margin: "10px 0", maxWidth: "100%" }}
        >
          <option value="">Select a saved baseline</option>
          {baselines.map((baseline) => (
            <option key={baseline.id} value={baseline.id}>
              {baseline.file_name} (ID: {baseline.id})
            </option>
          ))}
        </select>

        <p>Select the current version of the file to compare.</p>

        <input
          type="file"
          onChange={(event) => {
            setSelectedFile(event.target.files?.[0] || null);
            setMessage("");
            setStatus("");
            setCurrentHash("");
          }}
        />

        <br />

        <button
          onClick={verifyFile}
          disabled={loading || !selectedFile || !baselineId}
          style={{ padding: "12px 20px", margin: "15px 0" }}
        >
          {loading ? "Checking File..." : "Verify File Integrity"}
        </button>

        {message && (
          <p role="status" style={{ marginTop: "15px" }}>
            {message}
          </p>
        )}

        {status && (
          <h2 style={{ color: status === "VERIFIED" ? "green" : "red" }}>
            {status}
          </h2>
        )}

        {currentHash && (
          <div style={{ marginTop: "15px" }}>
            <strong>Current SHA-256 Hash:</strong>
            <p style={{ overflowWrap: "anywhere" }}>{currentHash}</p>
          </div>
        )}
      </section>
    </main>
  );
}
