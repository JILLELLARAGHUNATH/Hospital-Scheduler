'use client';
import React from 'react';
import type { Doctor, Specialty } from '@/types';

interface DoctorSelectorProps {
  allDoctors: Doctor[];
  selectedDoctorId: string | null;
  onDoctorChange: (doctorId: string) => void;
}

/**
 * DoctorSelector Component
 */
export function DoctorSelector({
  allDoctors,
  selectedDoctorId,
  onDoctorChange,
}: DoctorSelectorProps) {

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDoctorChange(e.target.value);
  };

  return (
    <div className="doctor-selector flex items-center gap-2">
      <label htmlFor="doctor-select" className="sr-only">
        Select Doctor
      </label>
      <select
        id="doctor-select"
        value={selectedDoctorId || ''}
        onChange={handleSelectionChange}
        className="block px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select a doctor...
        </option>
        {allDoctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            Dr. {doctor.name} - {doctor.specialty}
          </option>
        ))}
      </select>
    </div>
  );
}