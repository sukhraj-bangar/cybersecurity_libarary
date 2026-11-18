"use client";

import React, { useMemo, useState } from "react";

type Severity = "Critical" | "High" | "Medium" | "Low";
type Status = "Success" | "Failed" | "Blocked";

type AuditLog = {
  id: number;
  timestamp: string;
  event: string;
  description: string;
  severity: Severity;
  actor: string;
  agent: string;
  ip: string;
  status: Status;
};

const auditLogs: AuditLog[] = [
  {
    id: 1,
    timestamp: "2026-08-21 14:32:18",
    event: "FILE_MODIFIED",
    description: "system.dll was modified outside the trusted baseline.",
    severity: "Critical",
    actor: "WIN-SEC-01",
    agent: "Windows Security Agent",
    ip: "192.168.1.21",
    status: "Blocked",
  },
  {
    id: 2,
    timestamp: "2026-08-21 14:27:44",
    event: "BASELINE_CHECK",
    description: "Production server integrity verification completed.",
    severity: "Low",
    actor: "PROD-SERVER-01",
    agent: "FIM Agent",
    ip: "192.168.1.10",
    status: "Success",
  },
  {
    id: 3,
    timestamp: "2026-08-21 14:21:09",
    event: "FILE_MODIFIED",
    description: "config.json changed from the trusted snapshot.",
    severity: "High",
    actor: "WEB-01",
    agent: "Linux FIM Agent",
    ip: "192.168.1.15",
    status: "Failed",
  },
  {
    id: 4,
    timestamp: "2026-08-21 14:15:32",
    event: "AGENT_CONNECTED",
    description: "New FIM agent successfully connected to the platform.",
    severity: "Low",
    actor: "LINUX-SERVER-02",
    agent: "FIM Agent",
    ip: "192.168.1.18",
    status: "Success",
  },
  {
    id: 5,
    timestamp: "2026-08-21 14:08:51",
    event: "UNAUTHORIZED_ACCESS",
    description: "Unauthorized attempt to access protected files.",
    severity: "High",
    actor: "UNKNOWN",
    agent: "Security Monitor",
    ip: "185.92.41.17",
    status: "Blocked",
  },
  {
    id: 6,
    timestamp: "2026-08-21 13:54:27",
    event: "FILE_CREATED",
    description: "New executable detected in a protected directory.",
    severity: "Medium",
    actor: "SECURITY-AGENT-01",
    agent: "Windows FIM Agent",
    ip: "192.168.1.25",
    status: "Success",
  },
  {
    id: 7,
    timestamp: "2026-08-21 13:42:03",
    event: "BASELINE_UPDATED",
    description: "Trusted baseline snapshot was updated by administrator.",
    severity: "Medium",
    actor: "Administrator",
    agent: "Management Console",
    ip: "192.168.1.5",
    status: "Success",
  },
  {
    id: 8,
    timestamp: "2026-08-21 13:31:46",
    event: "FILE_DELETED",
    description: "Protected file deletion attempt detected.",
    severity: "Critical",
    actor: "BACKUP-SERVER-01",
    agent: "Windows FIM Agent",
    ip: "192.168.1.30",
    status: "Blocked",
  },
];

const severityClass: Record<Severity, string> = {
  Critical: "critical",
  High: "high",
  Medium: "medium",
  Low: "low",
};

