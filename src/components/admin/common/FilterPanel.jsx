import React, { useState } from 'react';
import { 
  Filter, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { 
  TextField,
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  Box,
  Chip,
  Button,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import './FilterPanel.css';

const FilterPanel = ({ 
  filters = [], 
  onApplyFilters, 
  onResetFilters,
  initialValues = {},
  isExpanded = false
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [filterValues, setFilterValues] = useState(initialValues);

  const hasActiveFilters = Object.keys(filterValues).length > 0 && 
    Object.values(filterValues).some(value => 
      value !== '' && value !== false && value !== null && value !== undefined
    );

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleInputChange = (id, value) => {
    setFilterValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filterValues);
  };

  const handleResetFilters = () => {
    setFilterValues({});
    onResetFilters();
  };

  const renderFilterInput = (filter) => {
    const { id, type, options, placeholder, label } = filter;
    const value = filterValues[id] || '';

    switch (type) {
      case 'text':
        return (
          <TextField
            id={id}
            label={label}
            value={value}
            onChange={(e) => handleInputChange(id, e.target.value)}
            placeholder={placeholder || ''}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: value ? (
                <InputAdornment position="end">
                  <ClearIcon 
                    fontSize="small" 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleInputChange(id, '')}
                  />
                </InputAdornment>
              ) : null
            }}
          />
        );
      
      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select
              labelId={`${id}-label`}
              id={id}
              value={value}
              onChange={(e) => handleInputChange(id, e.target.value)}
              label={label}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    marginTop: 8,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }
                },
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left'
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left'
                },
                disablePortal: true
              }}
            >
              <MenuItem value="">
                <em>{placeholder || 'None'}</em>
              </MenuItem>
              {options && options.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case 'date':
        return (
          <TextField
            type="date"
            id={id}
            label={label}
            value={value || ''}
            onChange={(e) => handleInputChange(id, e.target.value)}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        );
      
      case 'daterange': {
        const [startDate, endDate] = value ? value.split('|') : ['', ''];
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              type="date"
              value={startDate || ''}
              onChange={(e) => handleInputChange(id, `${e.target.value}|${endDate}`)}
              size="small"
              label="From"
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
            <Box sx={{ mx: 0.5 }}></Box>
            <TextField
              type="date"
              value={endDate || ''}
              onChange={(e) => handleInputChange(id, `${startDate}|${e.target.value}`)}
              size="small"
              label="To"
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
          </Stack>
        );
      }
      
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={value === true}
                onChange={(e) => handleInputChange(id, e.target.checked)}
                name={id}
                color="primary"
                size="small"
              />
            }
            label={label}
          />
        );
      
      case 'radio':
        return (
          <FormControl component="fieldset">
            <RadioGroup
              value={value}
              onChange={(e) => handleInputChange(id, e.target.value)}
              name={id}
            >
              {options && options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option.value}
                  control={<Radio size="small" />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`filter-panel ${expanded ? 'expanded' : ''} ${hasActiveFilters ? 'has-active-filters' : ''}`}>
      <div className="filter-panel-header" onClick={handleToggleExpand}>
        <div className="filter-panel-title">
          <Filter size={18} className="filter-icon" />
          <span>Filters</span>
          {hasActiveFilters && (
            <Chip 
              label={Object.keys(filterValues).filter(key => filterValues[key]).length} 
              size="small" 
              color="primary"
              className="active-filters-chip"
            />
          )}
        </div>
        <button 
          className="filter-expand-button" 
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse filters" : "Expand filters"}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      {expanded && (
        <>
          <div className="filter-panel-content">
            {filters.map((filter, index) => (
              <div key={index} className="filter-field">
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
          
          <div className="filter-panel-actions">
            <Button 
              variant="outlined" 
              onClick={handleResetFilters} 
              className="filter-reset-button"
              size="medium"
            >
              Reset
            </Button>
            <Button 
              variant="contained" 
              onClick={handleApplyFilters} 
              className="filter-apply-button"
              size="medium"
            >
              Apply Filters
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterPanel;