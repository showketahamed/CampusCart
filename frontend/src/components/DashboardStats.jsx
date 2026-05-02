export default function DashboardStats({ stats }) {
  const gradients = [
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-fuchsia-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-sky-500 to-indigo-600"
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Object.entries(stats).map(([k, v], i) => (
        <div key={k} className="card p-4 overflow-hidden relative">
          <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${gradients[i % gradients.length]}`} />
          <p className="text-sm text-slate-500 capitalize">{k}</p>
          <h3 className="text-2xl font-extrabold mt-1">{v}</h3>
        </div>
      ))}
    </div>
  );
}
