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
import UserForm from './CompteForm';
import EditCompte from './EditCompte';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HistoriqueCompte from './HistoriqueCompte';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./Compte.css";

const columns = [
    { id: 'role', label: 'Role', minWidth: 170 },
    { id: 'nom', label: 'Nom', minWidth: 170 },
    { id: 'prenom', label: 'Prenom', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'filliale', label: 'Filliale', minWidth: 170 },
    { id: 'lieu', label: 'Lieu', minWidth: 170 },
    { id: 'action', label: 'Action', minWidth: 170 },
];

export default function Compte() {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [page, setPage] = useState(0);
    const role = localStorage.getItem('role');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const apiUrl = `${window.location.protocol}//${window.location.hostname}:9000`;
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
                (filters.role === '' || row.role.toLowerCase().includes(filters.role.toLowerCase())) &&
                (filters.filliale === '' || row.filliale.toLowerCase().includes(filters.filliale.toLowerCase())) &&
                (filters.lieu === '' || row.lieu.toLowerCase().includes(filters.lieu.toLowerCase()))
            );
        }));
    }, [filters, rows]);

    const fetchData = async (token) => {
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
    
        let url;
    
        if (role === 'ADMIN' || role === 'DSI') {
          url = `${apiUrl}/api/users/all`;
        } else if (role === 'RSI' || role === 'SI') {
          url = `${apiUrl}/api/users/ByEmail?email=${encodeURIComponent(email)}`;
        }
      
        if (!url) {
          console.error('Invalid role, URL not set.');
          return;
        }
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const uniqueRows = new Map();

            response.data.forEach(user => {
                const email = user.email || 'none';
                const userId = user.id;
                if (user.filliales.length === 0 && !user.gerantFilliale) {
                    const key = `${user.nom}-${user.prenom}-none-none-${email}`;
                    if (!uniqueRows.has(key)) {
                        uniqueRows.set(key, {
                            id: userId,
                            role: user.role,
                            nom: user.nom,
                            prenom: user.prenom,
                            email: email,
                            filliale: 'none',
                            lieu: 'none',
                        });
                    }
                } else if (user.filliales.length > 0) {
                    user.filliales.forEach(f => {
                        const key = `${user.nom}-${user.prenom}-${f.libelle}-${f.lieu}-${email}`;
                        if (!uniqueRows.has(key)) {
                            uniqueRows.set(key, {
                                id: userId,
                                role: user.role,
                                nom: user.nom,
                                prenom: user.prenom,
                                email: email,
                                filliale: f.libelle,
                                lieu: f.lieu,
                            });
                        }
                    });
                } else if (user.gerantFilliale) {
                    const key = `${user.nom}-${user.prenom}-${user.gerantFilliale.libelle}-${user.gerantFilliale.lieu}-${email}`;
                    if (!uniqueRows.has(key)) {
                        uniqueRows.set(key, {
                            id: userId,
                            role: user.role,
                            nom: user.nom,
                            prenom: user.prenom,
                            email: email,
                            filliale: user.gerantFilliale.libelle,
                            lieu: user.gerantFilliale.lieu,
                        });
                    }
                }
            });

            setRows(Array.from(uniqueRows.values()));
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const openSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
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

    const handleHistoriqueClose = () => {
        setHistoriqueOpen(false);
        setRefresh(!refresh);
    };

    const handleHistorique = () => {
        setHistoriqueOpen(true);
    };

    const handleEditOpen = (row) => {
        setSelectedRow(row);
        setEditOpen(true);
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
                await axios.delete(`${apiUrl}/api/users/delete/${id}`, {
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

    const handleAdd = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
        setRefresh(!refresh);
    };

    const handleEditDialogClose = () => {
        setEditOpen(false);
        setRefresh(!refresh);
    };

    return (
        <Paper sx={{ width: '100%', height: "auto", overflow: 'hidden', marginTop: "65px" }}>
            <Box sx={{ padding: 2, display: 'flex', gap: 2 }}>
                <FormControl className="custom-form-control" variant="outlined" sx={{ minWidth: "125px" }}>
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

                <FormControl className="custom-form-control" variant="outlined" sx={{ minWidth: "125px" }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        name="role"
                        value={filters.role}
                        onChange={handleFilterChange}
                        label="Role"
                    >
                        <MenuItem value="">Tous</MenuItem>
                        {[...new Set(rows.map(row => row.role))].map(role => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {(role === 'ADMIN' || role === 'DSI') && (
                    <FormControl className="custom-form-control" variant="outlined" sx={{ minWidth: "125px" }}>
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
                )}

                <FormControl className="custom-form-control" variant="outlined" sx={{ minWidth: "125px" }}>
                    <InputLabel>Lieu</InputLabel>
                    <Select
                        name="lieu"
                        value={filters.lieu}
                        onChange={handleFilterChange}
                        label="Lieu"
                    >
                        <MenuItem value="">Tous</MenuItem>
                        {[...new Set(rows.map(row => row.lieu))].map(lieu => (
                            <MenuItem key={lieu} value={lieu}>
                                {lieu}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
              
                {role === 'ADMIN' && (
                    <Button variant="contained" sx={{ marginLeft: "auto", height: "50px", backgroundColor: "#B22222" }} onClick={handleHistorique}>
                        H
                    </Button>
                )}
                
                <Button variant="contained" sx={{ height: "50px", backgroundColor: "green" }} onClick={handleAdd}>
                    <PersonAddIcon />
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
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle sx={{ color: 'green' }}>Ajouter Utilisateur</DialogTitle>
                <DialogContent>
                    <UserForm onClose={handleDialogClose} />
                </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onClose={handleEditDialogClose}>
                <DialogTitle sx={{ color: 'green' }}>Modifier Utilisateur</DialogTitle>
                <DialogContent>
                    <EditCompte row={selectedRow} userId={selectedRow?.id} onClose={handleEditDialogClose} />
                </DialogContent>
            </Dialog>

            <Dialog open={historiqueOpen} onClose={handleHistoriqueClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ color: 'green' }}>Historique des Comptes</DialogTitle>
                <DialogContent>
                    <HistoriqueCompte />
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
                <DialogTitle sx={{ color: "green" }}>Confirmation</DialogTitle>
                <DialogContent>
                    <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDeleteDialog} sx={{ color: "green" }}>Annuler</Button>
                    <Button onClick={handleConfirmDelete} color="error">Supprimer</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
