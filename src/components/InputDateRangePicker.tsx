import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box } from '@mui/material';

const ACCENT_PURPLE = 'var(--color-accent-purple)';
const LIGHT_GRAY = 'var(--color-primary-light-gray)';
const SLATE_GRAY = 'var(--color-primary-slate-gray)';
const DEEP_BLUE = 'var(--color-primary-deep-blue)';

export const InputDateRangePicker = ({ value, onChange }:{value: any, onChange:any}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        value={value}
        onChange={onChange}
        slots={{ field: SingleInputDateRangeField }}
        slotProps={{
          textField: {
            size: 'small',
            label: 'Date range',
            sx: {
              //width: '100%',
              '& .MuiPickersOutlinedInput-root': {
                '& fieldset': {
                  borderColor: LIGHT_GRAY,
                  transition: 'border-color 0.2s ease'
                },
                '&:hover fieldset': {
                  borderColor: ACCENT_PURPLE,
                  transition: 'border-color 0.2s ease'
                },
                '&.Mui-focused fieldset': {
                  borderColor: `${ACCENT_PURPLE} !important`,
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                color: SLATE_GRAY,
                '&.Mui-focused': {
                  color: `${ACCENT_PURPLE} !important`,
                },
              },
              '& .MuiInputBase-input': {
                color: DEEP_BLUE,
              },
              '& .MuiIconButton-root': {
                color: SLATE_GRAY,
                '&:hover': {
                  color: ACCENT_PURPLE,
                },
              },
            },
          },
          popper: {
            sx: {
              '& .MuiPaper-root': {
                border: `1px solid ${LIGHT_GRAY}`,
              },
              '& .MuiPickersDay-root': {
                '&.Mui-selected': {
                  backgroundColor: `${ACCENT_PURPLE} !important`,
                  color: '#fff',
                },
              },
              '& .MuiDateRangePickerDay-rangeIntervalPreview': {
                borderColor: ACCENT_PURPLE,
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};