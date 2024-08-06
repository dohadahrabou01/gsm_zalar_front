import React, { useState, useEffect } from "react";
import { Box, Typography, Badge, IconButton } from "@mui/material";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';

const NotificationList = ({ notifications }) => {
  const [visibleNotifications, setVisibleNotifications] = useState(notifications);

  useEffect(() => {
    // Réinitialiser les notifications visibles à chaque montage du composant
    setVisibleNotifications(notifications);
  }, [notifications]);

  const handleClose = (id) => {
    setVisibleNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  if (!Array.isArray(notifications) || notifications.length === 0) {
    return (
      <Box sx={{ padding: "16px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        No notifications available
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "16px" }}>
      {visibleNotifications.map((notification) => (
        <Box
          key={notification.id}
          sx={{
            padding: "20px",
            margin: "12px 0",
            border: "1px solid #ddd",
            borderRadius: "16px",
            backgroundColor: '#E6E6FA	',
            backgroundImage: 'linear-gradient(135deg, #E6E6FA	 25%, #E6E6FA 100%)',
            color: '#333',
            boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            '&:hover': {
              transform: "scale(1.05)",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            
            </Box>
           
          </Box>
          <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: '1.5' }}>
            {notification.message}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default NotificationList;
