import { useState, useRef } from "react";
import { Plus, Sparkles, Search, X, Layers } from "lucide-react";
import TodoItem from "./components/TodoItem.jsx";
import StatsCard from "./components/StatsCard.jsx";
import {
  PRIORITIES,
  ORDER,
  CATEGORIES,
  CATEGORY_KEYS,
  FILTERS,
  EMPTY_TEXT,
  ANIM_MS,
  todayStr,
  addDays,
} from "./constants";

const fieldClass =
  "w-full rounded-2xl border border-violet-100 bg-violet-50/60 px-3 py-2 text-sm text-slate-700 focus:border-fuchsia-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-fuchsia-100";

export default function TodoApp() {
  const nextId = useRef(6);
  const [todos, setTodos] = useState(() => [
    { id: 1, text: "ส่งรายงานประจำสัปดาห์", completed: false, priority: "high", category: "work", due: addDays(-1) },
    { id: 2, text: "ซื้อของเข้าบ้าน", completed: false, priority: "medium", category: "shopping", due: addDays(0) },
    { id: 3, text: "อ่านหนังสือ 20 หน้า", completed: true, priority: "low", category: "personal", due: addDays(-2) },
    { id: 4, text: "ออกกำลังกาย 30 นาที", completed: false, priority: "medium", category: "health", due: addDays(2) },
    { id: 5, text: "นัดประชุมทีมโปรเจกต์", completed: false, priority: "high", category: "work", due: addDays(3) },
  ]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("personal");
  const [dueInput, setDueInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState([]);

  const today = todayStr();

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setTodos((prev) => [
      { id: nextId.current++, text: t, completed: false, priority, category, due: dueInput || null },
      ...prev,
    ]);
    setText("");
    setDueInput("");
  };

  const removeIds = (ids) => {
    setRemoving((r) => [...r, ...ids]);
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => !ids.includes(t.id)));
      setRemoving((r) => r.filter((id) => !ids.includes(id)));
    }, ANIM_MS);
  };

  const update = (id, patch) => setTodos((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const toggle = (id) => setTodos((p) => p.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const cycle = (list, key) => (id) =>
    setTodos((p) =>
      p.map((t) => (t.id === id ? { ...t, [key]: list[(list.indexOf(t[key]) + 1) % list.length] } : t))
    );

  const remaining = todos.filter((t) => !t.completed).length;
  const completedIds = todos.filter((t) => t.completed && !removing.includes(t.id)).map((t) => t.id);

  const q = search.trim().toLowerCase();
  const visible = todos.filter(
    (t) =>
      (catFilter === "all" || t.category === catFilter) &&
      (filter === "active" ? !t.completed : filter === "completed" ? t.completed : true) &&
      (!q || t.text.toLowerCase().includes(q))
  );

  const navItems = [
    { key: "all", label: "ทั้งหมด", Icon: Layers, count: todos.length },
    ...CATEGORY_KEYS.map((k) => ({
      key: k,
      label: CATEGORIES[k].label,
      Icon: CATEGORIES[k].Icon,
      count: todos.filter((t) => t.category === k).length,
    })),
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden px-4 py-8 sm:py-12"
      style={{
        background: "linear-gradient(135deg, #1e1b4b, #5b21b6, #be185d, #0e7490)",
        backgroundSize: "300% 300%",
        animation: "bg-shift 18s ease infinite",
      }}
    >
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-fuchsia-500/40 blur-3xl" style={{ animation: "blob-float 9s ease-in-out infinite" }} />
      <div className="pointer-events-none absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl" style={{ animation: "blob-float 12s ease-in-out infinite reverse" }} />

      <div className="relative mx-auto w-full max-w-5xl">
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/40">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-white via-fuchsia-100 to-cyan-100 bg-clip-text text-2xl font-semibold text-transparent">
              รายการงานของฉัน
            </h1>
            <p className="text-sm text-white/70">จัดการงานประจำวันให้เป็นระเบียบ</p>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-5">
          {/* Category sidebar */}
          <nav
            aria-label="หมวดหมู่"
            className="flex gap-1 overflow-x-auto rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/20 backdrop-blur lg:col-start-1 lg:row-start-1 lg:flex-col lg:overflow-visible"
          >
            {navItems.map(({ key, label, Icon, count }) => {
              const active = catFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setCatFilter(key)}
                  aria-pressed={active}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all lg:w-full ${
                    active
                      ? "bg-white text-violet-700 shadow-lg shadow-black/20"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-xs lg:ml-auto ${
                      active ? "bg-violet-100 text-violet-700" : "bg-white/15 text-white"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Stats */}
          <div className="lg:col-start-1 lg:row-start-2">
            <StatsCard todos={todos} today={today} />
          </div>

          {/* Main column */}
          <main className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            {/* Add form */}
            <div className="mb-4 rounded-3xl bg-white/90 p-4 shadow-2xl shadow-black/30 ring-1 ring-white/60 backdrop-blur-xl">
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === "Enter") add();
                  }}
                  placeholder="เพิ่มงานใหม่..."
                  className="min-w-0 flex-1 rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-2.5 text-base text-slate-800 placeholder-slate-400 focus:border-fuchsia-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-fuchsia-100"
                />
                <button
                  onClick={add}
                  disabled={!text.trim()}
                  className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/40 transition-all hover:scale-105 hover:shadow-xl hover:shadow-fuchsia-500/50 active:scale-95 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-none disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">เพิ่ม</span>
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-500">ความสำคัญ:</span>
                {ORDER.map((k) => (
                  <button
                    key={k}
                    onClick={() => setPriority(k)}
                    aria-pressed={priority === k}
                    className={`rounded-full border px-3.5 py-1 text-sm transition-all ${
                      priority === k ? PRIORITIES[k].active : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {PRIORITIES[k].label}
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500">หมวดหมู่</span>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass}>
                    {CATEGORY_KEYS.map((k) => (
                      <option key={k} value={k}>
                        {CATEGORIES[k].label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500">วันครบกำหนด</span>
                  <input type="date" value={dueInput} onChange={(e) => setDueInput(e.target.value)} className={fieldClass} />
                </label>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหางาน..."
                aria-label="ค้นหางาน"
                className="w-full rounded-2xl bg-white/10 py-2.5 pl-10 pr-10 text-base text-white placeholder-white/50 ring-1 ring-white/20 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="ล้างการค้นหา"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/70 hover:bg-white/15 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Status tabs */}
            <div role="tablist" className="mb-3 grid grid-cols-3 gap-1 rounded-2xl bg-white/10 p-1 ring-1 ring-white/20 backdrop-blur">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-xl py-2 text-sm font-medium transition-all ${
                    filter === f.key
                      ? "bg-white text-violet-700 shadow-lg shadow-black/20"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* List */}
            <ul>
              {visible.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  today={today}
                  removing={removing.includes(todo.id)}
                  onToggle={toggle}
                  onDelete={(id) => removeIds([id])}
                  onSave={(id, newText) => update(id, { text: newText })}
                  onCyclePriority={cycle(ORDER, "priority")}
                  onCycleCategory={cycle(CATEGORY_KEYS, "category")}
                  onSetDue={(id, due) => update(id, { due })}
                />
              ))}
            </ul>

            {visible.length === 0 && (
              <div className="rounded-2xl bg-white/10 px-4 py-10 text-center text-white/70 ring-1 ring-white/20 backdrop-blur">
                {q ? `ไม่พบงานที่ตรงกับ “${search.trim()}”` : EMPTY_TEXT[filter]}
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between px-1 text-sm">
              <span className="text-white/90">เหลืออีก {remaining} งาน</span>
              <button
                onClick={() => removeIds(completedIds)}
                disabled={completedIds.length === 0}
                className="rounded-xl px-3 py-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                ล้างที่เสร็จแล้ว
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-white/50">
              ดับเบิลคลิกที่ข้อความเพื่อแก้ไข · คลิกป้ายเพื่อเปลี่ยนความสำคัญ หมวดหมู่ หรือวันครบกำหนด
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
