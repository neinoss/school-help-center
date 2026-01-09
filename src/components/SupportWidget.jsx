export function SupportWidget({ onClick }) {
  return (
    <div className="support-widget">
      <a
        href="https://wa.me/96176036406"
        target="_blank"
        rel="noreferrer"
        className="support-btn"
        onClick={onClick}
      >
        💬 WhatsApp Support
      </a>
    </div>
  );
}
