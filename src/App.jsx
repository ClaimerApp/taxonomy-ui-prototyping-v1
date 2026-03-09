import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0A0E17",
  surface: "#111827",
  surfaceHover: "#1A2235",
  surfaceActive: "#1E2A3F",
  border: "#1F2937",
  borderSubtle: "#161E2E",
  text: "#E5E7EB",
  textMuted: "#9CA3AF",
  textDim: "#6B7280",
  accent: "#3B82F6",
  accentGlow: "rgba(59, 130, 246, 0.15)",
  accentSoft: "rgba(59, 130, 246, 0.08)",
  critical: "#EF4444",
  criticalBg: "rgba(239, 68, 68, 0.08)",
  criticalBorder: "rgba(239, 68, 68, 0.2)",
  warning: "#F59E0B",
  warningBg: "rgba(245, 158, 11, 0.08)",
  warningBorder: "rgba(245, 158, 11, 0.2)",
  opportunity: "#10B981",
  opportunityBg: "rgba(16, 185, 129, 0.08)",
  opportunityBorder: "rgba(16, 185, 129, 0.2)",
  info: "#6366F1",
  infoBg: "rgba(99, 102, 241, 0.08)",
  infoBorder: "rgba(99, 102, 241, 0.2)",
};

const typeConfig = {
  critical: { color: COLORS.critical, bg: COLORS.criticalBg, border: COLORS.criticalBorder, label: "CRITICAL" },
  warning: { color: COLORS.warning, bg: COLORS.warningBg, border: COLORS.warningBorder, label: "WARNING" },
  opportunity: { color: COLORS.opportunity, bg: COLORS.opportunityBg, border: COLORS.opportunityBorder, label: "OPPORTUNITY" },
  info: { color: COLORS.info, bg: COLORS.infoBg, border: COLORS.infoBorder, label: "INFO" },
};

