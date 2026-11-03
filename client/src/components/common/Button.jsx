import Spinner from './Spinner';
import buttonClass from './buttonClass';

function Button({ variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...props }) {
  return (
    <button type="button" disabled={disabled || loading} className={buttonClass({ variant, size, className })} {...props}>
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

export default Button;
