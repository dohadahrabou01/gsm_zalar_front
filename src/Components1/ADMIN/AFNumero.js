import React, { useEffect,useRef, useState } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle }from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Alert from '@mui/material/Alert';
import HistoriqueAFNumero from "./HistoriqueAFNumero";
import Snackbar from '@mui/material/Snackbar';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImportExportIcon from '@mui/icons-material/ImportExport';
const columns = [
    { id: 'nomPrenom', label: 'Nom Complet', minWidth: 150 },
    { id: 'filliale', label: 'Filiale', minWidth: 150 },
    { id: 'grade', label: 'Grade', minWidth: 150 },
    { id: 'numero', label: 'Numéro', minWidth: 150 },
    { id: 'forfait', label: 'Forfait', minWidth: 150 },
    { id: 'dateAffectation', label: 'Date d\'Affectation', minWidth: 150 },
 
    { id: 'imprim', label: 'Imprim', minWidth: 150 },
    { id: 'action', label: 'Action', minWidth: 150 },
];

export default function Beneficiaire() {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const role = localStorage.getItem('role');
    const [filters, setFilters] = useState({
        nomPrenom: '',
        filliale: '',
        dateAffectation: '',
    });
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteRow, setDeleteRow] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [importExportOpen, setImportExportOpen] = useState(false);
    const [historiqueOpen, setHistoriqueOpen] = useState(false);
    const apiUrl = `http://${window.location.hostname}:9000`;
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchData(token);
    }, [refresh]);

    useEffect(() => {
        // Filter rows based on selected filters
        setFilteredRows(rows.filter(row => {
            const nomPrenom = `${row.nomPrenom}`;
            const matchesDate = filters.dateAffectation === '' || row.dateAffectation.startsWith(filters.dateAffectation);

            return (
                (filters.nomPrenom === '' || nomPrenom.toLowerCase().includes(filters.nomPrenom.toLowerCase())) &&
                (filters.filliale === '' || row.filliale.toLowerCase().includes(filters.filliale.toLowerCase())) &&
                matchesDate
            );
        }));
    }, [filters, rows]);

    const fetchData = async (token) => {
        
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
        
        console.log('Role:', role);
        console.log('Email:', email);
    
       
    
        let url;

        if (role === 'ADMIN' || role === 'DSI') {
          url = `${apiUrl}/afnumero/all`;
        } else if (role === 'RSI' || role === 'SI') {
          url = `${apiUrl}/afnumero/ByEmail?email=${encodeURIComponent(email)}`;
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
          console.log(response.data);
            response.data.forEach(item => {
                const { id, beneficiareDTO, numeroDTO, validation, date_affectation, imprim } = item;
                const { nom, prenom, fillialeLibelle, grade } = beneficiareDTO;
                const { numero, forfaitLibelle } = numeroDTO;
    
                if (id === undefined) {
                    console.error('Item id is missing:', item);
                    return;
                }
    
                const key = `${nom}-${prenom}-${fillialeLibelle}-${grade}-${numero}`;
                if (!uniqueRows.has(key)) {
                    uniqueRows.set(key, {
                        id,
                        nomPrenom: `${nom} ${prenom}`,
                        filliale: fillialeLibelle,
                        grade: grade,
                        numero: numero,
                        forfait: forfaitLibelle,
                        dateAffectation: date_affectation,
                        validation: validation ? 'Oui' : 'Non',
                        imprim: imprim ? 'Oui' : 'Non',
                    });
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
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleHistoriqueClose = () => {
        setHistoriqueOpen(false);
        setRefresh(!refresh);
    };
    const handleHistorique= () => {
        setHistoriqueOpen(true);
       
    };
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
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
            const response = await fetch(`${apiUrl}/afnumero/import`, {
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
                alert(' veuiiler verifier si le fichier  Excel est ouvert ou les donnes Deja exist');
            }
        } catch (error) {
            alert('Erreur Au niveau Serveur');
        }
    };
    const handleDelete = (row) => {
        setDeleteRow(row);
        setConfirmDeleteOpen(true);
    };
    
const handleExport = async () => {
    try {
        // Récupérer le jeton d'authentification depuis le stockage local
        const token = localStorage.getItem('token'); // Remplacez ceci par votre méthode de récupération de jeton
  
        // Effectuer la demande GET pour récupérer le fichier Excel
        const response = await fetch(`${apiUrl}/api/export/afNumeros`, {
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
            link.download = 'Affectation_Numeros.xlsx';
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

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email'); // Obtenez l'email du local storage
            const id = deleteRow.id; // Utilisez deleteRow pour obtenir l'ID
    
            // Construisez l'URL avec l'ID et l'email
            const url = `${apiUrl}/afnumero/${id}?email=${encodeURIComponent(email)}`;
    
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Réinitialisez les données après la suppression
            setSnackbarMessage('L\'affectation a été supprimé avec succès.');
            setSnackbarOpen(true);
            setRefresh(!refresh);
        } catch (error) {
            console.error('There was an error deleting the item!', error);
            setSnackbarMessage('Erreur lors de la suppression de l\'affectation.');
            setSnackbarOpen(true);
        } finally {
            setConfirmDeleteOpen(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    const handleDownloadPdf = async (id) => {
        try {
          const token = localStorage.getItem('token');
      
          // Obtenir les détails du bénéficiaire et la date d'affectation
          const beneficiaryResponse = await axios.get(`${apiUrl}/afnumero/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Ajouter le token d'authentification
            }
          });
      
          const beneficiary = beneficiaryResponse.data.beneficiareDTO; // Accédez au bénéficiaire via 'beneficiareDTO'
          const beneficiaryName = `${beneficiary.nom} ${beneficiary.prenom}`;
          
          // Obtenir la date d'affectation
          const dateAffectation = beneficiaryResponse.data.date_affectation;
          const formattedDate = dateAffectation.replaceAll("/", "-"); // Formatage de la date si nécessaire
      
          // Télécharger le PDF
          const pdfResponse = await axios.get(`${apiUrl}/api/pdfAFNumero/download/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Ajouter le token d'authentification
            },
            responseType: 'blob', // nécessaire pour le téléchargement de fichiers
          });
      
          // Créer le nom du fichier basé sur le bénéficiaire et la date d'affectation
          const fileName = `${beneficiaryName}_${formattedDate}.pdf`;
      
          // Crée un URL pour le blob et déclenche le téléchargement
          const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName); // Utiliser le nom du fichier basé sur le bénéficiaire et la date d'affectation
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      
          setRefresh(!refresh);
        } catch (error) {
          console.error('Erreur lors du téléchargement du PDF', error);
          setSnackbarMessage('Erreur lors du téléchargement du PDF.');
          setSnackbarOpen(true);
        }
      };
      const handleFileUpload = async (event, id) => {
        const token = localStorage.getItem('token');
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                await axios.post(`${apiUrl}/afnumero/upload/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setSnackbarMessage('Image uploadée avec succès.');
                setSnackbarOpen(true);
                setRefresh(!refresh);
            } catch (error) {
                console.error('Erreur lors de l\'upload de l\'image', error);
                setSnackbarMessage('Erreur lors de l\'upload de l\'image.');
                setSnackbarOpen(true);
            }
        }
    };

    const handleCheckImage = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${apiUrl}/afnumero/preuve/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', // Spécifie que la réponse est un blob
            });
    
            // Vérifie si la réponse contient un blob
            if (response.data && response.data.size > 0) {
                const imageUrl = URL.createObjectURL(response.data);
    
                // Ouvre l'image dans une nouvelle fenêtre ou onglet
                window.open(imageUrl);
    
                // Retourne l'URL pour d'autres usages
                return imageUrl;
            } else {
                console.log('Aucune image trouvée.');
                // Optionnel : afficher un message à l'utilisateur ou prendre une autre action
                return null;
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'image', error);
            return null;
        }
    };
    
    

    const uniqueNomPrenoms = Array.from(new Set(rows.map(row => row.nomPrenom)));

    return (
        <Paper sx={{ width: '100%', height: "auto", overflow: 'hidden' }}>
            <Box sx={{ padding: 2, display: 'flex', gap: 2 }}>
                <FormControl className="custom-form-control" variant="outlined"sx={{minWidth:"125px"}}>
                    <InputLabel>Nom Complet</InputLabel>
                    <Select
                        name="nomPrenom"
                        value={filters.nomPrenom}
                        onChange={handleFilterChange}
                        label="Nom Complet"
                    >
                        <MenuItem value="">Tous</MenuItem>
                        {uniqueNomPrenoms.map(nom => (
                            <MenuItem key={nom} value={nom}>
                                {nom}
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
                        {Array.from(new Set(rows.map(row => row.filliale))).map(filliale => (
                            <MenuItem key={filliale} value={filliale}>
                                {filliale}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    name="dateAffectation"
                    label="Date d'Affectation"
                    type="date"
                    value={filters.dateAffectation}
                    onChange={handleFilterChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{ minWidth: 150 }}
                />
                  {role === 'ADMIN' && (
                <>
                    <Button
                        variant="contained"
                        sx={{ marginLeft: 'auto', height: '50px', backgroundColor: '#4B0082' }}
                        onClick={handleExport}
                    >
                        <ImportExportIcon />
                    </Button>
                </>
            )}
                 {role === 'ADMIN' && (  <Button variant="contained" sx={{height:"50px",backgroundColor:"#B22222" }}  onClick={handleHistorique}>
                    H
                </Button>  )}
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
                        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        {column.id === 'action' ? (
                                            <>
                                        <Button onClick={() => handleDownloadPdf(row.id)}>
                  <FileDownloadIcon sx={{ color:"#FF7F50", fontSize: 20, margin: 1 }} />
                </Button>

                <label htmlFor={`upload-${row.id}`}>
                                                    <input
                                                        style={{ display: 'none' }}
                                                        id={`upload-${row.id}`}
                                                        name={`upload-${row.id}`}
                                                        type="file"
                                                        onChange={(event) => handleFileUpload(event, row.id)}
                                                    />
                                                    <FileUploadIcon sx={{ color:"green", fontSize: 20, margin: 1 }} />
                                                </label>
                                                <VisibilityIcon sx={{ color:"#8A2BE2", fontSize: 20, margin: 2 }}
                                                    onClick={async () => {
                                                        const imageUrl = await handleCheckImage(row.id);
                                                        if (imageUrl) {
                                                            window.open(imageUrl, '_blank');
                                                        } else {
                                                            setSnackbarMessage('Aucune image trouvée.');
                                                            setSnackbarOpen(true);
                                                        }
                                                    }}
                                                />
                                                {role!=="SI" &&(
                                                 <Button onClick={() => handleDelete(row)}>
                                                    <DeleteIcon style={{ color: 'red' }} />
                                                </Button>)}
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
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Dialog for delete confirmation */}
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle  sx={{color:"green"}}>Confirmer la suppression</DialogTitle>
                <DialogContent>Êtes-vous sûr de vouloir supprimer cette Affectation  ?</DialogContent>
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
                <DialogTitle sx={{ color: 'green' }}>Historique des Affectations Numeros</DialogTitle>
                <DialogContent>
                    <HistoriqueAFNumero />
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
            {/* Snackbar for success/error messages */}
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
}
