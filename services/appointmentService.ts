import {
  MOCK_DOCTORS,
  MOCK_APPOINTMENTS,
  getDoctorById,
  getPatientById,
} from '@/data/mockData';
import type { Appointment, Doctor, Patient, PopulatedAppointment } from '@/types';
import { startOfDay, endOfDay } from 'date-fns';

/**
 * AppointmentService class (Data Layer)
 */
export class AppointmentService {
  getDoctors(): Doctor[] {
    return MOCK_DOCTORS;
  }

  getDoctorById(id: string): Doctor | undefined {
    return getDoctorById(id);
  }

  getPatientById(id: string): Patient | undefined {
    return getPatientById(id);
  }

  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return MOCK_APPOINTMENTS
      .filter((a) => a.doctorId === doctorId)
      .sort(
        (x, y) =>
          new Date(x.startTime).getTime() - new Date(y.startTime).getTime()
      );
  }

  getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[] {
    const start = startOfDay(date);
    const end = endOfDay(date);

    return MOCK_APPOINTMENTS.filter((a) => {
      if (a.doctorId !== doctorId) return false;
      const aptStart = new Date(a.startTime);
      return aptStart >= start && aptStart <= end;
    }).sort(
      (x, y) =>
        new Date(x.startTime).getTime() - new Date(y.startTime).getTime()
    );
  }

  getAppointmentsByDoctorAndDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ): Appointment[] {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    return MOCK_APPOINTMENTS.filter((a) => {
      if (a.doctorId !== doctorId) return false;
      const aptStart = new Date(a.startTime);
      return aptStart >= start && aptStart <= end;
    }).sort(
      (x, y) =>
        new Date(x.startTime).getTime() - new Date(y.startTime).getTime()
    );
  }

  getPopulatedAppointment(appointment: Appointment): PopulatedAppointment | null {
    const patient = this.getPatientById(appointment.patientId);
    const doctor = this.getDoctorById(appointment.doctorId);

    if (!patient || !doctor) return null;

    return {
      ...appointment,
      patient,
      doctor,
    };
  }
}

export const appointmentService = new AppointmentService();
