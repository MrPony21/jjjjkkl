import { useState, useEffect } from "react";
import { Container, Grid, TextField, Button, Alert, Link, Box, Paper, Typography } from "@mui/material";
import { apiURL } from "../../logic/constants";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

export function LoginPage() {
    let navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("null");
    const [variantStatus, setVariantStatus] = useState("");
    
    useEffect(() => {
        if (localStorage.getItem("user")) {
            const userRol = localStorage.getItem("rol");
            if (userRol === "administrador") {
                return navigate("/admin");
            } else if (userRol === "empleado") {
                return navigate("/empleado");
            } else {
                return navigate("/cloud");
            }
        }

    }, [navigate]);
    
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setLoginStatus("Ingrese su usuario y su password");
            setVariantStatus("warning");
            return;
        }

        const formData = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch(`${apiUrl}user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                // Assuming the server returns a success response
                if (data) {
                        
                    const response = await fetch(`${apiUrl}user/${username}`);
                    const dataUser = await response.json();
                    const userData = dataUser["message"];
                    if (userData.user_is_suspended === 1) {
                        setLoginStatus("Login incorrecto: Cuenta suspendida");
                        setVariantStatus("error");
                        return;
                    }
                    if (userData.user_is_in_delete_process === 1) {
                        const lastLoginDate = new Date(userData.user_last_login); // Convertir fecha de user_last_login a objeto Date
                        const currentDate = new Date(); // Obtener la fecha actual
                        
                        // Calcular la diferencia en milisegundos
                        const timeDifference = currentDate - lastLoginDate;
                        
                        // Convertir la diferencia en meses (aproximadamente 30 días por mes)
                        const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
                        
                        // Si ha pasado más de un mes desde el último login
                        if (timeDifference > oneMonthInMilliseconds) {
                            setLoginStatus("Login incorrecto: Cuenta eliminada");
                            setVariantStatus("error");
                            return;
                        }
                    }
                    setLoginStatus("Login correcto!");
                    setVariantStatus("success");
                    localStorage.setItem("user", username);
                    localStorage.setItem("rol", userData.user_rol);
                    localStorage.setItem("space_tier", userData.user_space_tier);
                    localStorage.setItem("space", userData.user_space);
                    localStorage.setItem("password", password);
                    if (userData.user_rol === "administrador") {
                        return navigate("/admin");
                    } else if (userData.user_rol === "empleado") {
                        return navigate("/empleado");
                    }
                    return navigate("/cloud");
                } else {
                    setLoginStatus("Login incorrecto: Credenciales incorrectas");
                    setVariantStatus("error");
                }
            } else {
                setLoginStatus("Login incorrecto: Credenciales incorrectas");
                setVariantStatus("error");
            }
        } catch (error) {
            console.log("Error during login:", error);
            setLoginStatus("Error - Login incorrecto: " + error.message);
            setVariantStatus("error");
        }
    };
    const payMonth = async () => {
        const now = new Date(); // Fecha actual
        const nextPayDate = new Date(now.setMonth(now.getMonth() + 1));
        const formattedNextPayDate = nextPayDate.toISOString();
        const formDataPay = {
            username: username,
            next_pay: formattedNextPayDate,
        };
        console.log(formDataPay);
        try {
            const responsePay = await fetch(`${apiUrl}user/updateNextPay`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formDataPay),
            });
            if (responsePay.ok) {
                setLoginStatus("Pago de un mes exitoso!");
                setVariantStatus("success");
            } else {
                setLoginStatus("Pago de un mes fallido");
                setVariantStatus("error");
            }
        } catch (error) {
            console.log("Error during login:", error);
            setLoginStatus("Error - Pago de un mes fallido: " + error.message);
            setVariantStatus("error");
        }
    }
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f0f0',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: '100%',
                    maxWidth: 400,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: '16px' }}>
                    <Typography variant="h4" sx={{ marginTop: 2 }}>AYD - Storage</Typography>
                </div>
                <Container maxWidth="sm">
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justifyContent="flex-start"
                    >
                        <Grid item xs={12}>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    id="userInput"
                                    label="Usuario"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleUsernameChange}
                                />
                                <TextField
                                    id="passwordInput"
                                    label="Contraseña"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handlePasswordChange}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    sx={{ marginTop: 2, marginBottom: 2 }}
                                >
                                    Iniciar sesión
                                </Button>
                                <Alert severity={variantStatus} style={{ visibility: loginStatus === 'null' ? 'hidden' : 'visible', contentVisibility: loginStatus === 'null' ? 'hidden' : 'visible' }} onClose={() => { setLoginStatus('null') }}>
                                    {loginStatus}
                                </Alert>
                            </form>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={payMonth}
                                fullWidth
                                sx={{ marginTop: 2, marginBottom: 2 }}
                            >
                                Pagar un Mes
                            </Button>
                            <Link className="link" href="/registrate" variant="body2" sx={{ display: 'block', marginTop: 2, marginBottom: 2 }}>
                                ¿No tienes una cuenta?
                            </Link>
                            <Link className="link" href="/forgotPassword" variant="body2" sx={{ display: 'block', marginTop: 2, marginBottom: 2 }}>
                                ¿Olvidaste tu Contraseña?
                            </Link>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
        </Box>
    );
}
