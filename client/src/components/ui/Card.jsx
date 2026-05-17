import { theme } from '../../theme/tokens';

const Card = ({ children, className = '', padded = true }) => (
  <section
    className={`${theme.radius.lg} border ${theme.colors.border} ${theme.colors.surface} ${theme.shadow.card} ${
      padded ? theme.spacing.section : ''
    } ${className}`}
  >
    {children}
  </section>
);

export default Card;
