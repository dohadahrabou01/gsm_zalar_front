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
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FournisseurForm from './FournisseurForm';  // Assurez-vous que le formulaire d'ajout/édition est configuré pour les fournisseurs
import EditFournisseur from './EditFournisseur';
import HistoriqueFournisseur from "./HistoriqueFournisseur";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DialogActions from '@mui/material/DialogActions';
const columns = [
    { id: 'libelle', label: 'Libelle', minWidth: 170 },
    { id: 'tel', label: 'Tel', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'action', label: 'Action', minWidth: 170 },
];

export default function FournisseurTable() {
    const [historiqueOpen, setHistoriqueOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [forfaitOpen, setForfaitOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);
   const userEmail=localStorage.getItem("email");
   const apiUrl = `http://${window.location.hostname}:9000`;

    useEffect(() => {
        fetchFournisseurs();
    }, [refresh]);

    const fetchFournisseurs = async () => {
        const token = localStorage.getItem('token'); // Assurez-vous que le token est stocké dans localStorage
        try {
            const response = await axios.get(`${apiUrl}/api/fournisseurs`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRows(response.data);
        } catch (error) {
            console.error('There was an error fetching the fournisseurs data!', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEdit = (row) => {
        setSelectedRow(row);
        setEditOpen(true);
    };


    const handleAddForfait = () => {
        setForfaitOpen(true);
    };

    const handleForfaitDialogClose = () => {
        setForfaitOpen(false);
        setRefresh(!refresh);
    };

    const handleEditDialogClose = () => {
        setEditOpen(false);
        setRefresh(!refresh);
    };

   

    const openSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
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
    
    const handleConfirmDelete = async () => {
        if (selectedRowToDelete) {
            try {
                const id = selectedRowToDelete.id;
                const token = localStorage.getItem('token');
                await axios.delete(`${apiUrl}/api/fournisseurs/${id}?email=${encodeURIComponent(userEmail)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRefresh(!refresh);
                openSnackbar('Fournisseur supprimé avec succès.', 'success');
            } catch (error) {
                console.error('There was an error deleting the user!', error);
                openSnackbar('Erreur lors de la suppression du Fournisseur.', 'error');
            } finally {
                closeConfirmDeleteDialog();
            }
        }
    };

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };
 const handleHistoriqueClose = () => {
        setHistoriqueOpen(false);
        setRefresh(!refresh);
    };
 const handleHistorique= () => {
        setHistoriqueOpen(true);
       
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '25px' }}>
            <Box sx={{ padding: 2, display: 'flex', justifyContent: 'flex-end' }}>
              
            <Button onClick={handleHistorique} variant="contained" sx={{ backgroundColor: '#B22222' ,marginRight:'10px'}} >
                    H
                </Button>
              
                <Button onClick={handleAddForfait} variant="contained" sx={{ backgroundColor: 'green' }} startIcon={<AddIcon />}>
                    Fournisseur
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
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow key={row.id}>
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        {column.id === 'action' ? (
                                            <>
                                                <Button onClick={() => handleEdit(row)}>
                                                    <EditIcon style={{ color: 'green' }} />
                                                </Button>
                                                <Button onClick={() => handleDelete(row)}>
                                                    <DeleteIcon style={{ color: 'red' }} />
                                                </Button>
                                            </>
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
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Dialog open={forfaitOpen} onClose={handleForfaitDialogClose}>
                <DialogTitle sx={{color:"green"}}>Ajouter un Fournisseur</DialogTitle>
                <DialogContent>
                    <FournisseurForm onClose={handleForfaitDialogClose} />
                </DialogContent>
            </Dialog>
            <Dialog open={historiqueOpen} onClose={handleHistoriqueClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ color: 'green' }}>Historique des Fournisseurs</DialogTitle>
                <DialogContent>
                    <HistoriqueFournisseur />
                </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onClose={handleEditDialogClose}>
                <DialogTitle sx={{color:"green"}}>Modifier le Fournisseur</DialogTitle>
                <DialogContent>
                    {selectedRow && (
                        <EditFournisseur row={selectedRow} onClose={handleEditDialogClose} />
                    )}
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
                <p>Êtes-vous sûr de vouloir supprimer ce fournisseur ?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeConfirmDeleteDialog} sx={{color:"green"}}>Annuler</Button>
                <Button onClick={handleConfirmDelete} color="error">Supprimer</Button>
            </DialogActions>
        </Dialog>
        </Paper>
    );
}
