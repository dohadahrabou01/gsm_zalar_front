import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box
} from '@mui/material';

const ForfaitForm = ({ onClose }) => {
    const [libelle, setLibelle] = useState('');
    const [prix, setPrix] = useState('');
    const [forfaits, setForfaits] = useState([{ libelle: '', prix: '' }]);
    const token = 'YOUR_TOKEN_HERE'; // Remplacez par votre token réel

    const handleSubmit = async (e) => {
        e.preventDefault();
        const forfait = forfaits[0]; // Assuming you want to send only the first forfait

        try {
            const response = await axios.post('http://localhost:8089/api/forfaits', forfait, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.data) {
                alert('Erreur lors de la création des forfaits');
            } else {
                console.log('Forfait créé:', response.data);
                alert('Forfait créé avec succès'); // Alert for success
                onClose(); // Close the dialog on success
            }
        } catch (error) {
            console.error('Erreur lors de la création des forfaits:', error.response ? error.response.data : error.message);
            alert('Problème lors de l’ajout des forfaits'); // Alert for error
        }
    };

    const handleAddForfait = () => {
        setForfaits([...forfaits, { libelle: '', prix: '' }]);
    };

    const handleRemoveForfait = (index) => {
        setForfaits(forfaits.filter((_, i) => i !== index));
    };

    const handleForfaitChange = (e, index, field) => {
        const value = e.target.value;
        const newForfaits = [...forfaits];
        newForfaits[index][field] = value;
        setForfaits(newForfaits);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '0rem' }}>
            <form onSubmit={handleSubmit}>
                {forfaits.map((forfait, index) => (
                    <Box key={index}>
                        <TextField
                            label="Libelle"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={forfait.libelle}
                            onChange={(e) => handleForfaitChange(e, index, 'libelle')}
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
                            value={forfait.prix}
                            onChange={(e) => handleForfaitChange(e, index, 'prix')}
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
                    </Box>
                ))}
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
            </form>
        </Container>
    );
};

export default ForfaitForm;
