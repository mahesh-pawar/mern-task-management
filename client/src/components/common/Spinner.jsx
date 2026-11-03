const SIZES = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-10 w-10 border-[3px]' };

function Spinner({ size = 'md', className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-current border-r-transparent ${SIZES[size]} ${className}`}
    />
  );
}

export function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-indigo-600">
      <Spinner size="lg" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

export default Spinner;
