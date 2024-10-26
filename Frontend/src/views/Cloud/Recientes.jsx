import React, { useState, useEffect, act } from 'react';
import {
    Box,
    IconButton,
    Typography,
    CircularProgress,
    Backdrop
} from "@mui/material";
import { json, useNavigate, useSearchParams } from "react-router-dom";
import { apiURL } from "../../logic/constants";
import Notificacion from '../../components/Notificacion';
import FolderIcon from '@mui/icons-material/Folder';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';

const removerUltimoPath = (path) => {
    const segments = path.split('/');
    if (segments.length > 1) {
      segments.pop();
    }
    return segments.join('/');
};

export function Recientes() {
    let navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [elementos, setElementos] = useState([]);
    const [rootDir, setrootDir] = useState([]);
    const [directorio, setDirectorio] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('user'));
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('MENSAJE');
    const [alertState, setAlertState] = useState('success');
    const [actualizado, setActualizado] = useState(false);

    useEffect(() => {
        const fetchElementos = async () => {
            console.log('Usuario ', username);
            console.log('Directorio Param ', directorio);
            if (username) {
                setLoading(true);
                const dir = directorio ? directorio : username+'/Papelera'
                console.log('New Dir ', dir);
                setrootDir(dir);
                const response = await fetch(`${apiURL}/files/get/recientes`, {
                    method: "GET"
                });
                if (response.ok) {
                    const result = await response.json();
                    console.log(result)
                    if(result.message.length == 0){
                        console.log("Fskla")
                        setElementos([])
                        
                    }else{
                        setElementos(result.message);
                    }

                } else {
                    setElementos([]);
                }
                setLoading(false);
            } else {
                navigate('/login');
            }
        };
        fetchElementos();
    }, [username, directorio, actualizado, navigate]);
    
    const renderElementos = (elementosToRender) => {
        return (
            <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                    <Box 
                        key={0}
                        sx={{ 
                            display: 'flex',
                            flexDirection: 'row',
                            //flex: '1 0 auto', 
                            m: 0.5, 
                            alignItems: 'center',
                            justifyContent: 'left',
                            textOverflow: 'ellipsis',
                            textWrap: 'pretty',
                            borderColor: '#b8b8b8',
                            cursor: 'pointer',
                            '&:hover': { 
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            },
                        }}
                        padding={1}
                        borderRadius={1}
                        border={1}
                        mb={1}
                        onClick={() => {
                            if (rootDir != username+'/Papelera') {
                                setDirectorio(`${removerUltimoPath(rootDir)}`);
                            }
                        }}
                    >
                        <IconButton disabled>
                            <FolderIcon />
                        </IconButton>
                        <Typography variant='h6' sx={{}}>
                            ...
                        </Typography>
                    </Box>
                    {elementosToRender.map((elemento) => (
                        <Box 
                            key={elemento.files_id}
                            sx={{ 
                                display: 'flex',
                                flexDirection: 'row',
                                m: 0.5, 
                                alignItems: 'center',
                                justifyContent: 'space-between',  // Espaciado entre el contenido clicable y el icono de Delete
                                textOverflow: 'ellipsis',
                                textWrap: 'pretty',
                                borderColor: '#b8b8b8',
                                cursor: 'pointer',
                                '&:hover': { 
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                },
                            }}
                            padding={1}
                            borderRadius={1}
                            border={1}
                            mb={1}
                        >
                            {/* Contenedor clicable */}
                            <Box 
                                sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 1 }} 
                                onClick={() => {
                                    if (elemento.files_type === 'dir') {
                                        setDirectorio(`${rootDir}/${elemento.files_name}`);
                                    } else {
                                        openDocumento(elemento.files_link);
                                    }
                                }}
                            >
                                <IconButton disabled>
                                    {elemento.files_type === 'dir' ? (
                                        <FolderIcon />
                                    ) : (
                                        <FileIcon />
                                    )}
                                </IconButton>
                                <Typography variant='h6'>
                                    {elemento.files_name}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    const openDocumento = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleVaciarPapelera = async () => {
        setLoading(true);
        console.log('Vaciando la papelera');
        try {
            for (let index = 0; index < elementos.length; index++) {
                const elemento = elementos[index];
                console.log('Elemento ', elemento);
                if (elemento.files_type === 'dir') {
                    const formData = {
                        'name': elemento.files_name,
                        'path': rootDir
                    }
                    const response = await fetch(`${apiURL}/files/delete-carp`, {
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData),
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message);
                    }
                } else {
                    const formData = {
                        'name': elemento.files_name,
                        'path': rootDir
                    }
                    const response = await fetch(`${apiURL}/files/delete-file`, {
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData),
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message);
                    }
                }
            }
            setAlertMessage('Papelera Vaciada');
            setAlertState('success');
            setOpenAlert(true);
            setActualizado(!actualizado);
        } catch (error) {
            console.error('Error al vaciar la papelera:', error);
            setAlertMessage(`ERROR: ${error.message}`);
            setAlertState('error');
            setOpenAlert(true);
        }
        setLoading(false);
    }

    return (
        <Box
            sx={{ display: "flex", flexDirection: "column" }}
        >
            {renderElementos(elementos)}
            <Box
                position="fixed"
                sx={{
                    bottom: "0",
                    right: "0",
                }}
            >
                <IconButton
                    sx={{  bottom: 0, right: 0, padding: 1, margin: 1, border: 1, backgroundColor: 'white',
                        ':hover': {
                            backgroundColor: 'white',
                            opacity: 1,
                        }
                    }}
                    color='error'
                    onClick={handleVaciarPapelera}
                >
                    <DeleteIcon color='error' />
                </IconButton>
            </Box>
            <Box
                visibility={openAlert}
                position="absolute"
                alignItems="center"
                sx={{
                    bottom: "0",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <Notificacion message={alertMessage} tipo={alertState} mostrar={openAlert} handelMostrar={setOpenAlert}/>
            </Box>
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}
