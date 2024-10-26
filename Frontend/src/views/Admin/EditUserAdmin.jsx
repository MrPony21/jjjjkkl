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
import DeleteIcon from '@mui/icons-material/Delete';
import "../../styles/login.css";
import Notificacion from "../../components/Notificacion";

export function EditUserAdmin() {
    let navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [countries, setCountry] = useState([]);
    const [userSelect, setUserSelect] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
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
        rol: ""
    });
    const [phoneCode, setPhoneCode] = useState("");
    const [registerStatus, setRegisterStatus] = useState("null");
    const [variantStatus, setVariantStatus] = useState("");
    const rolSelect = [{ rol: "administrador" }, { rol: "empleado" }, { rol: "cliente" }];
    
    const userName = localStorage.getItem("user");
    const phoneRegex = /(\(\+\d+\))\s*(\d+)/;
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${apiUrl}user/all`);
                const data = await response.json();
                const usersData = data;
                const fetchUserName = usersData.map((user) => {
                    return {
                        username: user.user_name || ""
                    };
                });
                setUserSelect(fetchUserName);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUsers();
        
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
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${apiUrl}user/${selectedUser}`);
                const data = await response.json();
                const userData = data["message"];
                setFormData({
                    firstname: userData.user_first_name || "",
                    lastname: userData.user_last_name || "",
                    username: userData.user_name || "",
                    password: userData.user_password || "",
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
    }, [selectedUser]);

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
    const handleChangeUser = (e) => {
        const { name, value } = e.target;
        setSelectedUser( value );
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

    
    const deleteAccount = async (e) => {
        e.preventDefault();
        console.log(formData.username);
        if (formData.username !== "") {

            let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
            }

            let bodyContent = JSON.stringify({
            "recipient_email": formData.email,
            "OTP": null
            }
            );

            let response = await fetch(`${apiUrl}email/send_delete_email`, { 
            method: "POST",
            body: bodyContent,
            headers: headersList
            });

            let data = await response.text();
            console.log(data);
            try {
                const response = await fetch(`${apiUrl}user/changeToDeleteProcess?username=${formData['username']}&process=${0}`, {
                method: 'PUT',
                });

                if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                console.log('Account suspend status:', data.message);
                setPropsNotificacion({
                    message: "Cuenta en proceso de eliminación",
                    tipo: "success",
                    mostrar: true,
                    handelMostrar: handelMostrar,
                });
                return;
            } catch (error) {
                console.error('Error suspending account:', error.message);
            }
        }
        setPropsNotificacion({
            message: "Por favor seleccione un usuario",
            tipo: "danger",
            mostrar: true,
            handelMostrar: handelMostrar,
        });
    };

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '30vh',
                    backgroundColor: '#f0f0f0',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 2,
                        width: '100%',
                        maxWidth: 400,
                    }}
                >
                    <Typography variant="h4" sx={{ marginTop: 2 }}>Editar Usuario</Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="userSelectLabel">Usuario a Editar</InputLabel>
                        <Select
                            label="userSelectLabel"
                            name="username"
                            value={selectedUser}
                            onChange={handleChangeUser}
                            required
                        >
                            {userSelect.map((userItem) => (
                                <MenuItem key={userItem.username} value={userItem.username}>
                                    {userItem.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>
            </Box>
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
                                    {/*<TextField
                                        name="password"
                                        label="Contraseña"
                                        value={formData.password}
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        margin="normal"
                                        onChange={handleChange}
                                    /> */}
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
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id="rolLabel">Rol del Usuario</InputLabel>
                                        <Select
                                            label="rolLabel"
                                            name="rol"
                                            value={formData.rol}
                                            onChange={handleChange}
                                            required
                                        >
                                            {rolSelect.map((rolItem) => (
                                                <MenuItem key={rolItem.rol} value={rolItem.rol}>
                                                    {rolItem.rol}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

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
                                        Cambiar Datos
                                    </Button>
                                    <Alert severity={variantStatus} style={{ visibility: registerStatus === 'null' ? 'hidden' : 'visible', contentVisibility: registerStatus === 'null' ? 'hidden' : 'visible' }} onClose={() => { setRegisterStatus('null') }}>
                                        {registerStatus}
                                    </Alert>
                                </form>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={deleteAccount}
                                    fullWidth
                                    sx={{
                                        marginTop: 2,
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
                            </Grid>
                        </Grid>
                    </Container>
                </Paper>       
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
