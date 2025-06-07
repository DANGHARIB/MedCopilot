import React from 'react';
import { 
  Paper, 
  Box, 
  Chip, 
  Typography, 
  Button, 
  ButtonGroup,
  Badge
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import './BulkActionBar.css';

const BulkActionBar = ({ 
  selectedCount, 
  actions = [], 
  onClearSelection,
  isVisible = true
}) => {
  
  if (!isVisible || selectedCount === 0) {
    return null;
  }

  return (
    <Paper className="bulk-action-bar-mui" elevation={4}>
      <Box className="bulk-action-info">
        <Box display="flex" alignItems="center" gap={1.5}>
          <Badge
            badgeContent={selectedCount}
            color="primary"
            classes={{
              badge: "selection-count-badge"
            }}
          >
            <Box className="count-icon-bg" />
          </Badge>
          <Typography variant="body2" className="count-text">
            {selectedCount > 1 ? 'items selected' : 'item selected'}
          </Typography>
        </Box>
        
        <Button
          variant="text"
          size="small"
          startIcon={<CloseIcon fontSize="small" />}
          onClick={onClearSelection}
          className="clear-selection-button"
        >
          Clear selection
        </Button>
      </Box>
      
      <Box className="bulk-action-buttons">
        <ButtonGroup variant="contained" size="small">
          {actions.map((action, index) => {
            // Determine button color
            let color = "primary";
            if (action.type === "danger") color = "error";
            else if (action.type === "success") color = "success";
            else if (action.type === "warning") color = "warning";
            
            return (
              <Button 
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                color={color}
                className={`bulk-action-mui-button ${action.type || 'default'}`}
                startIcon={action.icon}
              >
                {action.label}
              </Button>
            );
          })}
        </ButtonGroup>
      </Box>
    </Paper>
  );
};

export default BulkActionBar;