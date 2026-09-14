import { useState } from "react";

type JobStatus = "Booked" | "In Progress" | "Done";
type Service = "Driveway" | "Sealcoat" | "Parking Lot";
type ClosedBy = "Jeffrey" | "Alex (Sales Rep)" | null;

interface Job {
  id: number;
  customer: string;
  service: Service;
  status: JobStatus;
  filmed: boolean;
  closedBy: ClosedBy;
  serviced: boolean;
  paid: boolean;
}

const initialJobs: Job[] = [
  {
    id: 1,
    customer: "Karen Thomas",
    service: "Driveway",
    status: "Booked",
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
    filmed: true,
    closedBy: "Alex (Sales Rep)",
    serviced: true,
    paid: false,
  },
];

const initialActivity: string[] = [
  "New 5-star review from Sam",
  "Karen booked a driveway job",
  "Missed call from Mike — texted back in 8 seconds",
  "Doug's sealcoat job marked In Progress",
  "New lead: Linda Park requested a quote",
  "Ray's parking lot job serviced and closed out",
];

const ACCENT = "#cd553f";

const statusStyles: Record<JobStatus, string> = {
  Booked: "bg-amber-100 text-amber-800",
  "In Progress": "bg-[#cd553f]/10 text-[#cd553f]",
  Done: "bg-emerald-100 text-emerald-700",
};

function firstName(name: string) {
  return name.split(" ")[0];
}

export default function App() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [activity, setActivity] = useState<string[]>(initialActivity);

  function logActivity(message: string) {
    setActivity((prev) => [message, ...prev].slice(0, 12));
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
      logActivity(`${closedBy} closed ${firstName(job.customer)}'s ${job.service.toLowerCase()} job`);
    }
  }

  function toggleServiced(job: Job) {
    const serviced = !job.serviced;
    updateJob(job.id, { serviced });
    if (serviced) {
      logActivity(`${firstName(job.customer)}'s ${job.service.toLowerCase()} job marked as serviced`);
    }
  }

  function togglePaid(job: Job) {
    const paid = !job.paid;
    updateJob(job.id, { paid });
    if (paid) {
      logActivity(`${firstName(job.customer)}'s job marked fully paid`);
    }
  }

  const leadCounts = { New: 2, Contacted: 1, Booked: 2, Done: 1 };
  const totalLeads = Object.values(leadCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-12">
      <header className="bg-neutral-900 px-5 py-6 text-white">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: ACCENT }}>
          J&amp;C Asphalt Paving
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Command Center</h1>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6">
        {/* LEADS THIS WEEK */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
          <h2 className="text-sm font-medium text-neutral-500">Leads This Week</h2>
          <p className="mt-1 text-6xl font-bold tracking-tight text-neutral-900">
            {totalLeads}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(leadCounts) as (keyof typeof leadCounts)[]).map((key) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2"
              >
                <span className="text-sm text-neutral-600">{key}</span>
                <span className="text-lg font-semibold text-neutral-900">
                  {leadCounts[key]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* JOB BOARD */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
          <h2 className="text-sm font-medium text-neutral-500">Job Board</h2>
          <div className="mt-4 flex flex-col gap-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-neutral-900">{job.customer}</p>
                    <p className="text-sm text-neutral-500">{job.service}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[job.status]}`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
                  <span>{job.filmed ? "🎥 Filmed" : "🎥 Not filmed"}</span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <select
                    value={job.closedBy ?? ""}
                    onChange={(e) => handleClosedBy(job, e.target.value)}
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
                    onClick={() => toggleServiced(job)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      job.serviced
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-neutral-200 bg-white text-neutral-500"
                    }`}
                  >
                    {job.serviced ? "✓ Serviced" : "Mark serviced"}
                  </button>

                  <button
                    onClick={() => togglePaid(job)}
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
            ))}
          </div>
        </section>

        {/* RESPONSE TIME */}
        <section className="rounded-2xl bg-neutral-900 p-6 text-white shadow-sm">
          <h2 className="text-sm font-medium text-neutral-400">Response Time</h2>
          <p className="mt-2 text-xl leading-snug">
            Every lead gets a reply in under a minute —{" "}
            <span className="font-bold" style={{ color: ACCENT }}>33 sec avg</span>
          </p>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
          <h2 className="text-sm font-medium text-neutral-500">Recent Activity</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {activity.map((item, i) => (
              <li key={`${item}-${i}`} className="flex gap-3 text-sm text-neutral-700">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
