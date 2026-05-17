import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
  title = 'No records found',
  description = 'Try changing filters or creating a new record.',
  action,
  icon,
}) => (
  <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-slate-400 shadow-sm">
      {icon || <FiInbox />}
    </div>
    <p className="text-sm font-semibold text-slate-800">{title}</p>
    {description && <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
