export function SkeletonCard() {
  return (
    <div className="bg-slate-800/60 rounded-xl border border-slate-700/60 p-6 space-y-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1 pr-4">
          <div className="h-3 bg-slate-700 rounded w-1/3"></div>
          <div className="h-6 bg-slate-700 rounded w-2/3"></div>
        </div>
        <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
      </div>

      <div className="pt-4 flex justify-between items-end">
        <div className="space-y-1">
          <div className="h-3 bg-slate-700 rounded w-12"></div>
          <div className="h-7 bg-slate-700 rounded w-24"></div>
        </div>
        <div className="h-4 bg-slate-700 rounded w-28"></div>
      </div>

      <div className="pt-4 border-t border-slate-700/50">
        <div className="h-10 bg-slate-700 rounded-lg w-full"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
