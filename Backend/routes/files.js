const express = require('express')
const router = express.Router()
router.use(express.json())
const queries = require('../request/queries')
const { upload_file_s3 } = require('../request/s3')
const multer = require('multer');
const { user } = require('../config/db')
const { cola_abiertos, cola_subidos } = require('../request/tail');
const { route } = require('./user')
const { element, array } = require('prop-types')


router.get('/', (req, res) => {
    console.log('ruta de files')
    res.send('Ruta de files funcionando correctamente')
})



//aqui creamos un directorio recibe el id del usuario
router.post('/create/directory', async (req, res) => {
    data = req.body
    const username = data.username; const path_padre = data.path_padre; const name = data.name;
    const new_path = path_padre + "/" + name
    let create_directory, id_path, id_username;
    //primero creamos la ruta en la base
    try {
        create_directory = await queries.insert_path(new_path)
    } catch (err) {
        res.status(500).json({ error: err.message })
        return
    }

    //obtenemos el id de la ruta creada
    try {
        id_path = await queries.get_path_id_by_name(path_padre)
    } catch (err) {
        res.status(500).json({ error: err.message })
        return
    }

    //aqui obtenemos el id de el user
    try {
        id_username = await queries.get_user_id(username)
    } catch (err) {
        res.status(500).json({ error: err.message })
        return
    }

    console.log('id:', id_username)


    //ahora creamos el directorio
    try {
        const directorio = await queries.insert_file(name, "dir", id_path, id_username, "prueba.com")
    } catch (err) {
        res.status(500).json({ error: err.message })
        return
    }

    res.status(200).json({ message: "Directorio creado correctamente" })

})


// Configura multer para almacenar los archivos en la memoria
const upload = multer({ storage: multer.memoryStorage() });

// Ruta para subir archivos a S3
router.post('/create/file', upload.single('file'), async (req, res) => {
    const file = req.file; // Archivo subido
    const path = req.body.path; // Ruta de almacenamiento en S3
    const name = req.body.name || file.originalname; // Nombre del archivo
    console.log(req.file)

    let url;
    try {
        const result = await upload_file_s3(file, path, name);
        url = result.fileUrl;
    } catch (err) {
        res.status(500).json({ message: 'Error al subir el archivo', error: err.message });
        return
    }

    let id_path, id_username;
    //primero obtenemos la ruta padre
    try{
        id_path = await queries.get_path_id_by_name(path);
    } catch(err){
        res.status(500).json({ error: err.message })
        return
    }
    
    //aqui obtenemos el id en el user
    const username = path.split('/')[0]
    try{
        id_username = await queries.get_user_id(username)
    }catch(err){
        res.status(500).json({ error: err.message })
        return
    }
    
    //Por ultimo creamos el file en la base
    try{
        const archivo = await queries.insert_file(name, "file", id_path, id_username, url)
    }catch (err) {
        res.status(500).json({ error: err.message })
        return
    }

    //get_file_id_by_name_and_path

    data_file = {
        files_name: name,
        files_type: "file",
        files_path_id: id_path,
        user_id: id_username,
        files_link: url
    }
    cola_subidos.unshift(data_file);

    res.status(200).json({ message: "Archivo creado correctamente" })

});


//ruta para obtener todo lo que esta dentro de un directorio
router.get('/directory', async (req, res) => {
    const path = req.query.path
    let id_path;
    //primero obtenemos el id de la ruta
    try {
        id_path = await queries.get_path_id_by_name(path)
    } catch (err) {
        res.status(500).json({ error: err.message })
        return
    }

    //ahora creamos el directorio
    try {
        const files = await queries.get_files_by_path_id(id_path)
        res.status(200).json(files);
    } catch (err) {
        res.status(500).json({ error: err.message })
        return
    }
})

