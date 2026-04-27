import "./Modal.css";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeButton = true,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal modal-${size}`} onClick={(e) => e.stopPropagation()}>
        {closeButton && (
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        )}

        {title && <div className="modal-header">{title}</div>}

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
