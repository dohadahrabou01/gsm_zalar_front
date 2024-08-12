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
import { useEffect } from 'react'; 
const defaultTheme = createTheme();

export default function Reset() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Supprimer les éléments spécifiques du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  
  }, []); 
  const token = new URLSearchParams(window.location.search).get('token');
  const apiUrl = `http://${window.location.hostname}:9000`;
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = data.get('password');
    const confirmPassword = data.get('confirmPassword');

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (newPassword === confirmPassword) {
        try {
            const response = await axios.post(`${apiUrl}/api/auth/reset-password`, {
                token,
                newPassword
            });
            alert(response.data);
            navigate('/'); // Rediriger vers la page de connexion
        } catch (error) {
            console.error("Erreur lors de la réinitialisation du mot de passe:", error);
            alert("Échec de la réinitialisation du mot de passe.");
        }
    } else {
        alert("Les mots de passe ne correspondent pas.");
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
          <Grid item xs={12} sm={6} sx={{ marginTop: "65px" }}>
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: '400px',
                margin: 'auto',
                height: "300px"
              }}
            >
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  name="password"
                  label="Nouveau Mot de Passe"
                  type="password"
                  id="password"
                  autoComplete="current-password"
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
                <TextField
                  margin="normal"
                  name="confirmPassword"
                  label="Confirmer Mot de Passe"
                  type="password"
                  id="confirmPassword"
                  autoComplete="current-password"
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
                  Modifier
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
