import { useState } from "react";
import Tabs from "./components/Tabs.tsx";
import FindGame from "./pages/FindGame.tsx";
import HostGame from "./pages/HostGame.tsx";
import Login from "./components/Login.tsx";
import Signup from "./components/Signup.tsx";
import MenuButton from "./components/MenuButton.tsx";
import ProfileMenu from "./components/ProfileMenu.tsx";
import { useAuth } from "./context/AuthContext";
import "./App.css";

export default function App() {
  const { isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"find" | "host">("find");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    // unauthenticated users: show login/signup choice
    const [showSignup, setShowSignup] = useState(false);

    return (
      <div className="container">
        <h1>Welcome to UniPoker</h1>
        {showSignup ? (
          <Signup onSwitchToLogin={() => setShowSignup(false)} />
        ) : (
          <Login onSwitchToSignup={() => setShowSignup(true)} />
        )}
      </div>
    );
  }

  // authenticated users: main app
  return (
    <>
      <MenuButton
        isOpen={isProfileMenuOpen}
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
      />

      <ProfileMenu
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
        onLogout={() => {
          logout();
          setIsProfileMenuOpen(false);
        }}
      />

      <div className="container">
        <header className="appHeader">
          <h1>UniPoker</h1>
          <p className="subtitle">
            Distance-only discovery • Request access • Host creates games
          </p>
        </header>

        <Tabs
          tabs={[
            { id: "find", label: "Find Game" },
            { id: "host", label: "Host Game" },
          ]}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as "find" | "host")}
        />

        <main className="content">
          {activeTab === "find" ? <FindGame /> : <HostGame />}
        </main>
        <footer className="footer">
          <small>
            Privacy first: addresses are never shown until the host approves.
          </small>
        </footer>
      </div>
    </>
  );
}
