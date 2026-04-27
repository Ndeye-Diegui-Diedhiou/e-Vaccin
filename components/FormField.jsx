import "./FormField.css";

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  touched,
  icon,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  helper,
  ...props
}) {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      
      <div className="form-input-wrapper">
        {icon && <span className="form-icon">{icon}</span>}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`form-input ${error && touched ? "error" : ""}`}
          {...props}
        />
      </div>

      {error && touched && (
        <div className="form-error">
          {error}
        </div>
      )}

      {helper && !error && (
        <div className="form-helper">
          {helper}
        </div>
      )}
    </div>
  );
}
