import * as React from 'react';
import { Typography, CssBaseline, Grid, Box, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './Login.css';

const defaultTheme = createTheme();

export default function Email() {
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
          <Grid item xs={16} sm={6} sx={{ marginTop: "140px" }}>
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: '600px',
                margin: 'auto',
                height: "150px"
              }}
            >
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <Typography 
                  variant="h5" 
                  align="center" 
                  sx={{ 
                    mt: 2, 
                    mb: 2, 
                    color: '#2E8B57', 
                    fontWeight: 'bold', 
                    fontSize: '20px',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  GSM ZALAR vous a envoyé un email afin de réinitialiser votre mot de passe.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
