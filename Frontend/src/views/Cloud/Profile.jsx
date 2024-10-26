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
import Notificacion from "../../components/Notificacion";

export function Profile() {
    let navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [countries, setCountry] = useState([]);
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
    const userName = localStorage.getItem("user");
    const phoneRegex = /(\(\+\d+\))\s*(\d+)/;
    const userPasswordLocal = localStorage.getItem("password");
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${apiUrl}user/${userName}`);
                const data = await response.json();
                const userData = data["message"];
                setFormData({
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
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
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

    useEffect(() => {
        const match = formData.phone_number.match(phoneRegex);
        if (match) {
            const countryCode = match[1];
            const phoneNumber = match[2];

            setPhoneCode(countryCode);
            setFormData((prevFormData) => ({
                ...prevFormData,
                phone_number: phoneNumber
            }));
        }
    }, [formData.phone_number]);

    
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

        // Crear el número completo sin actualizar el estado aún
        const fullPhoneNumber = `${phoneCode} ${phone_number}`;

        // Validación de campos
        if (!username || !password || !email || !firstname || !lastname || !fullPhoneNumber || !country || !nationality || !phoneCode || space_tier === null || space_tier === undefined || !rol) {
            setRegisterStatus("Todos los campos son requeridos");
            setVariantStatus("warning");
            return;
        }

        // Realiza la petición usando el número completo
        try {
            const response = await fetch(`${apiUrl}user/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    phone_number: fullPhoneNumber, // Usar número completo aquí
                }),
            });

            if (response.ok) {
                console.log('User updated successfully');
                setPropsNotificacion({
                    message: "Usuario actualizado correctamente",
                    tipo: "success",
                    mostrar: true,
                    handelMostrar: handelMostrar,
                });
                // Navegación o mensaje de éxito
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
                    maxWidth: 700, 
                    margin: '0 auto',
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: '10px' }}>
                    <Typography variant="h4" sx={{ marginTop: 2 }}>Datos de Perfil</Typography>
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
                                    value={formData.firstname}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleChange}
                                />
                                <TextField
                                    name="lastname"
                                    label="Apellido"
                                    value={formData.lastname}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleChange}
                                />
                                <TextField
                                    name="username"
                                    label="Usuario"
                                    value={formData.username}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled
                                />
                                <TextField
                                    name="password"
                                    label="Cambiar Contraseña"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChange}
                                />
                                <TextField
                                    name="email"
                                    label="Correo Electrónico"
                                    value={formData.email}
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled
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
                                            value={formData.phone_number}
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
                                    value={formData.nationality}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                    onChange={handleChange}
                                />
                                
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                >
                                    Cambiar Datos
                                </Button>
                                <Alert severity={variantStatus} style={{ visibility: registerStatus === 'null' ? 'hidden' : 'visible', contentVisibility: registerStatus === 'null' ? 'hidden' : 'visible' }} onClose={() => { setRegisterStatus('null') }}>
                                    {registerStatus}
                                </Alert>
                            </form>
                        </Grid>
                    </Grid>
                </Container>
            <Notificacion
                message={propsNotificacion.message}
                tipo={propsNotificacion.tipo}
                mostrar={propsNotificacion.mostrar}
                handelMostrar={propsNotificacion.handelMostrar}
            />
            </Paper>
        </Box>
    );
}
