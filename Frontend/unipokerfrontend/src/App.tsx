import { useState } from "react";
import Tabs from "./components/Tabs.tsx";
import FindGame from "./pages/FindGame.tsx";
import HostGame from "./pages/HostGame.tsx";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState<"find" | "host">("find");

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
