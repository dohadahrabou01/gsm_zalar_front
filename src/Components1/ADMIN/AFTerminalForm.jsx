import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Button, Snackbar, Alert } from '@mui/material';
import Box from '@mui/material/Box';

const AFTerminalForm = ({ open, onClose, imei, onAssign }) => {
    const [beneficiares, setBeneficiares] = useState([]);
    const [selectedBeneficiare, setSelectedBeneficiare] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    useEffect(() => {
        const fetchBeneficiares = async () => {
            if (!imei) return; // Ensure imei is not empty
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${apiUrl}/api/beneficiares/by-imei?imei=${imei}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBeneficiares(response.data);
                setError(null);
            } catch (error) {
                setError('Erreur lors de la récupération des bénéficiaires');
            } finally {
                setLoading(false);
            }
        };

        fetchBeneficiares();
    }, [imei]);

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const affectantEmail = localStorage.getItem('email');

        setLoading(true);
        setError(null);
        try {
            await axios.post(
               `${apiUrl}/api/afterminals?imei=${imei}&beneficiareId=${selectedBeneficiare}&affectantEmail=${affectantEmail}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onAssign(); // Trigger re-fetch or update parent component
            onClose(); // Close the dialog
        } catch (error) {
            setError('Erreur lors de la soumission de l\'affectation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ color: "green" }}>Assigner le téléphone</DialogTitle>
            <DialogContent>
                {loading && <CircularProgress />}
                <TextField
                    label="IMEI"
                    fullWidth
                    value={imei}
                    disabled
                    margin="dense"
                />
                <FormControl fullWidth margin="dense">
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
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 2
                    }}
                >
                    <Button onClick={handleSubmit} sx={{ color: "green" }} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Affecter'}
                    </Button>
                    <Button sx={{ color: "#B22222" }} onClick={onClose} disabled={loading}>
                        Fermer
                    </Button>
                </Box>
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                    <Alert onClose={() => setError(null)} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            </DialogContent>
        </Dialog>
    );
};

export default AFTerminalForm;
