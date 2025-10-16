'use client';
import React, { useMemo } from 'react';
import {
  format,
  addDays,
  startOfWeek,
  parseISO,
  isSameDay,
  addMinutes,
} from 'date-fns';
import type {
  Appointment,
  CalendarConfig,
  TimeSlot,
  PopulatedAppointment,
} from '@/types';
import { DEFAULT_CALENDAR_CONFIG, APPOINTMENT_TYPE_CONFIG } from '@/types';
import { appointmentService } from '@/services/appointmentService';

interface WeekViewProps {
  appointments: Appointment[];
  date: Date;
}

/**
 * WeekView Component: Displays appointments for a week (Monday - Sunday) in a grid format.
 */
export function WeekView({ appointments, date }: WeekViewProps) {
  const config: CalendarConfig = DEFAULT_CALENDAR_CONFIG;

  const weekStart = startOfWeek(date, { weekStartsOn: 1 });

  const weekDays: Date[] = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const timeSlots: TimeSlot[] = useMemo(() => {
    const slots: TimeSlot[] = [];
    const dummyDate = new Date();
    dummyDate.setHours(0, 0, 0, 0);

    for (let hour = config.startHour; hour < config.endHour; hour++) {
      for (const minute of [0, 30]) {
        const start = addMinutes(new Date(dummyDate), hour * 60 + minute);
        slots.push({
          start,
          end: addMinutes(start, config.slotDuration),
          label: format(start, 'h:mm a'),
        });
      }
    }
    return slots;
  }, [config.startHour, config.endHour, config.slotDuration]);

  const populatedAppointments: PopulatedAppointment[] = useMemo(() => {
    return appointments
      .map((apt) => appointmentService.getPopulatedAppointment(apt))
      .filter((apt): apt is PopulatedAppointment => apt !== null);
  }, [appointments]);

  const getAppointmentsForSlot = (
    day: Date,
    slotStart: Date
  ): PopulatedAppointment[] => {
    return populatedAppointments.filter((apt) => {
      const aptStart = parseISO(apt.startTime);
      if (!isSameDay(aptStart, day)) return false;
      return (
        aptStart.getHours() === slotStart.getHours() &&
        aptStart.getMinutes() === slotStart.getMinutes()
      );
    });
  };

  return (
    <div className="week-view border border-gray-200 rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50 text-center">
            <th className="w-24 p-2 text-xs font-semibold text-gray-700 sticky left-0 bg-gray-50">
              Time
            </th>
            {weekDays.map((day, index) => (
              <th
                key={index}
                className="p-2 border-l border-gray-200 text-xs font-semibold text-gray-700 w-40 sm:w-auto"
              >
                <div className="font-bold">{format(day, 'EEE')}</div>
                <div className="text-gray-600 font-normal">
                  {format(day, 'MMM d')}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {timeSlots.map((slot, slotIndex) => (
            <tr key={slotIndex}>
              <td
                className="p-1 text-xs text-gray-500 w-24 align-top border-r border-gray-200 sticky left-0 bg-white"
                style={{ height: '48px' }}
              >
                {slot.label}
              </td>

              {weekDays.map((day, dayIndex) => {
                const slotAppointments = getAppointmentsForSlot(day, slot.start);
                return (
                  <td
                    key={dayIndex}
                    className="p-1 border-l border-gray-100 align-top"
                    style={{ height: '48px' }}
                  >
                    {slotAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="text-[10px] rounded p-0.5 mb-0.5 text-white overflow-hidden font-medium truncate"
                        style={{
                          backgroundColor:
                            APPOINTMENT_TYPE_CONFIG[apt.type].color,
                        }}
                        title={`${apt.patient.name} - ${
                          APPOINTMENT_TYPE_CONFIG[apt.type].label
                        }`}
                      >
                        {apt.patient.name}
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {populatedAppointments.length === 0 && (
        <div className="text-center text-gray-500 py-12 text-sm">
          No appointments scheduled for this week.
        </div>
      )}
    </div>
  );
}