const insights = [
  {
    id: 1,
    type: "critical",
    title: "HMRC Inquiry Response Overdue — Nexagen Ltd",
    summary: "HMRC caseworker Sarah Mitchell requested additional documentation for the 2023 R&D claim (ref: CT/RD/2024/00847). The 30-day response window expires this Friday 7 March. No outbound correspondence detected.",
    client: "Nexagen Ltd",
    clientId: "08451923",
    timeAgo: "2 hours ago",
    sources: [
      { type: "email", label: "HMRC inquiry letter received", detail: "From: sarah.mitchell@hmrc.gov.uk — 5 Feb 2026 — Subject: R&D Tax Relief Enquiry - Nexagen Ltd - CT/RD/2024/00847", icon: "📧" },
      { type: "email", label: "No outbound reply detected", detail: "Taxonomy scanned all outbound emails to HMRC and to client from 5 Feb to present. No response thread found.", icon: "⚠️" },
      { type: "legislation", label: "FA 2004 Sch 24 — Penalties for failure to comply", detail: "Failure to respond to a valid information notice may result in a £300 initial penalty plus £60/day thereafter.", icon: "📜" },
    ],
    actions: ["Draft response reminder to advisor", "View original inquiry letter", "Open client timeline"],
    delivered: ["Email to j.harrison@firm.co.uk", "Teams notification"],
    advisor: "James Harrison",
  },
  {
    id: 2,
    type: "critical",
    title: "CNF Deadline in 18 Days — Prospect: Arcline Robotics Ltd",
    summary: "Arcline Robotics Ltd (prospect, in pipeline since 14 Jan) has an accounting period ending 31 Dec 2025. This appears to be their first R&D claim. A Claim Notification Form must be filed by 31 March 2026. No CNF submission confirmation detected.",
    client: "Arcline Robotics Ltd",
    clientId: "12847561",
    timeAgo: "4 hours ago",
    sources: [
      { type: "email", label: "Prospect engagement email", detail: "From: m.chen@arclinerobotics.com — 14 Jan 2026 — Initial inquiry about R&D tax relief for robotics development work", icon: "📧" },
      { type: "companies_house", label: "Companies House — Accounting reference date", detail: "Arcline Robotics Ltd (12847561) — ARD: 31 December. Latest filed accounts: 31 Dec 2024. SIC: 28990 (Manufacture of special-purpose machinery)", icon: "🏛️" },
      { type: "legislation", label: "FA 2023 s.1 — Claim Notification requirement", detail: "First-time or lapsed claimants must submit a CNF within 6 months of accounting period end.", icon: "📜" },
    ],
    actions: ["Alert advisor to expedite engagement", "Check AIF requirement", "View prospect emails"],
    delivered: ["Email to s.patel@firm.co.uk"],
    advisor: "Sophie Patel",
  },
  {
    id: 3,
    type: "warning",
    title: "Group Structure Change May Affect SME Eligibility — Ferro Dynamics Ltd",
    summary: "Companies House filing on 28 Feb 2026 shows Vantage Holdings plc acquired 55% of Ferro Dynamics Ltd. Based on Vantage's last filed accounts (turnover £48M, 310 employees), the combined group likely exceeds SME thresholds. Ferro's current claim is being prepared under the merged scheme SME rate.",
    client: "Ferro Dynamics Ltd",
    clientId: "09273641",
    timeAgo: "Yesterday",
    sources: [
      { type: "companies_house", label: "PSC change filed — Vantage Holdings plc", detail: "Filed 28 Feb 2026 — Vantage Holdings plc notified as PSC with 50-75% ownership", icon: "🏛️" },
      { type: "companies_house", label: "Vantage Holdings plc — Filed accounts", detail: "Year ending 30 Sep 2025 — Turnover: £48.2M, Employees: 310, Total assets: £31.4M", icon: "🏛️" },
      { type: "email", label: "R&D report draft — Ferro Dynamics", detail: "Prepared under merged scheme — qualifying expenditure: £420K — draft sent to client 18 Feb 2026", icon: "📧" },
      { type: "legislation", label: "CTA 2009 s.1119 — SME definition", detail: "An SME must have fewer than 500 employees, turnover under €100M, and balance sheet under €86M. Linked and partner enterprises must be aggregated.", icon: "📜" },
    ],
    actions: ["Recalculate group thresholds", "Review claim basis", "Contact client re: acquisition"],
    delivered: ["Email to j.harrison@firm.co.uk", "Teams notification"],
    advisor: "James Harrison",
  },
  {
    id: 4,
    type: "opportunity",
    title: "Prior Year Claim Opportunity — Meridian Software Ltd",
    summary: "Meridian Software Ltd became a client on 10 Jan 2026. Their filed accounts for YE 31 March 2024 and 2025 show significant capitalised development costs (£285K and £340K respectively) but no R&D tax credit appears in the tax charge note. The 2024 period is still within the two-year amendment window until 31 March 2026.",
    client: "Meridian Software Ltd",
    clientId: "11384726",
    timeAgo: "Yesterday",
    sources: [
      { type: "email", label: "Engagement letter signed", detail: "Signed 10 Jan 2026 — Scope: R&D tax claim preparation for YE 31 Mar 2025", icon: "📧" },
      { type: "companies_house", label: "Filed accounts — YE 31 Mar 2024", detail: "Capitalised development costs: £285K. No R&D tax credit in tax charge note. CT liability: £67K.", icon: "🏛️" },
      { type: "companies_house", label: "Filed accounts — YE 31 Mar 2025", detail: "Capitalised development costs: £340K. No R&D tax credit in tax charge note. CT liability: £82K.", icon: "🏛️" },
      { type: "legislation", label: "FA 1998 Sch 18 para 15 — Amendment window", detail: "A company may amend its CT return within 2 years of the filing date.", icon: "📜" },
    ],
    actions: ["Estimate prior year claim value", "Discuss with client", "Check AIF/CNF requirements for prior period"],
    delivered: ["Email to s.patel@firm.co.uk"],
    advisor: "Sophie Patel",
  },
  {
    id: 5,
    type: "warning",
    title: "Unanswered Client Question — 6 Days — Helix BioSciences",
    summary: "Dr. Rebecca Torres (Helix BioSciences) asked a direct question on 27 Feb about whether their clinical trial subcontractor costs would qualify under the new merged scheme rules. No reply has been sent by anyone at the firm. This is the second unanswered email in this thread.",
    client: "Helix BioSciences Ltd",
    clientId: "10572839",
    timeAgo: "Today",
    sources: [
      { type: "email", label: "Client question — unanswered", detail: "From: r.torres@helixbio.co.uk — 27 Feb 2026 — 'Can you confirm whether the Phase II trial costs with ClinRes Partners would still qualify as subcontracted R&D under the new rules?'", icon: "📧" },
      { type: "email", label: "Previous unanswered follow-up", detail: "From: r.torres@helixbio.co.uk — 3 Mar 2026 — 'Just following up on the below — we need to finalise our budget allocation by end of next week.'", icon: "📧" },
    ],
    actions: ["Draft response", "View full thread", "Reassign to available advisor"],
    delivered: ["Email to j.harrison@firm.co.uk"],
    advisor: "James Harrison",
  },
  {
    id: 6,
    type: "opportunity",
    title: "Grant Funding Alignment — Photon Energy Systems Ltd",
    summary: "Innovate UK published new funding calls for clean energy storage projects on 1 March 2026. Photon Energy Systems' R&D report describes qualifying work on solid-state battery thermal management that appears to align with the 'Net Zero Energy Storage' competition. Grant funding would also generate additional qualifying R&D expenditure.",
    client: "Photon Energy Systems Ltd",
    clientId: "13291847",
    timeAgo: "2 days ago",
    sources: [
      { type: "email", label: "R&D technical narrative — Photon Energy Systems", detail: "Submitted 12 Dec 2025 — Describes novel thermal management system for solid-state batteries, overcoming heat dissipation challenges", icon: "📧" },
      { type: "public", label: "Innovate UK — Competition: Net Zero Energy Storage", detail: "Published 1 Mar 2026 — Funding available: up to £500K per project — Deadline: 15 May 2026", icon: "🌐" },
    ],
    actions: ["Share grant opportunity with client", "Assess R&D claim interaction with grant funding"],
    delivered: ["Email to s.patel@firm.co.uk"],
    advisor: "Sophie Patel",
  },
  {
    id: 7,
    type: "info",
    title: "Stalled Engagement — Client Data Received but Not Actioned — QuantumLeap AI",
    summary: "QuantumLeap AI sent their general ledger, payroll summary, and project cost breakdown on 14 February. No internal or external correspondence suggests the R&D claim preparation has commenced. This is now 19 days without action. Filing deadline for YE 30 Sep 2025 is 30 Sep 2026.",
    client: "QuantumLeap AI Ltd",
    clientId: "14028374",
    timeAgo: "3 days ago",
    sources: [
      { type: "email", label: "Client data received", detail: "From: ops@quantumleap-ai.com — 14 Feb 2026 — Attachments: GL_2025.xlsx, Payroll_Summary_2025.pdf, Project_Costs_Breakdown.xlsx", icon: "📧" },
      { type: "email", label: "No follow-up activity detected", detail: "No outbound emails to client or internal discussion referencing QuantumLeap AI since 14 Feb 2026", icon: "⚠️" },
    ],
    actions: ["Assign to available advisor", "Send acknowledgement to client", "View client data files"],
    delivered: ["Email to j.harrison@firm.co.uk"],
    advisor: "James Harrison",
  },
];

