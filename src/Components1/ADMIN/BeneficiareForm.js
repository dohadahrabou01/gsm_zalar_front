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
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import Box from '@mui/material/Box'; 
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const UserForm = ({ onClose }) => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [grade, setGrade] = useState('');
    const [filliales, setFilliales] = useState([]);
    const [multiple, setMultiple] = useState(false); // New state for the checkbox
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedFillialeLibelle, setSelectedFillialeLibelle] = useState('');
    const token = localStorage.getItem('token'); // Replace with your actual token
    const apiUrl = `http://${window.location.hostname}:9000`;
    useEffect(() => {
        // Fetch filliales from API
        const fetchFilliales = async () => {
            try {
                const userRole = localStorage.getItem('role'); 
                const userEmail = localStorage.getItem('email'); 
                console.log(userRole);
                // Adjust this according to where you store the user role
                let response;
                
                if (userRole === 'ADMIN' || userRole === 'DSI') {
                    response = await axios.get(`${apiUrl}/api/filliales/filliales`);
                } else if (userRole === 'RSI' || userRole === 'SI') {
                    // Adjust this according to where you store the user email
                    response = await axios.get(`${apiUrl}/api/filliales/by-email?email=${encodeURIComponent(userEmail)}`);
                }
        
                setFilliales(response?.data || []);
            } catch (error) {
                console.error('Error fetching filliales:', error);
            }
        };

        fetchFilliales();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDTO = {
            nom,
            prenom,
            grade,
            fillialeLibelle: selectedFillialeLibelle,
            multiple, // Include the new field in the DTO
        };

        try {
            const response = await axios.post(`${apiUrl}/api/beneficiares/ADD`, userDTO, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('User created:', response.data);
        
            onClose();
            openSnackbar('Beneficiaire ajouté avec succès.', 'success');
        } catch (error) {
            console.error('Error creating user:', error.response ? error.response.data : error.message);
            openSnackbar('Problème lors de la création du beneficiare', 'error'); // Alert for error
        }
    };

    const openSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '0rem' }}>
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
                            checked={multiple}
                            onChange={(e) => setMultiple(e.target.checked)}
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
                    <Button type="submit" sx={{ color: "green" }}>Soumettre</Button>
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

export default UserForm;
