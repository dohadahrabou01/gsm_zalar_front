import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Typography,
    CircularProgress,
} from '@mui/material';
import Box from '@mui/material/Box'; 

const NumeroForm = ({ row = {}, onClose }) => {
    const [numero, setNumero] = useState(row.numero || '');
    const [serie, setSerie] = useState(row.serie || '');
    const [pin, setPin] = useState(row.pin || '');
    const [puk, setPuk] = useState(row.puk || '');
    const [operateur, setOperateur] = useState(row.operateur || 'ORANGE');
    const [actif, setActif] = useState(row.actif || true);
    const [forfait, setForfait] = useState(row.forfait || '11GO');
    const [fillialeLibelle, setFillialeLibelle] = useState(row.fillialeLibelle || 'ZALAR');

    const [filliales, setFilliales] = useState([]);
    const [forfaits, setForfaits] = useState([]);
    const [loadingFilliales, setLoadingFilliales] = useState(true);
    const [loadingForfaits, setLoadingForfaits] = useState(true);
    const apiUrl = `https://gsm-zalar-back1.onrender.com`;
    useEffect(() => {
      const fetchFilliales = async () => {
        const userRole = localStorage.getItem('role');
        const userEmail = localStorage.getItem('email');
        let fillialeResponse;
    
        try {
            if (userRole === 'ADMIN' || userRole === 'DSI') {
                fillialeResponse = await axios.get(`${apiUrl}/api/filliales/filliales`);
            } else if (userRole === 'RSI' || userRole === 'SI') {
                fillialeResponse = await axios.get(`${apiUrl}/api/filliales/by-email?email=${encodeURIComponent(userEmail)}`);
            } else {
                console.warn('Rôle d\'utilisateur non reconnu');
                return;
            }
            
            setFilliales(fillialeResponse.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des filliales:', error);
        } finally {
            setLoadingFilliales(false);
        }
    };
    
        const fetchForfaits = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/forfaits/forfaits`);
                setForfaits(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des forfaits:', error);
            } finally {
                setLoadingForfaits(false);
            }
        };

        fetchFilliales();
        fetchForfaits();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const formData = {
            numero,
            serie,
            pin,
            puk,
            operateur,
            actif,
            forfait,
            fillialeLibelle
        };

        try {
            if (row.id) {
                await axios.put(`${apiUrl}/api/numeros/${row.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${apiUrl}/api/numeros`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            onClose(); // Fermer le formulaire
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
        }
    };

    return (
        <div>
          
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} sx={{
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
                      }}>
                        <TextField
                            label="Numéro"
                            fullWidth
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{
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
                      }}>
                        <TextField
                            label="Série"
                            fullWidth
                            value={serie}
                            onChange={(e) => setSerie(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{
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
                      }}>
                        <TextField
                            label="PIN"
                            fullWidth
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            // Add validation as needed
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{
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
                      }}>
                        <TextField
                            label="PUK"
                            fullWidth
                            value={puk}
                            onChange={(e) => setPuk(e.target.value)}
                            // Add validation as needed
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{
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
                      }}>
                        <FormControl fullWidth>
                            <InputLabel>Opérateur</InputLabel>
                            <Select
                                value={operateur}
                                onChange={(e) => setOperateur(e.target.value)}
                            >
                                <MenuItem value="IAM">IAM</MenuItem>
                                <MenuItem value="INWI">INWI</MenuItem>
                                <MenuItem value="ORANGE">ORANGE</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{
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
                      }}>
                            <InputLabel>Forfait</InputLabel>
                            <Select
                                value={forfait}
                                onChange={(e) => setForfait(e.target.value)}
                                disabled={loadingForfaits}
                            >
                                {loadingForfaits ? (
                                    <MenuItem value="" disabled>
                                        <CircularProgress size={24} />
                                    </MenuItem>
                                ) : (
                                    forfaits.map((forfait) => (
                                        <MenuItem key={forfait.id} value={forfait.libelle}>
                                            {forfait.libelle}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{
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
                      }}>
                            <InputLabel>Filliale</InputLabel>
                            <Select
                                value={fillialeLibelle}
                                onChange={(e) => setFillialeLibelle(e.target.value)}
                                disabled={loadingFilliales}
                            >
                                {loadingFilliales ? (
                                    <MenuItem value="" disabled>
                                        <CircularProgress size={24} />
                                    </MenuItem>
                                ) : (
                                    filliales.map((filliale) => (
                                        <MenuItem key={filliale.id} value={filliale.libelle}>
                                            {filliale.libelle}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2, // Add some space between the buttons
        mt: 2 // Add margin top if needed
      }}
    >
        <Button sx={{ color: "#B22222" }} onClick={onClose}>Fermer</Button>
      <Button type="submit" sx={{ color: "green" }}>Soumettre</Button>
      
    </Box>
            </form>
        </div>
    );
};

export default NumeroForm;
