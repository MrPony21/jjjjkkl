import { useState, useEffect } from "react";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Card,
    CardMedia,
    Container,
    Grid,
    TextField,
    Button,
    Alert,
    Link,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    Typography,
    Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

export function RegisterPage() {
    let navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [countries, setCountry] = useState([]);
    const [formData, setFormData] = useState({
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
    const [phoneCode, setPhoneCode] = useState("");
    const [registerStatus, setRegisterStatus] = useState("null");
    const [variantStatus, setVariantStatus] = useState("");

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch(`https://countriesnow.space/api/v0.1/countries/info?returns=currency,flag,unicodeFlag,dialCode`);
                const data = await response.json();
                const countriesfetch = data.data
                .filter(country => country.dialCode)
                .map((country) => {
                const dialCodeFormatted = country.dialCode.includes("+") 
                    ? `(${country.dialCode})` 
                    : `(+${country.dialCode})`;

                // Si ya existe en la lista, lo omitimos
                if (country.dialCode === " ") {
                    return null;
                }

                return {
                    name: country.name,
                    flag: country.flag,
                    code: dialCodeFormatted
                    };
                    
                }).filter(country => country !== null);
                setCountry(countriesfetch);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePhoneCodeChange = (e) => {
        setPhoneCode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstname, lastname, username, password, email, phone_number, country, nationality, space_tier, rol } = formData;
        const fullPhoneNumber = `${phoneCode} ${phone_number}`;
        setFormData({ ...formData, phone_number: fullPhoneNumber });
        console.log(formData);
        if (!username || !password || !email || !firstname || !lastname || !fullPhoneNumber || !country || !nationality || !phoneCode || !space_tier || !rol) {
            setRegisterStatus("Todos los campos son requeridos");
            setVariantStatus("warning");
            return;
        }

        try {
            const OTP = Math.floor(Math.random() * 9000 + 1000);
            console.log(OTP);

            let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
            }

            let bodyContent = JSON.stringify({
            "recipient_email": email,
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
                 return navigate("/otpInput", { state: { email: email, otp: OTP, verification: true, formData: formData, page: "Register" } }); // Navigate to OTPPage with state
            }

        } catch (error) {
            setRegisterStatus("Error - Registro incorrecto: " + error.message);
            setVariantStatus("danger");
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: '20px',
                backgroundColor: '#f0f0f0',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: '100%',
                    maxWidth: 600,
                    margin: '0 auto', 
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: '10px' }}>
                    <Typography variant="h4" sx={{ marginTop: 2 }}>Registro de Usuario</Typography>
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
                                    name="firstname"
                                    label="Nombre"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleChange}
                                />
                                <TextField
                                    name="lastname"
                                    label="Apellido"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleChange}
                                />
                                <TextField
                                    name="username"
                                    label="Usuario"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleChange}
                                />
                                <TextField
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleChange}
                                />
                                <TextField
                                    name="email"
                                    label="Correo Electrónico"
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleChange}
                                />

                                {/* Select for phone country code and flag */}
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={4}>
                                        <FormControl fullWidth>
                                        <InputLabel id="phoneCodeLabel">Código</InputLabel>
                                        <Select
                                            label="phoneCodeLabel"
                                            value={phoneCode}
                                            onChange={handlePhoneCodeChange}
                                            required
                                        >
                                            {countries.map((country, i) => (
                                            <MenuItem key={i} value={country.code}>
                                                {/* <img src={country.flag} alt={country.flag} width="20" height="20" /> */}
                                                {`${country.name} ${country.code}`}
                                            </MenuItem>
                                            ))}
                                        </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            name="phone_number"
                                            label="Número de Teléfono"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            margin="none"
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                                {/* Select for country */}
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="countryLabel">País de Residencia</InputLabel>
                                    <Select
                                        label="countryLabel"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                    >
                                        {countries.map((country) => (
                                            <MenuItem key={country.name} value={country.name}>
                                                {country.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {/* Select for nationality */}
                                
                                <TextField
                                    name="nationality"
                                    label="Nacionalidad"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleChange}
                                />
                                <FormControl component="fieldset" fullWidth margin="normal">
                                    <FormLabel component="legend">Paquete de Almacenamiento</FormLabel>
                                    <RadioGroup
                                        aria-label="space_tier"
                                        name="space_tier"
                                        value={formData.space_tier}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel
                                            sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginTop: '10px'
                                            }}
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
                                            sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginTop: '10px'
                                            }}
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
                                            sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginTop: '10px'
                                            }}
                                            value={15}
                                            control={<Radio />}
                                            label={
                                                <Card>
                                                    <CardMedia component="img" image="/basic.jpg" alt="Basic" height="200" width="50"/>
                                                    Basic - 15 GB
                                                </Card>
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                >
                                    Registrarse
                                </Button>
                                <Alert severity={variantStatus} style={{ visibility: registerStatus === 'null' ? 'hidden' : 'visible', contentVisibility: registerStatus === 'null' ? 'hidden' : 'visible' }} onClose={() => { setRegisterStatus('null') }}>
                                    {registerStatus}
                                </Alert>
                            </form>
                            <Link className="link" href="/login" variant="body2" sx={{ marginTop: 2, marginBottom: 2 }}>
                                ¿Ya tienes una cuenta?
                            </Link>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
        </Box>
    );
}
