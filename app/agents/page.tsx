"use client";

import React, { useMemo, useState } from "react";

type AgentStatus = "Online" | "Offline" | "Warning";
type IntegrityStatus = "Protected" | "Warning" | "Critical";

type Agent = {
  id: number;
  name: string;
  hostname: string;
  os: string;
  ip: string;
  status: AgentStatus;
  files: number;
  integrity: IntegrityStatus;
  lastSeen: string;
  version: string;
  location: string;
};

const agents: Agent[] = [
  {
    id: 1,
    name: "Windows Security Agent",
    hostname: "WIN-SEC-01",
    os: "Windows 11",
    ip: "192.168.1.21",
    status: "Online",
    files: 12482,
    integrity: "Protected",
    lastSeen: "Just now",
    version: "v2.4.1",
    location: "Security Network",
  },
  {
    id: 2,
    name: "Linux FIM Agent",
    hostname: "WEB-01",
    os: "Ubuntu 24.04",
    ip: "192.168.1.15",
    status: "Warning",
    files: 8921,
    integrity: "Warning",
    lastSeen: "34 sec ago",
    version: "v2.4.0",
    location: "Web Infrastructure",
  },
  {
    id: 3,
    name: "FIM Agent",
    hostname: "PROD-SERVER-01",
    os: "Windows Server 2022",
    ip: "192.168.1.10",
    status: "Online",
    files: 21304,
    integrity: "Protected",
    lastSeen: "1 min ago",
    version: "v2.4.1",
    location: "Production",
  },
  {
    id: 4,
    name: "Windows FIM Agent",
    hostname: "BACKUP-SERVER-01",
    os: "Windows Server 2022",
    ip: "192.168.1.30",
    status: "Offline",
    files: 6842,
    integrity: "Critical",
    lastSeen: "18 min ago",
    version: "v2.3.8",
    location: "Backup Infrastructure",
  },
  {
    id: 5,
    name: "FIM Agent",
    hostname: "LINUX-SERVER-02",
    os: "Ubuntu 22.04",
    ip: "192.168.1.18",
    status: "Online",
    files: 15320,
    integrity: "Protected",
    lastSeen: "2 min ago",
    version: "v2.4.1",
    location: "Internal Network",
  },
  {
    id: 6,
    name: "Security Agent",
    hostname: "SECURITY-AGENT-01",
    os: "Windows 11",
    ip: "192.168.1.25",
    status: "Online",
    files: 10482,
    integrity: "Protected",
    lastSeen: "3 min ago",
    version: "v2.4.1",
    location: "Security Network",
  },
];

const statusClass: Record<AgentStatus, string> = {
  Online: "online",
  Offline: "offline",
  Warning: "warning",
};

