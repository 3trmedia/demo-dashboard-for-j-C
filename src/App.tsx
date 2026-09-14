import { useEffect, useRef, useState } from "react";
import jcLogo from "./assets/jc-logo-horizontal.png";

type JobStatus = "Booked" | "In Progress" | "Done";
type Service = "Driveway" | "Sealcoat" | "Parking Lot";
type ClosedBy = "Jeffrey" | "Alex (Sales Rep)" | null;
type JobDate = "Today" | "Tomorrow" | "Wed" | "Thu" | "Fri";
type LeadStage = "Needs Visit" | "Needs Call";

interface Lead {
  id: number;
  name: string;
  stage: LeadStage;
  reason: string;
  service: Service;
}

interface Job {
  id: number;
  customer: string;
  service: Service;
  status: JobStatus;
  date: JobDate;
  filmed: boolean;
  closedBy: ClosedBy;
  serviced: boolean;
  paid: boolean;
}

interface ActivityItem {
  icon: string;
  text: string;
}

const ACCENT = "#cd553f";

const serviceIcon: Record<Service, string> = {
  Driveway: "🏠",
  Sealcoat: "🛢️",
  "Parking Lot": "🅿️",
};

const initialLeads: Lead[] = [
  {
    id: 101,
    name: "Mercer Property Mgmt",
    stage: "Needs Visit",
    reason: "Large parking lot bid — wants a walkthrough before signing",
    service: "Parking Lot",
  },
  {
    id: 102,
    name: "Deborah Hale",
    stage: "Needs Visit",
    reason: "Asked to see finish samples in person",
    service: "Driveway",
  },
  {
    id: 103,
    name: "Tyler Combs",
    stage: "Needs Call",
    reason: "Quoted 6 days ago, hasn't responded",
    service: "Sealcoat",
  },
  {
    id: 104,
    name: "Nancy Ruiz",
    stage: "Needs Call",
    reason: "Said she needs to check with her husband",
    service: "Driveway",
  },
  {
    id: 105,
    name: "Pete Alvarado",
    stage: "Needs Call",
    reason: "Requested a callback, missed twice",
    service: "Driveway",
  },
];

const initialJobs: Job[] = [
  {
    id: 1,
    customer: "Karen Thomas",
    service: "Driveway",
    status: "Booked",
    date: "Today",
    filmed: false,
    closedBy: "Jeffrey",
    serviced: false,
    paid: false,
  },
  {
    id: 2,
    customer: "Doug Reeser",
    service: "Sealcoat",
    status: "In Progress",
    date: "Today",
    filmed: true,
    closedBy: "Alex (Sales Rep)",
    serviced: false,
    paid: false,
  },
  {
    id: 3,
    customer: "Sam Whitfield",
    service: "Parking Lot",
    status: "Done",
    date: "Today",
    filmed: true,
    closedBy: "Jeffrey",
    serviced: true,
    paid: true,
  },
  {
    id: 4,
    customer: "Linda Park",
    service: "Driveway",
    status: "Booked",
    date: "Tomorrow",
    filmed: false,
    closedBy: null,
    serviced: false,
    paid: false,
  },
  {
    id: 5,
    customer: "Ray Ostergaard",
    service: "Sealcoat",
    status: "Done",
    date: "Fri",
    filmed: true,
    closedBy: "Alex (Sales Rep)",
    serviced: true,
    paid: false,
  },
];

const initialActivity: ActivityItem[] = [
  { icon: "⭐", text: "New 5-star review from Sam" },
  { icon: "📅", text: "Karen booked a driveway job" },
  { icon: "📞", text: "Missed call from Mike — texted back in 8 seconds" },
  { icon: "🔧", text: "Doug's sealcoat job marked In Progress" },
  { icon: "🆕", text: "New lead: Linda Park requested a quote" },
  { icon: "✅", text: "Ray's parking lot job serviced and closed out" },
];

const statusStyles: Record<JobStatus, string> = {
  Booked: "bg-amber-100 text-amber-800",
  "In Progress": "bg-[#cd553f]/10 text-[#cd553f]",
  Done: "bg-emerald-100 text-emerald-700",
};

