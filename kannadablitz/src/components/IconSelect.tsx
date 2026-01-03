import { useState } from "react";

interface Option {
  id: string;
  name: string;
}

interface IconSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  ariaLabel?: string;
}

const IconSelect = ({
  options,
  value,
  onChange,
  icon,
  ariaLabel = "Select option",
}: IconSelectProps) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
    setIsSelectorOpen(false);
  };

  return (
    <div className="icon-select-wrapper">
      <button
        onClick={() => setIsSelectorOpen(!isSelectorOpen)}
        onMouseDown={(e) => e.preventDefault()}
        className="btn btn--icon"
        aria-label={ariaLabel}
        type="button"
      >
        {icon}
      </button>
      {isSelectorOpen && (
        <select
          className="icon-select"
          value={value}
          onChange={handleSelectChange}
          aria-label={ariaLabel}
          onBlur={() => setIsSelectorOpen(false)}
          autoFocus
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default IconSelect;
