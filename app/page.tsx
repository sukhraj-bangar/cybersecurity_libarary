
"use client";

import { useState } from "react";

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hash, setHash] = useState("");

  async function handleUpload() {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setHash("");

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

      setMessage("File baseline saved successfully!");
      setHash(data.baseline.sha256_hash);
      setSelectedFile(null);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
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
          <h1>
            File
            <br />
            Integrity
            <br />
            Monitoring
          </h1>
          <p>
            Upload files and create secure SHA-256 integrity baselines.
          </p>
        </div>

        <div className="secure-badge">
          <span />
          SYSTEM SECURE
        </div>
      </header>

      <section className="events-card">
        <div className="section-header">
          <div>
            <span className="eyebrow">BASELINE MANAGEMENT</span>
            <h2>Protect a New File</h2>
          </div>
        </div>

        <div style={{ padding: "20px 0" }}>
          <input
            type="file"
            onChange={(event) => {
              setSelectedFile(event.target.files?.[0] || null);
              setMessage("");
              setHash("");
            }}
          />

          {selectedFile && (
            <p>
              Selected file: <strong>{selectedFile.name}</strong>
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            style={{
              marginTop: "15px",
              padding: "12px 22px",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Calculating SHA-256..." : "Create File Baseline"}
          </button>

          {message && <p role="status">{message}</p>}

          {hash && (
            <div style={{ marginTop: "20px" }}>
              <strong>SHA-256 Hash:</strong>
              <p style={{ overflowWrap: "anywhere" }}>{hash}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
