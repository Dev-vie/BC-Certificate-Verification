interface ModeToggleProps {
  value: 'individual' | 'bulk';
  onChange: (value: 'individual' | 'bulk') => void;
}

export const ModeToggle = ({ value, onChange }: ModeToggleProps) => {
  return (
    <div className="inline-flex items-center rounded-2xl bg-card border border-border p-1 shadow-sm transition-colors duration-200">
      <button
        type="button"
        onClick={() => onChange('individual')}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
          value === 'individual'
            ? 'bg-[#3D876C] text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <span className="text-[14px]">◌</span>
        Individual
      </button>
      <button
        type="button"
        onClick={() => onChange('bulk')}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
          value === 'bulk'
            ? 'bg-[#3D876C] text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <span className="text-[14px]">⇪</span>
        Bulk CSV
      </button>
    </div>
  );
};

export default ModeToggle;
