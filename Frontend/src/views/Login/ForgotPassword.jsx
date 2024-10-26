import { useState } from "react";
import { Container, Grid, TextField, Button, Alert, Box, Paper, Typography } from "@mui/material";
import { apiURL } from "../../logic/constants";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

export function ForgotPassword() {
    let navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [username, setUsername] = useState("");
    const [loginStatus, setLoginStatus] = useState("null");
    const [variantStatus, setVariantStatus] = useState("");
    
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(username);
        if (username) {
            const OTP = Math.floor(Math.random() * 9000 + 1000);
            console.log(OTP);

            let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
            }

            let bodyContent = JSON.stringify({
            "recipient_email": username,
            "OTP": OTP
            }
            );

            let response = await fetch(`${apiUrl}email/send_recovery_email`, { 
            method: "POST",
            body: bodyContent,
            headers: headersList
            });

            let data = await response.text();
            let formData = {};
            console.log(data);
            if (response.status === 200) {
                return navigate("/otpInput", { state: { email: username, otp: OTP, verification: false, formData, page: "Forgot" } }); // Navigate to OTPPage with state
            }
        }
        return alert("Please enter your email");
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
                    <Typography variant="h7" sx={{ marginTop: 2 }}>¿Has olvidado la contraseña? Introduce tu correo electrónico para restablecerla.</Typography>
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
                                    label="Correo electrónico"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleUsernameChange}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    sx={{ marginTop: 2, marginBottom: 2 }}
                                >
                                    Enviar
                                </Button>
                                <Alert severity={variantStatus} style={{visibility: loginStatus === 'null' ? 'hidden' : 'visible', contentVisibility: loginStatus === 'null' ? 'hidden' : 'visible'}} onClose={() => {setLoginStatus('null')}}>
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
