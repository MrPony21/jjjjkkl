import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';

export function CrearDirectorioModal({ open, onClose, onSave }) {
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        setNombre('');
    }, [])
    
    const handleSave = () => {
        const newDirectorio = { nombre };
        onSave(newDirectorio);
        setNombre('');
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box 
                sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
                }}
            >
                <Typography variant="h6" component="h2">Crear Directorio</Typography>
                <TextField
                    id="nombreInput"
                    label="Nombre"
                    variant="outlined"
                    required
                    margin="normal"
                    color="secondary"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{
                        margin: 2,
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button onClick={onClose} sx={{ marginRight: 1 }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSave}>Crear</Button>
                </Box>
            </Box>
        </Modal>
    );
}
