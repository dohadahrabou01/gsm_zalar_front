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
import RestoreIcon from '@mui/icons-material/Restore';


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
    { id: 'action', label: 'Action', minWidth: 150 },
];
export default function Compte() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const apiUrl = `${window.location.protocol}//${window.location.hostname}:9000`;
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchHistorique(token);
    }, [refresh]);

    const fetchHistorique = async (token) => {
        try {
            const response = await axios.get(`${apiUrl}/api/terminals/Historique`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setRows(response.data);
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleRestore = async (row) => {
        try {
            const id = row.id;
            const token = localStorage.getItem('token');
            await axios.put(`${apiUrl}/api/terminals/recuperer/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRefresh(!refresh);
        } catch (error) {
            console.error('There was an error restoring the user!', error);
        }
    };

  

    return (
        <Paper sx={{ width: '100%', height: "auto", overflow: 'hidden'}}>
            

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
                                                <Button onClick={() => handleRestore(row)}>
                                                    <RestoreIcon style={{ color: 'green' }} />
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

           
        </Paper>
    );
}
