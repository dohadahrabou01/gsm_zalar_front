import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ValidateUpdate = () => {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const apiUrl = `https://gsm-zalar-back1.onrender.com`;
  useEffect(() => {
    const validateUpdate = async () => {
      try {
        const response = await axios.put(`${apiUrl}/api/validate/${id}`);
        setMessage('User update has been validated successfully.');
      } catch (error) {
        setMessage('Failed to validate the user update.');
      }
    };

    validateUpdate();
  }, [id]);

  return (
    <div className="validate-update">
      <h1>Validation Update</h1>
      <p>{message}</p>
    </div>
  );
};

export default ValidateUpdate;