router.post('/moveFileToRecycle', async (req, res) => {
    const path = req.body.path; // 
    const name = req.body.name; // 
    const username = path.split('/')[0]

    try{
        id_path = await queries.get_path_id_by_name(path);
    } catch(err){
        res.status(500).json({ error: err.message })
        return
    }

    try{
        id_file = await queries.get_file_id_by_name_and_path(name, id_path);
    } catch(err){
        res.status(500).json({ error: err.message })
        return
    }

    let name_new = username+'/Papelera'
    try{
        id_file_path_papelera = await queries.get_path_id_by_name(name_new);
    } catch(err){
        res.status(500).json({ error: err.message })
        return
    }

    try{
        id_file_update = await queries.update_file (id_file, null, null , id_file_path_papelera, null, null);
    } catch(err){
        res.status(500).json({ error: err.message })
        return
    }
    // console.log('-------------------------------------------')
    // console.log(id_path)
    // console.log(id_file)
    // console.log(id_file_path_papelera)
    // console.log(id_file_update)
    // console.log('-------------------------------------------')
    res.status(200).json({ id: id_file_update })
    
});

router.delete('/delete-file', async (req, res) => {
    const path = req.body.path; // 
    const name = req.body.name; // 
    const username = path.split('/')[0]

    try{
        id_path = await queries.get_path_id_by_name(path);
    } catch(err){
        res.status(500).json({ error: err.message })
        return
    }
    try{
        id_delete_file = await queries.get_file_id_by_name_and_path(name,id_path);
    } catch(err){
        res.status(500).json({ error: err.message })
        return
    }
    try{
        file_delete = await queries.delete_file(id_delete_file);
    } catch(err){
        res.status(500).json({ error: err.message })
        return
    }
    res.status(200).json({ id: file_delete })
});


router.post('/moveCarpToRecycle', async (req, res) => {
    const path = req.body.path; 
    const name_carpeta = req.body.name_carpeta; 
    const username = path.split('/')[0];

    /* PASO [1] - Obtener el id de la carpeta padre */
    let id_carpeta_padre;
    try {
        id_carpeta_padre = await queries.get_path_id_by_name(path);
    } catch (err) {
        res.status(500).json({ error: err.message });
        return;
    }

    /* PASO [2] - Obtener el id de la carpeta a eliminar */
    let id_carpeta_eliminar;
    try {
        id_carpeta_eliminar = await queries.get_file_id_by_name_and_path(name_carpeta, id_carpeta_padre);
    } catch (err) {
        res.status(500).json({ error: err.message });
        return;
    }

    /* PASO [3] - Obtener el id de la papelera */
    let name_new = `${username}/Papelera`;
    let id_papelera;
    try {
        id_papelera = await queries.get_path_id_by_name(name_new);
    } catch (err) {
        res.status(500).json({ error: err.message });
        return;
    }


    /* PASO [4] - Obtener el contenido de la carpeta actual */
    let conten_carpetaAct; // Declarar la variable aquí
    try {
        let ruta_actual = `${username}/${name_carpeta}`;
        console.log(ruta_actual)
        let id_carpeta_actual = await queries.get_path_id_by_name(ruta_actual)
        console.log('--------------')

        conten_carpetaAct = await queries.get_files_by_path_id(id_carpeta_actual);
        //console.log(conten_carpetaAct)
        
        //console.log(conten_carpetaAct);
        
        // Llamar a la función para recorrer los hijos
        await recorrerHijos(conten_carpetaAct, username, ruta_actual);
        let id_file_update2 = await queries.update_file(id_carpeta_eliminar, null, null, id_papelera, null, null);
    } catch (err) {
        res.status(500).json({ error: err.message });
        return;
    }

    // Retornar el contenido de la carpeta actual
    res.status(200).json({ message: 'listo' });
});

router.delete('/delete-carp', async (req, res) => {
    const path = req.body.path; // 
    const name = req.body.name; // 
    const username = path.split('/')[0]
    try{
        id_path2 = await queries.get_path_id_by_name(path);
    } catch(err){
        res.status(500).json({ error: err.message })
        return
    }
    try{
        file_id = await queries.get_file_id_by_name_and_path(name,id_path2);
    } catch(err){
        res.status(500).json({ error: err.message })
        return
    }
    try{
        id_delete_file = await queries.delete_file(file_id);
    } catch(err){
        res.status(500).json({ error: err.message })
        return
    }
    res.status(200).json({ id: id_delete_file })
});