const integrityClass: Record<IntegrityStatus, string> = {
  Protected: "protected",
  Warning: "integrity-warning",
  Critical: "critical",
};

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        agent.name.toLowerCase().includes(searchText) ||
        agent.hostname.toLowerCase().includes(searchText) ||
        agent.os.toLowerCase().includes(searchText) ||
        agent.ip.toLowerCase().includes(searchText) ||
        agent.location.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All" || agent.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const totalFiles = agents.reduce(
    (total, agent) => total + agent.files,
    0
  );

  return (
    <main className="agents-page">
      <style jsx>{`
        .agents-page {
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

        .agents-card {
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

        .agent-count {
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

        tr.agent-row {
          cursor: pointer;
          transition: background 0.15s;
        }

        tr.agent-row:hover {
          background: rgba(30, 255, 130, 0.035);
        }

        .agent-name {
          color: white;
          font-weight: 700;
          font-size: 13px;
        }

        .hostname {
          color: #32ff91;
          font-family: monospace;
          margin-top: 5px;
          font-size: 12px;
        }

        .os {
          color: #c4d2cc;
        }

        .ip {
          font-family: monospace;
          color: #a9bbb4;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .online {
          color: #32ff91;
          background: rgba(50, 255, 145, 0.08);
          border: 1px solid rgba(50, 255, 145, 0.18);
        }

        .offline {
          color: #ff6868;
          background: rgba(255, 70, 70, 0.08);
          border: 1px solid rgba(255, 70, 70, 0.18);
        }

        .warning {
          color: #ffd35a;
          background: rgba(255, 210, 70, 0.08);
          border: 1px solid rgba(255, 210, 70, 0.2);
        }

        .protected {
          color: #32ff91;
        }

        .integrity-warning {
          color: #ffd35a;
        }

        .critical {
          color: #ff5e5e;
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
          .agents-page {
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
            SECURITY CENTER / INFRASTRUCTURE / AGENTS
          </div>

          <h1>Agents</h1>

          <p className="subtitle">
            Monitor connected endpoints and their file integrity status.
          </p>
        </div>

        <div className="system-status">
          <span className="dot" />
          AGENT MONITORING ACTIVE
        </div>
      </header>

      <section className="stats">
        <div className="stat">
          <span>TOTAL AGENTS</span>
          <strong>{agents.length}</strong>
          <p className="subtitle">Registered endpoints</p>
        </div>

        <div className="stat">
          <span>ONLINE</span>
          <strong className="green">
            {agents.filter((x) => x.status === "Online").length}
          </strong>
          <p className="subtitle">Currently connected</p>
        </div>

        <div className="stat">
          <span>WARNINGS</span>
          <strong className="yellow">
            {agents.filter((x) => x.status === "Warning").length}
          </strong>
          <p className="subtitle">Require investigation</p>
        </div>

        <div className="stat">
          <span>FILES MONITORED</span>
          <strong className="green">
            {totalFiles.toLocaleString()}
          </strong>
          <p className="subtitle">Across all endpoints</p>
        </div>
      </section>

      <section className="toolbar">
        <input
          className="search"
          placeholder="Search agents, hostnames, IP addresses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All</option>
          <option>Online</option>
          <option>Warning</option>
          <option>Offline</option>
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

      <section className="agents-card">
        <div className="card-header">
          <div>
            <span>ENDPOINT SECURITY</span>
            <h2>Registered Agents</h2>
          </div>

          <div className="agent-count">
            {filteredAgents.length} / {agents.length} AGENTS
          </div>
        </div>

        <div className="table-wrap">
          {filteredAgents.length === 0 ? (
            <div className="empty">
              No agents match your current filters.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>AGENT</th>
                  <th>OPERATING SYSTEM</th>
                  <th>IP ADDRESS</th>
                  <th>STATUS</th>
                  <th>FILES MONITORED</th>
                  <th>INTEGRITY</th>
                  <th>LAST SEEN</th>
                </tr>
              </thead>

              <tbody>
                {filteredAgents.map((agent) => (
                  <React.Fragment key={agent.id}>
                    <tr
                      className="agent-row"
                      onClick={() =>
                        setExpanded(
                          expanded === agent.id ? null : agent.id
                        )
                      }
                    >
                      <td>
                        <div className="agent-name">
                          {agent.name}
                        </div>

                        <div className="hostname">
                          {agent.hostname}
                        </div>
                      </td>

                      <td>
                        <span className="os">{agent.os}</span>
                      </td>

                      <td>
                        <span className="ip">{agent.ip}</span>
                      </td>

                      <td>
                        <span
                          className={`badge ${statusClass[agent.status]}`}
                        >
                          <span className="status-dot" />
                          {agent.status}
                        </span>
                      </td>

                      <td>
                        {agent.files.toLocaleString()}
                      </td>

                      <td>
                        <strong
                          className={
                            integrityClass[agent.integrity]
                          }
                        >
                          {agent.integrity}
                        </strong>
                      </td>

                      <td>{agent.lastSeen}</td>
                    </tr>

                    {expanded === agent.id && (
                      <tr className="details">
                        <td colSpan={7}>
                          <div className="detail-grid">
                            <div className="detail-item">
                              <span>AGENT VERSION</span>
                              <strong>{agent.version}</strong>
                            </div>

                            <div className="detail-item">
                              <span>HOSTNAME</span>
                              <strong>{agent.hostname}</strong>
                            </div>

                            <div className="detail-item">
                              <span>LOCATION</span>
                              <strong>{agent.location}</strong>
                            </div>

                            <div className="detail-item">
                              <span>INTEGRITY STATUS</span>
                              <strong>{agent.integrity}</strong>
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