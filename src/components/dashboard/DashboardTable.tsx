import { MoreVertical, UserCircle } from "lucide-react"
import { getStatusColor } from "../../utils/utils"

export const DashboardTable = () => {

    const doctorContracts = [
      {
        name: 'Dr. Emily Williams',
        specialty: 'Cardiology',
        created: '2024-01-20 09:30:00',
        status: 'Active',
      },
      {
        name: 'Dr. Michael Chen',
        specialty: 'Neurology',
        created: '2024-01-18 14:15:00',
        status: 'Pending',
      },
      {
        name: 'Dr. Sarah Thompson',
        specialty: 'Pediatrics',
        created: '2024-01-15 11:45:00',
        status: 'Active',
      },
      {
        name: 'Dr. James Rodriguez',
        specialty: 'Orthopedics',
        created: '2024-01-12 16:20:00',
        status: 'Expired',
      },
      {
        name: 'Dr. Lisa Park',
        specialty: 'Dermatology',
        created: '2024-01-10 10:00:00',
        status: 'Active',
      },
    ];
    
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: '#e2e8f0'
      }}
    >
      <div className="p-4 md:p-2 border-b flex items-center justify-between" style={{ borderColor: '#e2e8f0' }}>
        <div>
          <h3 className="font-semibold text-lg" style={{ color: '#0f172a' }}>
            Latest Doctor Contracts
          </h3>
          <p className="text-sm" style={{ color: '#64748b' }}>
            Recently signed and pending contracts
          </p>
        </div>
        <button className="text-sm font-medium transition-all duration-200 hover:opacity-70" style={{ color: '#af6faee6' }}>
          View All
        </button>
      </div>

      <div className="divide-y" style={{ borderColor: '#e2e8f0' }}>
        {doctorContracts.map((contract, index) => (
          <div key={index} className="px-2 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-3xl">
                <UserCircle className="w-6 h-6 text-[var(--primary-deep-blue)] opacity-60"/>
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--color-primary-slate-gray)' }}>
                  {contract.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: '#64748b' }}>
                    {contract.specialty}
                  </span>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#cbd5e1' }} />
                  <span className="text-xs" style={{ color: '#94a3b8' }}>
                    {contract.created}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                {contract.status}
              </span>
              <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <MoreVertical className="w-4 h-4" style={{ color: '#94a3b8' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}