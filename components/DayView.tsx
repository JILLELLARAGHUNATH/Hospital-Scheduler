'use client';
import React, { useMemo } from 'react';
import { format, addMinutes, isSameMinute, isSameHour, parseISO } from 'date-fns';
import type { Appointment, CalendarConfig, TimeSlot, PopulatedAppointment } from '@/types';
import { DEFAULT_CALENDAR_CONFIG } from '@/types';
import { appointmentService } from '@/services/appointmentService';
import { AppointmentCard } from './AppointmentCard'; 

interface DayViewProps {
  appointments: Appointment[];
  date: Date;
}

/**
 * Helper: Find the populated appointment that starts exactly at the given time slot.
 */
function getAppointmentForSlot(
  populatedAppointments: PopulatedAppointment[], 
  slotStart: Date
): PopulatedAppointment | undefined {
  return populatedAppointments.find(apt => {
    const aptStart = parseISO(apt.startTime);
    return isSameMinute(aptStart, slotStart) && isSameHour(aptStart, slotStart);
  });
}

/**
 * DayView Component: Renders a daily timeline view (visually aligned & consistent layout).
 */
export function DayView({ appointments, date }: DayViewProps) {
  const config: CalendarConfig = DEFAULT_CALENDAR_CONFIG;
  
  const timeSlots: TimeSlot[] = useMemo(() => {
    const slots: TimeSlot[] = [];
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0); 

    for (let hour = config.startHour; hour < config.endHour; hour++) {
      for (let minute of [0, 30]) {
        const start = addMinutes(new Date(dateOnly), hour * 60 + minute);
        const end = addMinutes(start, config.slotDuration);
        slots.push({ start, end, label: format(start, 'h:mm a') });
      }
    }
    return slots;
  }, [date, config.startHour, config.endHour, config.slotDuration]);

  const populatedAppointments: PopulatedAppointment[] = useMemo(() => {
    return appointments
      .map(apt => appointmentService.getPopulatedAppointment(apt))
      .filter((apt): apt is PopulatedAppointment => apt !== null);
  }, [appointments]);

  return (
    <div className="day-view border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="divide-y divide-gray-200">
        {timeSlots.map((slot, index) => {
          const apt = getAppointmentForSlot(populatedAppointments, slot.start);
          
          return (
            <div 
              key={index}
              className="flex items-center border-b border-gray-100 h-12"
            >
              {/* Time Label (Left) */}
              <div className="w-20 sm:w-24 bg-gray-50 text-[11px] text-gray-500 font-medium flex items-center justify-end pr-2 border-r border-gray-200">
                {slot.start.getMinutes() === 0 ? format(slot.start, 'h a') : ''}
              </div>
              
              {/* Appointment Area (Right) */}
              <div className="flex-1 px-2 py-1">
                {apt && <AppointmentCard appointment={apt} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {populatedAppointments.length === 0 && (
        <div className="text-center text-gray-500 py-12 text-sm">
          No appointments scheduled for this day.
        </div>
      )}
    </div>
  );
}
