import { Skeleton } from "@mui/material";
import { PageFooter } from "../components/PageFooter";

export const DashboardPage = () => {
  const loading = true;

  return (
    <div className="min-h-screen p-4 md:p-2" style={{ backgroundColor: '#f1f5f9' }}>
      {loading && (
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header Skeleton */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="space-y-2">
              <Skeleton variant="text" width={400} sx={{ fontSize: '3rem' }} />
              <Skeleton variant="text" width={300} sx={{ fontSize: '1rem' }} />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton variant="rectangular" height={30} width={30} sx={{borderRadius: "8px"}}/>
              <Skeleton variant="text" width={200} sx={{ fontSize: '2rem' }} />
            </div>
          </div>

          {/* User Profile Card Skeleton */}
          <div className="rounded-xl p-4 md:p-6 mb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton variant="circular" width={60} height={60} />
                <div className="space-y-2">
                  <Skeleton variant="text" width={400}  sx={{ fontSize: '1.5rem' }} />
                  <Skeleton variant="text" width={300} sx={{ fontSize: '1rem' }} />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg">
                  <Skeleton variant="circular" width={12} height={12} />
                  <Skeleton variant="text" width={80} sx={{ fontSize: '1rem' }} />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg">
                  <Skeleton variant="rectangular" height={18} width={18} sx={{borderRadius: "4px"}}/>
                  <Skeleton variant="text" width={100} sx={{ fontSize: '1rem' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
            {[1, 2, 3, 4].map((_, index) => (
              <div>
                <Skeleton variant="rectangular" height={120} sx={{borderRadius: "8px"}}/>
              </div>
            ))}
          </div>

          {/* Two Column Layout Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {/* Left Column - Chart and Table */}
            <div className="lg:col-span-2 flex flex-col justify-between h-full gap-2">
              {/* Chart Skeleton */}
              <Skeleton variant="rectangular" height={400} sx={{borderRadius: "8px"}}/>

              {/* Table Skeleton */}
              <Skeleton variant="rectangular" height={260} sx={{borderRadius: "8px"}}/>
            </div>

            {/* Right Column - Quick Actions & Activity Skeleton */}
            <div className="space-y-2">
              {/* Recent Activity Skeleton */}
              <Skeleton variant="rectangular" height={400} sx={{borderRadius: "8px"}}/>

              {/* Create New User Card Skeleton */}
              <Skeleton variant="rectangular" height={260} sx={{borderRadius: "8px"}}/>
            </div>
          </div>
        </div>
      )}
    <PageFooter role={"user"}/>  
    </div>
  );
};
