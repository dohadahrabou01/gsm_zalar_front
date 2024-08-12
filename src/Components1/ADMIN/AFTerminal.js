import React, { useEffect,useRef, useState, useMemo } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import HistoriqueAFTerminal from "./HistoriqueAFTerminal";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Select, MenuItem, Box, InputLabel,
  FormControl, Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, CircularProgress,DialogContentText
} from '@mui/material';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Edit as EditIcon, Delete as DeleteIcon, FileUpload as FileUploadIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckIcon from '@mui/icons-material/Check';
const columns = [
  { id: 'nomPrenom', label: 'Nom Complet', minWidth: 150 },
  { id: 'grade', label: 'Grade', minWidth: 150 },
  { id: 'fillialeLibelle', label: 'Filiale', minWidth: 150 },
  { id: 'marque', label: 'Marque', minWidth: 150 },
  { id: 'imei', label: 'IMEI', minWidth: 150 },
  { id: 'dateAffectation', label: 'Date d\'Affectation', minWidth: 150 },
  { id: 'validation', label: 'validation', minWidth: 150 },
 
  { id: 'imprim', label: 'Imprim', minWidth: 150 },
  { id: 'action', label: 'Action', minWidth: 150 },
];

const AFTerminalDisplay = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refresh, setRefresh] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filters, setFilters] = useState({
    nomPrenom: '',
    filliale: '',
    dateAffectation: '',
    validation: '',
  });
   
  const role = localStorage.getItem('role');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dureeDialogOpen, setDureeDialogOpen] = useState(false);
  const [duree, setDuree] = useState('');
  const [historiqueOpen, setHistoriqueOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmValidationOpen, setConfirmValidationOpen] = useState(false);
  const [rowToValidate, setRowToValidate] = useState(null);
  const [confirmRejectionOpen, setConfirmRejectionOpen] = useState(false);
  const [rowToReject, setRowToReject] = useState(null);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const currentUserRole = localStorage.getItem('role');
  const apiUrl = `${window.location.protocol}//${window.location.hostname}:9000`;
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    fetchData(token);
  }, []);
  const filterRows = (rows, filters) => {
    return rows.filter(row => {
      return (
        (!filters.nomPrenom || (row.nomPrenom && row.nomPrenom.startsWith(filters.nomPrenom))) &&
        (!filters.filliale || (row.fillialeLibelle && row.fillialeLibelle.startsWith(filters.filliale))) &&
        (!filters.dateAffectation || row.dateAffectation === filters.dateAffectation) &&
        (!filters.validation || row.validation === filters.validation) // Ajoutez ceci
      );
    });
  };
  

