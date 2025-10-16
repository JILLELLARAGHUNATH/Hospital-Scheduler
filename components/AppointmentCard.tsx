import React from 'react';
import { APPOINTMENT_TYPE_CONFIG, PopulatedAppointment } from '@/types';
import { differenceInMinutes } from 'date-fns';

interface AppointmentCardProps {
  appointment: PopulatedAppointment;
}

/**
 * AppointmentCard: Renders a single appointment with correct color and height.
 */
export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const config = APPOINTMENT_TYPE_CONFIG[appointment.type];

  const duration = differenceInMinutes(
    new Date(appointment.endTime),
    new Date(appointment.startTime)
  );

  return (
    <div
      className="rounded p-1 text-white z-10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
      style={{
        backgroundColor: config.color,
        height: '100%',
      }}
      title={`${appointment.patient.name} - ${config.label} (${duration} min)`}
    >
      <div className="font-medium text-[11px] truncate leading-tight">
        {appointment.patient.name}
      </div>
      <div className="text-[10px] opacity-90 leading-tight">
        {config.label} ({duration} min)
      </div>
    </div>
  );
}
