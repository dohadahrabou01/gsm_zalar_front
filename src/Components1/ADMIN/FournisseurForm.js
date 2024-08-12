import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const FournisseurForm = ({ onClose }) => {
    const [libelle, setLibelle] = useState('');
    const [tel, setTel] = useState('');
    const [email, setEmail] = useState('');
    const apiUrl = `http://${window.location.hostname}:9000`;
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/fournisseurs`, {
                libelle,
                tel,
                email,
            });
            console.log('Fournisseur added:', response.data);
            onClose(); // Close the dialog or modal after submission
        } catch (error) {
            console.error('There was an error adding the fournisseur!', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 ,width:"400px"}}>
            <TextField
                label="Libelle"
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
                label="Tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
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
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            
                    <Button type="submit" sx={{ color: "green" }}>Soumettre</Button>
                </Box>
        </Box>
    );
};

export default FournisseurForm;
