import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, IconButton, Grid, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailConfigForm from './EmailConfig';
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const role = localStorage.getItem('role');
  const [hovered, setHovered] = useState(false);
  const [openEmailConfig, setOpenEmailConfig] = useState(false); // State for email config modal
  const apiUrl = process.env.REACT_APP_API_URL;
  const [editUser, setEditUser] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: '',
    password: '',
  });
  const [formError, setFormError] = useState(''); // To handle form errors

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        if (!email || !token) {
          throw new Error('Email or token not found');
        }

        const response = await axios.get(`${apiUrl}/api/users/email/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setEditUser({
          prenom: response.data.prenom,
          nom: response.data.nom,
          email: response.data.email,
          role: response.data.role,
          password: '', // Initialisez avec une chaîne vide
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCloseEmailConfig = () => {
    setOpenEmailConfig(false);
  };
  const handleClickOpenEmailConfig = () => {
    setOpenEmailConfig(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      // Basic validation
      if (!editUser.prenom || !editUser.nom || !editUser.email || !editUser.password) {
        setFormError('Please fill all required fields.');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(`${apiUrl}/api/users/update/${user.id}`, editUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const updatedUser = response.data;
  
      if (updatedUser.sessionId !== user.sessionId) {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        window.location.href = '/'; // Rediriger vers la page de connexion
      } else {
        setUser(updatedUser);
        handleClose();
      }
    } catch (err) {
      setFormError(err.message);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const initials = user ? `${user.prenom.charAt(0)}${user.nom.charAt(0)}` : '';

  return (
    <Paper
      sx={{
        position: 'relative',
        padding: 4,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 4,
        marginTop: '100px',
      }}
    >
      {role === "ADMIN" && (
        <IconButton
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: hovered ? '#4B0082' : 'text.secondary',
            transform: hovered ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'color 0.3s, transform 0.3s',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleClickOpenEmailConfig }
        >
          <SettingsIcon />
        </IconButton>
      )}
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={4} textAlign="center">
          <Avatar
            alt={`${user.prenom} ${user.nom}`}
            sx={{
              width: 120,
              height: 120,
              margin: 'auto',
              fontSize: '2rem',
              backgroundColor: '#4B0082',
              color: '#fff',
            }}
          >
            {initials}
          </Avatar>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            {user.prenom} {user.nom}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {user.email}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ marginTop: 2 }}>
            Role: {user.role}
          </Typography>
          {(user.role === 'RSI' || user.role === 'SI') && user.filliales.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6" gutterBottom>
                Responsable de filliales:
              </Typography>
              {user.filliales.map((subsidiary, index) => (
                <Typography key={index} variant="body2" color="textSecondary">
                  {subsidiary.libelle}
                </Typography>
              ))}
            </Box>
          )}
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button
            variant="outlined"
            onClick={handleClickOpen}
            sx={{
              marginTop: 2,
              borderColor: '#4B0082',
              color: '#4B0082',
              '&:hover': {
                borderColor: '#4B0082',
                backgroundColor: 'rgba(75, 0, 130, 0.1)',
              },
            }}
          >
            Edit
          </Button>
        </Grid>
      </Grid>
  
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{color:"green"}}>Edit Profile</DialogTitle>
        <DialogContent>
          {formError && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {formError}
            </Typography>
          )}
          <TextField
            autoFocus
            margin="dense"
            name="prenom"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editUser.prenom}
            onChange={handleChange}
            sx={{
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure
                },
                '&:hover fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure au survol
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure lorsqu'il est focalisé
                },
              },
              '& .MuiInputLabel-root': {
                color: '#4B0082', // Couleur du label
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4B0082', // Couleur du label lorsqu'il est focalisé
              },
            }}
          />
          <TextField
            margin="dense"
            name="nom"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editUser.nom}
            onChange={handleChange}
            sx={{
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure
                },
                '&:hover fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure au survol
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure lorsqu'il est focalisé
                },
              },
              '& .MuiInputLabel-root': {
                color: '#4B0082', // Couleur du label
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4B0082', // Couleur du label lorsqu'il est focalisé
              },
            }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editUser.email}
            onChange={handleChange}
            sx={{
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure
                },
                '&:hover fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure au survol
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure lorsqu'il est focalisé
                },
              },
              '& .MuiInputLabel-root': {
                color: '#4B0082', // Couleur du label
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4B0082', // Couleur du label lorsqu'il est focalisé
              },
            }}
          />
          <TextField
            margin="dense"
            name="role"
            label="Role"
            type="text"
            fullWidth
            variant="outlined"
            value={editUser.role}
            onChange={handleChange}
            disabled
            sx={{
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure
                },
                '&:hover fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure au survol
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure lorsqu'il est focalisé
                },
              },
              '& .MuiInputLabel-root': {
                color: '#4B0082', // Couleur du label
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4B0082', // Couleur du label lorsqu'il est focalisé
              },
            }}
          />
          <TextField
            margin="dense"
            name="password"
            label="Mot de Passe"
            type="password"
            fullWidth
            variant="outlined"
            value={editUser.password}
            onChange={handleChange}
            sx={{
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure
                },
                '&:hover fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure au survol
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4B0082', // Couleur de la bordure lorsqu'il est focalisé
                },
              },
              '& .MuiInputLabel-root': {
                color: '#4B0082', // Couleur du label
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4B0082', // Couleur du label lorsqu'il est focalisé
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: 'red' }} onClick={handleClose}>Annuler</Button>
          <Button sx={{ color: 'green' }} onClick={handleSave}>Modifier</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEmailConfig} onClose={handleCloseEmailConfig}>
                <DialogTitle sx={{color:"green"}}>Email Configurations </DialogTitle>
                <DialogContent>
                    <EmailConfigForm onClose={handleCloseEmailConfig} />
                </DialogContent>
            </Dialog>
    </Paper>
  );
};

export default UserProfile;
