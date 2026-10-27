import { CalendarToday } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"

export const NoAppointmentsView = ({text}:{text:string}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 8,
        px: 4,
      }}
    >
      <CalendarToday sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
      <Typography variant="h6" style={{ color: 'var(--color-secondary-light-blue)'}}>
        No appointments found
      </Typography>
      <Typography variant="body2" style={{ color: 'var(--color-secondary-light-blue)'}}>
        {text}
      </Typography>
    </Box>
  )
}