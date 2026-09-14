import { useState } from "react";

type JobStatus = "Booked" | "In Progress" | "Done";
type Service = "Driveway" | "Sealcoat" | "Parking Lot";
type ClosedBy = "Jeffrey" | "Alex (Sales Rep)" | null;
type JobDate = "Today" | "Tomorrow" | "Wed" | "Thu" | "Fri";

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
    customer: "Mercer Property Mgmt",
    service: "Parking Lot",
    status: "In Progress",
    date: "Wed",
    filmed: false,
    closedBy: "Jeffrey",
    serviced: false,
    paid: false,
  },
  {
    id: 6,
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

function firstName(name: string) {
  return name.split(" ")[0];
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

export default function App() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [expanded, setExpanded] = useState(false);

  function logActivity(icon: string, text: string) {
    setActivity((prev) => [{ icon, text }, ...prev].slice(0, 12));
  }

  function updateJob(id: number, changes: Partial<Job>) {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ...changes } : job)),
    );
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

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-12">
      <header className="flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-4">
        <div>
          <p className="text-lg font-bold text-neutral-900">
            J&amp;C <span style={{ color: ACCENT }}>Command Center</span>
          </p>
          <p className="text-xs text-neutral-400">Asphalt Paving</p>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6">
        {/* LEADS THIS WEEK */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
          <SectionLabel>Leads This Week</SectionLabel>
          <p className="mt-1 text-6xl font-bold tracking-tight text-neutral-900">
            {totalLeads}
          </p>
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
                <span className="text-sm font-semibold text-neutral-900">
                  {leadCounts[key]}
                </span>
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
        </section>

        {/* TODAY'S JOBS */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
          <div className="flex items-center justify-between">
            <SectionLabel>Today's Jobs</SectionLabel>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}
            >
              {todaysJobs.length} to update
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-3">
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
        </section>

        {/* UPCOMING JOBS (collapsible) */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex w-full items-center justify-between"
          >
            <SectionLabel>Upcoming Jobs</SectionLabel>
            <span className="flex items-center gap-1 text-sm font-medium text-neutral-400">
              {jobs.length} jobs
              <span
                className="ml-1 inline-block transition-transform"
                style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                ▾
              </span>
            </span>
          </button>
          {expanded && (
            <div className="mt-4 flex flex-col gap-3">
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
          )}
        </section>

        {/* LEAD SOURCE */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
          <SectionLabel>Where Leads Come From</SectionLabel>
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
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.label}
                  </span>
                  <span className="font-semibold text-neutral-900">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
          <SectionLabel>Recent Activity</SectionLabel>
          <ul className="mt-4 flex flex-col gap-3">
            {activity.map((item, i) => (
              <li key={`${item.text}-${i}`} className="flex items-center gap-3 text-sm text-neutral-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-sm">
                  {item.icon}
                </span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
