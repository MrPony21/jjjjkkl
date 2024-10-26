import React, { useState, useEffect } from 'react';
import {
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    FormLabel,
    Card,
    CardMedia,
    Button,
    Grid,
    Box,
    TextField,
    IconButton,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiURL } from "../../logic/constants";
//import Notificacion from '../components/Notificacion';
import DeleteIcon from '@mui/icons-material/Delete';
import Notificacion from "../../components/Notificacion";

export function Settings() {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [storagePackage, setStoragePackage] = useState('');
    const [propsNotificacion, setPropsNotificacion] = useState({
        message: "",
        tipo: "",
        mostrar: false,
        handelMostrar: true,
    });
    const handelMostrar = (estado) => {
        setPropsNotificacion((prevState) => ({
        ...prevState,
        mostrar: estado,
        }));
    };
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        email: "",
        phone_number: "",
        country: "",
        nationality: "",
        space_tier: 0,
        rol: "cliente"
    });
    const userName = localStorage.getItem("user");
    const userPasswordLocal = localStorage.getItem("password");
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${apiUrl}user/${userName}`);
                const data = await response.json();
                const userData = data["message"];
                setUser({
                    firstname: userData.user_first_name || "",
                    lastname: userData.user_last_name || "",
                    username: userData.user_name || "",
                    password: userPasswordLocal || "",
                    email: userData.user_email || "",
                    phone_number: userData.user_phone_number || "",
                    country: userData.user_country || "",
                    nationality: userData.user_nationality || "",
                    space_tier: userData.user_space_tier || 0,
                    rol: userData.user_rol || "cliente"
                });
                setStoragePackage(userData.user_space_tier); // Set space_tier
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userName]);

    const handleChange = (e) => {
        const { value } = e.target;
        setStoragePackage(value); // Update only the storage package
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = { ...user, space_tier: storagePackage };
            const response = await fetch(`${apiUrl}user/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                setPropsNotificacion({
                    message: "Usuario actualizado correctamente",
                    tipo: "success",
                    mostrar: true,
                    handelMostrar: handelMostrar,
                });
                console.log('User updated successfully');
                // You can add navigation or success message here
            } else {
                console.error('Error updating user:', await response.json());
                setPropsNotificacion({
                    message: response.json(),
                    tipo: "danger",
                    mostrar: true,
                    handelMostrar: handelMostrar,
                });
            }
        } catch (error) {
            console.error('Error during update:', error);
            setPropsNotificacion({
                message: error,
                tipo: "danger",
                mostrar: true,
                handelMostrar: handelMostrar,
            });
        }
    };

    const deleteAccount = async (e) => {
        e.preventDefault();
        try {
            const OTP = Math.floor(Math.random() * 9000 + 1000);
            console.log(OTP);

            let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
            }

            let bodyContent = JSON.stringify({
                "recipient_email": user['email'],
                "OTP": OTP
            }
            );

            let response = await fetch(`${apiUrl}email/send_verification_email`, { 
            method: "POST",
            body: bodyContent,
            headers: headersList
            });

            let data = await response.text();
            console.log(data);
            if (response.status === 200) {
                console.log(response.status);
                 return navigate("/otpInput", { state: { email: user['email'], otp: OTP, verification: false, formData: user, page: "Settings" } }); // Navigate to OTPPage with state
            }

        } catch (error) {
            setPropsNotificacion({
                message: "Error - Registro incorrecto: " + error.message,
                tipo: "danger",
                mostrar: true,
                handelMostrar: handelMostrar,
            });
        }
    };

    return (
        <Box
            sx={{ display: "flex", flexDirection: "column" }}
        >
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
                <Typography variant="h5" sx={{ marginTop: 2 }}>Paquete de Almacenamiento</Typography>
                    <FormControl component="fieldset" margin="normal" sx={{ textAlign: 'center' }}>
                        <RadioGroup
                            aria-label="storagePackage"
                            name="storagePackage"
                            value={storagePackage}
                            onChange={handleChange}
                            row
                        >
                            <Box display="flex" justifyContent="center">
                                <FormControlLabel
                                    value={150}
                                    control={<Radio />}
                                    label={
                                        <Card>
                                            <CardMedia component="img" image="/premium.jpg" alt="Premium" height="200" width="50"/>
                                            Premium - 150 GB
                                        </Card>
                                    }
                                />
                                <FormControlLabel
                                    value={50}
                                    control={<Radio />}
                                    label={
                                        <Card>
                                            <CardMedia component="img" image="/standard.jpg" alt="Standard" height="200" width="50"/>
                                            Standard - 50 GB
                                        </Card>
                                    }
                                />
                                <FormControlLabel
                                    value={15}
                                    control={<Radio />}
                                    label={
                                        <Card>
                                            <CardMedia component="img" image="/basic.jpg" alt="Basic" height="200" width="50"/>
                                            Basic - 15 GB
                                        </Card>
                                    }
                                />
                            </Box>
                        </RadioGroup>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ marginTop: 2, width: 'auto', paddingLeft: 4, paddingRight: 4 }}
                    >
                        Cambiar Paquete
                    </Button>
                </Box>
            </form>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
                <Typography variant="h5" sx={{ marginTop: 2 }}>Solicitar Eliminacion de Cuenta</Typography>
                <Typography variant="h9" sx={{ marginTop: 2 }}> Esta Acción es irreversible, se te enviara un correo para confirmar esta operacion</Typography>
                <Button
                    variant="contained"
                    color="error"
                    onClick={deleteAccount}
                    sx={{
                        marginTop: 2,
                        width: 'auto',
                        paddingLeft: 4,
                        paddingRight: 4,
                        background: 'linear-gradient(45deg, #ff1744, #d50000)',
                        boxShadow: '0px 4px 12px rgba(255, 23, 68, 0.5)',
                        borderRadius: '8px', 
                        fontWeight: 'bold', 
                        '&:hover': {
                            background: 'linear-gradient(45deg, #ff5252, #d32f2f)',
                            boxShadow: '0px 6px 14px rgba(255, 23, 68, 0.7)',
                        }
                    }}
                    startIcon={<DeleteIcon />}
                >
                    Eliminar Cuenta
                </Button>
            </Box>
            <Notificacion
                message={propsNotificacion.message}
                tipo={propsNotificacion.tipo}
                mostrar={propsNotificacion.mostrar}
                handelMostrar={propsNotificacion.handelMostrar}
            />
        </Box>
    );
}
