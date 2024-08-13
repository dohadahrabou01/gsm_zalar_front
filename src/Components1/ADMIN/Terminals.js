import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
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
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import TerminalForm from './TerminalForm'; // Assume you have this component
import EditTerminal from './EditTerminal';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Assigner from "./AFTerminalForm";
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import HistoriqueTerminal from "./HistoriqueTerminal";
import FilePresentIcon from '@mui/icons-material/FilePresent';
import ImportExportIcon from '@mui/icons-material/ImportExport';
const columns = [
    { id: 'marque', label: 'Marque', minWidth: 150 },
    { id: 'model', label: 'Modèle', minWidth: 150 },
    { id: 'ram', label: 'RAM', minWidth: 150 },
    { id: 'rom', label: 'ROM', minWidth: 150 },
    { id: 'imei', label: 'IMEI', minWidth: 150 },
    { id: 'dateAcquisition', label: 'Date Acquisition', minWidth: 150 },
    { id: 'dureeGarantie', label: 'Durée Garantie ans', minWidth: 150 },
    { id: 'affectation', label: 'Affectation', minWidth: 150 },
    { id: 'fournisseur', label: 'Fournisseur', minWidth: 150 },
    { id: 'fillialeLibelle', label: 'Filiale', minWidth: 150 },
    { id: 'grade', label: 'Grade', minWidth: 150 }, 
    { id: 'action', label: 'Action', minWidth: 150 },
];
export default function Terminal() {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const fileInputRef = useRef(null);
    const [importExportOpen, setImportExportOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
    const [deleteRow, setDeleteRow] = useState(null);
    const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);
    const role = localStorage.getItem('role');
   
    const [historiqueOpen, setHistoriqueOpen] = useState(false);
    const [filters, setFilters] = useState({
        marque: '',
        model: '',
        fournisseur: '',
        filliale: '',
        affectation: '',
        grade: '',
        imei:'',
    });
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
    const [selectedIMEI, setSelectedIMEI] = useState('');
    const [imeiFilter, setImeiFilter] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const apiUrl = `https://gsm-zalar-back1.onrender.com`;
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchData(token);
    }, [refresh]);

    useEffect(() => {
        setFilteredRows(rows.filter(row => {
            return (
                (imeiFilter === '' || row.imei.toLowerCase().includes(imeiFilter.toLowerCase())) &&
                (filters.marque === '' || row.marque.toLowerCase().includes(filters.marque.toLowerCase())) &&
                (filters.model === '' || row.model.toLowerCase().includes(filters.model.toLowerCase())) &&
                (filters.fournisseur === '' || row.fournisseur.toLowerCase().includes(filters.fournisseur.toLowerCase())) &&
                (filters.filliale === '' || row.fillialeLibelle.toLowerCase().includes(filters.filliale.toLowerCase())) &&
                (filters.affectation === '' || row.affectation.toString() === filters.affectation)&&
                (filters.grade === '' || row.grade.toLowerCase().includes(filters.grade.toLowerCase())) // Add grade filter condition
            );
        }));
    }, [filters,imeiFilter, rows]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
        
        console.log('Role:', role);
        console.log('Email:', email);
    
        let url;
    
        if (role === 'ADMIN' || role === 'DSI') {
            url = `${apiUrl}/api/terminals`;
        } else if (role === 'RSI' || role === 'SI') {
            url = `${apiUrl}/api/terminals/ByEmail?email=${encodeURIComponent(email)}`;
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
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    const handleExport = async () => {
        try {
            // Récupérer le jeton d'authentification depuis le stockage local
            const token = localStorage.getItem('token'); // Remplacez ceci par votre méthode de récupération de jeton

            // Effectuer la demande GET pour récupérer le fichier Excel
            const response = await fetch(`${apiUrl}/api/export/terminals`, {
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
                link.download = 'Terminaux.xlsx';
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
    const handleDelete = (row) => {
        setDeleteRow(row);
        setConfirmDeleteOpen(true);
      };
    
      const confirmDelete = async () => {
        try {
          const token = localStorage.getItem('token');
          const email = localStorage.getItem('email');
          const id = deleteRow.id;
    
          const url = `${apiUrl}/api/terminals/${id}?email=${encodeURIComponent(email)}`;
    
          await axios.delete(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          setSnackbarMessage('Terminal a été supprimé avec succès.');
          setSnackbarOpen(true);
          fetchData(token);
        } catch (error) {
          console.error('There was an error deleting the item!', error);
          setSnackbarMessage('Erreur lors de la suppression du Terminal.');
          setSnackbarOpen(true);
        } finally {
          setConfirmDeleteOpen(false);
        }
      };
    
     
    
      const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };

    
    

    const handleAdd = () => {
        setOpen(true);
    };
    const handleAssignmentOpen = (row) => {
        // Assurez-vous que `imei` est bien extrait de `row`
        const { imei } = row || {};
        setSelectedRow(row);
        setSelectedIMEI(imei); // Définir l'IMEI sélectionné
        setAssignmentDialogOpen(true);
    };
    
    const handleAssignmentDialogClose = () => {
        setAssignmentDialogOpen(false);
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
            const response = await fetch(`${apiUrl}/api/terminals/import`, {
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
                alert(' 1. Veuillez vérifier si le fichier csv est ouvert.\n2. Assurez-vous que les données n’existent pas déjà.\n3.  Le schéma du fichier CSV doit être le suivant :  Marque	Model	Ram	Rom	IMEI	Date Acquisition	Garantie	Fournisseur	Filliale	Grade');
            }
        } catch (error) {
            alert('Erreur Au niveau Serveur');
        }
    };
    const formatBoolean = (value) => value ? 'Oui' : 'Non';

    return (
        <Paper sx={{ width: '100%', height: "auto", overflow: 'hidden', marginTop: "25px" }}>
            <Box sx={{ padding: 2, display: 'flex', gap: 2 }}>
            <TextField 
                    label="IMEI" 
                    variant="outlined" 
                    value={imeiFilter}
                    onChange={(e) => setImeiFilter(e.target.value)}
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
                <FormControl className="custom-form-control" variant="outlined" sx={{ minWidth: "125px" }}>
        <InputLabel>Grade</InputLabel>
        <Select
            name="grade"
            value={filters.grade}
            onChange={handleFilterChange}
            label="Grade"
        >
            <MenuItem value="">Tous</MenuItem>
            {[...new Set(rows.map(row => row.grade))].map(grade => (
                <MenuItem key={grade} value={grade}>
                    {grade}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
              

                <FormControl className="custom-form-control" variant="outlined"sx={{minWidth:"125px"}}>
                    <InputLabel>Fournisseur</InputLabel>
                    <Select
                        name="fournisseur"
                        value={filters.fournisseur}
                        onChange={handleFilterChange}
                        label="Fournisseur"
                    >
                        <MenuItem value="">Tous</MenuItem>
                        {[...new Set(rows.map(row => row.fournisseur))].map(fournisseur => (
                            <MenuItem key={fournisseur} value={fournisseur}>
                                {fournisseur}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className="custom-form-control" variant="outlined"sx={{minWidth:"125px"}}>
          <InputLabel>Filiale</InputLabel>
          <Select
            name="filliale"
            value={filters.filliale}
            onChange={handleFilterChange}
            label="Filiale"
          >
            <MenuItem value="">Tous</MenuItem>
            {Array.from(new Set(rows.map(row => row.fillialeLibelle))).map(filliale => (
              <MenuItem key={filliale} value={filliale}>
                {filliale}
              </MenuItem>
            ))}
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
                {role === 'ADMIN' && (  <Button variant="contained" sx={{ height:"50px",backgroundColor:"#B22222" }}  onClick={handleHistorique}>
                    H
                </Button>  )}
                <Button onClick={handleAdd} variant="contained" sx={{  height: "50px", backgroundColor: "green" }} >
                    <AddToHomeScreenIcon />
                </Button>
            </Box>

            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align="left"
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
    {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
        return (
            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                {columns.map((column) => {
                    const value = row[column.id];
                    return (
                        <TableCell key={column.id} align="left">
                            {column.id === 'action' ? (
                                <>
                                    {!row.affectation && (
                                        <>
                                            <Button onClick={() => handleDelete(row)} startIcon={<DeleteIcon />} color="secondary"></Button>
                                            {role !== 'SI' && (
                                                <Button onClick={() => handleAssignmentOpen(row)} startIcon={<AssignmentTurnedInIcon />} sx={{ color: "#FFD700" }}></Button>
                                            )}
                                        </>
                                    )}
                                    <Button onClick={() => handleEditOpen(row)} startIcon={<EditIcon />} sx={{ color: "green" }}></Button>
                                </>
                            ) : column.id === 'affectation' ? (
                                formatBoolean(row.affectation)
                            ) : (
                                value !== null && value !== undefined ? value : 'None'
                            )}
                        </TableCell>
                    );
                })}
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
                <DialogTitle sx={{color:"green"}}>Ajouter un nouveau terminal</DialogTitle>
                <DialogContent>
                    <TerminalForm onClose={handleDialogClose} />
                </DialogContent>
            </Dialog>
            <Dialog open={editOpen} onClose={handleEditDialogClose}>
                
                <DialogContent>
                    <EditTerminal terminal={selectedRow} onClose={handleEditDialogClose} />
                </DialogContent>
            </Dialog>
            <Dialog open={assignmentDialogOpen}  onClose={handleAssignmentDialogClose}>
               
                <DialogContent>
                    <Assigner open={assignmentDialogOpen}
    onClose={handleAssignmentDialogClose}
    imei={selectedIMEI} // Passer l'IMEI sélectionné au composant
    onAssign={() => setRefresh(!refresh)} />
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
             <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle  sx={{color:"green"}}>Confirmer la suppression</DialogTitle>
                <DialogContent>Êtes-vous sûr de vouloir supprimer ce Terminal?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)} sx={{color:"green"}}>
                        Annuler
                    </Button>
                    <Button onClick={confirmDelete} color="secondary">
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={historiqueOpen} onClose={handleHistoriqueClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ color: 'green' }}>Historique des Terminaux</DialogTitle>
                <DialogContent>
                    <HistoriqueTerminal />
                </DialogContent>
            </Dialog>
        </Paper>
    );
}