//cola para abiertos recientemente
router.post('/add/recientes', async (req, res) => {
    const file = req.body.path

    for (let i = 0; i < cola_abiertos.length; i++){
        if (cola_abiertos[i].files_id == file.files_id){
            res.status(200).json( { message: "Ya esta agregado"})
            return
        }
    }

    
    cola_abiertos.unshift(file)        
    
    console.log("------------------------------------------------------------------------")
    console.log(cola_abiertos)
    res.status(200).json({ message: "Agregado a la cola correctamente"})
})

router.get('/get/recientes', async (req, res) => {
    res.status(200).json({ message: cola_abiertos })
})

//cola de recien subidos
router.get('/get/subidos', async (req, res) => {
    res.status(200).json({ message: cola_subidos })
})

router.delete('/colas', async (req, res) => {
    
    cola_subidos.length = 0
    cola_abiertos.length = 0
    res.status(200).json({ message: "Registro de reciente eliminados correctamente"})

})


//---------------------------------------------endpoints para compartir carpetas--------------------------------
//Para obtener todos los usuarios y los archivos todo los archivos de nuestra cuenta
router.get('/users_and_files', async(req, res) => {
    const username = req.query.username
    console.log("hola")
    let users, user_files;
    try{
        users = await queries.get_all_users_name()
    }catch( error) {
        res.status(500).json({ message: error })
    }

    try{
        user_files = await queries.get_all_user_files(username)
    }catch(error){
        res.status(500).json( {message: error})
    }

    console.log(users)
    console.log(user_files)

    response = {
        users_to_share: users,
        user_files: user_files
    }

    res.status(200).json({ message: response})

})

//compartimos el archivo
router.post('/shareFile', async(req, res) => {
    const data = req.body
    const file = data.file_name; const host_user = data.host_user; const shared_user = data.shared_user
    console.log(data)

    try{
        const result = await queries.share_file(file, host_user, shared_user);
        res.status(200).json({ message: "Archivo compartido correctamente "})
    }catch(error){
        res.status(500).json({ error: "No se ha podido compartir el archivo"})
    }

})

//Para obtener los archivos compartidos para la cuenta que se le compartio
router.get('/sharedFiles', async(req, res) =>{
    const username = req.query.username

    //aqui solo obtenemos los id
    let sharedFiles
    try{
        sharedFiles = await queries.get_shared_files(username)
        
    }catch(error){
        res.status(500).json({error: error})
    }

    let id_files = sharedFiles.map(element => element.id_files)

    console.log(id_files)

    //aqui vamos a obtener los files compartidos
    let files = [] ;
    try{
        for(let i = 0; i < id_files.length; i++){
            console.log(id_files[i]);
            files.push(await queries.get_file_by_id(id_files[i]))
            console.log(files)
        }
    }catch(error){
        res.status(500).json({ error: error})
    }

    res.status(200).json({ message: files })

})

//aqui eliminamos el archivo compartido del usuario 
router.delete('/sharedFile', async(req, res) => {
    const filename = req.query.filename
    const username =req.query.username

    try{
        const result = await queries.remove_from_shared_files(filename, username)
        res.status(200).json({ message: "Se ha eliminado correctamente" })
    }catch(error){
        res.status(500).json({ error: error.message})
    }

})

router.get('/hostShared', async(req, res) => {
    const username = req.query.username

    let info;
    try{
        info = await queries.get_host_shared(username);
    }catch(error){
        res.status(500).json( { error: error.message})
    }

    console.log(info)
    let id_files = info.map(element => element.id_files)
    let id_users = info.map(element => element.id_user)
    let data_response = []
    try{
        for(let i = 0; i < id_files.length; i++){
            console.log(id_files[i]);
            let file = await queries.get_file_by_id(id_files[i])
            let user = await queries.get_user_info(id_users[i])
            data = {
                file: file,
                user_shared: user
            }   
            data_response.push(data)
        }
    }catch(error){
        res.status(500).json({ error: error})
    }

    res.status(200).json({ message: data_response})




})



