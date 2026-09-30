import { dueState } from "../constants";

export default function StatsCard({ todos, today }) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const overdue = todos.filter((t) => dueState(t, today) === "overdue").length;
  const active = total - completed - overdue;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const segments = [
    { key: "completed", label: "เสร็จแล้ว", color: "#a78bfa", n: completed },
    { key: "active", label: "กำลังทำ", color: "#22d3ee", n: active },
    { key: "overdue", label: "เลยกำหนด", color: "#f43f5e", n: overdue },
  ];

  let offset = 0;
  const arcs = segments.map((s) => {
    const len = total ? (s.n / total) * 100 : 0;
    const arc = (
      <circle
        key={s.key}
        cx="18"
        cy="18"
        r="15.9155"
        fill="none"
        stroke={s.color}
        strokeWidth="4"
        pathLength="100"
        strokeDasharray={`${len} ${100 - len}`}
        strokeDashoffset={-offset}
        style={{ transition: "stroke-dasharray 500ms ease, stroke-dashoffset 500ms ease" }}
      />
    );
    offset += len;
    return arc;
  });

  return (
    <section
      aria-label="สถิติ"
      className="rounded-3xl bg-white/90 p-4 shadow-2xl shadow-black/30 ring-1 ring-white/60 backdrop-blur-xl"
    >
      <h2 className="mb-3 text-sm font-semibold text-slate-700">สถิติ</h2>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-violet-50 px-3 py-2">
          <div className="text-xs text-slate-500">งานทั้งหมด</div>
          <div className="text-2xl font-semibold text-slate-800">{total}</div>
        </div>
        <div className="rounded-2xl bg-fuchsia-50 px-3 py-2">
          <div className="text-xs text-slate-500">สำเร็จแล้ว</div>
          <div className="text-2xl font-semibold text-fuchsia-600">{percent}%</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full" role="img" aria-label={`สำเร็จ ${percent}%`}>
            <g transform="rotate(-90 18 18)">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              {arcs}
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-semibold text-slate-800">
              {completed}/{total}
            </span>
            <span className="text-[10px] text-slate-400">เสร็จ</span>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-1.5 text-sm">
          {segments.map((s) => (
            <li key={s.key} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="flex-1 text-slate-600">{s.label}</span>
              <span className="font-medium text-slate-800">{s.n}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
