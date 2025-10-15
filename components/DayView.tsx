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
 * DayView Component: Renders a daily timeline view (Fixes spacing with h-12).
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
    <div className="day-view border border-gray-200 rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {timeSlots.map((slot, index) => {
          const apt = getAppointmentForSlot(populatedAppointments, slot.start);
          
          return (
            <div 
              key={index} 
              // Critical Fix: Use h-12 (48px) for stable row height
              className="flex border-b border-gray-200 h-12" 
            >
              {/* Time Label (Left) */}
              <div className="w-20 sm:w-24 bg-gray-50 text-[10px] text-gray-500 flex items-start justify-end pr-2 pt-0.5 flex-shrink-0">
                {slot.start.getMinutes() === 0 ? format(slot.start, 'h a') : ''}
              </div>
              
              {/* Appointment Area (Right) */}
              <div className="flex-1 p-0.5 border-l border-gray-200">
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