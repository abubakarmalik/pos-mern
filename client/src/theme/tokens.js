export const theme = {
  colors: {
    brand: {
      primary: 'cyan',
      primaryBg: 'bg-cyan-600',
      primaryHover: 'hover:bg-cyan-700',
      primaryText: 'text-cyan-700',
      primarySoft: 'bg-cyan-50',
      primaryRing: 'focus:ring-cyan-500',
    },
    app: 'bg-slate-100 text-slate-950',
    surface: 'bg-white',
    surfaceMuted: 'bg-slate-50',
    border: 'border-slate-200',
    text: {
      primary: 'text-slate-950',
      secondary: 'text-slate-600',
      muted: 'text-slate-500',
      subtle: 'text-slate-400',
    },
    focus: 'focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2',
  },
  radius: {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
  },
  shadow: {
    card: 'shadow-sm shadow-slate-200/70',
    overlay: 'shadow-xl shadow-slate-900/20',
  },
  spacing: {
    page: 'p-4 sm:p-6 lg:p-8',
    stack: 'space-y-5',
    section: 'p-4 sm:p-5',
  },
  transitions: {
    base: 'transition duration-150 ease-out',
  },
  z: {
    sidebar: 'z-30',
    overlay: 'z-40',
    modal: 'z-50',
  },
  table: {
    cell: 'px-4 py-3',
    header: 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500',
  },
  form: {
    field:
      'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500',
    label: 'text-sm font-medium text-slate-700',
    help: 'mt-1 text-xs text-slate-500',
    error: 'mt-1 text-xs font-medium text-red-600',
  },
};
