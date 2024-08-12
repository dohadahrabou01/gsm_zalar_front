import * as React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import './Login.css';

const defaultTheme = createTheme();

export default function Forget() {
  const navigate = useNavigate();
  const apiUrl = `http://${window.location.hostname}:9000`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');

    try {
      // Appel à l'API pour vérifier l'email
      const response = await axios.get(`${apiUrl}/api/users/api/verify-email`, {
        params: { email }
      });
      
      if (response.status === 200) {
        // Si l'email existe, appeler l'API de réinitialisation du mot de passe
        const forgotPasswordResponse = await axios.post(`${apiUrl}/api/auth/forgot-password?email=${encodeURIComponent(email)}`);
        alert('Un lien de réinitialisation du mot de passe a été envoyé à votre email.');
        navigate('/Email');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('Email non trouvé');
      } else {
        console.error('Une erreur est survenue:', error);
        alert('Erreur lors de la vérification de l\'email');
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="lg" sx={{ marginTop: "50px" }}>
        <CssBaseline />
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={process.env.PUBLIC_URL + '/Assets/GSM3-removebg.png'}
              alt="Login"
              style={{ width: "70%", height: "auto", objectFit: 'cover' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: "80px" }}>
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: '400px',
                margin: 'auto',
                height: "230px"
              }}
            >
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  id="email"
                  label="Addresse Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#545454' },
                      '&:hover fieldset': { borderColor: '#545454' },
                      '&.Mui-focused fieldset': { borderColor: '#545454' },
                    },
                    '& .MuiInputLabel-root': { color: '#545454' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#545454' },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                  style={{ backgroundColor: "#228B22" }}
                >
                  Verifier
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
