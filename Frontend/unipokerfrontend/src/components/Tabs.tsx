type Tab = {
  id: string;
  label: string;
};

export default function Tabs({
    tabs,
    activeId,
    onChange,
  }: {
    tabs: Tab[];
    activeId: string;
    onChange: (id: string) => void;
  }) {
    return (
      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tab ${t.id === activeId ? "active" : ""}`}
            onClick={() => onChange(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>
    );
  }