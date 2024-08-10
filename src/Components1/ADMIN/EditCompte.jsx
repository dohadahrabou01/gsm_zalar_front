import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    List,
    ListItem,
    Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const EditUserForm = ({ userId, onClose }) => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('DSI');
    const [filliales, setFilliales] = useState([]);
    const [selectedFilliales, setSelectedFilliales] = useState([]);
    const [gerantFilliale, setGerantFilliale] = useState('');
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;
   
    const userRole = localStorage.getItem("role");
    const userEmail = localStorage.getItem("email");
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data;
                setUserData(data);
                setNom(data.nom);
                setPrenom(data.prenom);
                setEmail(data.email);
                setPassword(data.password || ''); // Initializing password field
                setRole(data.role);
                setSelectedFilliales(data.filliales.map(filliale => filliale.libelle));
                if (data.gerantFilliale) {
                    setGerantFilliale(data.gerantFilliale.libelle);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId, token]);

    useEffect(() => {
      const fetchFilliales = async () => {
        const userRole = localStorage.getItem('role');
        const userEmail = localStorage.getItem('email');
        let fillialeResponse;
    
        try {
            if (userRole === 'ADMIN' || userRole === 'DSI') {
                fillialeResponse = await axios.get(`${apiUrl}/api/filliales/filliales`);
            } else if (userRole === 'RSI' || userRole === 'SI') {
                fillialeResponse = await axios.get(`${apiUrl}/api/filliales/by-email?email=${encodeURIComponent(userEmail)}`);
            } else {
                console.warn('Rôle d\'utilisateur non reconnu');
                return;
            }
            
            setFilliales(fillialeResponse.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des filliales:', error);
        }
    };

        fetchFilliales();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDTO = {
            nom,
            prenom,
            email,
            password,
            role,
            filliales: selectedFilliales.map(libelle => ({ libelle })),
            gerantFilliale: role === 'SI' ? { libelle: gerantFilliale } : null,
        };
    
        try {
            await axios.put(`${apiUrl}/api/users/update/${userId}`, userDTO, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Compte mis à jour avec succès');
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Problème lors de la mise à jour du compte');
        }
    };
    

    const handleAddFilliale = () => {
        setSelectedFilliales([...selectedFilliales, '']);
    };

    const handleRemoveFilliale = (index) => {
        setSelectedFilliales(selectedFilliales.filter((_, i) => i !== index));
    };

    const handleSelectedFillialeChange = (e, index) => {
        const value = e.target.value;
        const newSelectedFilliales = [...selectedFilliales];
        newSelectedFilliales[index] = value;
        setSelectedFilliales(newSelectedFilliales);
    };

    return (
        <Container maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Nom"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
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
                <TextField
                    label="Prénom"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
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
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                <TextField
                    label="Mot de passe"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <TextField
                    label="Rôle"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={role}
                    InputProps={{ readOnly: true }}
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
                {role === 'SI' && (
                    <FormControl fullWidth margin="normal" sx={{
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
                      }}>
                        <InputLabel>Gérant de Filiale</InputLabel>
                        <Select
                            value={gerantFilliale}
                            onChange={(e) => setGerantFilliale(e.target.value)}
                            fullWidth
                        >
                            {filliales.map((filliale) => (
                                <MenuItem key={filliale.id} value={filliale.libelle}>
                                    {filliale.libelle}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                {role === 'RSI' && (
                    <FormControl fullWidth margin="normal" sx={{
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
                      }}>
                        <InputLabel>Filiales</InputLabel>
                        <Box>
                            <List>
                                {selectedFilliales.map((selectedFilliale, index) => (
                                    <ListItem key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Select
                                            value={selectedFilliale}
                                            onChange={(e) => handleSelectedFillialeChange(e, index)}
                                            fullWidth
                                        >
                                            {filliales.map((filliale) => (
                                                <MenuItem key={filliale.id} value={filliale.libelle}>
                                                    {filliale.libelle}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <IconButton onClick={() => handleRemoveFilliale(index)}>
                                            <RemoveIcon />
                                        </IconButton>
                                       
                                    </ListItem>
                                ))}
                               <IconButton onClick={handleAddFilliale} sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
                                            <AddIcon />
                                        </IconButton>
                            </List>
                        </Box>
                    </FormControl>
                )}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 2
                    }}
                >
                    <Button sx={{ color: "#B22222" }} onClick={onClose}>Fermer</Button>
                    <Button type="submit" sx={{ color: "green" }}>Modifier</Button>
                    
                </Box>
            </form>
        </Container>
    );
};

export default EditUserForm;
