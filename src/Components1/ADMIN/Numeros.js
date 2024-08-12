import ImportExportIcon from '@mui/icons-material/ImportExport';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
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
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoriqueCompte from './HistoriqueNumero';
import Button from '@mui/material/Button';
import NumeroForm from './NumeroForm'; // Assume you have this component
import EditNumero from './EditNumero';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TextField from '@mui/material/TextField';

import "./Compte.css";
import Assigner from "./AFNumeroForm";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
const columns = [
    { id: 'numero', label: 'Numéro', minWidth: 150 },
    { id: 'serie', label: 'Série', minWidth: 150 },
    { id: 'pin', label: 'PIN', minWidth: 150 },
    { id: 'puk', label: 'PUK', minWidth: 150 },
    { id: 'affectation', label: 'Affectation', minWidth: 150 },
    { id: 'operateur', label: 'Opérateur', minWidth: 150 },
    { id: 'actif', label: 'Actif', minWidth: 150 },
    { id: 'forfait', label: 'Forfait', minWidth: 150 },
    { id: 'fillialeLibelle', label: 'Filliale', minWidth: 150 },
    { id: 'action', label: 'Action', minWidth: 150 },
];

export default function Numero() {
    const [rows, setRows] = useState([]);
    const fileInputRef = useRef(null);
    const [filteredRows, setFilteredRows] = useState([]);
    const [page, setPage] = useState(0);
    const [activeKey, setActiveKey] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        numero: '',
        serie: '',
        operateur: '',
        filliale: '',
        actif: '',
        affectation: '',  // Added filter for affectation
    });
    const [open, setOpen] = useState(false);
    const role = localStorage.getItem('role');

    const [editOpen, setEditOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
    const [historiqueOpen, setHistoriqueOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [importExportOpen, setImportExportOpen] = useState(false);
    const [numeroFilter, setNumeroFilter] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const apiUrl = `${window.location.protocol}//${window.location.hostname}:9000`;
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchData(token);
    }, [refresh]);

    useEffect(() => {
        setFilteredRows(rows.filter(row => {
            return (
                (numeroFilter === '' || row.numero.toLowerCase().includes(numeroFilter.toLowerCase())) &&
                (filters.serie === '' || row.serie.toLowerCase().includes(filters.serie.toLowerCase())) &&
                (filters.operateur === '' || row.operateur.toLowerCase().includes(filters.operateur.toLowerCase())) &&
                (filters.filliale === '' || row.fillialeLibelle.toLowerCase().includes(filters.filliale.toLowerCase())) &&
                (filters.actif === '' || row.actif.toString() === filters.actif) &&
                (filters.affectation === '' || row.affectation.toString() === filters.affectation)
            );
        }));
    }, [filters, numeroFilter, rows]); 
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
      
        
        console.log('Role:', role);
        console.log('Email:', email);
    
        let url;
    
        if (role === 'ADMIN' || role === 'DSI') {
            url = `${apiUrl}/api/numeros`;
        } else if (role === 'RSI' || role === 'SI') {
            url = `${apiUrl}/api/numeros/ByEmail?email=${encodeURIComponent(email)}`;
        }
    
        if (url) {
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                console.log('Data:', response.data);
                // Suppose setRows is a function to update your state with the fetched data
                setRows(response.data);
            } catch (error) {
                console.error('There was an error fetching the data!', error);
            }
        } else {
            console.error('Invalid role, no URL to fetch data from.');
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value === 'Tous' ? '' : value,
        }));
    };

    const handleEditOpen = (row) => {
        setSelectedRow(row);
        setEditOpen(true);
    };

    const handleAssignmentOpen = (row) => {
        setSelectedRow(row);
        setAssignmentDialogOpen(true);
        setRefresh(!refresh);
    };
    
    const handleAssignmentDialogClose = () => {
        setAssignmentDialogOpen(false);
    };

    
    const handleDelete = (row) => {
        openConfirmDeleteDialog(row);
    };
    const openConfirmDeleteDialog = (row) => {
        setSelectedRowToDelete(row);
        setConfirmDeleteOpen(true);
    };
    
    const closeConfirmDeleteDialog = () => {
        setConfirmDeleteOpen(false);
        setSelectedRowToDelete(null);
    };
    const openSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };
    const handleConfirmDelete = async () => {
        if (selectedRowToDelete) {
            try {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email'); // Obtenez l'email du local storage
                const id = selectedRowToDelete.id; // Use selectedRowToDelete instead of row
    
                // Construisez l'URL avec l'ID et l'email
                const url = `${apiUrl}/api/numeros/${id}?email=${encodeURIComponent(email)}`;
                await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRefresh(!refresh);
                openSnackbar('Carte sim supprimé avec succès.', 'success');
            } catch (error) {
                
                openSnackbar('Erreur lors de la suppression de la carte SIM.', 'error');
            } finally {
                closeConfirmDeleteDialog();
            }
        }
    };
    
    const handleAdd = () => {
        setOpen(true);
    };
    const handleExport = async () => {
        try {
            // Récupérer le jeton d'authentification depuis le stockage local
            const token = localStorage.getItem('token'); // Remplacez ceci par votre méthode de récupération de jeton

            // Effectuer la demande GET pour récupérer le fichier Excel
            const response = await fetch(`${apiUrl}/api/export/numeros`, {
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
                link.download = 'Numeros.xlsx';
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
    

    const handleDialogClose = () => {
        setOpen(false);
        setRefresh(!refresh);
    };

    const handleEditDialogClose = () => {
        setEditOpen(false);
        setRefresh(!refresh);
    };
    const handleHistoriqueClose = () => {
        setHistoriqueOpen(false);
        setRefresh(!refresh);
    };
    const handleHistorique= () => {
        setHistoriqueOpen(true);
       
    };
    const handleImport = async () => {
        if (!selectedFile) {
            alert("Aucun fichier sélectionné");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/numeros/import`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                console.log('Fichier importé avec succès');
                setSelectedFile(null); // Reset file selection
                setImportExportOpen(false); // Close dialog
                setRefresh(!refresh); // Refresh data
            } else {
                alert('1. Veuillez vérifier si le csv Excel est ouvert.\n2. Assurez-vous que les données n’existent pas déjà.\n3. Le schéma du fichier CSV doit être le suivant : Numero;Serie;Pin;Puk;Operateur;Actif;Forfait;Filliale.');
            }
        } catch (error) {
            alert('Erreur Au niveau Serveur');
        }
    };
    

    // Helper function to display "Oui" or "Non"
    const formatBoolean = (value) => value ? 'Oui' : 'Non';
   
    const handleToggle = (key) => {
        setActiveKey(activeKey === key ? null : key);
    };

    const headerStyle = (key) => ({
        backgroundColor: activeKey === key ? 'green' : 'inherit',
        color: activeKey === key ? 'white' : 'inherit',
        cursor: 'pointer',
    });

    return (
       
           
          
           
    
        
        <Paper sx={{ width: '100%', height: "auto", overflow: 'hidden', marginTop: "25px" }}>
       
            <Box sx={{ padding: 2, display: 'flex', gap: 2 }}>
          
            <TextField 
                    label="Numéro" 
                    variant="outlined" 
                    value={numeroFilter}
                    onChange={(e) => setNumeroFilter(e.target.value)}
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

              

                <FormControl className="custom-form-control" variant="outlined"sx={{minWidth:"125px"}}>
                    <InputLabel>Opérateur</InputLabel>
                    <Select
                        name="operateur"
                        value={filters.operateur}
                        onChange={handleFilterChange}
                        label="Opérateur"
                    >
                        <MenuItem value="">Tous</MenuItem>
                        {[...new Set(rows.map(row => row.operateur))].map(operateur => (
                            <MenuItem key={operateur} value={operateur}>
                                {operateur}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className="custom-form-control" variant="outlined"sx={{minWidth:"125px"}}>
                    <InputLabel>Filliale</InputLabel>
                    <Select
                        name="filliale"
                        value={filters.filliale}
                        onChange={handleFilterChange}
                        label="Filliale"
                    >
                        <MenuItem value="">Tous</MenuItem>
                        {[...new Set(rows.map(row => row.fillialeLibelle))].map(filliale => (
                            <MenuItem key={filliale} value={filliale}>
                                {filliale}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className="custom-form-control" variant="outlined"sx={{minWidth:"125px"}}>
                    <InputLabel>Actif</InputLabel>
                    <Select
                        name="actif"
                        value={filters.actif}
                        onChange={handleFilterChange}
                        label="Actif"
                    >
                        <MenuItem value="">Tous</MenuItem>
                        <MenuItem value="true">Oui</MenuItem>
                        <MenuItem value="false">Non</MenuItem>
                    </Select>
                </FormControl>

                <FormControl className="custom-form-control" variant="outlined"sx={{minWidth:"125px"}}>
                    <InputLabel>Affectation</InputLabel>
                    <Select
                        name="affectation"
                        value={filters.affectation}
                        onChange={handleFilterChange}
                        label="Affectation"
                    >
                        <MenuItem value="">Tous</MenuItem>
                        <MenuItem value="true">Oui</MenuItem>
                        <MenuItem value="false">Non</MenuItem>
                    </Select>
                </FormControl>
                {role === 'ADMIN' && (
                <>
                    <Button
                        variant="contained"
                        sx={{ marginLeft: 'auto', height: '50px', backgroundColor: '#4B0082' }}
                        onClick={() => setImportExportOpen(true)}
                    >
                        <ImportExportIcon />
                    </Button>
                </>
            )}
                {role === 'ADMIN' && (    <Button variant="contained" sx={{ height:"50px",backgroundColor:"#B22222" }}  onClick={handleHistorique}>
                    H
                </Button> )}
                <Button onClick={handleAdd} variant="contained" sx={{ height:"50px",backgroundColor:"green" }} >
                    <ContactPhoneIcon />

                </Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
    {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
        console.log('Row data:', row); // For debugging purposes
        const affectation = row.affectation === 'true' || row.affectation === true;
        const actif = row.actif === 'true' || row.actif === true;
        
        return (
            <TableRow key={row.id}>
                <TableCell>{row.numero}</TableCell>
                <TableCell>{row.serie}</TableCell>
                <TableCell>{row.pin}</TableCell>
                <TableCell>{row.puk}</TableCell>
                <TableCell>{affectation ? 'Oui' : 'Non'}</TableCell>
                <TableCell>{row.operateur}</TableCell>
                <TableCell>{actif ? 'Oui' : 'Non'}</TableCell>
                <TableCell>{row.forfait}</TableCell>
                <TableCell>{row.fillialeLibelle}</TableCell>
                <TableCell>
                    {affectation === false && (
                       <>
                         <Button
                            onClick={() => handleDelete(row)}
                            startIcon={<DeleteIcon />}
                            color="secondary"
                        >
                        </Button>
                      
                        { role!=="SI"  && actif===true && ( 
                      <Button
                      onClick={() => handleAssignmentOpen(row)}
                      startIcon={<AssignmentTurnedInIcon />}
                      sx={{ color: "#FFD700" }}
                    
                  >
                  </Button>
                    )
                        
                       
                        }</>
                     
                    )}
                    <Button
                        onClick={() => handleEditOpen(row)}
                        startIcon={<EditIcon />}
                        sx={{ color: "green" }}
                    >
                    </Button>
                   
                </TableCell>
            </TableRow>
        );
    })}
</TableBody>




                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle sx={{color:"green"}}>Ajouter un Numéro</DialogTitle>
                <DialogContent>
                    <NumeroForm onClose={handleDialogClose} />
                </DialogContent>
            </Dialog>
           
            <Dialog open={historiqueOpen} onClose={handleHistoriqueClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ color: 'green' }}>Historique des Comptes</DialogTitle>
                <DialogContent>
                    <HistoriqueCompte />
                </DialogContent>
            </Dialog>
            <Dialog open={editOpen} onClose={handleEditDialogClose}>
                <DialogTitle sx={{ color: "green" }}>Modifier le Numéro</DialogTitle>
                <DialogContent>
                    <EditNumero row={selectedRow} onClose={handleEditDialogClose} />
                </DialogContent>
            </Dialog>
            <Dialog open={importExportOpen} onClose={() => setImportExportOpen(false)}>
                <DialogTitle sx={{color : "green"}}>Choisir une action</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Veuillez sélectionner si vous souhaitez exporter ou importer des données.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleExport} sx={{color : "#4B0082"}}>Exporter</Button>
                    <input
                        accept=".xlsx, .xls"
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                    />
                    <Button onClick={() => fileInputRef.current.click()} sx={{color : "#4B0082"}}>
                        choisir Un fichier excel
                    </Button>
                    <Button onClick={handleImport} sx={{color : "#4B0082"}}>
            Importer
        </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={assignmentDialogOpen}  onClose={handleAssignmentDialogClose}>
                <DialogTitle sx={{color:"green"}}>Affecter le Numero</DialogTitle>
                <DialogContent>
                    <Assigner row={selectedRow} onClose={handleAssignmentDialogClose} />
                </DialogContent>
            </Dialog>
            <Dialog
            open={confirmDeleteOpen}
            onClose={closeConfirmDeleteDialog}
        >
            <DialogTitle sx={{color:"green"}}>Confirmation</DialogTitle>
            <DialogContent>
                <p>Êtes-vous sûr de vouloir supprimer cette carte sim?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeConfirmDeleteDialog} sx={{color:"green"}}>Annuler</Button>
                <Button onClick={handleConfirmDelete} color="error">Supprimer</Button>
            </DialogActions>
        </Dialog>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
        >
            <Alert
                onClose={() => setSnackbarOpen(false)}
                severity={snackbarSeverity}
                sx={{ width: '100%' }}
            >
                {snackbarMessage}
            </Alert>
        </Snackbar>
        </Paper>
      
        
    );
}
