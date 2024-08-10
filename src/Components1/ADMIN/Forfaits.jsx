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
import ForfaitForm from "./Forfait";
import EditForfaitForm from "./EditForfait";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DialogActions from '@mui/material/DialogActions';
import HistoriqueForfait from "./HistoriqueForfait"
const columns = [
    { id: 'libelle', label: 'Libelle', minWidth: 170 },
    { id: 'prix', label: 'Prix', minWidth: 170 },
    { id: 'action', label: 'Action', minWidth: 170 },
];

export default function ForfaitTable() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [forfaitOpen, setForfaitOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [historiqueOpen, setHistoriqueOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    useEffect(() => {
        fetchForfaits();
    }, [refresh]);

    const fetchForfaits = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/forfaits/forfaits`);
            setRows(response.data);
        } catch (error) {
            console.error('There was an error fetching the forfaits data!', error);
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
                await axios.delete(`${apiUrl}/api/forfaits/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRefresh(!refresh);
                openSnackbar('Utilisateur supprimé avec succès.', 'success');
            } catch (error) {
                console.error('There was an error deleting the user!', error);
                openSnackbar('Erreur lors de la suppression de l\'utilisateur.', 'error');
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
            <Button onClick={handleHistorique} variant="contained" sx={{ backgroundColor: '#B22222',marginRight:"2px" }} >
                    H
                </Button>
            
                <Button onClick={handleAddForfait} variant="contained" sx={{ backgroundColor: 'green' }} startIcon={<AddIcon />}>
                    Forfait
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
                <DialogTitle sx={{ color: 'green' }}>Ajouter un Forfait</DialogTitle>
                <DialogContent>
                    <ForfaitForm onClose={handleForfaitDialogClose} />
                </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onClose={handleEditDialogClose}>
                <DialogTitle sx={{ color: 'green' }}>Modifier le Forfait</DialogTitle>
                <DialogContent>
                    {selectedRow && (
                        <EditForfaitForm row={selectedRow} onClose={handleEditDialogClose} />
                    )}
                </DialogContent>
            </Dialog>
            <Dialog open={historiqueOpen} onClose={handleHistoriqueClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ color: 'green' }}>Historique des Forfait</DialogTitle>
                <DialogContent>
                    <HistoriqueForfait />
                </DialogContent>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
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
                <p>Êtes-vous sûr de vouloir supprimer ce forfait ?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeConfirmDeleteDialog} sx={{color:"green"}}>Annuler</Button>
                <Button onClick={handleConfirmDelete} color="error">Supprimer</Button>
            </DialogActions>
        </Dialog>
        </Paper>
    );
}
