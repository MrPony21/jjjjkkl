const express = require('express')
const router = express.Router()
router.use(express.json())
const queries = require('../request/queries')
const moment = require('moment');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.send("Ruta de users funciona correctamente");
})

//obtener todos los usuarios
router.get('/all', async (req, res) => {
    const users = await queries.getAllUsers()
    res.send(users)
})

//agregar usuarios
router.post('/add', async (req, res) => {
    const data = req.body;
    const { username, email, password, rol, space_tier, firstname, lastname, phone_number, country, nationality } = data;

    try {
        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertar el usuario con la contraseña encriptada
        const [addUser, response] = await queries.insert_user(
            username, email, hashedPassword, rol, space_tier, firstname, lastname, phone_number, country, nationality
        );

        // Crear la ruta para el usuario
        const ruta_creada = await queries.insert_path(username);

        res.status(200).json({ message: response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//obtener el id del usuario
router.get('/id', async (req, res) => {
    const username = req.query.username

    try{
        const id = await queries.get_user_info(username);
        res.status(200).json({ message: id })
    } catch(err){
        res.status(500).json({ error: err.message })
    }

})

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;


    // ACTUALIZAMOS EL LASTLOGIN
    let data_user;
    try {
        data_user = await queries.get_user_info_username(username);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    // Comparamos la contraseña
    const isMatch = await bcrypt.compare(password, data_user.user_password); 
    if (!isMatch) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const id_user = data_user.user_id;

    // Obtenemos la fecha actual
    const now = new Date();
    const fecha_actual = moment(now).format('YYYY-MM-DD HH:mm:ss');

    // Verificamos la fecha de next_pay y suspendemos si es necesario
    const fecha_next_pay = new Date(data_user.user_next_pay);
    if (now > fecha_next_pay) {
        console.log("Cuenta suspendida");
        await queries.update_user_is_suspended(id_user, 1);
    } else {
        console.log("Cuenta no ha sido suspendida");
        await queries.update_user_is_suspended(id_user, 0);
    }

    // Actualizamos el last_login
    try {
        await queries.update_user_last_login(id_user, fecha_actual);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    // Respondemos correctamente solo una vez
    return res.status(200).json({ message: "Ha iniciado sesión correctamente" });
});



//eliminar usuario
router.delete('/:username', async(req, res) => {

    const username = req.params.username
    let user = ''
    try{
        user = await queries.get_user_info_username(username);
        console.log("hola",user)
    } catch(err){
        res.status(500).json({ error: err.message })
    }

    const id = user.user_id
    console.log(id)

    try{
        const deleteduser = await queries.delete_user(id);
        res.status(200).json({ message: deleteduser })
    } catch(err){
        res.status(500).json({ error: err.message })
    }

})


//update el usuario
router.put('/update', async (req, res) => {
    data = req.body
    const username = data.username; const email = data.email; const password = data.password; const rol = data.rol; const space_tier = data.space_tier; const firstname = data.firstname; const lastname = data.lastname; const phone_number = data.phone_number; const country = data.country; const nationality = data.nationality;
    let user = ''
    try{
        user = await queries.get_user_info_username(username);
        console.log("hola",user)
    } catch(err){
        res.status(500).json({ error: err.message })
    }

    const id = user.user_id
    console.log(id)
    
       try {
        // Verificar si se proporciona una nueva contraseña
        let hashedPassword = user.user_password; // Mantener la contraseña actual por defecto
        if (password) {
            // Encriptar la nueva contraseña
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        // Actualizar el usuario con la contraseña encriptada
        const [updateUser, response] = await queries.update_user(
            id,
            username,
            email,
            hashedPassword, // Usar la contraseña encriptada
            rol,
            space_tier,
            firstname,
            lastname,
            phone_number,
            country,
            nationality
        );

        res.status(200).json({ message: response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})


//obtener la informacion dle usuario por medio de su username
router.get('/:username', async(req, res) => {
    const username = req.params.username
    try{
        const user = await queries.get_user_info_username(username);
        res.status(200).json({ message: user })
    } catch(err){
        res.status(500).json({ error: err.message })
    }

})

//cambiar contraseña
router.post('/resetPassword', async (req, res) => {
    const { email, confirmPassword } = req.body; 

    try {
        const users = await queries.getAllUsers();
        let userToUpdate = users.find(user => user.user_email === email); 
        console.log(userToUpdate)
        if (userToUpdate) {
            // Actualizar la contraseña
            userToUpdate.password = confirmPassword;

            // Llamar al endpoint de actualización para actualizar el usuario
            const updatedUserResponse = await queries.update_user(
                userToUpdate.user_id,
                userToUpdate.username,
                userToUpdate.email,
                userToUpdate.password,
                userToUpdate.rol,
                userToUpdate.space_tier,
                userToUpdate.firstname,
                userToUpdate.lastname,
                userToUpdate.phone_number,
                userToUpdate.country,
                userToUpdate.nationality
            );

            return res.status(200).json({
                message: "Contraseña actualizada correctamente",
                updatedUser: updatedUserResponse
            });
        }

        res.status(404).json({ message: "Usuario no encontrado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/suspendAccount', async(req, res) => {
    const username = req.query.username
    const suspend = req.query.suspend
    let id_user;
    //primero debemos obtener el id del usuario
    try{
        id_user = await queries.get_user_id(username);
    }catch(err){
        res.status(500).json( {error: err.message})
    }

    try{
        const accountSuspended = await queries.update_user_is_suspended(id_user, suspend)
        res.status(200).json( {message: accountSuspended })
    }catch(err){
        res.status(500).json( {error: err.message})
    }
    
})



router.put('/changeToDeleteProcess', async(req, res) => {
    const username = req.query.username
    const process = req.query.process
    let id_user;
    console.log(process, username)
    //primero debemos obtener el id del usuario
    try{
        id_user = await queries.get_user_id(username);
    }catch(err){
        res.status(500).json( {error: err.message})
    }

    try{
        const accountSuspended = await queries.update_user_is_in_delete_process(id_user, process)
        res.status(200).json( {message: accountSuspended })
    }catch(err){
        res.status(500).json( {error: err.message})
    }
    
})


router.put('/updateNextPay', async (req, res) => {
    const username = req.body.username;
    const next_pay = req.body.next_pay;
    let id_user;

    // primero debemos obtener el id del usuario
    try {
        id_user = await queries.get_user_id(username);
        console.log(id_user)
        console.log(username)
        
        if (!id_user) {
            return res.status(404).json({ error: "El usuario no existe" }); // Enviar respuesta si no se encuentra el usuario
        }
    } catch (err) {
        return res.status(500).json({ error: err.message }); // Terminar la ejecución si hay un error
    }

    // actualizar el campo next_pay del usuario
    try {
        const user_next_pay = await queries.update_user_next_pay(id_user, next_pay);
        return res.status(200).json({ message: user_next_pay }); // Enviar respuesta al cliente
    } catch (err) {
        return res.status(500).json({ error: err.message }); // Terminar la ejecución si hay un error
    }
});






module.exports = router