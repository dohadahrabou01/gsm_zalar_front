import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, MenuItem, Button, FormControl, InputLabel, Select, Box } from '@mui/material';

const TerminalForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        marque: '',
        model: '',
        ram: '',
        rom: '',
        imei: '',
        grade: '',
        dureeGarantie: 1,
        fournisseur: '',
        fillialeLibelle: ''
    });
    const [fournisseurs, setFournisseurs] = useState([]);
    const [filliales, setFilliales] = useState([]);
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const userRole = localStorage.getItem('role');
                const userEmail = localStorage.getItem('email');
                let fillialeResponse;

                if (userRole === 'ADMIN' || userRole === 'DSI') {
                    fillialeResponse = await axios.get(`${apiUrl}/api/filliales/filliales`);
                } else if (userRole === 'RSI' || userRole === 'SI') {
                    fillialeResponse = await axios.get(`${apiUrl}/api/filliales/by-email?email=${encodeURIComponent(userEmail)}`);
                }

                const fournisseurResponse = await axios.get(`${apiUrl}/api/fournisseurs`);
                setFournisseurs(fournisseurResponse.data);
                setFilliales(fillialeResponse?.data || []);
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, []); // Empty dependency array to run only once on mount

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/terminals`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Success:', response.data);
            onClose(); // Close the dialog on successful submission
        } catch (error) {
            console.error('Error submitting form:', error.response || error);
        }
    };

    const textFieldSx = {
        marginBottom: 2,
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#4B0082', // Border color
            },
            '&:hover fieldset': {
                borderColor: '#4B0082', // Border color on hover
            },
            '&.Mui-focused fieldset': {
                borderColor: '#4B0082', // Border color on focus
            },
        },
        '& .MuiInputLabel-root': {
            color: '#4B0082', // Label color
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#4B0082', // Label color on focus
        },
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                name="marque"
                label="Marque"
                variant="outlined"
                value={formData.marque}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldSx}
            />
            <TextField
                name="model"
                label="Modèle"
                variant="outlined"
                value={formData.model}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldSx}
            />
            <TextField
                name="ram"
                label="RAM"
                variant="outlined"
                value={formData.ram}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldSx}
            />
            <TextField
                name="rom"
                label="ROM"
                variant="outlined"
                value={formData.rom}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldSx}
            />
            <TextField
                name="imei"
                label="IMEI"
                variant="outlined"
                value={formData.imei}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldSx}
            />
            <TextField
                name="dureeGarantie"
                label="Durée Garantie (années)"
                type="number"
                variant="outlined"
                value={formData.dureeGarantie}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldSx}
            />
            <FormControl fullWidth margin="normal" sx={textFieldSx}>
                <InputLabel>Grade</InputLabel>
                <Select
                    value={formData.grade}
                    onChange={(e) => setFormData(prevData => ({ ...prevData, grade: e.target.value }))}
                    required
                >
                    <MenuItem value="DIRECTEUR">DIRECTEUR</MenuItem>
                    <MenuItem value="CADRE">CADRE</MenuItem>
                    <MenuItem value="RESPONSABLE">RESPONSABLE</MenuItem>
                    <MenuItem value="EMPLOYE">EMPLOYE</MenuItem>
                </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth margin="normal" sx={textFieldSx}>
                <InputLabel>Fournisseur</InputLabel>
                <Select
                    name="fournisseur"
                    value={formData.fournisseur}
                    onChange={handleChange}
                    label="Fournisseur"
                >
                    {fournisseurs.map(f => (
                        <MenuItem key={f.id} value={f.libelle}>{f.libelle}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth margin="normal" sx={textFieldSx}>
                <InputLabel>Filiale</InputLabel>
                <Select
                    name="fillialeLibelle"
                    value={formData.fillialeLibelle}
                    onChange={handleChange}
                    label="Filiale"
                >
                    {filliales.map(f => (
                        <MenuItem key={f.id} value={f.libelle}>{f.libelle}</MenuItem>
                    ))}
                </Select>
            </FormControl>
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
    );
};

export default TerminalForm;