const clients = [
  { name: "Nexagen Ltd", id: "08451923", status: "critical", activeInsights: 1, advisor: "James Harrison", claimValue: "£185K", period: "YE 31 Mar 2025" },
  { name: "Arcline Robotics Ltd", id: "12847561", status: "critical", activeInsights: 1, advisor: "Sophie Patel", claimValue: "TBC", period: "YE 31 Dec 2025", prospect: true },
  { name: "Ferro Dynamics Ltd", id: "09273641", status: "warning", activeInsights: 1, advisor: "James Harrison", claimValue: "£420K", period: "YE 30 Jun 2025" },
  { name: "Helix BioSciences Ltd", id: "10572839", status: "warning", activeInsights: 1, advisor: "James Harrison", claimValue: "£290K", period: "YE 31 Dec 2025" },
  { name: "Meridian Software Ltd", id: "11384726", status: "opportunity", activeInsights: 1, advisor: "Sophie Patel", claimValue: "£180K", period: "YE 31 Mar 2025" },
  { name: "Photon Energy Systems Ltd", id: "13291847", status: "opportunity", activeInsights: 1, advisor: "Sophie Patel", claimValue: "£210K", period: "YE 31 Mar 2025" },
  { name: "QuantumLeap AI Ltd", id: "14028374", status: "info", activeInsights: 1, advisor: "James Harrison", claimValue: "£155K", period: "YE 30 Sep 2025" },
  { name: "Brightpath Engineering Ltd", id: "07829134", status: "clear", activeInsights: 0, advisor: "Sophie Patel", claimValue: "£95K", period: "YE 31 Mar 2025" },
  { name: "Covalent Materials Ltd", id: "11293847", status: "clear", activeInsights: 0, advisor: "James Harrison", claimValue: "£310K", period: "YE 30 Jun 2025" },
];

