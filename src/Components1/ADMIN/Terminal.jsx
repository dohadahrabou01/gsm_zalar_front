import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Accordion from 'react-bootstrap/Accordion';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CDBBox, CDBContainer } from 'cdbreact';
import Button from '@mui/material/Button';
import NumeroForm from './NumeroForm'; // Assume you have this component
import AFTerminal from './AFTerminal';
import AFNumero from './AFNumero';  // Assume you have this component
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ProgressBar from './ProgressTerminal';
import SimCardIcon from '@mui/icons-material/SimCard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Fournisseur from "./Fournisseur"
import Terminals from "./Terminals";
import FilePresentIcon from '@mui/icons-material/FilePresent';
function CustomTabPanel({ value, index, children }) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function Numero() {
    const [value, setValue] = useState(0);
    const role = localStorage.getItem('role'); // Get the role from localStorage

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleExport = async () => {
        try {
            // Récupérer le jeton d'authentification depuis le stockage local
            const token = localStorage.getItem('token'); // Remplacez ceci par votre méthode de récupération de jeton

            // Effectuer la demande GET pour récupérer le fichier Excel
            const response = await fetch('http://localhost:8089/api/export/beneficiares', {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Authorization': `Bearer ${token}`, // Ajouter le jeton d'authentification
                },
            });

            if (response.ok) {
                // Convertir la réponse en blob
                const blob = await response.blob();
                
                // Créer un objet URL pour le blob
                const url = window.URL.createObjectURL(blob);
                
                // Créer un élément de lien temporaire et déclencher le téléchargement
                const link = document.createElement('a');
                link.href = url;
                link.download = 'beneficiares.xlsx';
                document.body.appendChild(link);
                link.click();
                
                // Nettoyer l'objet URL
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Erreur lors de l\'exportation:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de l\'exportation:', error);
        }
    };

    return (
        <Box sx={{ marginTop: "100px" }}>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab value={0} label="Les Terminaux" />
                    <Tab value={1} label="Les Affectations" />
                    {role === 'ADMIN' && <Tab value={2} label="Les Fournisseurs" />}
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
            {role === 'ADMIN' && (   <ProgressBar sx={{ color: "green" }} />  )}
            
                <Terminals />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <AFTerminal />
            </CustomTabPanel>
            {role === 'ADMIN' && (
                <CustomTabPanel value={value} index={2}>
                    <Fournisseur />
                </CustomTabPanel>
            )}
        </Box>
    );
}
