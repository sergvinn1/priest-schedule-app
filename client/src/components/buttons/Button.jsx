// client/src/components/buttons/Button.jsx (ПОВНИЙ КОД)
import React from 'react';
import './Button.css'; // Стилі для кнопки

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '', ...props }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`button ${variant} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;