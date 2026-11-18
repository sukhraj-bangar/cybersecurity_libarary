"use client";

import React, { useMemo, useState } from "react";

type BaselineStatus = "Healthy" | "Warning" | "Critical";

type Baseline = {
  id: number;
  name: string;
  system: string;
  description: string;
  files: number;
  status: BaselineStatus;
  hash: string;
  lastVerified: string;
  updatedBy: string;
};

const baselines: Baseline[] = [
  {
    id: 1,
    name: "Production Server Baseline",
    system: "PROD-SERVER-01",
    description:
      "Trusted baseline for critical production server files.",
    files: 21304,
    status: "Healthy",
    hash: "SHA-256",
    lastVerified: "2 minutes ago",
    updatedBy: "Administrator",
  },
  {
    id: 2,
    name: "Windows System Baseline",
    system: "WIN-SEC-01",
    description:
      "Windows system files and protected configuration baseline.",
    files: 12482,
    status: "Warning",
    hash: "SHA-256",
    lastVerified: "8 minutes ago",
    updatedBy: "Security Admin",
  },
  {
    id: 3,
    name: "Linux Security Baseline",
    system: "WEB-01",
    description:
      "Linux web server trusted files and security configuration.",
    files: 8921,
    status: "Healthy",
    hash: "SHA-256",
    lastVerified: "5 minutes ago",
    updatedBy: "Administrator",
  },
  {
    id: 4,
    name: "Database Server Baseline",
    system: "DB-SERVER-01",
    description:
      "Database server configuration and protected files baseline.",
    files: 15672,
    status: "Critical",
    hash: "SHA-256",
    lastVerified: "21 minutes ago",
    updatedBy: "Database Admin",
  },
];

const statusClass: Record<BaselineStatus, string> = {
  Healthy: "healthy",
  Warning: "warning",
  Critical: "critical",
};

