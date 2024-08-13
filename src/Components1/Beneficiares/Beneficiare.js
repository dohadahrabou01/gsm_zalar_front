import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import "./Beneficiare.css";

function CustomTabPanel({ value, index, children }) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function Numero() {
    const [value, setValue] = useState(0);
    const [beneficiare, setBeneficiare] = useState(null);
    const [numeros, setNumeros] = useState([]);
    const [terminals, setTerminals] = useState([]);
    const [code, setCode] = useState(localStorage.getItem("code"));
    const apiUrl = `https://gsm-zalar-back1.onrender.com`;
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (code) {
            if (value === 0) {
                axios.get(`${apiUrl}/api/beneficiares/by-code/${code}`)
                    .then(response => {
                        console.log('Beneficiare response:', response.data);
                        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
                            setBeneficiare(response.data);
                        } else {
                            console.error('Expected an object but got:', response.data);
                            setBeneficiare(null);
                        }
                    })
                    .catch(error => console.error('Error fetching beneficiare:', error));
            } else if (value === 1) {
                axios.get(`${apiUrl}/api/numeros/by-code/${code}`)
                    .then(response => setNumeros(response.data))
                    .catch(error => console.error('Error fetching numeros:', error));
            } else if (value === 2) {
                axios.get(`${apiUrl}/api/terminals/by-code/${code}`)
                    .then(response => setTerminals(response.data))
                    .catch(error => console.error('Error fetching terminals:', error));
            }
        }
    }, [value, code]);

    return (
        <Box sx={{ marginTop: "100px" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="inherit"
                    indicatorColor="primary"
                    aria-label="secondary tabs example"
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#4B0082',
                        },
                        '& .MuiTab-root': {
                            color: '#4B0082',
                            '&.Mui-selected': {
                                color: '#4B0082',
                            },
                        },
                    }}
                >
                    <Tab value={0} label="Mon Profile" />
                    <Tab value={1} label="Mes Numeros" />
                    <Tab value={2} label="Mes Terminaux" />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                {beneficiare ? (
                    <div className="beneficiaire-details">
                        <div className="detail">
                            <span className="label">Nom:</span> <span className="value">{beneficiare.nom}</span>
                        </div>
                        <div className="detail">
                            <span className="label">Prénom:</span> <span className="value">{beneficiare.prenom}</span>
                        </div>
                        <div className="detail">
                            <span className="label">Grade:</span> <span className="value">{beneficiare.grade}</span>
                        </div>
                        <div className="detail">
                            <span className="label">Filliale Libelle:</span> <span className="value">{beneficiare.fillialeLibelle}</span>
                        </div>
                    </div>
                ) : (
                    <Typography>No beneficiare found</Typography>
                )}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Forfait</TableCell>
                                <TableCell>Opérateur</TableCell>
                                <TableCell>PIN</TableCell>
                                <TableCell>PUK</TableCell>
                                <TableCell>Série</TableCell>
                                <TableCell>Numéro</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(numeros) && numeros.length > 0 ? (
                                numeros.map((numero, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{numero.forfaitLibelle}</TableCell>
                                        <TableCell>{numero.operateur}</TableCell>
                                        <TableCell>{numero.pin}</TableCell>
                                        <TableCell>{numero.puk}</TableCell>
                                        <TableCell>{numero.serie}</TableCell>
                                        <TableCell>{numero.numero}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6}>No numeros found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Fournisseur</TableCell>
                                <TableCell>Marque</TableCell>
                                <TableCell>Modèle</TableCell>
                                <TableCell>RAM</TableCell>
                                <TableCell>ROM</TableCell>
                                <TableCell>IMEI</TableCell>
                                <TableCell>Date d'Acquisition</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(terminals) && terminals.length > 0 ? (
                                terminals.map((terminal, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{terminal.fournisseur}</TableCell>
                                        <TableCell>{terminal.marque}</TableCell>
                                        <TableCell>{terminal.model}</TableCell>
                                        <TableCell>{terminal.ram}</TableCell>
                                        <TableCell>{terminal.rom}</TableCell>
                                        <TableCell>{terminal.imei}</TableCell>
                                        <TableCell>{new Date(terminal.dateAcquisition).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7}>No terminals found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CustomTabPanel>
        </Box>
    );
}
