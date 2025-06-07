import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import './CalendarView.css';

const CalendarView = ({ events, onEventClick, onAddToCalendarClick }) => {
  // État pour suivre le mois actuellement affiché
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Navigation entre les mois
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Fonction pour formater l'importance en classe CSS
  const getImportanceClass = (importance) => {
    switch (importance) {
      case 'critical': return 'importance-critical';
      case 'high': return 'importance-high';
      case 'medium': return 'importance-medium';
      case 'low': return 'importance-low';
      default: return '';
    }
  };

  // Fonction pour formater la catégorie en classe CSS
  const getCategoryClass = (category) => {
    switch (category) {
      case 'deadline': return 'category-deadline';
      case 'exam': return 'category-exam';
      case 'task': return 'category-task';
      case 'personal': return 'category-personal';
      default: return '';
    }
  };

  // Rendu de l'en-tête du calendrier avec les jours de la semaine
  const renderHeader = () => {
    const dateFormat = "EEE";
    const days = [];
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="calendar-day-header" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="calendar-days-header">{days}</div>;
  };

  // Rendu du titre et des contrôles de navigation
  const renderTitle = () => {
    return (
      <div className="calendar-header">
        <div className="calendar-title">
          <h2>{format(currentMonth, "MMMM yyyy")}</h2>
        </div>
        <div className="calendar-controls">
          <button className="calendar-nav-button" onClick={prevMonth} aria-label="Mois précédent">
            <ChevronLeft size={18} />
          </button>
          <button className="calendar-today-button" onClick={goToToday}>
            Aujourd'hui
          </button>
          <button className="calendar-nav-button" onClick={nextMonth} aria-label="Mois suivant">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  // Rendu des cellules des jours du mois
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        
        // Filtrer les événements pour ce jour
        const dayEvents = events.filter(event => 
          isSameDay(new Date(event.date), cloneDay)
        );

        days.push(
          <div
            className={`calendar-day ${
              !isSameMonth(day, monthStart) ? "disabled" : ""
            } ${isToday(day) ? "today" : ""}`}
            key={day}
          >
            <div className="day-header">
              <span className="day-number">{formattedDate}</span>
            </div>
            <div className="day-content">
              {dayEvents.length > 0 && (
                <div className="day-events">
                  {dayEvents.slice(0, 2).map((event) => {
                    // Déterminer le style de l'événement
                    const styleClasses = `calendar-event ${getImportanceClass(event.importance)} ${getCategoryClass(event.category)}`;
                    
                    return (
                      <div 
                        key={event.id}
                        className={styleClasses}
                        onClick={() => onEventClick(event)}
                      >
                        {event.startTime && (
                          <span className="event-time">
                            {event.startTime}
                          </span>
                        )}
                        <span className="event-title">{event.title}</span>
                        {onAddToCalendarClick && (
                          <button 
                            className="add-to-calendar-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCalendarClick(event);
                            }}
                            aria-label="Ajouter au calendrier"
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <div className="more-events" onClick={() => {
                      // Afficher le premier événement de la liste
                      const firstEvent = dayEvents[0];
                      onEventClick(firstEvent);
                    }}>
                      +{dayEvents.length - 2} plus
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      
      rows.push(
        <div className="calendar-row" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="calendar-body">{rows}</div>;
  };

  // Rendu du composant principal
  return (
    <div className="calendar-view">
      {renderTitle()}
      {renderHeader()}
      {renderCells()}
    </div>
  );
};

export default CalendarView;