export default function BaselinesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filteredBaselines = useMemo(() => {
    return baselines.filter((baseline) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        baseline.name.toLowerCase().includes(searchText) ||
        baseline.system.toLowerCase().includes(searchText) ||
        baseline.description.toLowerCase().includes(searchText) ||
        baseline.hash.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All" || baseline.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const totalFiles = baselines.reduce(
    (total, baseline) => total + baseline.files,
    0
  );

  return (
    <main className="baseline-page">
      <style jsx>{`
        .baseline-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(0, 255, 136, 0.08),
              transparent 28%
            ),
            #030706;
          color: #edf5f1;
          padding: 42px;
          font-family: Arial, Helvetica, sans-serif;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #173028;
          padding-bottom: 28px;
          margin-bottom: 36px;
        }

        .eyebrow {
          color: #32ff91;
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: 700;
        }

        h1 {
          margin: 10px 0 8px;
          font-size: 48px;
          letter-spacing: -2px;
        }

        .subtitle {
          margin: 0;
          color: #758c84;
          font-size: 15px;
        }

        .system-status {
          border: 1px solid #15563b;
          background: rgba(16, 55, 39, 0.3);
          color: #35ff91;
          padding: 13px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
        }

        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #32ff91;
          border-radius: 50%;
          margin-right: 9px;
          box-shadow: 0 0 12px #32ff91;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat {
          border: 1px solid #173028;
          background: #07100d;
          border-radius: 14px;
          padding: 24px;
        }

        .stat span {
          display: block;
          color: #6e847d;
          font-size: 11px;
          letter-spacing: 2px;
          margin-bottom: 14px;
        }

        .stat strong {
          font-size: 34px;
        }

        .green {
          color: #32ff91;
        }

        .red {
          color: #ff5757;
        }

        .yellow {
          color: #ffd35a;
        }

        .toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search {
          flex: 1;
          min-width: 280px;
          background: #07100d;
          border: 1px solid #1a382e;
          color: white;
          border-radius: 9px;
          padding: 14px 16px;
          outline: none;
          font-size: 14px;
        }

        .search:focus {
          border-color: #25db7c;
          box-shadow: 0 0 0 2px rgba(37, 219, 124, 0.08);
        }

        select,
        .reset {
          background: #07100d;
          color: #c8d7d1;
          border: 1px solid #1a382e;
          border-radius: 9px;
          padding: 13px 16px;
          cursor: pointer;
        }

        .reset:hover {
          border-color: #2cff8c;
          color: #32ff91;
        }

        .baseline-card {
          border: 1px solid #173028;
          background: #050b09;
          border-radius: 16px;
          overflow: hidden;
        }

        .card-header {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #173028;
        }

        .card-header span {
          color: #6f867e;
          font-size: 13px;
        }

        .card-header h2 {
          margin: 5px 0 0;
          font-size: 22px;
        }

        .baseline-count {
          color: #32ff91;
          font-size: 13px;
          font-weight: 700;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1100px;
        }

        th {
          text-align: left;
          padding: 15px 18px;
          color: #637a72;
          font-size: 10px;
          letter-spacing: 1.5px;
          background: #07100d;
          border-bottom: 1px solid #173028;
        }

        td {
          padding: 18px;
          border-bottom: 1px solid #11251e;
          color: #aebdb7;
          font-size: 13px;
        }

        tr.baseline-row {
          cursor: pointer;
          transition: background 0.15s;
        }

        tr.baseline-row:hover {
          background: rgba(30, 255, 130, 0.035);
        }

        .baseline-name {
          color: white;
          font-weight: 700;
          font-size: 13px;
        }

        .system {
          color: #32ff91;
          font-family: monospace;
          margin-top: 5px;
          font-size: 12px;
        }

        .description {
          color: #758b83;
          max-width: 300px;
          line-height: 1.4;
        }

        .hash {
          color: #b8c8c1;
          font-family: monospace;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
        }

        .healthy {
          color: #32ff91;
          background: rgba(50, 255, 145, 0.08);
          border: 1px solid rgba(50, 255, 145, 0.18);
        }

        .warning {
          color: #ffd35a;
          background: rgba(255, 210, 70, 0.08);
          border: 1px solid rgba(255, 210, 70, 0.2);
        }

        .critical {
          color: #ff5e5e;
          background: rgba(255, 50, 50, 0.1);
          border: 1px solid rgba(255, 50, 50, 0.25);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          display: inline-block;
          border-radius: 50%;
          margin-right: 7px;
          background: currentColor;
        }

        .details {
          background: #07100d;
        }

        .details td {
          padding: 22px 30px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .detail-item span {
          display: block;
          color: #587067;
          font-size: 10px;
          letter-spacing: 1.5px;
          margin-bottom: 7px;
        }

        .detail-item strong {
          color: #dce9e4;
          font-size: 13px;
        }

        .empty {
          padding: 70px;
          text-align: center;
          color: #687e76;
        }

        @media (max-width: 900px) {
          .baseline-page {
            padding: 22px;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .topbar {
            align-items: flex-start;
            gap: 20px;
          }

          h1 {
            font-size: 38px;
          }
        }

        @media (max-width: 600px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .system-status {
            display: none;
          }

          .detail-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <header className="topbar">
        <div>
          <div className="eyebrow">
            SECURITY CENTER / INTEGRITY / BASELINES
          </div>

          <h1>Baselines</h1>

          <p className="subtitle">
            Manage trusted file states used to detect unauthorized changes.
          </p>
        </div>

        <div className="system-status">
          <span className="dot" />
          BASELINE MONITORING ACTIVE
        </div>
      </header>

      <section className="stats">
        <div className="stat">
          <span>TOTAL BASELINES</span>
          <strong>{baselines.length}</strong>
          <p className="subtitle">Configured trusted states</p>
        </div>

        <div className="stat">
          <span>HEALTHY</span>
          <strong className="green">
            {baselines.filter((x) => x.status === "Healthy").length}
          </strong>
          <p className="subtitle">No integrity issues</p>
        </div>

        <div className="stat">
          <span>WARNINGS</span>
          <strong className="yellow">
            {baselines.filter((x) => x.status === "Warning").length}
          </strong>
          <p className="subtitle">Changes detected</p>
        </div>

        <div className="stat">
          <span>FILES BASELINED</span>
          <strong className="green">
            {totalFiles.toLocaleString()}
          </strong>
          <p className="subtitle">Trusted file records</p>
        </div>
      </section>

      <section className="toolbar">
        <input
          className="search"
          placeholder="Search baselines, servers or hash algorithms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All</option>
          <option>Healthy</option>
          <option>Warning</option>
          <option>Critical</option>
        </select>

        <button
          className="reset"
          onClick={() => {
            setSearch("");
            setStatus("All");
          }}
        >
          ↻ Reset
        </button>
      </section>

      <section className="baseline-card">
        <div className="card-header">
          <div>
            <span>TRUSTED CONFIGURATION</span>
            <h2>System Baselines</h2>
          </div>

          <div className="baseline-count">
            {filteredBaselines.length} / {baselines.length} BASELINES
          </div>
        </div>

        <div className="table-wrap">
          {filteredBaselines.length === 0 ? (
            <div className="empty">
              No baselines match your current filters.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>BASELINE</th>
                  <th>DESCRIPTION</th>
                  <th>FILES</th>
                  <th>STATUS</th>
                  <th>HASH</th>
                  <th>LAST VERIFIED</th>
                </tr>
              </thead>

              <tbody>
                {filteredBaselines.map((baseline) => (
                  <React.Fragment key={baseline.id}>
                    <tr
                      className="baseline-row"
                      onClick={() =>
                        setExpanded(
                          expanded === baseline.id
                            ? null
                            : baseline.id
                        )
                      }
                    >
                      <td>
                        <div className="baseline-name">
                          {baseline.name}
                        </div>

                        <div className="system">
                          {baseline.system}
                        </div>
                      </td>

                      <td>
                        <div className="description">
                          {baseline.description}
                        </div>
                      </td>

                      <td>
                        {baseline.files.toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            statusClass[baseline.status]
                          }`}
                        >
                          <span className="status-dot" />
                          {baseline.status}
                        </span>
                      </td>

                      <td>
                        <span className="hash">
                          {baseline.hash}
                        </span>
                      </td>

                      <td>{baseline.lastVerified}</td>
                    </tr>

                    {expanded === baseline.id && (
                      <tr className="details">
                        <td colSpan={6}>
                          <div className="detail-grid">
                            <div className="detail-item">
                              <span>BASELINE ID</span>
                              <strong>
                                BASE-{String(
                                  baseline.id
                                ).padStart(4, "0")}
                              </strong>
                            </div>

                            <div className="detail-item">
                              <span>SYSTEM</span>
                              <strong>
                                {baseline.system}
                              </strong>
                            </div>

                            <div className="detail-item">
                              <span>UPDATED BY</span>
                              <strong>
                                {baseline.updatedBy}
                              </strong>
                            </div>

                            <div className="detail-item">
                              <span>HASH ALGORITHM</span>
                              <strong>
                                {baseline.hash}
                              </strong>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}