"use client";

import { useState } from "react";

type Severity = "Critical" | "High" | "Medium" | "Low";

type Event = {
  id: number;
  time: string;
  timestamp: string;
  severity: Severity;
  event: string;
  file: string;
  agent: string;
  previousHash: string;
  currentHash: string;
  status: string;
};

const events: Event[] = [
  {
    id: 1,
    time: "2 min ago",
    timestamp: "2026-08-24 18:44:12",
    severity: "Critical",
    event: "File Modified",
    file: "C:\\Windows\\System32\\config\\SAM",
    agent: "WIN-SEC-01",
    previousHash:
      "8a7d5e1f9c4b7a2e6d8f1c3b5a9e7d2f4c6b8a1e3d5f7c9b2a4e6d8f1c3b5a",
    currentHash:
      "f3b8c1a7d9e2f4c6b5a8d1e7f9c3b2a6d4e8f1c5b7a9d2e6f3c8b4a1d5e7f",
    status: "Hash mismatch detected",
  },
  {
    id: 2,
    time: "8 min ago",
    timestamp: "2026-08-24 18:38:04",
    severity: "High",
    event: "Unauthorized Change",
    file: "/var/www/application/config.json",
    agent: "WEB-01",
    previousHash:
      "1d4f7a9c2b6e8f3a5d7c1b9e4f6a2d8c3b5e7f1a9d4c6b8e2f5a7c9d1b3e6f",
    currentHash:
      "9c2a5f7e1d4b8a6c3f9e2d5b7a1c4e8f6d3b9a2e5c7f1d8b4a6e9c3f5b7d2",
    status: "Unauthorized modification",
  },
  {
    id: 3,
    time: "15 min ago",
    timestamp: "2026-08-24 18:31:45",
    severity: "Medium",
    event: "File Created",
    file: "/etc/security/policy.conf",
    agent: "LINUX-01",
    previousHash: "N/A",
    currentHash:
      "7e4a9c2f6b1d8e5a3c7f9b2d4a6e8c1f5d3b7a9e2c6f4d8b1a5e7c9f3b6d2",
    status: "New file detected",
  },
  {
    id: 4,
    time: "24 min ago",
    timestamp: "2026-08-24 18:22:19",
    severity: "Low",
    event: "File Accessed",
    file: "/var/log/security.log",
    agent: "PROD-SERVER-01",
    previousHash:
      "5b8e2c7f1a4d9e6b3c5f8a2d7e1b4c9f6a3d8e5b2c7f1a9d4e6b8c3f5a7d2",
    currentHash:
      "5b8e2c7f1a4d9e6b3c5f8a2d7e1b4c9f6a3d8e5b2c7f1a9d4e6b8c3f5a7d2",
    status: "No content change detected",
  },
];

