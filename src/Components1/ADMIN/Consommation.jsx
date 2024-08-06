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
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import AddConsommation from './ConsommationForm';
import EditConsommation from './EditConsommation';
import AddchartIcon from '@mui/icons-material/Addchart';

const columns = [
    { id: 'numero', label: 'Numéro', minWidth: 100 },
    { id: 'annee', label: 'Année', minWidth: 100 },
    { id: 'janvier', label: 'Janvier', minWidth: 50 },
    { id: 'fevrier', label: 'Février', minWidth: 50 },
    { id: 'mars', label: 'Mars', minWidth: 50 },
    { id: 'avril', label: 'Avril', minWidth: 50 },
    { id: 'mai', label: 'Mai', minWidth: 50 },
    { id: 'juin', label: 'Juin', minWidth: 50 },
    { id: 'juillet', label: 'Juillet', minWidth: 50 },
    { id: 'aout', label: 'Août', minWidth: 50 },
    { id: 'septembre', label: 'Septembre', minWidth: 50 },
    { id: 'octobre', label: 'Octobre', minWidth: 50 },
    { id: 'novembre', label: 'Novembre', minWidth: 50 },
    { id: 'decembre', label: 'Décembre', minWidth: 50 },
    { id: 'action', label: 'Action', minWidth: 100 },
];

export default function ConsommationTable() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);  // State for opening Add dialog
    const [selectedRow, setSelectedRow] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [numeroFilter, setNumeroFilter] = useState('');
    const [anneeFilter, setAnneeFilter] = useState('');

    useEffect(() => {
        fetchConsommations();
    }, [refresh]);

    const fetchConsommations = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8089/api/consommations', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Fetched data:', response.data);  // Log data for verification
            setRows(response.data);
        } catch (error) {
            console.error('There was an error fetching the consommations data!', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEditClick = (row) => {
        setSelectedRow(row);
        setEditOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditOpen(false);
        setRefresh(!refresh);
    };

    const handleAddDialogClose = () => {
        setAddOpen(false);
        setRefresh(!refresh);
    };

    const handleDelete = async (row) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8089/api/consommations/${row.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRefresh(!refresh);
        } catch (error) {
            console.error('There was an error deleting the consommation!', error);
        }
    };

    const filteredRows = rows.filter(row => 
        (numeroFilter === '' || row.numero.includes(numeroFilter)) &&
        (anneeFilter === '' || row.annee.includes(anneeFilter))
    );

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '75px' }}>
            <Box sx={{ padding: 2, display: 'flex' }}>
                <TextField 
                    label="Numéro" 
                    variant="outlined" 
                    value={numeroFilter}
                    onChange={(e) => setNumeroFilter(e.target.value)}
                    sx={{ marginRight: "5px" }}
                />
                <TextField 
                    label="Année" 
                    variant="outlined" 
                    value={anneeFilter}
                    onChange={(e) => setAnneeFilter(e.target.value)}
                />
                <Button variant="contained" sx={{ marginLeft: "auto", height: "50px", backgroundColor: "green" }} onClick={() => setAddOpen(true)}>
                    <AddchartIcon />
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
                                                <Button onClick={() => handleEditClick(row)}>
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
            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Modifier Consommation</DialogTitle>
                <DialogContent>
                    {selectedRow && (
                        <EditConsommation
                            row={selectedRow}
                            onClose={handleEditDialogClose}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <Dialog open={addOpen} onClose={handleAddDialogClose}>
                <DialogTitle>Ajouter une Consommation</DialogTitle>
                <DialogContent>
                    <AddConsommation onClose={handleAddDialogClose} />
                </DialogContent>
            </Dialog>
        </Paper>
    );
}
