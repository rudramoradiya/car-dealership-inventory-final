export function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-pulse shadow-xl">
      <div className="h-44 bg-slate-800 rounded-xl w-full"></div>

      <div className="flex items-start justify-between pt-1">
        <div className="space-y-2 flex-1 pr-4">
          <div className="h-3 bg-slate-800 rounded-md w-1/3"></div>
          <div className="h-5 bg-slate-800 rounded-md w-2/3"></div>
        </div>
        <div className="h-5 w-20 bg-slate-800 rounded-full"></div>
      </div>

      <div className="pt-2 flex justify-between items-end">
        <div className="space-y-1">
          <div className="h-3 bg-slate-800 rounded-md w-10"></div>
          <div className="h-6 bg-slate-800 rounded-md w-24"></div>
        </div>
        <div className="h-3 bg-slate-800 rounded-md w-24"></div>
      </div>

      <div className="pt-2">
        <div className="h-10 bg-slate-800 rounded-xl w-full"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