const StatusDot = ({ status, size = 8 }) => (
  <span style={{
    display: "inline-block",
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundColor: typeConfig[status]?.color || COLORS.textDim,
    boxShadow: status === "critical" ? `0 0 8px ${COLORS.critical}` : "none",
    animation: status === "critical" ? "pulse 2s ease-in-out infinite" : "none",
  }} />
);

const TypeBadge = ({ type }) => {
  const config = typeConfig[type];
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "3px 10px",
      borderRadius: 4,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: config.color,
      backgroundColor: config.bg,
      border: `1px solid ${config.border}`,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <StatusDot status={type} size={6} />
      {config.label}
    </span>
  );
};

const SourceItem = ({ source, index }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        padding: "12px 16px",
        backgroundColor: expanded ? COLORS.surfaceActive : COLORS.surface,
        borderRadius: 6,
        cursor: "pointer",
        border: `1px solid ${expanded ? COLORS.border : COLORS.borderSubtle}`,
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>{source.icon}</span>
        <span style={{ fontSize: 13, color: COLORS.text, flex: 1 }}>{source.label}</span>
        <span style={{ fontSize: 11, color: COLORS.textDim, transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }}>▾</span>
      </div>
      {expanded && (
        <div style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: `1px solid ${COLORS.border}`,
          fontSize: 12,
          color: COLORS.textMuted,
          lineHeight: 1.6,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {source.detail}
        </div>
      )}
    </div>
  );
};

