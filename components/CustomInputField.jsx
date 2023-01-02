import React, { useState } from 'react'
import { TextField, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';


const CustomInputField = ({ name, formData, setFormData, removeQueryParam, handleFields, value, textLabel }) => {
  return (
    <TextField
      className='gap'
      name={name}
      type="number"
      label={textLabel}
      size='small'
      value={value || ""}
      variant="outlined"
      onChange={(e) => {
        handleFields(e);
      }}
      InputProps={
        value ? {
          endAdornment: (
            <IconButton
              size="small"
              aria-label="toggle password visibility"
              onClick={() => {
                setFormData({ ...formData, name: "" });
                removeQueryParam(name);
              }}
              edge="end"
            >
              <ClearIcon />
            </IconButton>
          ),
        } : {}
      }
    />
  )
}

export default CustomInputField
