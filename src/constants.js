import { Briefcase, User, ShoppingBag, HeartPulse } from "lucide-react";

export const ANIM_MS = 300;

export const PRIORITIES = {
  low: {
    label: "ต่ำ",
    badge: "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-400/40",
    bar: "bg-gradient-to-b from-emerald-400 to-teal-500",
    active: "bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-transparent shadow-lg shadow-emerald-400/40",
  },
  medium: {
    label: "ปานกลาง",
    badge: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md shadow-orange-400/40",
    bar: "bg-gradient-to-b from-amber-400 to-orange-500",
    active: "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent shadow-lg shadow-orange-400/40",
  },
  high: {
    label: "สูง",
    badge: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-pink-500/40",
    bar: "bg-gradient-to-b from-rose-500 to-pink-500",
    active: "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-pink-500/40",
  },
};
export const ORDER = ["low", "medium", "high"];

export const CATEGORIES = {
  work: { label: "งาน", Icon: Briefcase, tag: "bg-sky-50 text-sky-700 ring-sky-200" },
  personal: { label: "ส่วนตัว", Icon: User, tag: "bg-violet-50 text-violet-700 ring-violet-200" },
  shopping: { label: "ช้อปปิ้ง", Icon: ShoppingBag, tag: "bg-pink-50 text-pink-700 ring-pink-200" },
  health: { label: "สุขภาพ", Icon: HeartPulse, tag: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};
export const CATEGORY_KEYS = Object.keys(CATEGORIES);

export const FILTERS = [
  { key: "all", label: "ทั้งหมด" },
  { key: "active", label: "ยังไม่เสร็จ" },
  { key: "completed", label: "เสร็จแล้ว" },
];

export const EMPTY_TEXT = {
  all: "ยังไม่มีงาน เพิ่มงานแรกของคุณได้เลย",
  active: "ไม่มีงานค้างอยู่ เยี่ยมมาก!",
  completed: "ยังไม่มีงานที่เสร็จ",
};

/* ---------- Date helpers (local time, "YYYY-MM-DD") ---------- */
const pad = (n) => String(n).padStart(2, "0");
export const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayStr = () => toDateStr(new Date());
export const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toDateStr(d);
};

export function formatDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  const opts = { day: "numeric", month: "short" };
  if (y !== new Date().getFullYear()) opts.year = "numeric";
  return new Date(y, m - 1, d).toLocaleDateString("th-TH", opts);
}

// none | done | overdue | today | upcoming
export function dueState(todo, today) {
  if (!todo.due) return "none";
  if (todo.completed) return "done";
  if (todo.due < today) return "overdue";
  if (todo.due === today) return "today";
  return "upcoming";
}
