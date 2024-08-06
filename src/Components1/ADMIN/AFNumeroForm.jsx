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
    Box,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';

const NumeroForm = ({ row = {}, onClose }) => {
    const [numero, setNumero] = useState(row.numero || '');
    const [beneficiares, setBeneficiares] = useState([]);
    const [selectedBeneficiare, setSelectedBeneficiare] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        const fetchBeneficiares = async () => {
            if (!numero) {
                setBeneficiares([]);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8089/api/beneficiares/by-numero?numero=${numero}`);
                setBeneficiares(response.data);
                setError(null);
                setRefresh(!refresh);
            } catch (error) {
                setError('Erreur lors de la récupération des bénéficiaires');
            } finally {
                setLoading(false);
            }
        };

        fetchBeneficiares();
    }, [numero]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const affectantEmail = localStorage.getItem('email');
        
        setLoading(true);
        setError(null);
        try {
            await createNumero(numero, selectedBeneficiare, affectantEmail, token);
        } catch (error) {
            window.alert('le  beneficiare a deja une carte SIM');
            onClose();
            setError(null);
            console.error('Erreur lors de la soumission du formulaire:', error);
        }
    };
    
    const createNumero = async (numero, beneficiareId, affectantEmail, token) => {
        try {
            const response = await axios.post(
                'http://localhost:8089/afnumero/create',
                new URLSearchParams({
                    numero: numero,
                    beneficiareId: beneficiareId,
                    affectantEmail: affectantEmail // No need to encode again
                }),
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
    
            console.log(response.data); // Afficher la réponse du serveur
    
            if (response.data === true) {
                window.alert('Affectation avec succès');
                console.log(`Numéro: ${numero}`);
                console.log(`ID Bénéficiaire: ${beneficiareId}`);
                console.log(`Affectant : ${affectantEmail}`);
                onClose();
            } else {
                window.alert('Problème lors de la soumission du formulaire');
                onClose();
            }
        } catch (error) {
            console.error('Erreur lors de la création du numéro:', error);
            throw error;
        }
    };
    
    
    
    
    
    return (
        <div style={{ marginTop: '2rem' }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Numéro"
                            fullWidth
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            required
                            sx={{
                                marginBottom: 2,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#4B0082',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#4B0082',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4B0082',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#4B0082',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#4B0082',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{
                        marginBottom: 2,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#4B0082',
                            },
                            '&:hover fieldset': {
                                borderColor: '#4B0082',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#4B0082',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#4B0082',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4B0082',
                        },
                    }}>
                            <InputLabel>Bénéficiaire</InputLabel>
                            <Select
                                value={selectedBeneficiare}
                                onChange={(e) => setSelectedBeneficiare(e.target.value)}
                                label="Bénéficiaire"
                                disabled={beneficiares.length === 0}
                            >
                                {beneficiares.map((beneficiare) => (
                                    <MenuItem key={beneficiare.id} value={beneficiare.id}>
                                        {beneficiare.nom} {beneficiare.prenom}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 2
                    }}
                >
                    <Button type="submit" sx={{ color: "green" }} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Affecter'}
                    </Button>
                    <Button sx={{ color: "#B22222" }} onClick={onClose} disabled={loading}>
                        Fermer
                    </Button>
                </Box>
            </form>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
            >
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default NumeroForm;
