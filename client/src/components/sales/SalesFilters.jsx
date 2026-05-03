import Input from '../ui/Input';

const SalesFilters = ({ from, onFromChange, onToChange, to }) => (
  <div className="rounded-xl bg-white p-4 shadow">
    <h2 className="text-lg font-semibold text-slate-800">Sales</h2>
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <Input
        type="date"
        label="From"
        value={from}
        onChange={(event) => onFromChange(event.target.value)}
      />
      <Input
        type="date"
        label="To"
        value={to}
        onChange={(event) => onToChange(event.target.value)}
      />
    </div>
  </div>
);

export default SalesFilters;
