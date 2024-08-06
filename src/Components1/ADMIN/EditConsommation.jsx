import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function EditConsommation({ row, onClose }) {
    const [numero, setNumero] = useState('');
    const [annee, setAnnee] = useState('');
    const [janvier, setJanvier] = useState('');
    const [fevrier, setFevrier] = useState('');
    const [mars, setMars] = useState('');
    const [avril, setAvril] = useState('');
    const [mai, setMai] = useState('');
    const [juin, setJuin] = useState('');
    const [juillet, setJuillet] = useState('');
    const [aout, setAout] = useState('');
    const [septembre, setSeptembre] = useState('');
    const [octobre, setOctobre] = useState('');
    const [novembre, setNovembre] = useState('');
    const [decembre, setDecembre] = useState('');

    useEffect(() => {
        if (row) {
            setNumero(row.numero);
            setAnnee(row.annee);
            setJanvier(row.janvier);
            setFevrier(row.fevrier);
            setMars(row.mars);
            setAvril(row.avril);
            setMai(row.mai);
            setJuin(row.juin);
            setJuillet(row.juillet);
            setAout(row.aout);
            setSeptembre(row.septembre);
            setOctobre(row.octobre);
            setNovembre(row.novembre);
            setDecembre(row.decembre);
        }
    }, [row]);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:8089/api/consommations/update/${row.id}`, {
                numero,
                annee,
                janvier,
                fevrier,
                mars,
                avril,
                mai,
                juin,
                juillet,
                aout,
                septembre,
                octobre,
                novembre,
                decembre
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("modifie avec succes");
            onClose(); // Close the dialog after successful update
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <TextField
                label="Numéro"
                variant="outlined"
                fullWidth
                margin="normal"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                disabled
            />
            <TextField
                label="Année"
                variant="outlined"
                fullWidth
                margin="normal"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                disabled
            />
            <TextField
                label="Janvier"
                variant="outlined"
                fullWidth
                margin="normal"
                value={janvier}
                onChange={(e) => setJanvier(e.target.value)}
            />
            <TextField
                label="Février"
                variant="outlined"
                fullWidth
                margin="normal"
                value={fevrier}
                onChange={(e) => setFevrier(e.target.value)}
            />
            <TextField
                label="Mars"
                variant="outlined"
                fullWidth
                margin="normal"
                value={mars}
                onChange={(e) => setMars(e.target.value)}
            />
            <TextField
                label="Avril"
                variant="outlined"
                fullWidth
                margin="normal"
                value={avril}
                onChange={(e) => setAvril(e.target.value)}
            />
            <TextField
                label="Mai"
                variant="outlined"
                fullWidth
                margin="normal"
                value={mai}
                onChange={(e) => setMai(e.target.value)}
            />
            <TextField
                label="Juin"
                variant="outlined"
                fullWidth
                margin="normal"
                value={juin}
                onChange={(e) => setJuin(e.target.value)}
            />
            <TextField
                label="Juillet"
                variant="outlined"
                fullWidth
                margin="normal"
                value={juillet}
                onChange={(e) => setJuillet(e.target.value)}
            />
            <TextField
                label="Août"
                variant="outlined"
                fullWidth
                margin="normal"
                value={aout}
                onChange={(e) => setAout(e.target.value)}
            />
            <TextField
                label="Septembre"
                variant="outlined"
                fullWidth
                margin="normal"
                value={septembre}
                onChange={(e) => setSeptembre(e.target.value)}
            />
            <TextField
                label="Octobre"
                variant="outlined"
                fullWidth
                margin="normal"
                value={octobre}
                onChange={(e) => setOctobre(e.target.value)}
            />
            <TextField
                label="Novembre"
                variant="outlined"
                fullWidth
                margin="normal"
                value={novembre}
                onChange={(e) => setNovembre(e.target.value)}
            />
            <TextField
                label="Décembre"
                variant="outlined"
                fullWidth
                margin="normal"
                value={decembre}
                onChange={(e) => setDecembre(e.target.value)}
            />
            <DialogActions>
                <Button onClick={onClose}  sx={{ color: "#B22222" }}>
                    Annuler
                </Button>
                <Button onClick={handleSave} sx={{ color: "green" }}>
                    Enregistrer
                </Button>
            </DialogActions>
        </Box>
    );
}
