// client/src/components/forms/Input.jsx (ПОВНИЙ КОД)
import React from 'react';
import './Input.css'; // Стилі для інпута

const Input = ({ label, id, type = 'text', value, onChange, placeholder, required = false, ...props }) => {
    return (
        <div className="input-group">
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="input-field"
                {...props}
            />
        </div>
    );
};

export default Input;