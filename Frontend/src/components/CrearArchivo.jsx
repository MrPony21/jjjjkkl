import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Avatar } from '@mui/material';
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";

export function CrearArchivoModal({ open, onClose, onSave }) {
    const [nombre, setNombre] = useState('');
    const [archivo, setArchivo] = useState('');

    useEffect(() => {
        setArchivo('');
        setNombre('');
    }, []);

    const handleUploadArchivo = (e) => {
        const file = e.target.files[0];
        if (file) {
            setArchivo(file);
            setNombre(file.name);
        }
    }
    
    const handleSave = () => {
        const newArchivo = { nombre, archivo };
        onSave(newArchivo);
        setArchivo('');
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
                <Typography variant="h6" component="h2" mb={2}>Subir Archivo</Typography>
                <Box 
                    display="flex" 
                    flexDirection="row" 
                    justifyContent="center" 
                    alignItems="center"
                    sx={{ marginTop: 2 }}
                >
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
                            marginRight: 1,
                        }}
                    />
                    <IconButton
                        component="label"
                        sx={{ marginLeft: 1 }}
                    >
                        <FileUploadOutlined />
                        <input
                            type="file"
                            hidden
                            accept="*"
                            onChange={handleUploadArchivo}
                        />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button onClick={onClose} sx={{ marginRight: 1 }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSave}>Cargar</Button>
                </Box>
            </Box>
        </Modal>
    );
}
