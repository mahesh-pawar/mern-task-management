function ErrorAlert({ message, onRetry }) {
  if (!message) return null;

  return (
    <div role="alert" className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="shrink-0 font-medium underline hover:text-red-800">
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorAlert;