export default function EventsPage() {
  const [filter, setFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents =
    filter === "All"
      ? events
      : events.filter((event) => event.severity === filter);

  const severityColor = (severity: Severity) => {
    if (severity === "Critical") return "#ff5757";
    if (severity === "High") return "#ff9b57";
    if (severity === "Medium") return "#ffd35a";
    return "#22ff88";
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020605",
        color: "#f5f7f6",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "#22ff88",
            letterSpacing: "3px",
            fontSize: "13px",
          }}
        >
          SECURITY CENTER / EVENTS
        </p>

        <h1
          style={{
            fontSize: "48px",
            margin: "10px 0",
          }}
        >
          Security Events
        </h1>

        <p
          style={{
            color: "#7f938b",
            fontSize: "18px",
          }}
        >
          Monitor file integrity and security events across your
          infrastructure.
        </p>

        {/* FILTER */}
        <div
          style={{
            marginTop: "35px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <label>Severity:</label>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              background: "#07100d",
              color: "white",
              border: "1px solid #1b3a2d",
              borderRadius: "8px",
              padding: "12px 16px",
              cursor: "pointer",
            }}
          >
            <option value="All">All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* EVENTS */}
        <section
          style={{
            marginTop: "25px",
            border: "1px solid #173028",
            borderRadius: "16px",
            overflow: "hidden",
            background: "#050b09",
          }}
        >
          <div
            style={{
              padding: "22px",
              borderBottom: "1px solid #173028",
            }}
          >
            <h2 style={{ margin: 0 }}>
              Recent Security Events
            </h2>
          </div>

          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              style={{
                padding: "22px",
                borderBottom: "1px solid #12251e",
                display: "grid",
                gridTemplateColumns:
                  "120px 110px 1fr 1fr 150px",
                gap: "20px",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span style={{ color: "#7f938b" }}>
                {event.time}
              </span>

              <strong
                style={{
                  color: severityColor(event.severity),
                }}
              >
                {event.severity}
              </strong>

              <strong>{event.event}</strong>

              <span
                style={{
                  color: "#9fb2aa",
                  wordBreak: "break-word",
                }}
              >
                {event.file}
              </span>

              <span style={{ color: "#22ff88" }}>
                {event.agent}
              </span>
            </div>
          ))}
        </section>

        {/* EVENT DETAILS */}
        {selectedEvent && (
          <section
            style={{
              marginTop: "25px",
              padding: "30px",
              border: "1px solid #22ff88",
              borderRadius: "16px",
              background: "#050b09",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#22ff88",
                    letterSpacing: "2px",
                    fontSize: "12px",
                  }}
                >
                  EVENT DETAILS
                </p>

                <h2 style={{ margin: "5px 0" }}>
                  {selectedEvent.event}
                </h2>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  background: "#07100d",
                  color: "#22ff88",
                  border: "1px solid #1b3a2d",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, 1fr)",
                gap: "18px",
              }}
            >
              <Detail
                title="Severity"
                value={selectedEvent.severity}
                valueColor={severityColor(
                  selectedEvent.severity
                )}
              />

              <Detail
                title="Detection Time"
                value={selectedEvent.timestamp}
              />

              <Detail
                title="Agent"
                value={selectedEvent.agent}
                valueColor="#22ff88"
              />

              <Detail
                title="Status"
                value={selectedEvent.status}
              />

              <div
                style={{
                  gridColumn: "1 / -1",
                  background: "#07100d",
                  padding: "18px",
                  borderRadius: "10px",
                  border: "1px solid #173028",
                }}
              >
                <p
                  style={{
                    color: "#7f938b",
                    margin: "0 0 8px",
                    fontSize: "13px",
                  }}
                >
                  FILE PATH
                </p>

                <code
                  style={{
                    color: "#22ff88",
                    wordBreak: "break-all",
                  }}
                >
                  {selectedEvent.file}
                </code>
              </div>

              <HashBox
                title="Previous SHA-256"
                hash={selectedEvent.previousHash}
              />

              <HashBox
                title="Current SHA-256"
                hash={selectedEvent.currentHash}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Detail({
  title,
  value,
  valueColor = "#f5f7f6",
}: {
  title: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        background: "#07100d",
        padding: "18px",
        borderRadius: "10px",
        border: "1px solid #173028",
      }}
    >
      <p
        style={{
          color: "#7f938b",
          margin: "0 0 8px",
          fontSize: "13px",
        }}
      >
        {title}
      </p>

      <strong style={{ color: valueColor }}>
        {value}
      </strong>
    </div>
  );
}

function HashBox({
  title,
  hash,
}: {
  title: string;
  hash: string;
}) {
  return (
    <div
      style={{
        background: "#07100d",
        padding: "18px",
        borderRadius: "10px",
        border: "1px solid #173028",
      }}
    >
      <p
        style={{
          color: "#7f938b",
          margin: "0 0 8px",
          fontSize: "13px",
        }}
      >
        {title}
      </p>

      <code
        style={{
          color: "#9fb2aa",
          fontSize: "12px",
          wordBreak: "break-all",
        }}
      >
        {hash}
      </code>
    </div>
  );
}