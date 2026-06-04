import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "निवडा (Select)", 
  required = false, 
  className = "",
  style = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Resolve current selected label
  const selectedOption = options.find(opt => 
    typeof opt === "object" ? opt.value === value : opt === value
  );
  
  const displayLabel = selectedOption 
    ? (typeof selectedOption === "object" ? selectedOption.label : selectedOption)
    : placeholder;

  return (
    <div 
      className={`custom-dropdown-container ${className}`} 
      ref={dropdownRef}
      style={{ minWidth: "100%", width: "100%", ...style }}
    >
      <div 
        className="custom-dropdown-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span>{displayLabel}</span>
        <ChevronDown 
          size={16} 
          style={{ 
            transition: "transform 150ms ease", 
            transform: isOpen ? "rotate(180deg)" : "rotate(0)" 
          }} 
        />
      </div>
      
      {isOpen && (
        <div className="custom-dropdown-menu" style={{ width: "100%", minWidth: "100%" }}>
          {options.map((opt, index) => {
            const optVal = typeof opt === "object" ? opt.value : opt;
            const optLabel = typeof opt === "object" ? opt.label : opt;
            const isSelected = optVal === value;

            return (
              <div 
                key={index} 
                className={`custom-dropdown-item ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(optVal)}
              >
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
