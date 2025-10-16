import React from 'react';
import { ScheduleView } from '@/components/ScheduleView';

/**
 * Schedule Page - Main Entry Point
 */
export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 pt-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Hospital Appointment Schedule
          </h1>
          <p className="text-gray-600">
            Manage doctor schedules in day and week views
          </p>
        </header>
        <ScheduleView />
      </div>
    </main>
  );
}
