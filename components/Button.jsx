import "./Button.css";

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false, 
  disabled = false,
  fullWidth = false,
  icon = null,
  className = "",
  ...props 
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${fullWidth ? "btn-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn-spinner" />}
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}
