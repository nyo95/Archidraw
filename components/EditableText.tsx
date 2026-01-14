
import React, { useState, useEffect, useRef } from 'react';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  placeholder?: string;
  isReadOnly?: boolean;
  multiline?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ value, onSave, className = "", placeholder = "", isReadOnly = false, multiline = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setInternalValue(value);
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (!multiline && inputRef.current instanceof HTMLInputElement) {
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }
  }, [isEditing, multiline]);

  const handleBlur = () => {
    setIsEditing(false);
    if (internalValue !== value) {
      onSave(internalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setInternalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing && !isReadOnly) {
    const commonProps = {
      ref: inputRef as any,
      value: internalValue,
      onChange: (e: React.ChangeEvent<any>) => setInternalValue(e.target.value),
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      className: `w-full bg-zinc-50 border-2 border-zinc-900 rounded-[12px] px-3 py-1 outline-none seamless-input ${className}`,
      placeholder
    };

    return multiline ? 
      <textarea {...commonProps} rows={4} className={`${commonProps.className} resize-none py-4`} /> : 
      <input {...commonProps} />;
  }

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        if (!isReadOnly) setIsEditing(true);
      }}
      className={`cursor-text transition-all rounded-[8px] hover:bg-zinc-100/50 min-h-[1.2em] py-1 ${!internalValue ? 'text-zinc-300 italic' : ''} ${className}`}
    >
      {internalValue || placeholder}
    </div>
  );
};

export default EditableText;
