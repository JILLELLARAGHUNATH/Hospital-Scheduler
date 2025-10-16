'use client';
import React, { useState } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { format, addDays, getDay } from 'date-fns';
import type { CalendarView } from '@/types';

import { DoctorSelector } from './DoctorSelector';
import { DayView } from './DayView';
import { WeekView } from './WeekView';

export function ScheduleView() {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>('day');

  const { appointments, doctor, loading, error, allDoctors } = useAppointments(
    selectedDoctorId,
    selectedDate,
    view
  );

  const changeDate = (numDays: number) => {
    const newDate = addDays(selectedDate, numDays);
    setSelectedDate(newDate);
  };

  const getWeekStart = (date: Date): Date => {
    const day = getDay(date);
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const displayDate =
    view === 'day'
      ? format(selectedDate, 'PPP')
      : `${format(getWeekStart(selectedDate), 'MMM d')} - ${format(
          addDays(getWeekStart(selectedDate), 6),
          'MMM d, yyyy'
        )}`;

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200">
      {/* HEADER with Controls */}
      <div className="border-b border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900 hidden sm:block">
              Schedule
            </h2>
            <DoctorSelector
              allDoctors={allDoctors}
              selectedDoctorId={selectedDoctorId}
              onDoctorChange={setSelectedDoctorId}
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => changeDate(view === 'day' ? -1 : -7)}
              className="p-2 border rounded-full hover:bg-gray-100"
            >
              &lt;
            </button>

            <div className="text-sm font-medium text-gray-700 w-48 text-center">
              {displayDate}
            </div>

            <button
              onClick={() => changeDate(view === 'day' ? 1 : 7)}
              className="p-2 border rounded-full hover:bg-gray-100"
            >
              &gt;
            </button>

            <div className="flex border rounded-lg overflow-hidden ml-4">
              <button
                className={`px-3 py-1 text-sm transition-colors ${
                  view === 'day'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setView('day')}
              >
                Day
              </button>
              <button
                className={`px-3 py-1 text-sm transition-colors ${
                  view === 'week'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setView('week')}
              >
                Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="p-4 sm:p-6">
        {loading && (
          <div className="text-center py-12 text-gray-500">
            Loading schedule...
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-600">
            Error fetching data: {error.message}
          </div>
        )}

        {!selectedDoctorId && !loading && (
          <div className="text-center py-12 text-gray-500">
            Please select a doctor to view their schedule.
          </div>
        )}

        {selectedDoctorId && doctor && !loading && !error && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Dr. {doctor.name} - {doctor.specialty}
            </h3>

            {view === 'day' ? (
              <DayView appointments={appointments} date={selectedDate} />
            ) : (
              <WeekView appointments={appointments} date={selectedDate} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
