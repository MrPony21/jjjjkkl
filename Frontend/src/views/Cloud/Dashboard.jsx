import React, { useState, useEffect } from 'react';
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
import FilePreview from '../../components/FilePreview';
import { CrearDirectorioModal } from '../../components/CrearDirectorio';
import { CrearArchivoModal } from '../../components/CrearArchivo';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderIcon from '@mui/icons-material/Folder';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';

const removerUltimoPath = (path) => {
    const segments = path.split('/');
    if (segments.length > 1) {
      segments.pop();
    }
    return segments.join('/');
};

export function Dashboard() {
    let navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [elementos, setElementos] = useState([]);
    const [rootDir, setrootDir] = useState([]);
    const [directorio, setDirectorio] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('user'));
    const [openCrearDirectorio, setOpenCrearDirectorio] = useState(false);
    const [openCrearArchivo, setOpenCrearArchivo] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [filePreview, setFilePreview] = useState(false);
    const [alertMessage, setAlertMessage] = useState('MENSAJE');
    const [alertState, setAlertState] = useState('success');
    const [actualizado, setActualizado] = useState(false);

    useEffect(() => {
        const fetchElementos = async () => {
            console.log('Usuario ', username);
            console.log('Directorio Param ', directorio);
            if (username) {
                setLoading(true);
                const dir = directorio ? directorio : username
                console.log('New Dir ', dir);
                setrootDir(dir);
                const response = await fetch(`${apiURL}/files/directory?path=${dir}`, {
                    method: "GET"
                });
                if (response.ok) {
                    const result = await response.json();
                    const archivos = result.filter(elemento => elemento.files_name !== 'Papelera');
                    setElementos(archivos);
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
                            setDirectorio(`${removerUltimoPath(rootDir)}`);
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
                                justifyContent: 'space-between',
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
                            <Box 
                                sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 1 }} 
                                onClick={() => {
                                    if (elemento.files_type === 'dir') {
                                        setDirectorio(`${rootDir}/${elemento.files_name}`);
                                    } else {
                                        //openDocumento(elemento.files_link);
                                        handlePreviewOpen(elemento);
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
                            <IconButton 
                                sx={{ marginLeft: 'auto' }} 
                                onClick={() => {
                                    if (elemento.files_type === 'dir') {
                                        handleMoveDirToTrash(elemento);
                                    } else {
                                        handleMoveFileToTrash(elemento);
                                    }
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    const openDocumento = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleCrear = () => {
        setOpenCrearDirectorio(true);
    };

    const handleCrearClose = () => {
        setOpenCrearDirectorio(false);
    };

    const handelAdicionarDirectorio = async (newDirectorio) => {
        setLoading(true);
        console.log('Creando directorio:', newDirectorio);
        
        const formData = {
            username: username,
            path_padre: directorio ? directorio : username,
            name: newDirectorio.nombre
        };
    
        try {
            const response = await fetch(`${apiURL}/files/create/directory`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const result = await response.json();
            handleCrearClose();
            setAlertMessage('Directorio creado');
            setAlertState('success');
            setOpenAlert(true);
            setActualizado(!actualizado);
        } catch (error) {
            console.error('Error al crear el directorio:', error);
            setAlertMessage(`ERROR: ${error.message}`);
            setAlertState('error');
            setOpenAlert(true);
        }
        setLoading(false);
    };

    const handleMoveDirToTrash = async (directorio) => {
        setLoading(true);
        console.log('Moviendo directorio a la papelera ', directorio, rootDir);

        const formData = {
            'name_carpeta': directorio.files_name,
            'path': rootDir
        }
    
        try {
            const response = await fetch(`${apiURL}/files/moveCarpToRecycle`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error);
            }
            const result = await response.json();
            handleCrearClose();
            setAlertMessage('Carpeta trasladada a la papelera');
            setAlertState('success');
            setOpenAlert(true);
            setActualizado(!actualizado);
        } catch (error) {
            console.error('Error al mover la carpeta:', error);
            setAlertMessage(`ERROR: ${error.message}`);
            setAlertState('error');
            setOpenAlert(true);
        }
        setLoading(false);
    }

    const handleCrearArchivo = () => {
        setOpenCrearArchivo(true);
    };

    const handleCrearArchivoClose = () => {
        setOpenCrearArchivo(false);
    };

    const handelAdicionarArchivo = async (newArchivo) => {
        setLoading(true);
        console.log('Creando archivo:', newArchivo);
        
        const formData = new FormData();
        formData.append('file', newArchivo.archivo);
        formData.append('name', newArchivo.nombre);
        formData.append('path', rootDir);
    
        try {
            const response = await fetch(`${apiURL}/files/create/file`, {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const result = await response.json();
            handleCrearClose();
            setAlertMessage('Archivo creado');
            setAlertState('success');
            setOpenAlert(true);
            setActualizado(!actualizado);
        } catch (error) {
            console.error('Error al crear el archivo:', error);
            setAlertMessage(`ERROR: ${error.message}`);
            setAlertState('error');
            setOpenAlert(true);
        }
        setLoading(false);
    };

    const handleMoveFileToTrash = async (archivo) => {
        setLoading(true);
        console.log('Moviendo archivo a la papelera ', archivo);

        const formData = {
            'name': archivo.files_name,
            'path': rootDir
        }
    
        try {
            const response = await fetch(`${apiURL}/files/moveFileToRecycle`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const result = await response.json();
            handleCrearClose();
            setAlertMessage('Archivo trasladado a la papelera');
            setAlertState('success');
            setOpenAlert(true);
            setActualizado(!actualizado);
        } catch (error) {
            console.error('Error al mover el archivo:', error);
            setAlertMessage(`ERROR: ${error.message}`);
            setAlertState('error');
            setOpenAlert(true);
        }
        setLoading(false);
    };

    const handlePreviewOpen = (url) => {
        setOpenPreview(true);
        setFilePreview(url);
    };

    const handlePreviewClose = () => {
        setOpenPreview(false);
        setFilePreview(false);
    };

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
                    sx={{  bottom: 0, right: 0, padding: 1, margin: 0, border: 1, backgroundColor: 'white',
                        ':hover': {
                            backgroundColor: 'white',
                            opacity: 1,
                        }
                    }}
                    color='success'
                    onClick={handleCrear}
                >
                    <CreateNewFolderIcon color='success' />
                </IconButton>
                <IconButton
                    sx={{  bottom: 0, right: 0, padding: 1, margin: 1, border: 1, backgroundColor: 'white',
                        ':hover': {
                            backgroundColor: 'white',
                            opacity: 1,
                        }
                    }}
                    color='primary'
                    onClick={handleCrearArchivo}
                >
                    <UploadFileIcon color='primary' />
                </IconButton>
            </Box>
            <Box
                position="fixed"
                sx={{
                    bottom: "0",
                    right: "0",
                }}
            >
            </Box>
            <CrearDirectorioModal
                open={openCrearDirectorio}
                onClose={handleCrearClose}
                onSave={handelAdicionarDirectorio}
            />
            <CrearArchivoModal
                open={openCrearArchivo}
                onClose={handleCrearArchivoClose}
                onSave={handelAdicionarArchivo}
            />
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
            <FilePreview file={filePreview} open={openPreview} onClose={handlePreviewClose}/>
        </Box>
    );
}
