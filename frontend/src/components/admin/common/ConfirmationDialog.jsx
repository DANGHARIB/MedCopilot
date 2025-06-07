import React, { useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  IconButton, 
  Typography, 
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  ErrorOutline as ErrorIcon,
  WarningAmber as WarningIcon,
  InfoOutlined as InfoIcon,
  CheckCircleOutline as SuccessIcon
} from '@mui/icons-material';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'danger',
  onConfirm,
  onCancel,
  icon = null
}) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling when dialog is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling when dialog is closed
      document.body.style.overflow = '';
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Render icon based on type
  const renderIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'danger':
        return <ErrorIcon fontSize="large" className="icon-danger" />;
      case 'warning':
        return <WarningIcon fontSize="large" className="icon-warning" />;
      case 'info':
        return <InfoIcon fontSize="large" className="icon-info" />;
      case 'success':
        return <SuccessIcon fontSize="large" className="icon-success" />;
      default:
        return null;
    }
  };

  // Get color based on type
  const getColorByType = () => {
    switch (type) {
      case 'danger':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="xs"
      fullWidth
      classes={{
        paper: `confirmation-dialog-paper dialog-${type}`
      }}
    >
      <Box position="absolute" top={8} right={8}>
        <IconButton 
          aria-label="close" 
          onClick={onCancel}
          size="small"
          className="dialog-close-button"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <Box display="flex" flexDirection="column" alignItems="center" pt={3} pb={1}>
        <Box className={`dialog-icon-container icon-${type}`}>
          {renderIcon()}
        </Box>
      </Box>
      
      <DialogTitle id="confirmation-dialog-title" className="dialog-title">
        {title}
      </DialogTitle>
      
      <DialogContent>
        <Typography 
          id="confirmation-dialog-description" 
          variant="body2" 
          className="dialog-message"
        >
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions className="dialog-actions">
        <Button 
          onClick={onCancel} 
          variant="outlined" 
          size="medium"
          className="cancel-button"
        >
          {cancelLabel}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={getColorByType()} 
          size="medium"
          autoFocus
          className={`confirm-button ${type}`}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;