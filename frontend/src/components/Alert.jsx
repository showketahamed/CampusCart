export default function Alert({ type = "success", children }) {
  const css = type === "error" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700";
  return <div className={`rounded-xl px-4 py-2 ${css}`}>{children}</div>;
}
