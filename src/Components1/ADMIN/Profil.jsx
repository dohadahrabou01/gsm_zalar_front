// UserProfile.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); // Etat pour gérer l'ouverture du formulaire d'édition
  const [editUser, setEditUser] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: '',
    password: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        if (!email || !token) {
          throw new Error('Email or token not found');
        }

        const response = await axios.get(`http://localhost:8089/api/users/email/${email}`, {
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
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8089/api/users/update/${user.id}`, editUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const updatedUser = response.data;
  
      // Vérifiez si le sessionId a changé
      if (updatedUser.sessionId !== user.sessionId) {
        // Déconnecter l'utilisateur et rediriger vers la page de connexion
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        window.location.href = '/'; // Rediriger vers la page de connexion
      } else {
        setUser(updatedUser);
        handleClose();
      }
    } catch (err) {
      setError(err.message);
    }
  };
  

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const initials = user ? `${user.prenom.charAt(0)}${user.nom.charAt(0)}` : '';

  return (
    <Paper
      sx={{
        padding: 3,
        textAlign: 'center',
        color: 'text.secondary',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 3,
        marginTop: '125px',
      }}
    >
      <Avatar
        alt={`${user.prenom} ${user.nom}`}
        sx={{
          width: 120,
          height: 120,
          margin: 'auto',
          marginBottom: 2,
          fontSize: '2rem',
          backgroundColor: '#4B0082',
          color: '#fff',
        }}
      >
        {initials}
      </Avatar>
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
      <Button
  variant="outlined"
  onClick={handleClickOpen}
  sx={{
    marginTop: 2,
    borderColor: '#4B0082', // Couleur de la bordure
    color: '#4B0082', // Couleur du texte
    '&:hover': {
      borderColor: '#4B0082', // Couleur de la bordure lors du survol
      backgroundColor: 'rgba(75, 0, 130, 0.1)', // Couleur de fond lors du survol (optionnel)
    },
  }}
> Edit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{color:"green"}}>Edit Profile</DialogTitle>
        <DialogContent>
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
          <Button sx={{color:"red"}} onClick={handleClose}>Annuler</Button>
          <Button  sx={{color:"green"}} onClick={handleSave}>Modifier</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserProfile;
