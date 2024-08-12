import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Button,
    MenuItem,
    Typography,
    Select,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const EditBeneficiaire = ({ row, onClose, multiple }) => {
    const [nom, setNom] = useState(row.nom || '');
    const [prenom, setPrenom] = useState(row.prenom || '');
    const [grade, setGrade] = useState(row.grade || '');
    const [filliales, setFilliales] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedFillialeLibelle, setSelectedFillialeLibelle] = useState(row.filliale || '');
    const [isMultiple, setIsMultiple] = useState(row.multiple === true || row.multiple === "true"); // Handle both boolean and string "true"
    const token = localStorage.getItem('token'); // Replace with your actual token retrieval mechanism
    const apiUrl = `${window.location.protocol}//${window.location.hostname}:9000`;
    useEffect(() => {
        console.log('Beneficiaire information:', row);
        setIsMultiple(row.multiple === true || row.multiple === "true"); // Handle both boolean and string "true"

        const fetchFilliales = async () => {
            try {
                const userRole = localStorage.getItem('role');
                const userEmail = localStorage.getItem('email');
                console.log(userRole);
                let response;

                if (userRole === 'ADMIN' || userRole === 'DSI') {
                    response = await axios.get(`${apiUrl}/api/filliales/filliales`);
                } else if (userRole === 'RSI' || userRole === 'SI') {
                    response = await axios.get(`${apiUrl}/api/filliales/by-email?email=${encodeURIComponent(userEmail)}`);
                }

                setFilliales(response?.data || []);
            } catch (error) {
                console.error('Error fetching filliales:', error);
            }
        };

        fetchFilliales();
    }, [multiple]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDTO = {
            nom,
            prenom,
            grade,
            fillialeLibelle: selectedFillialeLibelle,
            multiple: isMultiple ? 'true' : 'false' // Convert boolean to string
        };

        try {
            await axios.put(`${apiUrl}/api/beneficiares/${row.id}`, userDTO, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('User updated');
            setSnackbarMessage('Utilisateur mis à jour avec succès');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            onClose();
        } catch (error) {
            console.error('Error updating user:', error.response ? error.response.data : error.message);
            setSnackbarMessage('Problème lors de la mise à jour de l’utilisateur');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <Container maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Nom"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
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
                    label="Prénom"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
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
                <FormControl fullWidth margin="normal" sx={{
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
                    <InputLabel>Grade</InputLabel>
                    <Select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        required
                    >
                        <MenuItem value="DIRECTEUR">DIRECTEUR</MenuItem>
                        <MenuItem value="CADRE">CADRE</MenuItem>
                        <MenuItem value="RESPONSABLE">RESPONSABLE</MenuItem>
                        <MenuItem value="EMPLOYE">EMPLOYE</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{
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
                    <InputLabel>Filiale</InputLabel>
                    <Select
                        value={selectedFillialeLibelle}
                        onChange={(e) => setSelectedFillialeLibelle(e.target.value)}
                        required
                    >
                        {filliales.map((filliale) => (
                            <MenuItem key={filliale.libelle} value={filliale.libelle}>
                                {filliale.libelle}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isMultiple}
                            onChange={(e) => setIsMultiple(e.target.checked)}
                        />
                    }
                    label="Multiple"
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2, // Add some space between the buttons
                        mt: 2 // Add margin top if needed
                    }}
                >
                    <Button sx={{ color: "#B22222" }} onClick={onClose}>Fermer</Button>
                    <Button type="submit" sx={{ color: "green" }}>Modifier</Button>
                </Box>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </form>
        </Container>
    );
};

export default EditBeneficiaire;
