import React, { useState, useEffect } from "react";
import { Box, Typography, Badge, IconButton } from "@mui/material";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
const NotificationList = ({ notifications }) => {
  const [visibleNotifications, setVisibleNotifications] = useState(notifications);
  const navigate = useNavigate();

  useEffect(() => {
    // Limiter les notifications visibles à 4
    const limitedNotifications = notifications.slice(0,1);
    setVisibleNotifications(limitedNotifications);
  }, [notifications]);

  const handleClose = (id) => {
    setVisibleNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };
  const handleNotificationClick = () => {
    // Rediriger vers la page contenant toutes les notifications
    navigate('/notifications');
  };
  

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
          onClick={handleNotificationClick} 
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge badgeContent="New"  sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#4B0082',
                    color: '#ffffff',
                  },
                  marginRight: '16px',
                }}>
                <NotificationsActiveIcon sx={{ marginRight: '16px', color: '#1976d2',color:"#4B0082"  }} />
              </Badge>
              <Typography variant="h6" sx={{ marginBottom: "8px", fontWeight: 'bold',color:"#4B0082"  }}>
                Affectation Terminal En Attente
              </Typography>
            </Box>
            <IconButton size="small" aria-label="close" onClick={() => handleClose(notification.id)}>
              <CloseIcon />
            </IconButton>
          </Box>
         
        </Box>
      ))}
    </Box>
  );
};

export default NotificationList;
