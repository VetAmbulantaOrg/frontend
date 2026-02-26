import React from 'react';
import './styles/calendar.scss';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView({ events, onDayClick, onEventClick, onNavigate }) {
  // Dodaj eventPropGetter da dodeli CSS klasu po statusu
  const eventPropGetter = (event) => {
    return {
      className: event.status || 'Scheduled', // default ako nema status
    };
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 600 }}
      defaultView="month"
      selectable
      onSelectSlot={(slotInfo) => onDayClick(slotInfo.start)}
      onSelectEvent={(event) => onEventClick(event)}
      onNavigate={(date) => onNavigate(date)}
      eventPropGetter={eventPropGetter}
    />
  );
}
