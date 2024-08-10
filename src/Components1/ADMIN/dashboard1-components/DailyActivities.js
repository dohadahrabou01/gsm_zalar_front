import React from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import axios from 'axios';

const StatusCard = ({ title, count, color }) => (
  <Card variant="outlined" sx={{ textAlign: 'center', width: 150, margin: 1 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={50}
          sx={{ color: color, margin: '0 4px' }}
        />
        <CircularProgress
          variant="determinate"
          value={count}
          size={50}
          sx={{ color: color, position: 'absolute' }}
        />
      </Box>
      <Typography variant="h6" sx={{ mt: 1 }}>
        {count}
      </Typography>
    </CardContent>
  </Card>
);

const AffectedStatuses = () => {
  const [statusCounts, setStatusCounts] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Remplacez par la méthode de récupération du token
const response = await axios.get(`${apiUrl}/api/afterminals/all`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


        const data = response.data;
        const counts = data.reduce((acc, item) => {
          acc[item.validation] = (acc[item.validation] || 0) + 1;
          return acc;
        }, {});

        setStatusCounts(counts);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap' }}>
      <Typography
        variant="h6"
        component="h6"
        sx={{
          marginTop: "35px",
          fontWeight: 'bold',
          color: '#4B0082',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          mb: 2,
        }}
      >
        Etat Des Affectations Des Terminaux
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <StatusCard
          title="Validée"
          count={statusCounts.VALIDEE || 0}
          color="success.main"
        />
        <StatusCard
          title="En cours"
          count={statusCounts.ENCOURS || 0}
          color="warning.main"
        />
        <StatusCard
          title="Rejetée"
          count={statusCounts.REJECTED || 0}
          color="error.main"
        />
      </Box>
    </Box>
  );
};

export default AffectedStatuses;
