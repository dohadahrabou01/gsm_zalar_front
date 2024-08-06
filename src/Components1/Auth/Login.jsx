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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import './Login.css';
import { useEffect, useState } from 'react';

const defaultTheme = createTheme();

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function SignIn({ onLogin }) {
  const [value, setValue] = React.useState(0);
  const [error, setError] = React.useState('');
  const [emailError, setEmailError] = React.useState(''); // Erreur pour le champ email
  const [passwordError, setPasswordError] = React.useState(''); // Erreur pour le champ mot de passe
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    setEmailError('');
    setPasswordError('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8089/api/auth/signin', { email, password });
      console.log('Réponse de connexion:', response.data);

      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('email', email);

      const tokenData = { token, role, email };
      onLogin(tokenData);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError('Identifiants incorrects. Veuillez réessayer.');
      if (error.response && error.response.data) {
        // Assigner des messages d'erreur spécifiques pour chaque champ
        setEmailError('Adresse email invalide.');  // Modifier selon le message d'erreur reçu
        setPasswordError('Mot de passe incorrect.');  // Modifier selon le message d'erreur reçu
      }
    }
  };

  const handleForgotPasswordClick = () => {
    navigate('/forget');
  };

  const handleBeneficiaireSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const code = data.get('code');
    
    // Store the code in localStorage
    localStorage.setItem('code', code);
    
    // Redirect to /beneficiaire
    navigate('/beneficiaire');
  };
  useEffect(() => {
    // Supprimer les éléments spécifiques du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  
  }, []); 
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="lg" sx={{ marginTop: "50px" }}>
        <CssBaseline />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example">
            <Tab label="Login" {...a11yProps(0)} />
            <Tab label="Beneficiaire" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={process.env.PUBLIC_URL + '/Assets/GSM3-removebg.png'}
                alt="Login"
                style={{ width: "70%", height: "auto", objectFit: 'cover' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ marginTop: "35px" }}>
              <Box
                sx={{
                  backgroundColor: '#FFFFFF',
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: 3,
                  maxWidth: '400px',
                  margin: 'auto',
                  height: "380px"
                }}
              >
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                {error && (
                    <Typography color="error" style={{ display: 'flex', justifyContent: 'center' }}>
                      {error}
                    </Typography>
                  )}
                 
                 
                  <TextField
                    margin="normal"
                    id="email"
                    label="Adresse Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    fullWidth
                    error={!!emailError} // Déterminer si une erreur doit être affichée
                    helperText={emailError} // Afficher le texte d'erreur
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: emailError ? '#B22222' : '#545454' },  // Bordure rouge en cas d'erreur
                        '&:hover fieldset': { borderColor: emailError ? '#B22222' : '#545454' },
                        '&.Mui-focused fieldset': { borderColor: emailError ? '#B22222' : '#545454' },
                      },
                      '& .MuiInputLabel-root': { color: emailError ? '#B22222' : '#545454' },
                      '& .MuiInputLabel-root.Mui-focused': { color: emailError ? '#B22222' : '#545454' },
                    }}
                  />
                  <TextField
                    margin="normal"
                    name="password"
                    label="Mot De Passe"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    fullWidth
                    error={!!passwordError} // Déterminer si une erreur doit être affichée
                    helperText={passwordError} // Afficher le texte d'erreur
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: passwordError ? '#B22222' : '#545454' },  // Bordure rouge en cas d'erreur
                        '&:hover fieldset': { borderColor: passwordError ? '#B22222' : '#545454' },
                        '&.Mui-focused fieldset': { borderColor: passwordError ? '#B22222' : '#545454' },
                      },
                      '& .MuiInputLabel-root': { color: passwordError ? '#B22222' : '#545454' },
                      '& .MuiInputLabel-root.Mui-focused': { color: passwordError ? '#B22222' : '#545454' },
                    }}
                  />
                 
                  <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <p
                      variant="body2"
                      style={{ color: "#B22222", cursor: 'pointer', marginLeft: "auto" }}
                      onClick={handleForgotPasswordClick}
                    >
                      Mot De Passe Oublié
                    </p>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    style={{ backgroundColor: "#228B22" }}
                  >
                    Se connecter
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={process.env.PUBLIC_URL + '/Assets/GSM3-removebg.png'}
                alt="Beneficiaire"
                style={{ width: "70%", height: "auto", objectFit: 'cover' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ marginTop: "75px" }}>
              <Box
                sx={{
                  backgroundColor: '#FFFFFF',
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: 3,
                  maxWidth: '400px',
                  margin: 'auto',
                  height: "200px"
                }}
              >
                <Box component="form" onSubmit={handleBeneficiaireSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    id="code"
                    label="Code Beneficiaire"
                    name="code"
                    autoComplete="code"
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
                    Voir Mes Equipements
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}
