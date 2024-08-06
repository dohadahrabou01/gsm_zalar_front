import React, { useEffect, useState } from 'react';
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
import Button from '@mui/material/Button';
import UserForm from './BeneficiareForm';
import EditBeneficiaire from './BeneficiaireEdit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HistoriqueCompte from './HistoriqueBeneficiaire';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import "./Compte.css";
const columns = [
    { id: 'filliale', label: 'Filliale', minWidth: 150 },
    { id: 'grade', label: 'Grade', minWidth: 150 },
    { id: 'code', label: 'Code', minWidth: 150 },
    { id: 'nom', label: 'Nom', minWidth: 150 },
    { id: 'prenom', label: 'Prenom', minWidth: 150 },
    { id: 'multiple', label: 'Multiple', minWidth: 150 },
    { id: 'action', label: 'Action', minWidth: 150 },
];

export default function Beneficiaire() {
    const [rows, setRows] = useState([]);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userEmail = localStorage.getItem('email');
    const [filteredRows, setFilteredRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        nomPrenom: '',
        role: '',
        filliale: '',
        lieu: '',

    });
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [historiqueOpen, setHistoriqueOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);




    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchData(token);
    }, [refresh]);

    useEffect(() => {
        setFilteredRows(rows.filter(row => {
            const nomPrenom = `${row.nom} ${row.prenom}`;
            return (
                (filters.nomPrenom === '' || nomPrenom.toLowerCase().includes(filters.nomPrenom.toLowerCase())) &&
                (filters.role === '' || row.grade.toLowerCase().includes(filters.role.toLowerCase())) &&
                (filters.filliale === '' || row.filliale.toLowerCase().includes(filters.filliale.toLowerCase()))
            );
        }));
    }, [filters, rows]);
    

    const fetchData = async () => {
    try {
        let response;
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
        
        console.log('Role:', role);
        console.log('Email:', email);

        if (role === 'ADMIN' || role === 'DSI') {
            response = await axios.get('http://localhost:8089/api/beneficiares/Beneficiaires', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } else if (role === 'RSI' || role === 'SI') {
            console.log("Fetching data for RSI or SI");
            const url = `http://localhost:8089/api/beneficiares/ByEmail?email=${encodeURIComponent(email)}`;
            console.log('URL:', url);
            response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        if (response && Array.isArray(response.data)) {
            console.log('Response data:', response.data);
            
            const uniqueRows = new Map();
            const seenKeys = new Set();

            response.data.forEach(user => {
                const key = `${user.nom}-${user.prenom}-${user.fillialeLibelle}-${user.grade}-${user.email || 'none'}`;
                
                if (!seenKeys.has(key)) {
                    seenKeys.add(key);
                    uniqueRows.set(key, {
                        id: user.id,
                        filliale: user.fillialeLibelle || 'none',
                        grade: user.grade || 'none',
                        nom: user.nom || 'none',
                        prenom: user.prenom || 'none',
                        code: user.code || 'none',
                        multiple: user.multiple || 'none',
                    });
                }
            });

            console.log('Unique rows:', Array.from(uniqueRows.values()));
            setRows(Array.from(uniqueRows.values()));
        } else {
            console.warn('Response data is not an array or is empty:', response.data);
        }
    } catch (error) {
        console.error('There was an error fetching the data!', error.response ? error.response.data : error.message);
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
    const openSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleEditOpen = (row) => {
        setSelectedRow(row);
        setEditOpen(true);
    };

    
    

    const handleAdd = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
        setRefresh(!refresh);
    };
    const handleHistoriqueClose = () => {
        setHistoriqueOpen(false);
        setRefresh(!refresh);
    };
    const handleHistorique= () => {
        setHistoriqueOpen(true);
       
    };
    const handleEditDialogClose = () => {
        setEditOpen(false);
        setRefresh(!refresh);
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

    const handleConfirmDelete = async () => {
        if (selectedRowToDelete) {
            try {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email'); // Obtenez l'email du local storage
                const id = selectedRowToDelete.id; // Use selectedRowToDelete instead of row
    
                // Construisez l'URL avec l'ID et l'email
                const url = `http://localhost:8089/api/beneficiares/${id}?email=${encodeURIComponent(email)}`;
                await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRefresh(!refresh);
                openSnackbar('Beneficiaire supprimé avec succès.', 'success');
            } catch (error) {
                console.error('There was an error deleting the user!', error);
                openSnackbar('Erreur lors de la suppression du Beneficiaire.', 'error');
            } finally {
                closeConfirmDeleteDialog();
            }
        }
    };
    

    return (
        <Paper sx={{ width: '100%', height: "auto", overflow: 'hidden', marginTop: "65px" }}>
            <Box sx={{ padding: 2, display: 'flex', gap: 2 }}>
                <FormControl className="custom-form-control" variant="outlined"sx={{minWidth:"125px"}}>
                    <InputLabel>Nom Complet</InputLabel>
                    <Select
                        name="nomPrenom"
                        value={filters.nomPrenom}
                        onChange={handleFilterChange}
                        label="Nom + Prenom"
                    >
                        <MenuItem value="">Tous</MenuItem>
                        {rows.map(row => (
                            <MenuItem key={row.nom + row.prenom} value={`${row.nom} ${row.prenom}`}>
                                {`${row.nom} ${row.prenom}`}
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
                        {[...new Set(rows.map(row => row.filliale))].map(filliale => (
                            <MenuItem key={filliale} value={filliale}>
                                {filliale}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className="custom-form-control" variant="outlined"sx={{minWidth:"125px"}}>
                    <InputLabel>Grade</InputLabel>
                    <Select
                        name="role"
                        value={filters.role}
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
                {role === 'ADMIN' && (
                <Button
                    variant="contained"
                    sx={{ marginLeft: 'auto', height: '50px', backgroundColor: '#4B0082' }}
                    onClick={handleExport}
                >
                   <FilePresentIcon />
                </Button>
            )}
                {role === 'ADMIN' && (
                <Button
                    variant="contained"
                    sx={{  height: '50px', backgroundColor: '#B22222' }}
                    onClick={handleHistorique}
                >
                    H
                </Button>
            )}
                <Button variant="contained" sx={{height:"50px",backgroundColor:"green" }}  onClick={handleAdd}>
                <EngineeringIcon  />
                </Button>
            </Box>

            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
    {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
        <TableRow key={row.id}>
            {columns.map((column) => (
                <TableCell key={column.id}>
                    {column.id === 'action' ? (
                        <>
                            <Button onClick={() => handleEditOpen(row)}>
                                <EditIcon style={{ color: 'green' }}/>
                            </Button>
                            <Button onClick={() => handleDelete(row)}>
                                <DeleteIcon style={{ color: 'red' }} />
                            </Button>
                        </>
                    ) :column.id === 'multiple' ? (
                        row[column.id] === true || row[column.id] === 'true' ? 'Oui' : 'Non'
                      ) : (
                        row[column.id]
                    )}
                </TableCell>
            ))}
        </TableRow>
    ))}
</TableBody>

                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle sx={{ color: 'green' }}>Ajouter Bénéficiaire</DialogTitle>
                <DialogContent>
                    <UserForm onClose={handleDialogClose} />
                </DialogContent>
               
            </Dialog>
            <Dialog open={historiqueOpen} onClose={handleHistoriqueClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ color: 'green' }}>Historique des Beneficiaires</DialogTitle>
                <DialogContent>
                    <HistoriqueCompte />
                </DialogContent>
            </Dialog>
            <Dialog open={editOpen} onClose={handleEditDialogClose}>
                <DialogTitle sx={{ color: 'green' }}>Modifier Beneficiaire</DialogTitle>
                <DialogContent>
                    <EditBeneficiaire  row={selectedRow} onClose={handleEditDialogClose} />
                </DialogContent>
                
            </Dialog>
            <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
        >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
        <Dialog
            open={confirmDeleteOpen}
            onClose={closeConfirmDeleteDialog}
        >
            <DialogTitle sx={{color:"green"}}>Confirmation</DialogTitle>
            <DialogContent>
                <p>Êtes-vous sûr de vouloir supprimer ce Beneficiaire?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeConfirmDeleteDialog} sx={{color:"green"}}>Annuler</Button>
                <Button onClick={handleConfirmDelete} color="error">Supprimer</Button>
            </DialogActions>
        </Dialog>
        </Paper>
    );
}
