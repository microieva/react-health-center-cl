import React, { useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { Appointment } from '../types';

interface InputAutocompleteProps {
  appointments: Appointment[];
  value: string | null;
  onChange: (patientId: string | null) => void;
  label: string;
  disabled?: boolean;
}

export const InputAutocomplete: React.FC<InputAutocompleteProps> = ({
  appointments,
  value,
  onChange,
  label,
  disabled = false,
}) => {

  const patientMap = useMemo(() => {
    const map = new Map<string, string>();

    appointments.forEach((appointment) => {
      const patient = appointment?.patient;
      if (!patient?.id) return;

      const fullName = `${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim();
      if (!fullName) return;

      if (!map.has(patient.id)) {
        map.set(patient.id, fullName);
      }
    });

    return map;
  }, [appointments]);

  const options = useMemo(() => {
    return Array.from(patientMap.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [patientMap]);

  const selectedOption = useMemo(() => {
    if (!value) return null;
    return options.find((opt) => opt.id === value) ?? null;
  }, [value, options]);

  return (
    <Autocomplete
      options={options}
      value={selectedOption}
      onChange={(_, newValue) => {
        onChange(newValue?.id ?? null);
      }}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          size="small"
        />
      )}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'var(--color-primary-light-gray)',
          },
          '&:hover fieldset': {
            borderColor: 'var(--color-accent-purple)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'var(--color-accent-purple)',
            borderWidth: '2px',
          },
          '& .MuiIconButton-root': {
            '&:hover': {
              color: 'var(--color-accent-purple)',
            },
          },
        },

        '& .MuiInputLabel-root': {
          color: 'var(--color-primary-slate-gray)',
          '&:hover': {
            color: 'var(--color-accent-purple)',
          },
          '&.Mui-focused': {
            color: 'var(--color-accent-purple)',
          },
        },

        '& .MuiOutlinedInput-input': {
          color: 'var(--color-primary-deep-blue)',
        },

        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--color-primary-light-gray)',
        },
      }}
    />
  );
};