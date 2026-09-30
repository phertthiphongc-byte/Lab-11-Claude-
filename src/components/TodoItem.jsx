import { useState, useRef, useEffect } from "react";
import { Check, Pencil, Trash2, CalendarDays } from "lucide-react";
import { PRIORITIES, CATEGORIES, ANIM_MS, dueState, formatDate } from "../constants";

const DUE_STYLE = {
  overdue: "bg-red-100 text-red-700 ring-red-300 font-medium",
  today: "bg-yellow-100 text-yellow-800 ring-yellow-300 font-medium",
  upcoming: "bg-slate-100 text-slate-600 ring-slate-200",
  done: "bg-slate-100 text-slate-400 ring-slate-200",
  none: "text-slate-400 ring-slate-300 hover:text-fuchsia-500 hover:ring-fuchsia-300",
};

function DueBadge({ todo, today, onChange }) {
  const state = dueState(todo, today);
  const label =
    state === "none"
      ? "กำหนดวัน"
      : state === "today"
      ? "วันนี้"
      : state === "overdue"
      ? `เลยกำหนด ${formatDate(todo.due)}`
      : formatDate(todo.due);

  return (
    <label
      title="เลือกวันครบกำหนด"
      className={`relative inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ring-1 ring-inset transition-colors ${DUE_STYLE[state]}`}
    >
      <CalendarDays size={12} />
      {label}
      <input
        type="date"
        value={todo.due || ""}
        aria-label="วันครบกำหนด"
        onChange={(e) => onChange(todo.id, e.target.value || null)}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker?.();
          } catch {
            /* some browsers block showPicker; native behavior still works */
          }
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </label>
  );
}

export default function TodoItem({
  todo,
  today,
  removing,
  onToggle,
  onDelete,
  onSave,
  onCyclePriority,
  onCycleCategory,
  onSetDue,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef(null);
  const p = PRIORITIES[todo.priority];
  const c = CATEGORIES[todo.category];

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
        maxHeight: removing ? 0 : 220,
        opacity: removing ? 0 : 1,
        transform: removing ? "translateX(24px) scale(0.96)" : "translateX(0)",
        paddingTop: removing ? 0 : 5,
        paddingBottom: removing ? 0 : 5,
        animation: removing ? "none" : "todo-in 260ms ease-out",
      }}
    >
      <div className="relative flex items-start gap-3 rounded-2xl bg-white/90 py-3 pl-5 pr-2 shadow-lg shadow-black/20 ring-1 ring-white/60 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl">
        <span className={`absolute left-0 top-2.5 bottom-2.5 w-1.5 rounded-full ${p.bar}`} />

        <button
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? "ทำเครื่องหมายว่ายังไม่เสร็จ" : "ทำเครื่องหมายว่าเสร็จแล้ว"}
          aria-pressed={todo.completed}
          className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 ${
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

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onCyclePriority(todo.id)}
              title="คลิกเพื่อเปลี่ยนระดับความสำคัญ"
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-transform hover:scale-105 ${p.badge}`}
            >
              {p.label}
            </button>
            <button
              onClick={() => onCycleCategory(todo.id)}
              title="คลิกเพื่อเปลี่ยนหมวดหมู่"
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ring-1 ring-inset transition-transform hover:scale-105 ${c.tag}`}
            >
              <c.Icon size={12} />
              {c.label}
            </button>
            <DueBadge todo={todo} today={today} onChange={onSetDue} />
          </div>
        </div>

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
