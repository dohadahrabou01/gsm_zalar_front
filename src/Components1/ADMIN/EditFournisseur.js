import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Button,
    Box
} from '@mui/material';

const EditFournisseur = ({ onClose, row }) => {
    const [libelle, setLibelle] = useState(row.libelle || '');
    const [tel, setTel] = useState(row.tel || '');
    const [email, setEmail] = useState(row.email || '');
    const token = localStorage.getItem("token"); // Replace with your actual token
    const apiUrl = `http://${window.location.hostname}:9000`;
    useEffect(() => {
        if (row) {
            setLibelle(row.libelle);
            setTel(row.tel);
            setEmail(row.email);
        }
    }, [row]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fournisseur = { libelle, tel, email };

        try {
            const response = await axios.put(`${apiUrl}/api/fournisseurs/${row.id}`, fournisseur, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                console.log('Fournisseur updated:', response.data);
                alert('Fournisseur updated successfully');
                onClose(); // Close the dialog on success
            } else {
                alert('Error updating fournisseur');
            }
        } catch (error) {
            console.error('Error updating fournisseur:', error.response ? error.response.data : error.message);
            alert('Problem updating fournisseur');
        }
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
                    label="Tel"
                    variant="outlined"
                    fullWidth
                    margin="normal"
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
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  c

                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 2
                    }}
                >  
                   <Button type="submit" sx={{ color: "green" }}>Modifier</Button>
                 
                <Button sx={{ color: "#B22222" }} onClick={onClose}>Fermer</Button>
                
                  </Box>
            </form>
        </Container>
    );
};

export default EditFournisseur;
