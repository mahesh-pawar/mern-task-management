const ACCENTS = {
  indigo: 'bg-indigo-50 text-indigo-600',
  slate: 'bg-slate-100 text-slate-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
};

function StatCard({ label, value, accent = 'indigo', icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${ACCENTS[accent]}`} aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{value}</p>
    </div>
  );
}

export default StatCard;