const leadSources: { label: string; value: number; color: string }[] = [
  { label: "Google Ads", value: 8, color: ACCENT },
  { label: "Meta Ads", value: 5, color: "#3b6ea5" },
  { label: "Phone Call", value: 6, color: "#2f6f4f" },
  { label: "Text / Website", value: 3, color: "#b8860b" },
];

const weekBars: { day: string; count: number; isToday: boolean }[] = [
  { day: "Su", count: 0, isToday: false },
  { day: "Mo", count: 2, isToday: false },
  { day: "Tu", count: 1, isToday: false },
  { day: "We", count: 0, isToday: false },
  { day: "Th", count: 2, isToday: true },
  { day: "Fr", count: 1, isToday: false },
  { day: "Sa", count: 0, isToday: false },
];

const SECTION_TITLES: Record<string, string> = {
  needsVisit: "Needs a Visit",
  needsCall: "Needs a Call",
  pulse: "Pulse",
  todaysJobs: "Today's Jobs",
  upcomingJobs: "Upcoming Jobs",
  activity: "Recent Activity",
};

const DEFAULT_ORDER = [
  "needsVisit",
  "needsCall",
  "pulse",
  "todaysJobs",
  "upcomingJobs",
  "activity",
];

const DEFAULT_COLLAPSED: Record<string, boolean> = {
  upcomingJobs: true,
};

const HOLD_MS = 350;
const MOVE_CANCEL_PX = 8;

function firstName(name: string) {
  return name.split(" ")[0];
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved) as T;
  } catch {
    // ignore — fall back to default
  }
  return fallback;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
      {children}
    </h2>
  );
}

function Donut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="#f0eeec" strokeWidth="14" />
      {data.map((d) => {
        const fraction = total === 0 ? 0 : d.value / total;
        const dash = fraction * circumference;
        const circle = (
          <circle
            key={d.label}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={d.color}
            strokeWidth="14"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += dash;
        return circle;
      })}
    </svg>
  );
}

function JobCard({
  job,
  onClosedBy,
  onToggleServiced,
  onTogglePaid,
  compact,
}: {
  job: Job;
  onClosedBy: (value: string) => void;
  onToggleServiced: () => void;
  onTogglePaid: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 ${
        compact ? "border-[#cd553f]/30" : "border-neutral-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{serviceIcon[job.service]}</span>
          <div>
            <p className="font-semibold text-neutral-900">{job.customer}</p>
            <p className="text-sm text-neutral-500">{job.service}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[job.status]}`}
        >
          {job.status}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
        <span>{job.filmed ? "🎥 Filmed" : "🎥 Not filmed"}</span>
        {!compact && <span className="text-neutral-300">•</span>}
        {!compact && <span>{job.date}</span>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          value={job.closedBy ?? ""}
          onChange={(e) => onClosedBy(e.target.value)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            job.closedBy ? "" : "border-neutral-200 bg-white text-neutral-500"
          }`}
          style={
            job.closedBy
              ? { borderColor: `${ACCENT}66`, backgroundColor: `${ACCENT}1a`, color: ACCENT }
              : undefined
          }
        >
          <option value="">Not closed</option>
          <option value="Jeffrey">Closed by Jeffrey</option>
          <option value="Alex (Sales Rep)">Closed by Alex (Sales Rep)</option>
        </select>

        <button
          onClick={onToggleServiced}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            job.serviced
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-neutral-200 bg-white text-neutral-500"
          }`}
        >
          {job.serviced ? "✓ Serviced" : "Mark serviced"}
        </button>

        <button
          onClick={onTogglePaid}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            job.paid
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-neutral-200 bg-white text-neutral-500"
          }`}
        >
          {job.paid ? "✓ Paid" : "Mark paid"}
        </button>
      </div>
    </div>
  );
}

function LeadRow({
  lead,
  primaryLabel,
  onPrimary,
  onCloseAndBook,
}: {
  lead: Lead;
  primaryLabel: string;
  onPrimary: () => void;
  onCloseAndBook: () => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-4">
      <div className="flex items-start gap-2">
        <span className="text-xl leading-none">{serviceIcon[lead.service]}</span>
        <div>
          <p className="font-semibold text-neutral-900">{lead.name}</p>
          <p className="text-sm text-neutral-500">{lead.reason}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={onPrimary}
          className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600"
        >
          {primaryLabel}
        </button>
        <button
          onClick={onCloseAndBook}
          className="rounded-full border px-3 py-1.5 text-xs font-medium"
          style={{ borderColor: `${ACCENT}66`, backgroundColor: `${ACCENT}1a`, color: ACCENT }}
        >
          ✓ Close &amp; book
        </button>
      </div>
    </div>
  );
}

