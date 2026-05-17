import { Link, useLocation, useParams } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const staticLabels = {
  pos: 'Dashboard',
  products: 'Products',
  categories: 'Categories',
  inventory: 'Inventory',
  reports: 'Reports',
  sales: 'Sales',
  invoice: 'Receipt',
  users: 'Users',
  settings: 'Settings',
  new: 'Create',
  edit: 'Edit',
};

const titleCase = (value) =>
  value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());

const getLabel = ({ segment, index, segments, params }) => {
  if (staticLabels[segment]) {
    if (segment === 'new') {
      const parent = segments[index - 1];
      if (parent === 'products') return 'Create Product';
      if (parent === 'categories') return 'Create Category';
      if (parent === 'users') return 'Create User';
    }
    if (segment === 'edit') {
      const parent = segments[index - 2];
      if (parent === 'products') return 'Edit Product';
      if (parent === 'categories') return 'Edit Category';
    }
    return staticLabels[segment];
  }

  if (segment === params.id || segment === params.saleId) {
    const parent = segments[index - 1];
    if (parent === 'sales') return 'Sale Detail';
    if (parent === 'invoice') return 'Receipt Detail';
    return 'Detail';
  }

  return titleCase(segment);
};

const Breadcrumb = ({ className = '' }) => {
  const location = useLocation();
  const params = useParams();
  const segments = location.pathname.split('/').filter(Boolean);

  const crumbs = [
    { label: 'Dashboard', to: '/pos', icon: <FiHome /> },
    ...segments
      .filter((segment) => segment !== 'pos')
      .map((segment, index, filteredSegments) => {
        const originalIndex = segments.indexOf(segment);
        return {
          label: getLabel({
            segment,
            index: originalIndex,
            segments,
            params,
          }),
          to: `/${segments.slice(0, originalIndex + 1).join('/')}`,
          hidden: segment === 'edit',
          sourceIndex: originalIndex,
          filteredIndex: index,
          filteredSegments,
        };
      }),
  ].filter((crumb) => !crumb.hidden);

  const dedupedCrumbs = crumbs.filter(
    (crumb, index, list) =>
      index === 0 || crumb.label !== list[index - 1].label,
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className={`min-w-0 overflow-x-auto ${className}`}
    >
      <ol className="flex min-w-max items-center gap-1 text-sm text-slate-500">
        {dedupedCrumbs.map((crumb, index) => {
          const isLast = index === dedupedCrumbs.length - 1;

          return (
            <li key={`${crumb.to}-${crumb.label}`} className="flex items-center gap-1">
              {index > 0 && <FiChevronRight className="text-slate-400" />}
              {isLast ? (
                <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-semibold text-slate-800">
                  {crumb.icon}
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {crumb.icon}
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
