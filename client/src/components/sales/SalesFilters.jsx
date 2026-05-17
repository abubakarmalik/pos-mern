import Input from '../ui/Input';
import Card from '../ui/Card';

const SalesFilters = ({ from, onFromChange, onToChange, to }) => (
  <Card>
    <h2 className="text-base font-semibold text-slate-900">Filters</h2>
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
  </Card>
);

export default SalesFilters;
