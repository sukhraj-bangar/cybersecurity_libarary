"use client";

import { useEffect, useState } from "react";

type FileResult = {
  id?: number;
  name: string;
  size: number;
  hash: string;
  status: "BASELINE" | "UNCHANGED" | "MODIFIED";
};

async function calculateSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    buffer
  );

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${
    units[index]
  }`;
}

export default function FilesPage() {
  const [baseline, setBaseline] =
    useState<FileResult | null>(null);

  const [current, setCurrent] =
    useState<FileResult | null>(null);

  const [checking, setChecking] = useState(false);

  const [loadingBaseline, setLoadingBaseline] =
    useState(true);

  /*
   * LOAD TRUSTED BASELINE FROM POSTGRESQL
   */
  useEffect(() => {
    async function loadBaseline() {
      try {
        const response = await fetch("/api/baseline", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load baseline");
        }

        const data = await response.json();

        if (data.success && data.baseline) {
          setBaseline({
            id: data.baseline.id,
            name: data.baseline.file_name,
            size: Number(data.baseline.file_size),
            hash: data.baseline.sha256_hash,
            status: "BASELINE",
          });
        }
      } catch (error) {
        console.error(
          "Failed to load baseline:",
          error
        );
      } finally {
        setLoadingBaseline(false);
      }
    }

    loadBaseline();
  }, []);

  /*
   * UPLOAD AND VERIFY FILE
   */
  async function handleFile(file: File) {
    try {
      setChecking(true);

      const hash = await calculateSHA256(file);

      /*
       * If there is NO baseline in PostgreSQL,
       * create the first trusted baseline.
       */
      if (!baseline) {
        const response = await fetch(
          "/api/baseline",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: file.name,
              fileSize: file.size,
              sha256Hash: hash,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to create baseline"
          );
        }

        const newBaseline: FileResult = {
          id: data.baseline?.id,
          name: file.name,
          size: file.size,
          hash,
          status: "BASELINE",
        };

        setBaseline(newBaseline);
        setCurrent(newBaseline);

        return;
      }

      /*
       * A baseline already exists.
       * DO NOT overwrite it.
       *
       * Compare the uploaded file's SHA-256
       * with the trusted PostgreSQL hash.
       */
      const status =
        hash === baseline.hash
          ? "UNCHANGED"
          : "MODIFIED";

      const result: FileResult = {
        name: file.name,
        size: file.size,
        hash,
        status,
      };

      setCurrent(result);
    } catch (error) {
      console.error(error);

      alert(
        "Unable to process the file. Check the API and database connection."
      );
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className="files-page">

      {/* HEADER */}

      <header className="files-header">

        <div>
          <div className="files-breadcrumb">
            SECURITY CENTER / FILE INTEGRITY / FILES
          </div>

          <h1>File Integrity Scanner</h1>

          <p>
            Upload a file to calculate its SHA-256 hash and
            verify whether it has been modified.
          </p>
        </div>

        <div className="files-status">
          <span />
          INTEGRITY MONITORING
        </div>

      </header>


      <section className="files-grid">

        {/* UPLOAD CARD */}

        <div className="file-upload-card">

          <div className="files-eyebrow">
            FILE ANALYSIS
          </div>

          <h2>Upload File</h2>

          <p>
            Upload your original file to create or verify
            a trusted integrity baseline.
          </p>

          <label className="file-upload-area">

            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  handleFile(file);
                }
              }}
            />

            <div className="upload-icon">
              ↑
            </div>

            <strong>
              Choose a file
            </strong>

            <span>
              Word, PDF, TXT, ZIP or any other file
            </span>

          </label>

          {checking && (
            <div className="checking-message">
              Calculating SHA-256...
            </div>
          )}

        </div>


        {/* BASELINE CARD */}

        <div className="integrity-card">

          <div className="files-eyebrow">
            TRUSTED BASELINE
          </div>

          <h2>Original File</h2>

          {loadingBaseline ? (

            <div className="empty-integrity">

              <div>⏳</div>

              <h3>
                Loading baseline...
              </h3>

              <p>
                Checking PostgreSQL for the trusted
                SHA-256 baseline.
              </p>

            </div>

          ) : !baseline ? (

            <div className="empty-integrity">

              <div>🔐</div>

              <h3>
                No baseline created
              </h3>

              <p>
                Upload your original file to create a
                trusted SHA-256 baseline.
              </p>

            </div>

          ) : (

            <div className="file-details">

              <div className="detail-row">

                <span>
                  FILE NAME
                </span>

                <strong>
                  {baseline.name}
                </strong>

              </div>

              <div className="detail-row">

                <span>
                  FILE SIZE
                </span>

                <strong>
                  {formatBytes(baseline.size)}
                </strong>

              </div>

              <div className="hash-box">

                <span>
                  SHA-256 BASELINE
                </span>

                <code>
                  {baseline.hash}
                </code>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* RESULT */}

      {current && (

        <section className="integrity-result">

          <div className="result-header">

            <div>

              <span className="files-eyebrow">
                INTEGRITY VERIFICATION
              </span>

              <h2>
                Verification Result
              </h2>

            </div>

            {current.status === "BASELINE" && (
              <span className="result-badge baseline">
                BASELINE CREATED
              </span>
            )}

            {current.status === "UNCHANGED" && (
              <span className="result-badge unchanged">
                ✓ INTEGRITY OK
              </span>
            )}

            {current.status === "MODIFIED" && (
              <span className="result-badge modified">
                ⚠ FILE MODIFIED
              </span>
            )}

          </div>


          <div className="result-file">

            <div>

              <span>
                FILE
              </span>

              <strong>
                {current.name}
              </strong>

            </div>

            <div>

              <span>
                SIZE
              </span>

              <strong>
                {formatBytes(current.size)}
              </strong>

            </div>

          </div>


          <div className="hash-comparison">

            <div className="comparison-box">

              <span>
                TRUSTED HASH
              </span>

              <code>
                {baseline?.hash}
              </code>

            </div>


            <div className="comparison-arrow">
              →
            </div>


            <div className="comparison-box">

              <span>
                CURRENT HASH
              </span>

              <code>
                {current.hash}
              </code>

            </div>

          </div>


          {current.status === "BASELINE" && (

            <div className="result-message baseline-message">

              This file has been registered as the trusted
              baseline. Modify the file and upload it again
              to test integrity.

            </div>

          )}


          {current.status === "UNCHANGED" && (

            <div className="result-message success-message">

              ✓ The SHA-256 hash matches the trusted
              baseline. The file has not changed.

            </div>

          )}


          {current.status === "MODIFIED" && (

            <div className="result-message danger-message">

              ⚠ The SHA-256 hash does not match the trusted
              baseline. The file has been modified.

            </div>

          )}

        </section>

      )}


      {/* HOW IT WORKS */}

      <section className="integrity-process">

        <div>

          <span>
            01
          </span>

          <strong>
            Upload
          </strong>

          <p>
            Select the original file.
          </p>

        </div>


        <div className="process-arrow">
          →
        </div>


        <div>

          <span>
            02
          </span>

          <strong>
            Hash
          </strong>

          <p>
            Generate SHA-256.
          </p>

        </div>


        <div className="process-arrow">
          →
        </div>


        <div>

          <span>
            03
          </span>

          <strong>
            Modify
          </strong>

          <p>
            Change the file.
          </p>

        </div>


        <div className="process-arrow">
          →
        </div>


        <div>

          <span>
            04
          </span>

          <strong>
            Verify
          </strong>

          <p>
            Compare both hashes.
          </p>

        </div>

      </section>

    </main>
  );
}