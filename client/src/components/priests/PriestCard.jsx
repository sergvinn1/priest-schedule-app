// client/src/components/priests/PriestCard.jsx (ПОВНИЙ КОД)
import React from 'react';
import { FaUserCircle, FaEnvelope, FaPhone } from 'react-icons/fa'; // Приклад іконок
import './PriestCard.css'; // Стилі для картки священника

const PriestCard = ({ priest }) => {
    const { title, fullName, email, phone } = priest; // Припустимо, що ці поля є

    return (
        <div className="priest-card">
            <div className="priest-card-header">
                <FaUserCircle className="priest-avatar-icon" /> {/* Аватар-іконка */}
                <h3 className="priest-full-name">{fullName}</h3>
            </div>
            <div className="priest-card-body">
                <p className="priest-title">{title}</p>
                {email && (
                    <p className="priest-contact">
                        <FaEnvelope className="contact-icon" /> {email}
                    </p>
                )}
                {phone && (
                    <p className="priest-contact">
                        <FaPhone className="contact-icon" /> {phone}
                    </p>
                )}
                {/* Можна додати інші деталі, наприклад, посилання на біографію */}
            </div>
        </div>
    );
};

export default PriestCard;