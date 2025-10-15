'use client';
import { useState, useEffect, useMemo } from 'react';
import type { Appointment, Doctor, CalendarView } from '@/types';
import { appointmentService } from '@/services/appointmentService';
import { startOfWeek, endOfWeek, getDay } from 'date-fns';

/**
 * useAppointments (Headless Logic Hook)
 */
export function useAppointments(
  selectedDoctorId: string | null,
  selectedDate: Date,
  view: CalendarView = 'day'
) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const doctor = useMemo(() => {
    if (!selectedDoctorId) return undefined;
    return appointmentService.getDoctorById(selectedDoctorId);
  }, [selectedDoctorId]);

  useEffect(() => {
    if (!selectedDoctorId) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let fetchedAppointments: Appointment[] = [];

      if (view === 'day') {
        fetchedAppointments = appointmentService.getAppointmentsByDoctorAndDate(
          selectedDoctorId,
          selectedDate
        );
      } else {
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

        fetchedAppointments = appointmentService.getAppointmentsByDoctorAndDateRange(
          selectedDoctorId,
          weekStart,
          weekEnd
        );
      }

      setAppointments(fetchedAppointments);
    } catch (e: any) {
      console.error("Error fetching appointments:", e);
      setError(e);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDoctorId, selectedDate, view]);

  return {
    appointments,
    doctor,
    loading,
    error,
    allDoctors: appointmentService.getDoctors(),
  };
}