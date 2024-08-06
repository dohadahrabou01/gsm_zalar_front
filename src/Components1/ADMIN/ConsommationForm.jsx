import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const AddConsommation = ({ onClose }) => {
    const [numero, setNumero] = useState('');
    const [annee, setAnnee] = useState('');
    const [janvier, setJanvier] = useState(0);
    const [fevrier, setFevrier] = useState(0);
    const [mars, setMars] = useState(0);
    const [avril, setAvril] = useState(0);
    const [mai, setMai] = useState(0);
    const [juin, setJuin] = useState(0);
    const [juillet, setJuillet] = useState(0);
    const [aout, setAout] = useState(0);
    const [septembre, setSeptembre] = useState(0);
    const [octobre, setOctobre] = useState(0);
    const [novembre, setNovembre] = useState(0);
    const [decembre, setDecembre] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:8089/api/consommations', {
                numero,
                annee,
                janvier: parseInt(janvier, 10),
                fevrier: parseInt(fevrier, 10),
                mars: parseInt(mars, 10),
                avril: parseInt(avril, 10),
                mai: parseInt(mai, 10),
                juin: parseInt(juin, 10),
                juillet: parseInt(juillet, 10),
                aout: parseInt(aout, 10),
                septembre: parseInt(septembre, 10),
                octobre: parseInt(octobre, 10),
                novembre: parseInt(novembre, 10),
                decembre: parseInt(decembre, 10),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Consommation added:', response.data);
            onClose(); // Close the dialog or modal after submission
        } catch (error) {
            console.error('There was an error adding the consommation!', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: "400px" }}>
            <TextField
                label="Numéro"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                required
            />
            <TextField
                label="Année"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required
            />
            <TextField
                label="Janvier"
                value={janvier}
                onChange={(e) => setJanvier(parseInt(e.target.value, 10) || 0)}
                required
                type="number"
            />
            <TextField
                label="Février"
                value={fevrier}
                onChange={(e) => setFevrier(parseInt(e.target.value, 10) || 0)}
                required
                type="number"
            />
            <TextField
                label="Mars"
                value={mars}
                onChange={(e) => setMars(parseInt(e.target.value, 10) || 0)}
                required
                type="number"
            />
            <TextField
                label="Avril"
                value={avril}
                onChange={(e) => setAvril(parseInt(e.target.value, 10) || 0)}
                required
                type="number"
            />
            <TextField
                label="Mai"
                value={mai}
                onChange={(e) => setMai(parseInt(e.target.value, 10) || 0)}
                required
                type="number"
            />
            <TextField
                label="Juin"
                value={juin}
                onChange={(e) => setJuin(parseInt(e.target.value, 10) || 0)}
                required
                type="number"
            />
            <TextField
                label="Juillet"
                value={juillet}
                onChange={(e) => setJuillet(parseInt(e.target.value, 10) || 0)}
                required
                type="number"
            />
            <TextField
                label="Août"
                value={aout}
                onChange={(e) => setAout(parseInt(e.target.value, 10) || 0)}
                required
                type="number"
            />
            <TextField
                label="Septembre"
                value={septembre}
                onChange={(e) => setSeptembre(parseInt(e.target.value, 10) || 0)}
                required
                type="number"
            />
            <TextField
                label="Octobre"
                value={octobre}
                onChange={(e) => setOctobre(parseInt(e.target.value, 10) || 0)}
                required
                type="number"
            />
            <TextField
                label="Novembre"
                value={novembre}
                onChange={(e) => setNovembre(parseInt(e.target.value, 10) || 0)}
                required
                type="number"
            />
            <TextField
                label="Décembre"
                value={decembre}
                onChange={(e) => setDecembre(parseInt(e.target.value, 10) || 0)}
                required
                type="number"
            />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mt: 2
                }}
            >
                <Button type="submit" sx={{ color: "green" }}>Soumettre</Button>
                <Button sx={{ color: "#B22222" }} onClick={onClose}>Fermer</Button>
            </Box>
        </Box>
    );
};

export default AddConsommation;
