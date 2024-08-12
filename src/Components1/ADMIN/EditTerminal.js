import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';

const EditTerminal = ({ terminal, onClose }) => {
    const [formData, setFormData] = useState(terminal || {});
    const [fournisseurs, setFournisseurs] = useState([]);
    const [filliales, setFilliales] = useState([]);
    const [loadingFournisseurs, setLoadingFournisseurs] = useState(true);
    const [loadingFilliales, setLoadingFilliales] = useState(true);
    const apiUrl = `http://${window.location.hostname}:9000`;
    useEffect(() => {
        if (terminal) {
            setFormData(terminal);
        }
    }, [terminal]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const token = localStorage.getItem('token');
                const userRole = localStorage.getItem('role');
                const userEmail = localStorage.getItem('email');

                // Fetch fournisseurs
                const fournisseurResponse = await axios.get(`${apiUrl}/api/fournisseurs`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFournisseurs(fournisseurResponse.data);

                // Fetch filliales based on role
                let fillialeResponse;
                if (userRole === 'ADMIN' || userRole === 'DSI') {
                    fillialeResponse = await axios.get(`${apiUrl}/api/filliales/filliales`);
                } else if (userRole === 'RSI' || userRole === 'SI') {
                    fillialeResponse = await axios.get(`${apiUrl}/api/filliales/by-email?email=${encodeURIComponent(userEmail)}`);
                }
                setFilliales(fillialeResponse?.data || []);
            } catch (error) {
                console.error('Error fetching options:', error);
            } finally {
                setLoadingFournisseurs(false);
                setLoadingFilliales(false);
            }
        };

        fetchOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${apiUrl}/api/terminals/${formData.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            onClose(); // Close the dialog on successful update
        } catch (error) {
            console.error('There was an error updating the terminal!', error);
        }
    };

    return (
        <Dialog open={Boolean(terminal)} onClose={onClose}>
            <DialogTitle sx={{ color: "green" }}>Modifier Terminal</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="marque"
                    label="Marque"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.marque || ''}
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
                    name="model"
                    label="Modèle"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.model || ''}
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
                    name="ram"
                    label="RAM"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.ram || ''}
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
                    name="rom"
                    label="ROM"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.rom || ''}
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
                    name="imei"
                    label="IMEI"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.imei || ''}
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
                    name="dateAcquisition"
                    label="Date Acquisition"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={formData.dateAcquisition || ''}
                    InputProps={{ readOnly: true }} 
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
                    }}// Make the field read-only
                />
                <TextField
                    margin="dense"
                    name="dureeGarantie"
                    label="Durée Garantie (années)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={formData.dureeGarantie || ''}
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
                  <FormControl fullWidth margin="dense" variant="outlined" sx={{
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
                        name="grade"
                        value={formData.grade || ''}
                        onChange={handleChange}
                        label="Grade"
                    >
                        <MenuItem value="DIRECTEUR">DIRECTEUR</MenuItem>
                        <MenuItem value="RESPONSABLE">RESPONSABLE</MenuItem>
                        <MenuItem value="CADRE">CADRE</MenuItem>
                        <MenuItem value="EMPLOYE">EMPLOYE</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined"  sx={{
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
                    <InputLabel>Fournisseur</InputLabel>
                    <Select
                        name="fournisseur"
                        value={formData.fournisseur || ''}
                        onChange={handleChange}
                        label="Fournisseur"
                    >
                        {loadingFournisseurs ? (
                            <MenuItem disabled>Loading...</MenuItem>
                        ) : (
                            fournisseurs.map((fournisseur) => (
                                <MenuItem key={fournisseur.id} value={fournisseur.libelle}>
                                    {fournisseur.libelle}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined"  sx={{
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
                        name="fillialeLibelle"
                        value={formData.fillialeLibelle || ''}
                        onChange={handleChange}
                        label="Filiale"
                    >
                        {loadingFilliales ? (
                            <MenuItem disabled>Loading...</MenuItem>
                        ) : (
                            filliales.map((filliale) => (
                                <MenuItem key={filliale.id} value={filliale.libelle}>
                                    {filliale.libelle}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
            <Button onClick={onClose} sx={{ color: "#B22222" }}>
                    Annuler
                </Button>
                <Button onClick={handleSubmit} sx={{ color: "green" }}>
                    Modifier
                </Button>
               
            </DialogActions>
        </Dialog>
    );
};

export default EditTerminal;
