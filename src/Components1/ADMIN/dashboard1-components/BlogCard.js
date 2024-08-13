import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import defaultImage from '../../../assets/ZALAR.png'; // Image par défaut
import HistoriqueFilliale from './HistoriqueFilliale';
const fetchBeneficiaires = async (libelle, token,apiUrl) => {
  try {
    
    console.log('api',apiUrl);
    const response = await axios.get(`${apiUrl}/api/beneficiares/FillialesLibelle/?Libelle=${libelle}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('api',apiUrl);
    console.log('API response for', libelle, ':', response); // Log the entire response object
    return response.data; // Return the data directly if it's the count
  } catch (error) {
    console.error('Erreur serveur:', error.response ? error.response.status : error.message);
    return 0; // Default to 0 if there's an error
  }
};

const apiUrl = `https://gsm-zalar-back1.onrender.com`;
const FilialeCard = ({ filiale, onEdit, onDelete }) => {
  const [beneficiairesCount, setBeneficiairesCount] = useState(0);
 // Pour afficher/masquer l'historique

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token not found in localStorage. Make sure the user is logged in.');
      return;
    }

    const fetchData = async () => {
      const apiUrl = `https://gsm-zalar-back1.onrender.com`;


      const count = await fetchBeneficiaires(filiale.libelle, token,apiUrl);
      console.log(`Nombre de bénéficiaires pour ${filiale.libelle}:`, count); // Log the count value
      setBeneficiairesCount(count);
    };

    fetchData();
  }, [filiale.libelle]);

  const getImageForFiliale = () => {
    try {
      if (filiale.img) {
        return require(`../../../assets/${filiale.img}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'importation de l\'image:', error.message);
    }
    return defaultImage; // Image par défaut si aucune image n'est fournie ou erreur
  };
 
  return (
    <Card style={{ height: "335px" }}>
      <img src={getImageForFiliale()} alt={filiale.libelle} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
      <CardContent>
      <Typography gutterBottom variant="h5" component="div">
  <Box display="flex" justifyContent="space-between" width="100%">
    <span>{filiale.libelle}</span>
    <span style={{ color:"#D2B48C	" }}>{beneficiairesCount} B</span>
  </Box>
</Typography>
        <Typography variant="body2" color="text.secondary">
          Lieu: {filiale.lieu}
        </Typography>
       
      </CardContent>
      <Box display="flex" justifyContent="flex-end" alignItems="center" padding="0 16px 16px">
        <Button onClick={() => onEdit(filiale)} style={{ minWidth: 'auto', marginRight: 8 }}>
          <EditIcon style={{ color: 'green' }} />
        </Button>
        <Button onClick={() => onDelete(filiale.id)} style={{ minWidth: 'auto' }}>
          <DeleteIcon style={{ color: 'red' }} />
        </Button>
      </Box>
    </Card>
  );
};


export default function MediaCard() {
  const [filiales, setFiliales] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFiliale, setSelectedFiliale] = useState(null);
  const [newLibelle, setNewLibelle] = useState('');
  const [newLieu, setNewLieu] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const fetchData = async (token) => {
    try {
      const apiUrl = `https://gsm-zalar-back1.onrender.com`;
      const response = await axios.get(`${apiUrl}/api/filliales/filliales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFiliales(response.data);
    } catch (error) {
      console.error('Erreur serveur:', error.response ? error.response.status : error.message);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage. Make sure the user is logged in.');
      return;
    }
  
    fetchData(token);
  }, [refresh]); // Ajoute refresh ici
  

  

  const handleOpen = (filiale = null) => {
    if (filiale) {
      setEditMode(true);
      setSelectedFiliale(filiale);
      setNewLibelle(filiale.libelle);
      setNewLieu(filiale.lieu);
      setNewImage(null);
    } else {
      setEditMode(false);
      setNewLibelle('');
      setNewLieu('');
      setNewImage(null);
    }
    setOpen(true);
  };
  const [historiqueOpen, setHistoriqueOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setNewLibelle('');
    setNewLieu('');
    setNewImage(null);
    setSelectedFiliale(null);
  };
  const handleHistoriqueClose = () => {
    setHistoriqueOpen(false);
    setRefresh(!refresh);
};

const handleHistorique = () => {
    setHistoriqueOpen(true);
};

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage. Make sure the user is logged in.');
      return;
    }
  
    // Taille maximale autorisée (10 Mo en octets)
    const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo
  
    // Types de fichiers autorisés
    const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
  
    const formData = new FormData();
    formData.append('libelle', newLibelle);
    formData.append('lieu', newLieu);
  
    if (newImage) {
      // Vérifiez la taille du fichier
      if (newImage.size > MAX_SIZE) {
        console.error('Le fichier est trop volumineux. La taille maximale autorisée est de 10 Mo.');
        alert('Le fichier est trop volumineux. La taille maximale autorisée est de 10 Mo.');
        return;
      }
  
      // Vérifiez le type du fichier
      if (!ALLOWED_TYPES.includes(newImage.type)) {
        console.error('Type de fichier non autorisé. Veuillez télécharger une image au format JPG, JPEG ou PNG.');
        alert('Type de fichier non autorisé. Veuillez télécharger une image au format JPG, JPEG ou PNG.');
        return;
      }
  
      formData.append('image', newImage);
    }
  
    const apiUrl = `https://gsm-zalar-back1.onrender.com`;
  
    try {
      if (editMode && selectedFiliale) {
        await axios.put(`${apiUrl}/api/filliales/${selectedFiliale.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`${apiUrl}/api/filliales`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
  
      fetchData(token);
      handleClose();
    } catch (error) {
      console.error('Erreur serveur:', error.response ? error.response.status : error.message);
    }
  };
  
  const role=localStorage.getItem('role');

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    
    if (!token) {
      console.error('Token not found in localStorage. Make sure the user is logged in.');
      return;
    }
    
    if (!email) {
      console.error('Email not found in localStorage.');
      return;
    }
    
    try {
      await axios.delete(`${apiUrl}/api/filliales/${id}?email=${encodeURIComponent(email)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      fetchData(token);
    } catch (error) {
      console.error('Erreur serveur:', error.response ? error.response.status : error.message);
    }
  };

  return (
    <Box marginTop={3}>
   {role === 'ADMIN' && (
    <Button
        variant="contained"
        sx={{
            marginLeft: 'auto',
            marginBottom:"10px", // Aligne le bouton à droite dans son conteneur
            height: '50px',
            backgroundColor: '#B22222',
            display: 'block', // Assure que le bouton se comporte comme un élément de bloc
        }}
        onClick={handleHistorique}
    >
        H
    </Button>
)}

      <Grid container spacing={4}>
        {filiales.map((filiale) => (
          <Grid item xs={12} sm={6} md={4} key={filiale.id}>
            <FilialeCard filiale={filiale} onEdit={handleOpen} onDelete={handleDelete} />
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Card style={{ position: 'relative', height: "335px", backgroundColor: '#f0f0f0', boxShadow: '0 3px 8px rgba(0,0,0,0.2)' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => handleOpen()}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                border: 'none',
                color: '#228B22',
              }}
            >
              <AddIcon style={{ fontSize: "5rem" }} />
            </Button>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{color:"green"}}>{editMode ? 'Modifier la filiale' : 'Ajouter une nouvelle filiale'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Libelle"
            fullWidth
            value={newLibelle}
            onChange={(e) => setNewLibelle(e.target.value)}
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
            label="Lieu"
            fullWidth
            value={newLieu}
            onChange={(e) => setNewLieu(e.target.value)}
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
          <label htmlFor="upload-image">
            <input
              style={{ display: 'none' }}
              id="upload-image"
              name="upload-image"
              type="file"
              onChange={(e) => setNewImage(e.target.files[0])}
              
            />
            <Button variant="contained" component="span"sx={{backgroundColor:"green"}}>
              Upload Image
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{color:"red"}}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} sx={{color:"green"}}>
            {editMode ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={historiqueOpen} onClose={handleHistoriqueClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ color: 'green' }}>Historique des Filliales</DialogTitle>
                <DialogContent>
                    <HistoriqueFilliale  />
                </DialogContent>
            </Dialog>
    </Box>
  );
}
