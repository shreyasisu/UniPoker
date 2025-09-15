import { useState } from "react";
import Tabs from "./components/Tabs.tsx";
import FindGame from "./pages/FindGame.tsx";
import HostGame from "./pages/HostGame.tsx";
import Login from "./components/Login.tsx";
import Signup from "./components/Signup.tsx";
import { useAuth } from "./context/AuthContext"; 
import "./App.css";

export default function App() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"find" | "host">("find");

  if (!isAuthenticated) {
    // unauthenticated users: show login/signup choice
    return (
      <div className="container">
        <h1>Welcome to UniPoker</h1>
        <Login />
        <Signup />
      </div>
    );
  }

  // authenticated users: main app
  return (
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
  );
}