useEffect(() => {
  setFilteredRows(filterRows(rows, filters));
}, [filters, rows]);

  const fetchData = async (token) => {
    setLoading(true);
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    
    console.log('Role:', role);
    console.log('Email:', email);

   

    let url;

    if (role === 'ADMIN' || role === 'DSI') {
      url =`${apiUrl}/api/afterminals/all`;
    } else if (role === 'RSI' || role === 'SI') {
      url = `${apiUrl}/api/afterminals/ByEmail?email=${encodeURIComponent(email)}`;
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
 

      const data = response.data.map(item => ({
        id: item.id,
        nomPrenom: `${item.beneficiareDTO.nom} ${item.beneficiareDTO.prenom}`,
        fillialeLibelle: item.beneficiareDTO.fillialeLibelle,
        grade: item.beneficiareDTO.grade,
        marque: item.terminalDTO.marque,
        imei: item.terminalDTO.imei,
        dateAffectation: item.date_affectation,
        validation: item.validation ,
    
        imprim: item.imprim ? 'Oui' : 'Non',
      }));

      setRows(data);
      setLoading(false);
    } catch (error) {
      console.error('There was an error fetching the data!', error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleHistoriqueClose = () => {
    setHistoriqueOpen(false);
    setRefresh(!refresh);
};
const handleHistorique= () => {
    setHistoriqueOpen(true);
   
};
const handleFileChange = (event) => {
  setSelectedFile(event.target.files[0]);
};
const handleExport = async () => {
  try {
      // Récupérer le jeton d'authentification depuis le stockage local
      const token = localStorage.getItem('token'); // Remplacez ceci par votre méthode de récupération de jeton

      // Effectuer la demande GET pour récupérer le fichier Excel
      const response = await fetch(`${apiUrl}/api/export/afterminaux`, {
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
          link.download = 'Affectation_Terminaux.xlsx';
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
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
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

      const url = `${apiUrl}/api/afterminals/${id}?email=${encodeURIComponent(email)}`;

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbarMessage('L\'affectation a été supprimé avec succès.');
      setSnackbarOpen(true);
      fetchData(token);
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

  const handleDureeDialogOpen = () => {
    setDureeDialogOpen(true);
  };

  const handleDureeDialogClose = () => {
    setDureeDialogOpen(false);
    setDuree('');
  };

  const handleDureeChange = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiUrl}/api/afterminals/update-duree-max?duree=${duree}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbarMessage('Durée max mise à jour avec succès.');
      setSnackbarOpen(true);
      fetchData(token);
    } catch (error) {
      console.error('There was an error updating the duration max', error);
      setSnackbarMessage('Erreur lors de la mise à jour de la durée max.');
      setSnackbarOpen(true);
    } finally {
      handleDureeDialogClose();
    }
  };

  const handleValidationClick = (row) => {
    setRowToValidate(row);
    setConfirmValidationOpen(true);
  };
  const handleRejectionClick = (row) => {
    setRowToReject(row);
    setConfirmRejectionOpen(true);
  };
  const handleValidationConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      const id = rowToValidate.id;

      await axios.put(`${apiUrl}/api/afterminals/update/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbarMessage('L\'affectation a été validée avec succès.');
      setSnackbarOpen(true);
      fetchData(token);
    } catch (error) {
      console.error('There was an error validating the assignment!', error);
      setSnackbarMessage('Erreur lors de la validation de l\'affectation.');
      setSnackbarOpen(true);
    } finally {
      setConfirmValidationOpen(false);
    }
  };
  const handleRejectConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      const id = rowToReject.id;

      await axios.put(`${apiUrl}/api/afterminals/reject/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbarMessage('L\'affectation a été rejetée avec succès.');
      setSnackbarOpen(true);
      fetchData(token);
    } catch (error) {
      console.error('There was an error rejecting the assignment!', error);
      setSnackbarMessage('Erreur lors de la rejection de l\'affectation.');
      setSnackbarOpen(true);
    } finally {
      setConfirmRejectionOpen(false);
    }
  };
  const handleDownloadPdf = async (id) => {
    try {
      const token = localStorage.getItem('token');
  
      // Obtenir les informations du bénéficiaire et la date d'affectation
      const beneficiaryResponse = await axios.get(`${apiUrl}/api/afterminals/${id}`, {
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
      const pdfResponse = await axios.get(`${apiUrl}/api/pdf/download/${id}`, {
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
            await axios.post(`${apiUrl}/api/afterminals/upload/${id}`, formData, {
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
        const response = await axios.get(`${apiUrl}/api/afterminals/preuve/${id}`, {
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

const handleImport = async () => {
  if (!selectedFile) {
      alert("Aucun fichier sélectionné");
      return;
  }

  try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/afterminals/import`, {
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
  const uniqueNomPrenoms = useMemo(() => Array.from(new Set(rows.map(row => row.nomPrenom))), [rows]);

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
            {Array.from(new Set(rows.map(row => row.fillialeLibelle))).map(filliale => (
              <MenuItem key={filliale} value={filliale}>
                {filliale}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className="custom-form-control" variant="outlined"sx={{minWidth:"125px"}}>
  <InputLabel>Validation</InputLabel>
  <Select
    name="validation"
    value={filters.validation}
    onChange={handleFilterChange}
    label="Validation"
  >
    <MenuItem value="">Tous</MenuItem>
    <MenuItem value="VALIDEE">Validée</MenuItem>
    <MenuItem value="ENCOURS">En cours</MenuItem>
    <MenuItem value="REJECTED">Rejetée</MenuItem>
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
        />
         {currentUserRole === 'ADMIN' && (
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
{currentUserRole === 'ADMIN' && (
         <>
         <Button
                    variant="contained"
                   
                    onClick={handleHistorique}
                    sx={{  height: "50px", backgroundColor: "#B22222" }}
                >
                  H
                </Button>
                <Button
                    variant="contained"
                    startIcon={<AccessTimeIcon />}
                    onClick={handleDureeDialogOpen}
                    sx={{ height: "50px", backgroundColor: "green" }}
                >
                    Durée max
                </Button>
                </>)}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'action' ? (
                            <>
                          {row.validation === 'VALIDEE' && (
  <>
    <Button onClick={() => handleDownloadPdf(row.id)}>
      <FileDownloadIcon sx={{ color: "#FF7F50", fontSize: 20, margin: 1 }} />
    </Button>
    <label htmlFor={`upload-${row.id}`}>
      <input
        style={{ display: 'none' }}
        id={`upload-${row.id}`}
        name={`upload-${row.id}`}
        type="file"
        onChange={(event) => handleFileUpload(event, row.id)}
      />
      <FileUploadIcon sx={{ color: "green", fontSize: 20, margin: 1 }} />
    </label>
    <VisibilityIcon
      sx={{ color: "#8A2BE2", fontSize: 20, margin: 2 }}
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
  </>
)} 


{currentUserRole!=='SI' &&(
        <Button onClick={() => handleDelete(row)}>
          <DeleteIcon sx={{ color: 'red', fontSize: 20, margin: 1 }} />
        </Button>) }
     
                            {row.validation === 'ENCOURS' && (
                              <>
                             {currentUserRole === 'ADMIN' || currentUserRole === 'DSI' ? (
        <>
          <Button onClick={() => handleValidationClick(row)}>
            <CheckIcon sx={{ color: 'green', fontSize: 20, margin: 1 }} />
          </Button>
          <Button onClick={() => handleRejectionClick(row)}>
            <ClearIcon sx={{ color: 'red', fontSize: 20, margin: 1 }} />
          </Button>
        </>
      ) : null}</>
                            )}
                        </>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
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
        </>
      )}

    

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle sx={{color:"green"}}>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <p>Êtes-vous sûr de vouloir supprimer cette affectation ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmValidationOpen} onClose={() => setConfirmValidationOpen(false)}>
        
        <DialogContent>
          Êtes-vous sûr de vouloir valider cette affectation ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmValidationOpen(false)} sx={{color:"red"}}>
            Annuler
          </Button>
          <Button onClick={handleValidationConfirm} sx={{color:"green"}}>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={historiqueOpen} onClose={handleHistoriqueClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ color: 'green' }}>Historique des Affectations Numeros</DialogTitle>
                <DialogContent>
                    <HistoriqueAFTerminal />
                </DialogContent>
            </Dialog>
      <Dialog open={confirmRejectionOpen} onClose={() => setConfirmRejectionOpen(false)}>
       
        <DialogContent>
          <p>Êtes-vous sûr de vouloir rejeter cette affectation ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRejectionOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleRejectConfirm} color="secondary">
            Rejeter
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
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
      <Dialog open={dureeDialogOpen} onClose={handleDureeDialogClose}>
        <DialogTitle sx={{color:"green"}}>Mise à jour de la durée maximale</DialogTitle>
        <DialogContent>
          <TextField
            label="Durée max (en ans)"
            type="number"
            value={duree}
            onChange={(e) => setDuree(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDureeDialogClose} sx={{color:"red"}}>
            Annuler
          </Button>
          <Button onClick={handleDureeChange} sx={{color:"green"}}>
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AFTerminalDisplay;
