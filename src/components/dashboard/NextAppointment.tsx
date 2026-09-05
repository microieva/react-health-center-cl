import type { NextAppointment as Data} from "../../types"
import { ButtonPrimary } from "../ButtonPrimary"
import { DateStatusBadge } from "../DateStatusBadge"

export const NextAppointment = ({data}:{data: Data}) => {
  return (
    <div className="rounded-xl border p-4 md:p-6" style={{ backgroundColor: 'var(--color-white)', borderColor: 'var(--color-primary-light-gray)', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg" style={{ color: 'var(--color-primary-deep-blue)' }}>
            Next Appointment
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-primary-slate-gray)' }}>
            Upcoming scheduled appointment
          </p>
        </div>
        <DateStatusBadge timestamp={data.nextStart} />
      </div>

      {/* Patient Info */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b" style={{ borderColor: 'var(--color-primary-light-gray)' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style={{ backgroundColor: 'rgba(175, 111, 174, 0.1)', color: 'var(--color-accent-purple)' }}>
          {data?.patient?.firstName?.[0]}{data?.patient?.lastName?.[0]}
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--color-primary-deep-blue)' }}>
            {data?.patient?.firstName} {data?.patient?.lastName}
          </p>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <span style={{ color: 'var(--color-primary-slate-gray)' }}>
              DOB: {data?.patient?.dob ? new Date(data.patient.dob).toLocaleDateString() : 'N/A'}
            </span>
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--color-primary-medium-gray)' }} />
            <span style={{ color: 'var(--color-primary-slate-gray)' }}>
              Patient ID: {data?.patient?.id || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Appointment Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-light-blue)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--color-primary-slate-gray)' }}>
            Start Time
          </p>
          <p className="font-semibold text-sm" style={{ color: 'var(--color-primary-deep-blue)' }}>
            {data?.nextStart ? new Date(data.nextStart).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A'}
          </p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-light-blue)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--color-primary-slate-gray)' }}>
            End Time
          </p>
          <p className="font-semibold text-sm" style={{ color: 'var(--color-primary-deep-blue)' }}>
            {data?.nextEnd ? new Date(data.nextEnd).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Previous Appointment */}
      <div className="flex items-center gap-2 mb-4 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-primary-white)' }}>
        <span className="text-xs font-medium" style={{ color: 'var(--color-primary-slate-gray)' }}>
          Previous Appointment:
        </span>
        <span className="text-sm" style={{ color: 'var(--color-primary-deep-blue)' }}>
          {data?.previousAppointmentDate ? new Date(data.previousAppointmentDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }) : 'None'}
        </span>
      </div>

      {/* Messages Section */}
      <div className="space-y-2 mb-4">
        {/* Patient Message */}
        <div className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg-light-blue)' }}>
          <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--color-primary-slate-gray)' }}>
            Patient:
          </span>
          <span className="text-xs" style={{ color: 'var(--color-primary-deep-blue)' }}>
            {data?.patientMessage || 'No message from patient'}
          </span>
        </div>

        {/* Doctor Message */}
        <div className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg-light-blue)' }}>
          <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--color-primary-slate-gray)' }}>
            My Note:
          </span>
          <span className="text-xs" style={{ color: 'var(--color-primary-deep-blue)' }}>
            {data?.doctorMessage || '-'}
          </span>
        </div>
      </div>

      {/* Records Section */}
      <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--color-primary-light-gray)', backgroundColor: '#fafbfc' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: 'var(--color-primary-slate-gray)' }}>
              Associated Records:
            </span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-primary-deep-blue)' }}>
              {data?.recordIds?.length || 0}
            </span>
          </div>
          {data?.recordIds && data.recordIds.length > 0 ? (
            <button className="text-xs font-medium transition-colors hover:opacity-70" style={{ color: 'var(--color-accent-purple)' }}>
              View All
            </button>
          ) : (
            <span className="text-xs italic" style={{ color: 'var(--color-secondary-light-blue)' }}>
              No records attached
            </span>
          )}
        </div>
        {data?.recordIds && data.recordIds.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.recordIds.slice(0, 3).map((id, index) => (
              <span key={index} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--color-primary-light-gray)', color: 'var(--color-primary-dark-gray)' }}>
                Record #{id.slice(0, 8)}
              </span>
            ))}
            {data.recordIds.length > 3 && (
              <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--color-primary-light-gray)', color: 'var(--color-primary-slate-gray)' }}>
                +{data.recordIds.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <ButtonPrimary onClick={() => {}} className="flex-1 text-xs px-4">View Patient Profile</ButtonPrimary>
        <ButtonPrimary className="text-xs bg-transparent text-accent-purple)] hover:bg-[var(--color-accent-purple)] hover:text-[var(--color-primary-white)]">Reschedule</ButtonPrimary>
      </div>
    </div>
  )
}