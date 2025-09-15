interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function MenuButton({ isOpen, onClick }: MenuButtonProps) {
  return (
    <button
      className={`menu-button ${isOpen ? "open" : ""}`}
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="menu-button-icon">
        <div className="menu-button-line"></div>
        <div className="menu-button-line"></div>
        <div className="menu-button-line"></div>
      </div>
    </button>
  );
}
