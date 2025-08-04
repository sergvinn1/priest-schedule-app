// client/src/components/schedules/ScheduleCard.jsx (ПОВНИЙ КОД)
import React from 'react';
import { format } from 'date-fns'; // Для форматування дат
import { uk } from 'date-fns/locale'; // Для української локалі
import './ScheduleCard.css'; // Стилі для картки розкладу

const ScheduleCard = ({ schedule }) => {
    const { startDate, endDate, servingPriest, templeDutyPriest, cityDutyPriest } = schedule;

    // Форматуємо дати
    const formattedStartDate = format(new Date(startDate), 'dd.MM.yyyy', { locale: uk });
    const formattedEndDate = format(new Date(endDate), 'dd.MM.yyyy', { locale: uk });

    return (
        <div className="schedule-card">
            <div className="schedule-card-header">
                <h3 className="schedule-dates">
                    {formattedStartDate} - {formattedEndDate}
                </h3>
            </div>
            <div className="schedule-card-body">
                <p className="schedule-duty">
                    <span className="duty-label">Служащий:</span>{' '}
                    {servingPriest ? servingPriest.fullName : 'Не вказано'}
                </p>
                <p className="schedule-duty">
                    <span className="duty-label">Черговий по храму:</span>{' '}
                    {templeDutyPriest ? templeDutyPriest.fullName : 'Не вказано'}
                </p>
                <p className="schedule-duty">
                    <span className="duty-label">Черговий по місту:</span>{' '}
                    {cityDutyPriest ? cityDutyPriest.fullName : 'Не вказано'}
                </p>
            </div>
        </div>
    );
};

export default ScheduleCard;