//---------------------------------------------endpoints para crear labels--------------------------------
//creamos el label y agregamos archivos
router.post('/createLabel', async(req, res) => {
    const data = req.body
    const label_name = data.label_name; const file_name = data.file_name; const username = data.username;

    console.log(label_name, file_name, username)
    try{
        const result = await queries.create_label(label_name, file_name, username)
        res.status(200).json({ message: "Se ha creado correctamente"})
    }catch(error){
        res.status(500).json({ error: error })
    }
})

//para obtener los archivos de una etiqueta
router.get('/labelFiles', async(req, res) => {
    const label_name = req.query.label;
    const username = req.query.username;

    //aqui obtenemos los files del id
    let labels;
    try{
        labels = await queries.get_label_by_description(label_name, username);
       
    }catch(error){
        res.status(500).json({ error: error})
    }

    let id_files = labels.map(element => element.label_id_path)

    console.log(id_files)

    let files = []
    try{
        for(let i = 0; i < id_files.length; i++){
            files.push(await queries.get_file_by_id(id_files[i]))
        }
    }catch(error){
        res.status(500).json({ error: error })
    }

    res.status(200).json({ message: files})

})

//aqui obtenemos todos los labels de un usuario
router.get('/labels', async(req, res) => {
    const username = req.query.username;

    //aqui obtenemos los files del id
    let labels;
    try{
        labels = await queries.get_labels_by_user(username);
    }catch(error){
        res.status(500).json({ error: error })
    }

    let names = labels.map(element => element.label_description)
    let unique_names = [...new Set(names)];

    console.log(unique_names)

    res.status(200).json({ message: unique_names})
})

router.delete('/removeFile', async(req, res) => {
    const data = req.body
    const label_name = data.label_name; const file_name = data.file_name; const username = data.username;

    try{
        const result = await queries.remove_label(label_name, file_name, username)
        res.status(200).json({ message: "eliminado correctamente"})
    }catch(error){
        res.status(500).json({ error: error.message })
    }

})





async function recorrerHijos(contenido, req, rutaAcutal) {
    let name_new = `${req}/Papelera`;
    let id_papelera = await queries.get_path_id_by_name(name_new);

    for (const item of contenido) {
        if (item.files_type === "dir") {

            // Obtener los hijos del directorio actual
            const id_hijos = await queries.get_files_by_path_id(item.files_path_id);   

            // Comprobar si el directorio tiene hijos
            if (id_hijos.length === 0) {
                console.log(`El directorio ${item.files_name} no tiene hijos.`);
                
                let id_file_update = await queries.update_file(item.files_id, null, null, id_papelera, null, null);
                console.log(`Actualizado el directorio ${item.files_name} en la papelera.`);
            } else {
                console.log(`El directorio ${item.files_name} tiene ${id_hijos.length} hijo(s):`);

                let rutaDelHijo = `${rutaAcutal}/${item.files_name}`;
                let id_carpeta_actual;

                try {
                    id_carpeta_actual = await queries.get_path_id_by_name(rutaDelHijo);
                    console.log(`ID de la carpeta actual: ${id_carpeta_actual}`);
                } catch (err) {
                    console.error(`Error al obtener el ID de la carpeta actual: ${err.message}`);
                    continue; 
                }

                let conten_carpetaAct;
                try {
                    conten_carpetaAct = await queries.get_files_by_path_id(id_carpeta_actual);
                    console.log("Contenido de la carpeta actual:", conten_carpetaAct);
                } catch (err) {
                    console.error(`Error al obtener los files: ${err.message}`);
                    continue; 
                }

                for (const idfiles of conten_carpetaAct) {
                    let id_file_update = await queries.update_file(idfiles.files_id, null, null, id_papelera, null, null);
                }    
            }

            // Actualizar el directorio actual en la papelera
            let id_file_update = await queries.update_file(item.files_id, null, null, id_papelera, null, null);
            console.log(`Actualizado el directorio ${item.files_name} en la papelera.`);
        }
    }
}









module.exports = router