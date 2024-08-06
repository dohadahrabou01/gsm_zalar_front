import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import axios from "axios";
import NotificationList from './NotificationList'; // Adjust the path if necessary
import { BlogCard, SalesOverview ,DailyActivities} from "./dashboard1-components";
import { addNotification } from 'react-push-notification';


const Admin = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token'); // Adjust token retrieval as needed
  const expired = localStorage.getItem('expirationTime');
  const currentTime = new Date().getTime();
  useEffect(() => {
    if (token) {
      axios.get('http://localhost:8089/api/notifications/ongoing', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Notifications data:', response.data);
        console.log('expired:',expired);
        console.log('time:',currentTime);
        setNotifications(response.data);
        response.data.forEach(notification => {
          addNotification({
            title: 'Affectation En Attente',
            message: notification.message,
            theme: 'light'
          });
        });
      })
      .catch(error => {
        console.error('There was an error fetching the notifications!', error);
      });
    } else {
      console.error('No token found');
    }
  }, [token]);


  return (
    <Box sx={{ marginTop: "70px" }}>
      <NotificationList notifications={notifications} />
      <Grid container spacing={0}>
      <Grid container spacing={2}> {/* Utilise spacing pour définir l'espacement */}
      <Grid item xs={12} sm={9} md={7} lg={6}>
        <Box sx={{ padding: '6px', borderRadius: '4px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <SalesOverview />
        </Box>
      </Grid>
      <Grid item xs={12} sm={9} md={7} lg={6}> {/* Assure-toi que le DailyActivities est aussi dans un Grid item */}
        <Box sx={{ padding: '6px',height:"310px", borderRadius: '4px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <DailyActivities />
        </Box>
      </Grid>
    </Grid>
        <Grid item xs={12} lg={12}>
          <BlogCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Admin;
