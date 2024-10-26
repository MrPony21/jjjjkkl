import { useState, useEffect  } from "react";
import { Container, Grid, TextField, Button, Alert, Box, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/login.css";

export function Reset() {
    let navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const location = useLocation();  // Make sure to get the location
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");  // New state for confirm password
    const [loginStatus, setLoginStatus] = useState("null");
    const [variantStatus, setVariantStatus] = useState("");
    const { Verified = false, email = "" } = location.state || {};
    console.log(!Verified);

    useEffect(() => {
        if (!Verified) {
            navigate("/forgotPassword");
            return;
        }

    }, [Verified, navigate]);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);  // Update confirm password state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !confirmPassword) {
            return alert("Please enter your new password and confirm it");
        }

        // Check if passwords match
        if (username !== confirmPassword) {
            return alert("Passwords do not match");
        }

        const formData = {
            email: email,
            confirmPassword: confirmPassword,
        };
        console.log(formData);
        try {
            const response = await fetch(`${apiUrl}user/resetPassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });
            
            console.log(response);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                // Assuming the server returns a success response
                if (data) {
                    alert("La contraseña ha sido cambiada"); // Placeholder alert
                    return navigate("/");
                } else {
                    alert("No se pudo cambiar la contraseña"); // Placeholder alert
                    return navigate("/");
                }
            } else {
                alert("Credenciales incorrectas"); // Placeholder alert
                return navigate("/");
            }
        } catch (error) {
    
            alert("Error en el servidor: " + error.message); // Placeholder alert
            return navigate("/");
        }
        
    };

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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: '16px' }}>
                    <Typography variant="h7" sx={{ marginTop: 2 }}>Cambiar Contraseña</Typography>
                </div>

                <Container maxWidth="sm">
                    <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
                        <Grid item xs={12}>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    id="newPassword"  // Changed ID for clarity
                                    label="Nueva Contraseña"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    type="password"  // Changed to password input
                                    onChange={handleUsernameChange}
                                />
                                <TextField
                                    id="confirmPassword"  // Changed ID for clarity
                                    label="Confirmar Contraseña"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    type="password"  // Changed to password input
                                    onChange={handleConfirmPasswordChange} // Use new handler
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    sx={{ marginTop: 2, marginBottom: 2 }}
                                >
                                    Reestablecer Contraseña
                                </Button>
                                <Alert severity={variantStatus} style={{visibility: loginStatus === 'null' ? 'hidden' : 'visible'}} onClose={() => {setLoginStatus('null')}}>
                                    {loginStatus}
                                </Alert>
                            </form>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
        </Box>
    );
}
