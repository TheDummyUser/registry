import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";

interface InputComponentProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  required?: boolean;
  error?: string;
}

export const InputComponent: React.FC<InputComponentProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  id,
  required,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="mb-0.5">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={type === "password" && !showPassword ? "password" : "text"}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className={`pr-10 ${error ? "border-red-500" : ""}`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
