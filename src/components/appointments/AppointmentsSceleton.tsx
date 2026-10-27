import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

export const AppointmentsSkeleton: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={150} height={24} />
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Skeleton variant="rounded" width={120} height={40} />
        <Skeleton variant="rounded" width={120} height={40} />
        <Skeleton variant="rounded" width={120} height={40} />
      </Box>

      {/* Stepper items */}
      <Stack spacing={4}>
        {[1, 2, 3].map((month) => (
          <Box key={month}>
            {/* Month header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width={120} height={28} />
              <Skeleton variant="rounded" width={80} height={24} />
            </Box>

            {/* Appointment cards */}
            <Stack spacing={2} sx={{ ml: 5 }}>
              {[1, 2, 3].map((card) => (
                <Box
                  key={card}
                  sx={{
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="30%" height={16} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Skeleton variant="circular" width={16} height={16} />
                      <Skeleton variant="text" width={100} height={20} />
                    </Box>
                    <Skeleton variant="rounded" width={70} height={24} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
