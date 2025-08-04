// client/src/components/common/ChurchLogo.jsx (ПОВНИЙ КОД)
import React from 'react';
import './ChurchLogo.css'; // Стилі для логотипу

const ChurchLogo = ({ className = '' }) => {
    return (
        <div className={`church-logo ${className}`}>
            <div className="dome-base"></div>
            <div className="dome">
                <div className="cross-vertical"></div>
                <div className="cross-horizontal"></div>
            </div>
            {/* Можна додати ще елементів для ускладнення, наприклад, "барабан" під куполом */}
        </div>
    );
};

export default ChurchLogo;