import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Check, Pencil, Sparkles } from "lucide-react";

const PRIORITIES = {
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
const ORDER = ["low", "medium", "high"];

const FILTERS = [
  { key: "all", label: "ทั้งหมด" },
  { key: "active", label: "ยังไม่เสร็จ" },
  { key: "completed", label: "เสร็จแล้ว" },
];

const EMPTY_TEXT = {
  all: "ยังไม่มีงาน เพิ่มงานแรกของคุณได้เลย",
  active: "ไม่มีงานค้างอยู่ เยี่ยมมาก!",
  completed: "ยังไม่มีงานที่เสร็จ",
};

const ANIM_MS = 300;

function TodoItem({ todo, removing, onToggle, onDelete, onSave, onCyclePriority }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef(null);
  const p = PRIORITIES[todo.priority];

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const startEdit = () => {
    setDraft(todo.text);
    setEditing(true);
  };
  const commit = () => {
    const t = draft.trim();
    if (t) onSave(todo.id, t);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(todo.text);
    setEditing(false);
  };

  return (
    <li
      className="overflow-hidden px-1 transition-all ease-out"
      style={{
        transitionDuration: `${ANIM_MS}ms`,
        maxHeight: removing ? 0 : 160,
        opacity: removing ? 0 : 1,
        transform: removing ? "translateX(24px) scale(0.96)" : "translateX(0)",
        paddingTop: removing ? 0 : 5,
        paddingBottom: removing ? 0 : 5,
        animation: removing ? "none" : "todo-in 260ms ease-out",
      }}
    >
      <div className="relative flex items-center gap-3 rounded-2xl bg-white/90 py-3 pl-5 pr-3 shadow-lg shadow-black/20 ring-1 ring-white/60 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl">
        <span className={`absolute left-0 top-2.5 bottom-2.5 w-1.5 rounded-full ${p.bar}`} />

        <button
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? "ทำเครื่องหมายว่ายังไม่เสร็จ" : "ทำเครื่องหมายว่าเสร็จแล้ว"}
          aria-pressed={todo.completed}
          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 ${
            todo.completed
              ? "border-transparent bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-md shadow-fuchsia-400/50"
              : "border-slate-300 bg-white hover:border-fuchsia-400"
          }`}
          style={todo.completed ? { animation: "todo-pop 320ms ease-out" } : undefined}
        >
          {todo.completed && <Check size={14} strokeWidth={3.5} />}
        </button>

        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === "Enter") commit();
                if (e.key === "Escape") cancel();
              }}
              className="w-full rounded-lg border border-fuchsia-300 bg-white px-2 py-1 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
            />
          ) : (
            <span
              onDoubleClick={startEdit}
              title="ดับเบิลคลิกเพื่อแก้ไข"
              className={`block cursor-text select-none break-words text-base leading-relaxed transition-colors ${
                todo.completed ? "text-slate-400 line-through decoration-fuchsia-400" : "text-slate-800"
              }`}
            >
              {todo.text}
            </span>
          )}
        </div>

        <button
          onClick={() => onCyclePriority(todo.id)}
          title="คลิกเพื่อเปลี่ยนระดับความสำคัญ"
          className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-transform hover:scale-105 ${p.badge}`}
        >
          {p.label}
        </button>

        <div className="flex flex-shrink-0 items-center">
          <button
            onClick={startEdit}
            aria-label="แก้ไข"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-600"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            aria-label="ลบ"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </li>
  );
}

export default function TodoApp() {
  const nextId = useRef(4);
  const [todos, setTodos] = useState([
    { id: 1, text: "ส่งรายงานประจำสัปดาห์", completed: false, priority: "high" },
    { id: 2, text: "ซื้อของเข้าบ้าน", completed: false, priority: "medium" },
    { id: 3, text: "อ่านหนังสือ 20 หน้า", completed: true, priority: "low" },
  ]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [removing, setRemoving] = useState([]);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setTodos((prev) => [{ id: nextId.current++, text: t, completed: false, priority }, ...prev]);
    setText("");
  };

  const removeIds = (ids) => {
    setRemoving((r) => [...r, ...ids]);
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => !ids.includes(t.id)));
      setRemoving((r) => r.filter((id) => !ids.includes(id)));
    }, ANIM_MS);
  };

  const toggle = (id) => setTodos((p) => p.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const save = (id, newText) => setTodos((p) => p.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  const cycle = (id) =>
    setTodos((p) =>
      p.map((t) => (t.id === id ? { ...t, priority: ORDER[(ORDER.indexOf(t.priority) + 1) % ORDER.length] } : t))
    );

  const remaining = todos.filter((t) => !t.completed).length;
  const percent = todos.length ? Math.round(((todos.length - remaining) / todos.length) * 100) : 0;
  const completedIds = todos.filter((t) => t.completed && !removing.includes(t.id)).map((t) => t.id);
  const visible = todos.filter((t) =>
    filter === "active" ? !t.completed : filter === "completed" ? t.completed : true
  );

  return (
    <div
      className="relative min-h-screen overflow-hidden px-4 py-8 sm:py-12"
      style={{
        fontFamily: "'Noto Sans Thai', 'Sarabun', system-ui, sans-serif",
        background: "linear-gradient(135deg, #1e1b4b, #5b21b6, #be185d, #0e7490)",
        backgroundSize: "300% 300%",
        animation: "bg-shift 18s ease infinite",
      }}
    >

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-fuchsia-500/40 blur-3xl" style={{ animation: "blob-float 9s ease-in-out infinite" }} />
      <div className="pointer-events-none absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl" style={{ animation: "blob-float 12s ease-in-out infinite reverse" }} />

      <div className="relative mx-auto w-full max-w-xl">
        <header className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/40">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-white via-fuchsia-100 to-cyan-100 bg-clip-text text-2xl font-semibold text-transparent">
                รายการงานของฉัน
              </h1>
              <p className="text-sm text-white/70">จัดการงานประจำวันให้เป็นระเบียบ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 shadow-lg shadow-fuchsia-400/60 transition-all duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="w-24 text-right text-sm text-white/80">สำเร็จ {percent}%</span>
          </div>
        </header>

        {/* Add form */}
        <div className="mb-5 rounded-3xl bg-white/90 p-4 shadow-2xl shadow-black/30 ring-1 ring-white/60 backdrop-blur-xl">
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
        </div>

        {/* Filter tabs */}
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
              removing={removing.includes(todo.id)}
              onToggle={toggle}
              onDelete={(id) => removeIds([id])}
              onSave={save}
              onCyclePriority={cycle}
            />
          ))}
        </ul>

        {visible.length === 0 && (
          <div className="rounded-2xl bg-white/10 px-4 py-10 text-center text-white/70 ring-1 ring-white/20 backdrop-blur">
            {EMPTY_TEXT[filter]}
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
          ดับเบิลคลิกที่ข้อความเพื่อแก้ไข · คลิกป้ายความสำคัญเพื่อเปลี่ยนระดับ
        </p>
      </div>
    </div>
  );
}
