import React, { useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import axios from 'axios';

function WithLabelExample() {
  const [percentage, setPercentage] = useState(0);
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchPercentage = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${apiUrl}/api/terminals/pourcentage-affectation`, config);
        // Arrondir le pourcentage à l'entier le plus proche
        setPercentage(Math.round(response.data));
      } catch (error) {
        console.error('There was an error fetching the percentage!', error);
      }
    };

    fetchPercentage();
  }, []); // Assurez-vous que le tableau de dépendances est correct

  return (
    <ProgressBar
      variant="success"
      now={percentage}
      label={`${percentage}%`}
      style={{ height: '1rem' }} // Optionnel : pour ajuster la hauteur de la barre
    />
  );
}

export default WithLabelExample;
