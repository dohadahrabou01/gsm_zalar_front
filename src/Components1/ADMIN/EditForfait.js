import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Button,
    Box,
    Snackbar,
    Alert
} from '@mui/material';

const EditForfait = ({ onClose, row }) => {
    const [libelle, setLibelle] = useState('');
    const [prix, setPrix] = useState('');
    const token = localStorage.getItem('token');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
    const apiUrl = `http://${window.location.hostname}:9000`;
    useEffect(() => {
        const fetchForfait = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/forfaits/${row.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const fetchedForfait = response.data;
                setLibelle(fetchedForfait.libelle);
                setPrix(fetchedForfait.prix);
            } catch (error) {
                console.error('Erreur lors de la récupération du forfait:', error.response ? error.response.data : error.message);
                setSnackbarMessage('Erreur lors de la récupération des données.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        };

        if (row && row.id) {
            fetchForfait();
        }
    }, [row, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const forfait = { libelle, prix };

        try {
            const response = await axios.put(`${apiUrl}/api/forfaits/${row.id}`, forfait, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                console.log('Forfait modifié:', response.data);
                setSnackbarMessage('Forfait modifié avec succès');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
               
            } else {
                console.log('Erreur lors de la modification du forfait:', response.data);
                setSnackbarMessage('Erreur lors de la modification du forfait');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
       
        } catch (error) {
            console.error('Erreur lors de la modification du forfait:', error.response ? error.response.data : error.message);
            setSnackbarMessage('Problème lors de la modification du forfait');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '0rem' }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Libelle"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={libelle}
                    onChange={(e) => setLibelle(e.target.value)}
                    required
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
                    label="Prix"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                    required
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
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 2
                    }}
                >
                        <Button sx={{ color: "#B22222" }} onClick={onClose}>Fermer</Button>
               
                    <Button type="submit" sx={{ color: "green" }}>Modifier</Button>
                 </Box>
            </form>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default EditForfait;
