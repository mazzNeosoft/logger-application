import React from 'react'
import { FormControl, InputLabel, Select, InputAdornment, IconButton, MenuItem } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const SelectField = ({ textLable, name, value, handleFields, formData, setFormData, removeQueryParam, dataArr }) => {
  return (
    <FormControl className='gap' size='small'>
      <InputLabel id="demo-simple-select-label">{textLable}</InputLabel>
      <Select
        name={name}
        value={value || ""}
        label={textLable}
        onChange={(e) => {
          handleFields(e);
        }}
        endAdornment={
          value && (
            <InputAdornment
              position="end"
              classes="iconButton"
            >
              <IconButton
                size="small"
                classes="iconButton"
                onClick={() => {
                  setFormData({ ...formData, name: "" });
                  removeQueryParam(name);
                }}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }
      >
        <MenuItem value="" disabled>Please select</MenuItem>
        {
          dataArr?.map((i) => (
            <MenuItem key={i} value={i}>{i}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  )
}

export default SelectField
