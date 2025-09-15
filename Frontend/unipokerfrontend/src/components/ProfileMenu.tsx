interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export default function ProfileMenu({
  isOpen,
  onClose,
  onLogout,
}: ProfileMenuProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="profile-menu-overlay" onClick={onClose} />}

      {/* Sidebar */}
      <div className={`profile-menu-sidebar ${isOpen ? "open" : ""}`}>
        <div className="profile-menu-header">
          <h3>Menu</h3>
        </div>

        <div className="profile-menu-content">
          <div className="profile-menu-item">
            <button className="profile-menu-button">View Profile</button>
          </div>

          <div className="profile-menu-item">
            <button className="profile-menu-button">Settings</button>
          </div>

          <div className="profile-menu-item">
            <button className="profile-menu-button">Game History</button>
          </div>

          <div className="profile-menu-item">
            <button className="profile-menu-button">Help & Support</button>
          </div>
        </div>

        <div className="profile-menu-footer">
          <button className="profile-menu-logout" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
