import type { Appointment as Data} from "../../types"
import { useAuth } from "../../utils/AuthProvider";
import { getTimeDuration } from "../../utils/utils";
import { ButtonPrimary } from "../ButtonPrimary"
import { DateStatusBadge } from "../DateStatusBadge"

export const Appointment = ({data, primaryTitle, secondaryTitle}:{data: Data, primaryTitle: string, secondaryTitle: string}) => {
  const {currentUser} = useAuth();

  const PatientInfo = () => {
    return (
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
    )
  }
  const DoctorInfo = () => {
    return (
      <div className="flex items-center gap-4 mb-4 pb-4 border-b" style={{ borderColor: 'var(--color-primary-light-gray)' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style={{ backgroundColor: 'rgba(175, 111, 174, 0.1)', color: 'var(--color-accent-purple)' }}>
          {data?.doctor?.firstName?.[0]}{data?.doctor?.lastName?.[0]}
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--color-primary-deep-blue)' }}>
            Dr., {data?.doctor?.firstName} {data?.doctor?.lastName}
          </p>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <span style={{ color: 'var(--color-primary-slate-gray)' }}>
              Appointment Duration: {getTimeDuration(data.start, data.end)}
            </span>
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--color-primary-medium-gray)' }} />
            <span style={{ color: 'var(--color-primary-slate-gray)' }}>
              Doctor ID: {data?.doctor?.id || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div 
      className="rounded-xl border p-4 md:p-6 " 
      style={{ 
        backgroundColor: 'var(--color-white)', 
        borderColor: 'var(--color-primary-light-gray)', 
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)', 
        minWidth:"50vw" 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg" style={{ color: 'var(--color-primary-deep-blue)' }}>
            {primaryTitle}
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-primary-slate-gray)' }}>
            {secondaryTitle}
          </p>
        </div>
        {<DateStatusBadge timestamp={!!data.doctor ? data.start : undefined} />}
      </div>

      {currentUser?.userRole === 'doctor' ? <PatientInfo /> : <DoctorInfo />}
      

      {/* Appointment Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-light-blue)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--color-primary-slate-gray)' }}>
            Start Time
          </p>
          <p className="font-semibold text-sm" style={{ color: 'var(--color-primary-deep-blue)' }}>
            {data?.start ? new Date(data.start).toLocaleString('en-US', {
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
            {data?.end ? new Date(data.end).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Appointment dates */}
      <div className="flex items-center gap-2 mb-4 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-primary-white)' }}>
        {!data.doctor ? <span className="text-xs font-medium" style={{ color: 'var(--color-primary-slate-gray)' }}>
          Appointment Request Created On:
        </span> : <span className="text-xs font-medium" style={{ color: 'var(--color-primary-slate-gray)' }}>
          Appointment Created On:
        </span>}
        <span className="text-sm" style={{ color: 'var(--color-primary-deep-blue)' }}>
          {data?.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'None'}
        </span>
      </div>
      {data?.updatedAt && <div className="flex items-center gap-2 mb-4 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-primary-white)' }}>
        {data.doctor && <span className="text-xs font-medium" style={{ color: 'var(--color-primary-slate-gray)' }}>
          Appointment Confirmed:
        </span> }
        <span className="text-sm" style={{ color: 'var(--color-primary-deep-blue)' }}>
          {new Date(data.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>}

      {/* Messages Section */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg-light-blue)' }}>
          {currentUser?.userRole === 'doctor' ? <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--color-primary-slate-gray)' }}>
            Patient:
          </span> : <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--color-primary-slate-gray)' }}>
            Doctor:
          </span>}
          {currentUser?.userRole === 'doctor' ? <span className="text-xs" style={{ color: data?.patientMessage ? 'var(--color-primary-deep-blue)':'var(--color-secondary-light-blue)' }}>
            {data?.patientMessage || 'No message from patient'}
          </span> : <span className="text-xs" style={{ color: data?.doctorMessage ? 'var(--color-primary-deep-blue)':'var(--color-secondary-light-blue)' }}>
            {data?.doctorMessage || 'No message from doctor'}
          </span>}
        </div>

        {/* Doctor Message */}
        <div className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg-light-blue)' }}>
          <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--color-primary-slate-gray)' }}>
            My Note:
          </span>
          {currentUser?.userRole === 'doctor' ? <span className="text-xs" style={{ color: 'var(--color-primary-deep-blue)' }}>
            {data?.doctorMessage || '-'}
          </span> : <span className="text-xs" style={{ color: 'var(--color-primary-deep-blue)' }}>
            {data?.patientMessage || '-'}
          </span>}
        </div>
      </div>

      {/* Records Section */}
      <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--color-primary-light-gray)', backgroundColor: '#fafbfc' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: 'var(--color-primary-slate-gray)' }}>
              Medical Record:
            </span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-primary-deep-blue)' }}>
              {data?.recordId || 0}
            </span>
          </div>
          {data?.recordId ? (
            <button className="text-xs font-medium transition-colors hover:opacity-70" style={{ color: 'var(--color-accent-purple)' }}>
              View
            </button>
          ) : (
            <span className="text-xs italic" style={{ color: 'var(--color-secondary-light-blue)' }}>
              No record 
            </span>
          )}
        </div>
        {data?.recordId && (
          <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--color-primary-light-gray)', color: 'var(--color-primary-dark-gray)' }}>
                Record #{data.recordId}
              </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <ButtonPrimary onClick={() => {}} className="flex-1 text-xs px-4 text-primary-white  hover:bg-transparent hover:text-accent-purple">View Patient Profile</ButtonPrimary>
        <ButtonPrimary className="text-xs bg-transparent text-accent-purple hover:bg-accent-purple hover:text-primary-white">Reschedule</ButtonPrimary>
      </div>
    </div>
  )
}