import { COUNTRIES } from "../data/countries";

interface PhoneInputProps {
  dialCode: string;
  number: string;
  onDialCodeChange: (dialCode: string) => void;
  onNumberChange: (number: string) => void;
  hasError?: boolean;
}

// dial codes repeat across countries (e.g. +1 for US and Canada) - de-dupe for the select
const DIAL_CODES = Array.from(new Set(COUNTRIES.map((c) => c.dialCode))).sort(
  (a, b) => Number(a.slice(1)) - Number(b.slice(1)),
);

export default function PhoneInput({ dialCode, number, onDialCodeChange, onNumberChange, hasError }: PhoneInputProps) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <select
        value={dialCode}
        onChange={(e) => onDialCodeChange(e.target.value)}
        aria-label="Country dial code"
        style={{ flex: "0 0 100px" }}
        className={hasError ? "has-error" : ""}
      >
        {DIAL_CODES.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
      <input
        type="tel"
        inputMode="numeric"
        placeholder="555 123 4567"
        value={number}
        onChange={(e) => onNumberChange(e.target.value.replace(/[^\d\s-]/g, ""))}
        aria-label="Phone number"
        className={hasError ? "has-error" : ""}
        style={{ flex: 1 }}
      />
    </div>
  );
}