const statusClass: Record<Status, string> = {
  Success: "success",
  Failed: "failed",
  Blocked: "blocked",
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        log.event.toLowerCase().includes(searchText) ||
        log.description.toLowerCase().includes(searchText) ||
        log.actor.toLowerCase().includes(searchText) ||
        log.agent.toLowerCase().includes(searchText) ||
        log.ip.toLowerCase().includes(searchText);

      const matchesSeverity =
        severity === "All" || log.severity === severity;

      const matchesStatus =
        status === "All" || log.status === status;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [search, severity, status]);

  const exportLogs = () => {
    const header =
      "Timestamp,Event,Description,Severity,Actor,Agent,IP,Status";

    const rows = auditLogs.map((log) =>
      [
        log.timestamp,
        log.event,
        `"${log.description.replaceAll('"', '""')}"`,
        log.severity,
        log.actor,
        log.agent,
        log.ip,
        log.status,
      ].join(",")
    );

    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "fim-audit-logs.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="audit-page">
      <style jsx>{`
        .audit-page {
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
          font-size: 16px;
        }

        .secure {
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
        .toolbar button {
          background: #07100d;
          color: #c8d7d1;
          border: 1px solid #1a382e;
          border-radius: 9px;
          padding: 13px 16px;
          cursor: pointer;
        }

        .toolbar button:hover {
          border-color: #2cff8c;
          color: #32ff91;
        }

        .logs-card {
          border: 1px solid #173028;
          background: #050b09;
          border-radius: 16px;
          overflow: hidden;
        }

        .logs-header {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #173028;
        }

        .logs-header h2 {
          margin: 5px 0 0;
          font-size: 22px;
        }

        .logs-header span {
          color: #6f867e;
          font-size: 13px;
        }

        .export {
          border: 1px solid #1b5d40;
          background: #092117;
          color: #32ff91;
          border-radius: 8px;
          padding: 11px 15px;
          cursor: pointer;
          font-weight: 600;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
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
          padding: 17px 18px;
          border-bottom: 1px solid #11251e;
          color: #aebdb7;
          font-size: 13px;
        }

        tr.log-row {
          cursor: pointer;
          transition: background 0.15s;
        }

        tr.log-row:hover {
          background: rgba(30, 255, 130, 0.035);
        }

        .event {
          color: white;
          font-weight: 700;
          font-size: 12px;
        }

        .description {
          color: #758b83;
          margin-top: 5px;
          max-width: 330px;
          line-height: 1.4;
        }

        .badge {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .critical {
          color: #ff5e5e;
          background: rgba(255, 50, 50, 0.1);
          border: 1px solid rgba(255, 50, 50, 0.25);
        }

        .high {
          color: #ff9b57;
          background: rgba(255, 120, 50, 0.1);
          border: 1px solid rgba(255, 120, 50, 0.2);
        }

        .medium {
          color: #ffd35a;
          background: rgba(255, 210, 70, 0.08);
          border: 1px solid rgba(255, 210, 70, 0.2);
        }

        .low {
          color: #32ff91;
          background: rgba(50, 255, 145, 0.08);
          border: 1px solid rgba(50, 255, 145, 0.18);
        }

        .success {
          color: #32ff91;
        }

        .failed {
          color: #ff6868;
        }

        .blocked {
          color: #ff9d59;
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
          .audit-page {
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

          .secure {
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
            SECURITY CENTER / ACTIVITY / AUDIT LOGS
          </div>

          <h1>Audit Logs</h1>

          <p className="subtitle">
            Monitor security events, integrity changes and administrative
            activity across your infrastructure.
          </p>
        </div>

        <div className="secure">
          <span className="dot" />
          AUDIT SYSTEM ACTIVE
        </div>
      </header>

      <section className="stats">
        <div className="stat">
          <span>TOTAL EVENTS</span>
          <strong>{auditLogs.length}</strong>
          <p className="subtitle">Recorded security events</p>
        </div>

        <div className="stat">
          <span>CRITICAL EVENTS</span>
          <strong className="red">
            {auditLogs.filter((x) => x.severity === "Critical").length
              .toString()
              .padStart(2, "0")}
          </strong>
          <p className="subtitle">Immediate attention required</p>
        </div>

        <div className="stat">
          <span>BLOCKED ACTIONS</span>
          <strong className="yellow">
            {auditLogs.filter((x) => x.status === "Blocked").length
              .toString()
              .padStart(2, "0")}
          </strong>
          <p className="subtitle">Prevented by security controls</p>
        </div>

        <div className="stat">
          <span>SUCCESS RATE</span>
          <strong className="green">87.5%</strong>
          <p className="subtitle">Events processed successfully</p>
        </div>
      </section>

      <section className="toolbar">
        <input
          className="search"
          placeholder="Search events, users, agents or IP addresses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option>All</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All</option>
          <option>Success</option>
          <option>Failed</option>
          <option>Blocked</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setSeverity("All");
            setStatus("All");
          }}
        >
          ↻ Reset
        </button>
      </section>

      <section className="logs-card">
        <div className="logs-header">
          <div>
            <span>SECURITY ACTIVITY</span>
            <h2>Recent Audit Events</h2>
          </div>

          <button className="export" onClick={exportLogs}>
            ↓ Export Logs
          </button>
        </div>

        <div className="table-wrap">
          {filteredLogs.length === 0 ? (
            <div className="empty">
              No audit events match your current filters.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>EVENT</th>
                  <th>SEVERITY</th>
                  <th>ACTOR / AGENT</th>
                  <th>IP ADDRESS</th>
                  <th>STATUS</th>
                </tr>
              </thead>

                                         <tbody>
                {filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr
                      className="log-row"
                      onClick={() =>
                        setExpanded(
                          expanded === log.id ? null : log.id
                        )
                      }
                    >
                      <td>{log.timestamp}</td>

                      <td>
                        <div className="event">{log.event}</div>
                        <div className="description">
                          {log.description}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            severityClass[log.severity]
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>

                      <td>
                        <strong>{log.actor}</strong>
                        <br />
                        <span className="subtitle">{log.agent}</span>
                      </td>

                      <td>{log.ip}</td>

                      <td className={statusClass[log.status]}>
                        <span className="status-dot" />
                        {log.status}
                      </td>
                    </tr>

                    {expanded === log.id && (
                      <tr className="details">
                        <td colSpan={6}>
                          <div className="detail-grid">
                            <div className="detail-item">
                              <span>EVENT ID</span>
                              <strong>
                                EVT-{String(log.id).padStart(5, "0")}
                              </strong>
                            </div>

                            <div className="detail-item">
                              <span>ACTOR</span>
                              <strong>{log.actor}</strong>
                            </div>

                            <div className="detail-item">
                              <span>MONITORING AGENT</span>
                              <strong>{log.agent}</strong>
                            </div>

                            <div className="detail-item">
                              <span>SOURCE IP</span>
                              <strong>{log.ip}</strong>
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