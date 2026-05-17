import Card from './Card';
import Skeleton from './Skeleton';

const StatCard = ({ label, value, helper, tone = 'blue', loading = false }) => {
  const tones = {
    blue: 'bg-cyan-50 text-cyan-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          {loading ? (
            <Skeleton className="mt-3 h-7 w-28" />
          ) : (
            <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
          )}
          {helper && <p className="mt-2 text-sm text-slate-500">{helper}</p>}
        </div>
        <span className={`h-2.5 w-2.5 rounded-full ${tones[tone] || tones.blue}`} />
      </div>
    </Card>
  );
};

export default StatCard;