function DraggableSection({
  title,
  badge,
  collapsed,
  onToggleCollapsed,
  onHandlePointerDown,
  onHandlePointerMove,
  onHandlePointerUp,
  registerRef,
  isDragging,
  dragY,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onHandlePointerDown: (e: React.PointerEvent) => void;
  onHandlePointerMove: (e: React.PointerEvent) => void;
  onHandlePointerUp: (e: React.PointerEvent) => void;
  registerRef: (el: HTMLDivElement | null) => void;
  isDragging: boolean;
  dragY: number;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={registerRef}
      className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100"
      style={{
        transform: isDragging ? `translateY(${dragY}px) scale(1.02)` : undefined,
        boxShadow: isDragging ? "0 16px 28px rgba(0,0,0,0.16)" : undefined,
        position: "relative",
        zIndex: isDragging ? 10 : undefined,
        transition: isDragging ? "none" : "transform 150ms ease",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onToggleCollapsed}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <span
            className="inline-block text-neutral-400 transition-transform"
            style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
          >
            ▾
          </span>
          <SectionLabel>{title}</SectionLabel>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {badge}
          <span
            onPointerDown={onHandlePointerDown}
            onPointerMove={onHandlePointerMove}
            onPointerUp={onHandlePointerUp}
            onPointerCancel={onHandlePointerUp}
            onContextMenu={(e) => e.preventDefault()}
            className="cursor-grab select-none rounded px-2 py-1 text-base leading-none text-neutral-300 active:cursor-grabbing"
            style={{ touchAction: "none" }}
          >
            ⠿
          </span>
        </div>
      </div>
      {!collapsed && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);

  const [order, setOrder] = useState<string[]>(() => loadJSON("jc-section-order", DEFAULT_ORDER));
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>(() =>
    loadJSON("jc-section-collapsed", DEFAULT_COLLAPSED),
  );

  useEffect(() => {
    try {
      localStorage.setItem("jc-section-order", JSON.stringify(order));
    } catch {
      // ignore — order just won't persist this session
    }
  }, [order]);

  useEffect(() => {
    try {
      localStorage.setItem("jc-section-collapsed", JSON.stringify(collapsedMap));
    } catch {
      // ignore — collapse state just won't persist this session
    }
  }, [collapsedMap]);

  const sectionRefs = useRef<Partial<Record<string, HTMLDivElement>>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragY, setDragY] = useState(0);
  const dragState = useRef<{
    startY: number;
    holdTimer: number | null;
    holding: boolean;
  } | null>(null);

  function toggleCollapsed(id: string) {
    setCollapsedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handlePointerDown(id: string) {
    return (e: React.PointerEvent) => {
      const state = { startY: e.clientY, holdTimer: null as number | null, holding: false };
      dragState.current = state;
      const pointerId = e.pointerId;
      const target = e.currentTarget;
      state.holdTimer = window.setTimeout(() => {
        state.holding = true;
        setDragId(id);
        try {
          target.setPointerCapture(pointerId);
        } catch {
          // capture is a nice-to-have; dragging still works without it
        }
      }, HOLD_MS);
    };
  }

  function handlePointerMove(id: string) {
    return (e: React.PointerEvent) => {
      const state = dragState.current;
      if (!state) return;
      const delta = e.clientY - state.startY;

      if (!state.holding) {
        if (Math.abs(delta) > MOVE_CANCEL_PX && state.holdTimer) {
          clearTimeout(state.holdTimer);
          state.holdTimer = null;
        }
        return;
      }

      setDragY(delta);
      const idx = order.indexOf(id);

      if (delta < 0 && idx > 0) {
        const aboveEl = sectionRefs.current[order[idx - 1]];
        if (aboveEl) {
          const rect = aboveEl.getBoundingClientRect();
          if (e.clientY < rect.top + rect.height / 2) {
            const newOrder = [...order];
            [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
            setOrder(newOrder);
            state.startY = e.clientY;
            setDragY(0);
          }
        }
      } else if (delta > 0 && idx < order.length - 1) {
        const belowEl = sectionRefs.current[order[idx + 1]];
        if (belowEl) {
          const rect = belowEl.getBoundingClientRect();
          if (e.clientY > rect.top + rect.height / 2) {
            const newOrder = [...order];
            [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
            setOrder(newOrder);
            state.startY = e.clientY;
            setDragY(0);
          }
        }
      }
    };
  }

  function handlePointerUp(id: string) {
    return () => {
      const state = dragState.current;
      if (state?.holdTimer) clearTimeout(state.holdTimer);
      dragState.current = null;
      if (dragId === id) {
        setDragId(null);
        setDragY(0);
      }
    };
  }

  function logActivity(icon: string, text: string) {
    setActivity((prev) => [{ icon, text }, ...prev].slice(0, 12));
  }

  function updateJob(id: number, changes: Partial<Job>) {
    setJobs((prev) => prev.map((job) => (job.id === id ? { ...job, ...changes } : job)));
  }

  function handleClosedBy(job: Job, value: string) {
    const closedBy = (value || null) as ClosedBy;
    updateJob(job.id, { closedBy });
    if (closedBy) {
      logActivity("🤝", `${closedBy} closed ${firstName(job.customer)}'s ${job.service.toLowerCase()} job`);
    }
  }

  function toggleServiced(job: Job) {
    const serviced = !job.serviced;
    updateJob(job.id, { serviced });
    if (serviced) {
      logActivity("🧹", `${firstName(job.customer)}'s ${job.service.toLowerCase()} job marked as serviced`);
    }
  }

  function togglePaid(job: Job) {
    const paid = !job.paid;
    updateJob(job.id, { paid });
    if (paid) {
      logActivity("💰", `${firstName(job.customer)}'s job marked fully paid`);
    }
  }

  function markVisited(lead: Lead) {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === lead.id ? { ...l, stage: "Needs Call", reason: "Visited — following up by phone" } : l,
      ),
    );
    logActivity("🚗", `Jeffrey visited ${firstName(lead.name)}`);
  }

  function markCalled(lead: Lead) {
    logActivity("📞", `Jeffrey called ${firstName(lead.name)}`);
  }

  function closeAndBook(lead: Lead) {
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    setJobs((prev) => [
      {
        id: Date.now(),
        customer: lead.name,
        service: lead.service,
        status: "Booked",
        date: "Tomorrow",
        filmed: false,
        closedBy: "Jeffrey",
        serviced: false,
        paid: false,
      },
      ...prev,
    ]);
    logActivity("🤝", `Jeffrey closed ${firstName(lead.name)}'s ${lead.service.toLowerCase()} job`);
  }

  const needsVisit = leads.filter((l) => l.stage === "Needs Visit");
  const needsCall = leads.filter((l) => l.stage === "Needs Call");

  const leadCounts = { New: 2, Contacted: 1, Booked: 2, Done: 1 };
  const totalLeads = Object.values(leadCounts).reduce((a, b) => a + b, 0);
  const leadPillColor: Record<keyof typeof leadCounts, string> = {
    New: ACCENT,
    Contacted: "#3b6ea5",
    Booked: "#b8860b",
    Done: "#2f6f4f",
  };

  const todaysJobs = jobs.filter((j) => j.date === "Today").slice(0, 3);
  const maxBar = Math.max(...weekBars.map((b) => b.count), 1);
  const totalSourceLeads = leadSources.reduce((sum, s) => sum + s.value, 0);

  const sectionBadge: Record<string, React.ReactNode> = {
    needsVisit: (
      <span
        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}
      >
        {needsVisit.length}
      </span>
    ),
    needsCall: (
      <span
        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}
      >
        {needsCall.length}
      </span>
    ),
    todaysJobs: (
      <span
        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}
      >
        {todaysJobs.length} to update
      </span>
    ),
    upcomingJobs: <span className="text-sm font-medium text-neutral-400">{jobs.length} jobs</span>,
  };

  const sectionContent: Record<string, React.ReactNode> = {
    needsVisit: (
      <div className="flex flex-col gap-3">
        {needsVisit.length === 0 && (
          <p className="text-sm text-neutral-400">Nobody needs an in-person visit right now.</p>
        )}
        {needsVisit.map((lead) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            primaryLabel="Mark visited"
            onPrimary={() => markVisited(lead)}
            onCloseAndBook={() => closeAndBook(lead)}
          />
        ))}
      </div>
    ),
    needsCall: (
      <div className="flex flex-col gap-3">
        {needsCall.length === 0 && (
          <p className="text-sm text-neutral-400">No leads waiting on a call right now.</p>
        )}
        {needsCall.map((lead) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            primaryLabel="Mark called"
            onPrimary={() => markCalled(lead)}
            onCloseAndBook={() => closeAndBook(lead)}
          />
        ))}
      </div>
    ),
    pulse: (
      <div>
        <p className="text-6xl font-bold tracking-tight text-neutral-900">{totalLeads}</p>
        <p className="text-xs text-neutral-400">leads this week</p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(leadCounts) as (keyof typeof leadCounts)[]).map((key) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-full border px-3 py-1.5"
              style={{ borderColor: `${leadPillColor[key]}55` }}
            >
              <span className="text-xs font-medium" style={{ color: leadPillColor[key] }}>
                {key}
              </span>
              <span className="text-sm font-semibold text-neutral-900">{leadCounts[key]}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-end justify-between gap-2">
          {weekBars.map((b) => (
            <div key={b.day} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className="w-full rounded-md"
                style={{
                  height: `${8 + (b.count / maxBar) * 32}px`,
                  backgroundColor: b.isToday ? ACCENT : "#eee9e6",
                }}
              />
              <span className="text-[10px] font-medium text-neutral-400">{b.day}</span>
            </div>
          ))}
        </div>

        <hr className="my-5 border-neutral-100" />

        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Where leads come from
        </p>
        <div className="mt-4 flex items-center gap-6">
          <div className="relative shrink-0">
            <Donut data={leadSources} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-neutral-900">{totalSourceLeads}</span>
              <span className="text-[10px] uppercase text-neutral-400">leads</span>
            </div>
          </div>
          <ul className="flex flex-1 flex-col gap-2">
            {leadSources.map((s) => (
              <li key={s.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-neutral-600">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
                <span className="font-semibold text-neutral-900">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
    todaysJobs: (
      <div className="flex flex-col gap-3">
        {todaysJobs.length === 0 && (
          <p className="text-sm text-neutral-400">No jobs scheduled for today.</p>
        )}
        {todaysJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            compact
            onClosedBy={(v) => handleClosedBy(job, v)}
            onToggleServiced={() => toggleServiced(job)}
            onTogglePaid={() => togglePaid(job)}
          />
        ))}
      </div>
    ),
    upcomingJobs: (
      <div className="flex flex-col gap-3">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClosedBy={(v) => handleClosedBy(job, v)}
            onToggleServiced={() => toggleServiced(job)}
            onTogglePaid={() => togglePaid(job)}
          />
        ))}
      </div>
    ),
    activity: (
      <ul className="flex flex-col gap-3">
        {activity.map((item, i) => (
          <li key={`${item.text}-${i}`} className="flex items-center gap-3 text-sm text-neutral-700">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-sm">
              {item.icon}
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    ),
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-12">
      <header className="flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-4">
        <div>
          <img src={jcLogo} alt="J&amp;C Asphalt" className="h-8 w-auto" />
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Command Center
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6">
        {order.map((id) => (
          <DraggableSection
            key={id}
            title={SECTION_TITLES[id]}
            badge={sectionBadge[id]}
            collapsed={!!collapsedMap[id]}
            onToggleCollapsed={() => toggleCollapsed(id)}
            onHandlePointerDown={handlePointerDown(id)}
            onHandlePointerMove={handlePointerMove(id)}
            onHandlePointerUp={handlePointerUp(id)}
            registerRef={(el) => {
              sectionRefs.current[id] = el ?? undefined;
            }}
            isDragging={dragId === id}
            dragY={dragY}
          >
            {sectionContent[id]}
          </DraggableSection>
        ))}
      </main>
    </div>
  );
}
