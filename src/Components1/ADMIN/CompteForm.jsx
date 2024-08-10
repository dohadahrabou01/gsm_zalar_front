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
    Box,
    List,
    ListItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const UserForm = ({ onClose }) => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('DSI');
    const [filliales, setFilliales] = useState([]);
    const [selectedFilliales, setSelectedFilliales] = useState([]);
    const [selectedFillialeSI, setSelectedFillialeSI] = useState('');  // Pour le rôle SI
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const userEmail = localStorage.getItem("email");

    useEffect(() => {
        const fetchFilliales = async () => {
            let endpoint = '';

            if (userRole === 'ADMIN' || userRole === 'DSI') {
                endpoint = role === 'SI'
                    ? `${apiUrl}/api/filliales/SI`
                    : role === 'RSI'
                        ? `${apiUrl}/api/filliales/RSI`
                        : '';
            } else if (userRole === 'RSI') {
                endpoint = `${apiUrl}/api/filliales/by-rsi?email=${encodeURIComponent(userEmail)}`;
            }

            if (endpoint) {
                try {
                    const response = await axios.get(endpoint);
                    setFilliales(response.data);

                    if (role === 'RSI' || role === 'SI') {
                        setSelectedFilliales(response.data.map(filliale => filliale.libelle));
                    }
                } catch (error) {
                    console.error('Error fetching filliales:', error);
                }
            } else {
                setFilliales([]);
                setSelectedFilliales([]);
            }
        };

        fetchFilliales();
    }, [role, userRole, userEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDTO = {
            nom,
            prenom,
            email,
            password,
            role,
            filliales: role === 'SI' ? [{ libelle: selectedFillialeSI }] : selectedFilliales.map(libelle => ({ libelle })),
        };

        try {
            const response = await axios.post(`${apiUrl}/api/users/create`, userDTO, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.data) {
                alert('Email existe déjà');
            } else {
                console.log('User created:', response.data);
                alert('Compte créé avec succès');
                onClose();
            }
        } catch (error) {
            console.error('Error creating user:', error.response ? error.response.data : error.message);
            alert('Problème lors de l’ajout du compte');
        }
    };

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        setRole(newRole);
        if (newRole === 'SI') {
            setSelectedFilliales([]);
            setSelectedFillialeSI('');  // Réinitialiser la sélection pour SI
        }
    };

    const handleSelectedFillialeChange = (e, index) => {
        const newFilliales = [...selectedFilliales];
        newFilliales[index] = e.target.value;
        setSelectedFilliales(newFilliales);
    };

    const handleAddFilliale = () => {
        setSelectedFilliales([...selectedFilliales, '']);
    };

    const handleRemoveFilliale = (index) => {
        const newFilliales = selectedFilliales.filter((_, i) => i !== index);
        setSelectedFilliales(newFilliales);
    };

    const getAvailableRoles = () => {
        switch (userRole) {
            case 'ADMIN':
                return ['DSI', 'RSI', 'SI'];
            case 'RSI':
                return ['SI'];
            case 'DSI':
                return ['RSI', 'SI'];
            default:
                return [];
        }
    };

    const renderTextField = (label, value, onChange, type = 'text') => (
        <TextField
            label={label}
            variant="outlined"
            fullWidth
            margin="normal"
            type={type}
            value={value}
            onChange={onChange}
            required
            sx={{
                marginBottom: 2,
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#4B0082',
                    },
                    '&:hover fieldset': {
                        borderColor: '#4B0082',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#4B0082',
                    },
                },
                '& .MuiInputLabel-root': {
                    color: '#4B0082',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: '#4B0082',
                },
            }}
        />
    );

    return (
        <Container maxWidth="sm" style={{ marginTop: '0rem' }}>
            <form onSubmit={handleSubmit}>
                {renderTextField("Nom", nom, (e) => setNom(e.target.value))}
                {renderTextField("Prénom", prenom, (e) => setPrenom(e.target.value))}
                {renderTextField("Email", email, (e) => setEmail(e.target.value), 'email')}
                {renderTextField("Mot de passe", password, (e) => setPassword(e.target.value), 'password')}

                <FormControl fullWidth margin="normal" sx={{
                    marginBottom: 2,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#4B0082',
                        },
                        '&:hover fieldset': {
                            borderColor: '#4B0082',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#4B0082',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#4B0082',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#4B0082',
                    },
                }}>
                    <InputLabel>Rôle</InputLabel>
                    <Select value={role} onChange={handleRoleChange}>
                        {getAvailableRoles().map((availableRole) => (
                            <MenuItem key={availableRole} value={availableRole}>
                                {availableRole}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {role === 'SI' && (
                    <FormControl fullWidth margin="normal" sx={{
                        marginBottom: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#4B0082',
                          },
                          '&:hover fieldset': {
                            borderColor: '#4B0082',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4B0082',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#4B0082',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#4B0082',
                        },
                      }}>
                        <InputLabel>Filiale</InputLabel>
                        <Select
                            value={selectedFillialeSI}
                            onChange={(e) => setSelectedFillialeSI(e.target.value)}
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
                                borderColor: '#4B0082',
                            },
                            '&:hover fieldset': {
                                borderColor: '#4B0082',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#4B0082',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#4B0082',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4B0082',
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
                                <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
                                    <IconButton onClick={handleAddFilliale}>
                                        <AddIcon />
                                    </IconButton>
                                </ListItem>
                            </List>
                        </Box>
                    </FormControl>
                )}

<Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2, // Add some space between the buttons
                        mt: 2 // Add margin top if needed
                    }}
                >
                    <Button sx={{ color: "#B22222" }} onClick={onClose}>Fermer</Button>
                    <Button type="submit" sx={{ color: "green" }}>Soumettre</Button>
                </Box>
            </form>
        </Container>
    );
};

export default UserForm;