const InsightCard = ({ insight, onClick, compact = false }) => {
  const config = typeConfig[insight.type];
  return (
    <div
      onClick={onClick}
      style={{
        padding: compact ? "16px 20px" : "20px 24px",
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        border: `1px solid ${config.border}`,
        borderLeft: `3px solid ${config.color}`,
        cursor: "pointer",
        transition: "all 0.15s ease",
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = COLORS.surfaceHover;
        e.currentTarget.style.borderColor = config.color;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = COLORS.surface;
        e.currentTarget.style.borderColor = config.border;
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: compact ? 8 : 12 }}>
        <TypeBadge type={insight.type} />
        <span style={{ fontSize: 11, color: COLORS.textDim, whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace" }}>{insight.timeAgo}</span>
      </div>
      <h3 style={{ fontSize: compact ? 14 : 15, fontWeight: 600, color: COLORS.text, margin: 0, marginBottom: 8, lineHeight: 1.4, fontFamily: "'Instrument Sans', sans-serif" }}>
        {insight.title}
      </h3>
      {!compact && (
        <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0, lineHeight: 1.6 }}>
          {insight.summary}
        </p>
      )}
      {!compact && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.borderSubtle}` }}>
          <span style={{ fontSize: 11, color: COLORS.textDim }}>
            {insight.sources.length} sources
          </span>
          <span style={{ fontSize: 11, color: COLORS.textDim }}>
            {insight.advisor}
          </span>
          <span style={{ fontSize: 11, color: COLORS.textDim }}>
            Delivered: {insight.delivered.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
};

const InsightDetail = ({ insight, onBack }) => {
  const config = typeConfig[insight.type];
  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", color: COLORS.accent, cursor: "pointer",
          fontSize: 13, padding: "0 0 20px", display: "flex", alignItems: "center", gap: 6,
          fontFamily: "'Instrument Sans', sans-serif",
        }}
      >
        ← Back to timeline
      </button>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <TypeBadge type={insight.type} />
          <span style={{ fontSize: 12, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{insight.timeAgo}</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 8px", fontFamily: "'Instrument Sans', sans-serif" }}>
          {insight.title}
        </h2>
        <div style={{ fontSize: 12, color: COLORS.textDim, display: "flex", gap: 16 }}>
          <span>Client: {insight.client}</span>
          <span>Company #{insight.clientId}</span>
          <span>Advisor: {insight.advisor}</span>
        </div>
      </div>

      <div style={{
        padding: 20, backgroundColor: config.bg, borderRadius: 8,
        border: `1px solid ${config.border}`, marginBottom: 28,
      }}>
        <p style={{ fontSize: 14, color: COLORS.text, margin: 0, lineHeight: 1.7 }}>
          {insight.summary}
        </p>
      </div>

      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: COLORS.textDim, letterSpacing: "0.08em", margin: "0 0 14px", fontFamily: "'JetBrains Mono', monospace" }}>
          EVIDENCE CHAIN
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {insight.sources.map((source, i) => (
            <SourceItem key={i} source={source} index={i} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: COLORS.textDim, letterSpacing: "0.08em", margin: "0 0 14px", fontFamily: "'JetBrains Mono', monospace" }}>
          SUGGESTED ACTIONS
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {insight.actions.map((action, i) => (
            <button key={i} style={{
              padding: "10px 16px", backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
              borderRadius: 6, color: COLORS.text, fontSize: 13, cursor: "pointer", textAlign: "left",
              transition: "all 0.15s", fontFamily: "'Instrument Sans', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = COLORS.surfaceHover; e.currentTarget.style.borderColor = COLORS.accent; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = COLORS.surface; e.currentTarget.style.borderColor = COLORS.border; }}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: COLORS.textDim, letterSpacing: "0.08em", margin: "0 0 14px", fontFamily: "'JetBrains Mono', monospace" }}>
          DELIVERY LOG
        </h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {insight.delivered.map((d, i) => (
            <span key={i} style={{
              padding: "5px 12px", backgroundColor: COLORS.accentSoft, borderRadius: 4,
              fontSize: 12, color: COLORS.accent, border: `1px solid rgba(59,130,246,0.15)`,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              ✓ {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const EmailPreview = () => {
  const insight = insights[0];
  const config = typeConfig[insight.type];
  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: COLORS.textMuted, margin: "0 0 16px", fontFamily: "'Instrument Sans', sans-serif" }}>
        Email notification preview
      </h3>
      <div style={{
        backgroundColor: "#ffffff", borderRadius: 8, overflow: "hidden",
        border: `1px solid ${COLORS.border}`, maxWidth: 600,
      }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>From: Taxonomy &lt;alerts@taxonomy.ai&gt;</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>To: j.harrison@firm.co.uk</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>🔴 HMRC Inquiry Response Overdue — Nexagen Ltd</div>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{
            padding: "12px 16px", backgroundColor: "#FEF2F2", borderRadius: 6,
            borderLeft: "3px solid #EF4444", marginBottom: 20,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", letterSpacing: "0.08em", marginBottom: 6 }}>CRITICAL — ACTION REQUIRED</div>
            <div style={{ fontSize: 13, color: "#1F2937", lineHeight: 1.6 }}>
              The 30-day response window for HMRC inquiry ref CT/RD/2024/00847 expires this Friday 7 March. No response has been detected.
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>What Taxonomy found:</div>
            <div style={{ paddingLeft: 12, borderLeft: "2px solid #E5E7EB" }}>
              <div style={{ marginBottom: 8 }}>HMRC caseworker Sarah Mitchell sent an information request on 5 Feb 2026 for additional documentation supporting the Nexagen Ltd 2023 R&D claim.</div>
              <div>No outbound email to HMRC or to the client regarding this inquiry has been detected from anyone at the firm.</div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{
              display: "inline-block", padding: "10px 28px", backgroundColor: "#3B82F6",
              color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              View full insight in Taxonomy →
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
            Taxonomy — Proactive Tax Intelligence
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientRow = ({ client, onClick }) => {
  const statusColor = typeConfig[client.status]?.color || COLORS.textDim;
  return (
    <div
      onClick={onClick}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 100px 90px 120px 120px 60px",
        alignItems: "center",
        padding: "14px 20px",
        borderBottom: `1px solid ${COLORS.borderSubtle}`,
        cursor: "pointer",
        transition: "background 0.1s",
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.surfaceHover}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StatusDot status={client.status} />
          <span style={{ fontSize: 14, color: COLORS.text, fontWeight: 500 }}>{client.name}</span>
          {client.prospect && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, backgroundColor: COLORS.infoBg, color: COLORS.info, border: `1px solid ${COLORS.infoBorder}`, fontFamily: "'JetBrains Mono', monospace" }}>PROSPECT</span>}
        </div>
      </div>
      <span style={{ fontSize: 12, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{client.id}</span>
      <span style={{ fontSize: 13, color: COLORS.textMuted }}>{client.claimValue}</span>
      <span style={{ fontSize: 12, color: COLORS.textMuted }}>{client.period}</span>
      <span style={{ fontSize: 12, color: COLORS.textMuted }}>{client.advisor}</span>
      <div style={{ textAlign: "right" }}>
        {client.activeInsights > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 22, height: 22, borderRadius: "50%", fontSize: 11, fontWeight: 700,
            backgroundColor: typeConfig[client.status]?.bg || COLORS.surface,
            color: statusColor,
            border: `1px solid ${typeConfig[client.status]?.border || COLORS.border}`,
          }}>
            {client.activeInsights}
          </span>
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, setSelectedInsight }) => {
  const tabs = [
    { id: "timeline", label: "Timeline", icon: "◎" },
    { id: "clients", label: "Clients", icon: "◫" },
    { id: "email", label: "Email Preview", icon: "✉" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  const stats = {
    critical: insights.filter(i => i.type === "critical").length,
    warning: insights.filter(i => i.type === "warning").length,
    opportunity: insights.filter(i => i.type === "opportunity").length,
  };

  return (
    <div style={{
      width: 240, backgroundColor: COLORS.surface, borderRight: `1px solid ${COLORS.border}`,
      display: "flex", flexDirection: "column", height: "100%", flexShrink: 0,
    }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, backgroundColor: COLORS.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#fff",
            fontFamily: "'JetBrains Mono', monospace",
          }}>T</div>
          <span style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.02em", fontFamily: "'Instrument Sans', sans-serif" }}>Taxonomy</span>
        </div>
        <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace" }}>Proactive Tax Intelligence</span>
      </div>

      <div style={{ padding: "16px 16px 12px" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { count: stats.critical, color: COLORS.critical, bg: COLORS.criticalBg },
            { count: stats.warning, color: COLORS.warning, bg: COLORS.warningBg },
            { count: stats.opportunity, color: COLORS.opportunity, bg: COLORS.opportunityBg },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: "8px 0", borderRadius: 6, textAlign: "center",
              backgroundColor: s.bg, border: `1px solid transparent`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.count}</div>
            </div>
          ))}
        </div>
      </div>

      <nav style={{ padding: "4px 12px", flex: 1 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedInsight(null); }}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 12px", marginBottom: 2, border: "none", borderRadius: 6,
              backgroundColor: activeTab === tab.id ? COLORS.surfaceActive : "transparent",
              color: activeTab === tab.id ? COLORS.text : COLORS.textMuted,
              cursor: "pointer", fontSize: 13, textAlign: "left",
              transition: "all 0.1s", fontFamily: "'Instrument Sans', sans-serif",
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = COLORS.surfaceHover; }}
            onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <span style={{ fontSize: 15, opacity: 0.7 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: `1px solid ${COLORS.border}`, fontSize: 11, color: COLORS.textDim }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>Harrison & Patel LLP</div>
        <div style={{ marginTop: 4, color: COLORS.textDim }}>Last scan: 2 min ago</div>
      </div>
    </div>
  );
};

const FilterBar = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: "all", label: "All" },
    { id: "critical", label: "Critical" },
    { id: "warning", label: "Warnings" },
    { id: "opportunity", label: "Opportunities" },
    { id: "info", label: "Info" },
  ];
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
      {filters.map(f => (
        <button
          key={f.id}
          onClick={() => setActiveFilter(f.id)}
          style={{
            padding: "6px 14px", borderRadius: 5, border: `1px solid ${activeFilter === f.id ? COLORS.accent : COLORS.border}`,
            backgroundColor: activeFilter === f.id ? COLORS.accentSoft : "transparent",
            color: activeFilter === f.id ? COLORS.accent : COLORS.textMuted,
            fontSize: 12, cursor: "pointer", transition: "all 0.1s",
            fontFamily: "'Instrument Sans', sans-serif",
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

const SettingsView = () => (
  <div style={{ animation: "fadeIn 0.2s ease" }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 8px", fontFamily: "'Instrument Sans', sans-serif" }}>
      Settings
    </h2>
    <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 28px" }}>
      Connect data sources and configure alert delivery.
    </p>

    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 12, fontWeight: 700, color: COLORS.textDim, letterSpacing: "0.08em", margin: "0 0 14px", fontFamily: "'JetBrains Mono', monospace" }}>
        DATA SOURCES
      </h3>
      {[
        { name: "Microsoft 365 Email", status: "connected", detail: "j.harrison@firm.co.uk, s.patel@firm.co.uk — 12,847 emails indexed", icon: "📧" },
        { name: "Companies House API", status: "connected", detail: "Monitoring 9 companies — Last poll: 2 min ago", icon: "🏛️" },
        { name: "Xero", status: "pending", detail: "Awaiting OAuth authorisation", icon: "📊" },
        { name: "HMRC Gateway", status: "not_connected", detail: "Connect to pull filing confirmations", icon: "📜" },
      ].map((source, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", backgroundColor: COLORS.surface, borderRadius: 6,
          border: `1px solid ${COLORS.borderSubtle}`, marginBottom: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>{source.icon}</span>
            <div>
              <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 500 }}>{source.name}</div>
              <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{source.detail}</div>
            </div>
          </div>
          <span style={{
            padding: "4px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600,
            letterSpacing: "0.05em", fontFamily: "'JetBrains Mono', monospace",
            backgroundColor: source.status === "connected" ? COLORS.opportunityBg : source.status === "pending" ? COLORS.warningBg : COLORS.surface,
            color: source.status === "connected" ? COLORS.opportunity : source.status === "pending" ? COLORS.warning : COLORS.textDim,
            border: `1px solid ${source.status === "connected" ? COLORS.opportunityBorder : source.status === "pending" ? COLORS.warningBorder : COLORS.border}`,
          }}>
            {source.status === "connected" ? "CONNECTED" : source.status === "pending" ? "PENDING" : "CONNECT"}
          </span>
        </div>
      ))}
    </div>

    <div>
      <h3 style={{ fontSize: 12, fontWeight: 700, color: COLORS.textDim, letterSpacing: "0.08em", margin: "0 0 14px", fontFamily: "'JetBrains Mono', monospace" }}>
        ALERT DELIVERY
      </h3>
      {[
        { channel: "Email", enabled: true, detail: "Critical and warning alerts — immediate delivery" },
        { channel: "Microsoft Teams", enabled: true, detail: "All alert types — #taxonomy-alerts channel" },
        { channel: "Slack", enabled: false, detail: "Not configured" },
      ].map((ch, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", backgroundColor: COLORS.surface, borderRadius: 6,
          border: `1px solid ${COLORS.borderSubtle}`, marginBottom: 8,
        }}>
          <div>
            <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 500 }}>{ch.channel}</div>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{ch.detail}</div>
          </div>
          <div style={{
            width: 36, height: 20, borderRadius: 10, padding: 2, cursor: "pointer",
            backgroundColor: ch.enabled ? COLORS.accent : COLORS.border,
            transition: "background 0.2s",
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: "50%", backgroundColor: "#fff",
              transform: ch.enabled ? "translateX(16px)" : "translateX(0)",
              transition: "transform 0.2s",
            }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function TaxonomyMVP() {
  const [activeTab, setActiveTab] = useState("timeline");
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredInsights = activeFilter === "all"
    ? insights
    : insights.filter(i => i.type === activeFilter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
      `}</style>
      <div style={{
        display: "flex", height: "100vh", backgroundColor: COLORS.bg,
        fontFamily: "'Instrument Sans', sans-serif", color: COLORS.text,
      }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setSelectedInsight={setSelectedInsight} />

        <main style={{ flex: 1, overflow: "auto", padding: "28px 36px" }}>
          {activeTab === "timeline" && !selectedInsight && (
            <div style={{ animation: "fadeIn 0.2s ease" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" }}>
                Insight Timeline
              </h2>
              <p style={{ fontSize: 13, color: COLORS.textDim, margin: "0 0 24px" }}>
                Proactive intelligence across your client book, sourced and cited.
              </p>
              <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredInsights.map(insight => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    onClick={() => setSelectedInsight(insight)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "timeline" && selectedInsight && (
            <InsightDetail insight={selectedInsight} onBack={() => setSelectedInsight(null)} />
          )}

          {activeTab === "clients" && (
            <div style={{ animation: "fadeIn 0.2s ease" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" }}>
                Client Portfolio
              </h2>
              <p style={{ fontSize: 13, color: COLORS.textDim, margin: "0 0 24px" }}>
                All monitored clients and prospects with active intelligence status.
              </p>
              <div style={{ backgroundColor: COLORS.surface, borderRadius: 8, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 100px 90px 120px 120px 60px",
                  padding: "10px 20px", borderBottom: `1px solid ${COLORS.border}`,
                  fontSize: 10, fontWeight: 700, color: COLORS.textDim, letterSpacing: "0.08em",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  <span>CLIENT</span>
                  <span>CO. NO.</span>
                  <span>CLAIM</span>
                  <span>PERIOD</span>
                  <span>ADVISOR</span>
                  <span style={{ textAlign: "right" }}>ALERTS</span>
                </div>
                {clients.map((client, i) => (
                  <ClientRow key={i} client={client} onClick={() => {
                    const match = insights.find(ins => ins.clientId === client.id);
                    if (match) { setActiveTab("timeline"); setSelectedInsight(match); }
                  }} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "email" && <EmailPreview />}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>
    </>
  );
}
