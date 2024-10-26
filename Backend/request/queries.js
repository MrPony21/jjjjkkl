const mysql = require('mysql2/promise');
const db_config = require('../config/db');

async function connect_to_db() {
    return await  mysql.createConnection(db_config);
}

//------------------------------------------------------CONSULTAS DE USUARIOS---------------------------------------------------------
async function getAllUsers() {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('SELECT * FROM user')
        console.log(results)
        return results
    } catch (error) {
        console.log("Error al obtener todos los usuarios", error)
    } finally {
        connection.end();
    }
}

async function insert_user(username, email, password, rol, space_tier, firstname, lastname, phone_number, country, nationality) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call insert_user(?,?,?,?,?,?,?,?,?,?)', [username, email, password, rol, space_tier, firstname, lastname, phone_number, country, nationality])
        resultado = results[0][0].result
        console.log(resultado)
        if (resultado == 0) {
            throw new Error("El usuario ya existe")
        }
        return [resultado, "Se ha creado correctamente el usuario"]
    } catch (error) {
        console.log("Error al agregar usuario", error)
        throw error
    } finally {
        connection.end();
    }
}


async function get_user_id(username) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call get_user_id(?)', [username])
        resultado = results[0][0].user_id
        console.log(resultado)
        if (resultado == 0) {
            throw new Error("El usuario no existe")
        }
        return resultado
    } catch (error) {
        console.log("Error al obtener el id usuario", error)
        throw error
    } finally {
        connection.end();
    }
}


async function get_user_email(id) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call get_user_email(?)', [id])
        resultado = results[0][0].email
        console.log(resultado)
        if (resultado == 0) {
            throw new Error("El usuario no existe")
        }
        return resultado
    } catch (error) {
        console.log("Error al obtener el email usuario", error)
        throw error
    } finally {
        connection.end();
    }
    
}


async function get_user_rol(id) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call get_user_rol(?)', [id])
        resultado = results[0][0].user_rol
        console.log(resultado)
        if (resultado == 0) {
            throw new Error("El usuario no existe")
        }
        return resultado
    } catch (error) {
        console.log("Error al obtener el rol del usuario", error)
        throw error
    } finally {
        connection.end();
    }    
}


async function get_user_space(id) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call get_user_space(?)', [id])
        resultado = results[0][0].user_space_tier
        console.log(resultado)
        return resultado
    } catch (error) {
        console.log("Error al obtener user_space ", error)
        throw error
    } finally {
        connection.end();
    }    
}

async function get_user_info(id) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call get_user_info(?)', [id])
        resultado = results[0][0]
        console.log(resultado)
        if (resultado == 0) {
            throw new Error("El usuario no existe")
        }
        return resultado
    } catch (error) {
        console.log("Error al obtener info del usuario", error)
        throw error
    } finally {
        connection.end();
    }    
}

async function get_user_info_username(username) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call get_user_info_username(?)', [username])
        resultado = results[0][0]
        console.log(resultado)
        if (resultado == 0) {
            throw new Error("El usuario no existe")
        }
        return resultado
    } catch (error) {
        console.log("Error al obtener info dle usuario", error)
        throw error
    } finally {
        connection.end();
    }    
}

async function delete_user(id){
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call delete_user(?)', [id])
        resultado = results[0][0].message
        console.log(resultado)
        if (resultado == 0) {
            throw new Error("El usuario no existe")
        }
        return resultado
    } catch (error) {
        console.log("Error al eliminar el usuario", error)
        throw error
    } finally {
        connection.end();
    }    
}


async function update_user(id, username, email, password, rol, space_tier, firstname, lastname, phone_number, country, nationality){
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call update_user_info(?,?,?,?,?,?,?,?,?,?,?)',  [id ,username, email, password, rol, space_tier, firstname, lastname, phone_number, country, nationality])
        resultado = results[0][0].result
        console.log(resultado)
        if (resultado == 0) {
            throw new Error("El usuario no existe")
        }
        return [resultado, "Se ha creado ha modificado el usuario correctamente"]
    } catch (error) {
        console.log("Error al actualizar el usuario", error)
        throw error
    } finally {
        connection.end();
    }    
}

async function login(username, password){
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call login(?,?)',  [username, password])
        resultado = results[0][0].result
        console.log('esto',resultado)
        if (resultado == 0) {
            throw new Error("Error de credenciales")
        }
        return resultado
    } catch (error) {
        console.log("Error al loguear usuario", error)
        throw error
    } finally {
        connection.end();
    }    
}

async function update_user_is_in_delete_process(id_user, new_boolean) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call update_user_is_in_delete_process(?,?)',  [id_user, new_boolean])
        resultado = results[0]
        console.log('esto es del process',resultado)
        if (resultado == 0) {
            throw new Error("Error ya existe esa ruta")
        }
        return resultado
    } catch (error) {
        console.log("Error en update_delete_process", error)
        throw error
    } finally {
       connection.end();
    }
    
}

async function update_user_is_suspended(id_user, new_boolean) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call update_user_is_suspended(?,?)',  [id_user, new_boolean])
        resultado = results[0]
        console.log('esto es del process',resultado)
        if (resultado == 0) {
            throw new Error("Error ya existe esa ruta")
        }
        return resultado
    } catch (error) {
        console.log("Error en user is suspended", error)
        throw error
    } finally {
       connection.end();
    }
    
}

async function update_user_space(id_user, new_boolean) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call update_user_space(?,?)',  [id_user, new_boolean])
        resultado = results[0]
        console.log('esto es del user_space',resultado)
        if (resultado == 0) {
            throw new Error("Error ya existe esa ruta")
        }
        return resultado
    } catch (error) {
        console.log("Error en update_delete_process", error)
        throw error
    } finally {
       connection.end();
    }
    
}

async function update_user_last_login(id_user, datetime) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call update_user_last_login(?,?)',  [id_user, datetime])
        resultado = results[0]
        console.log('esto es el resultado',resultado)
        if (resultado == 0) {
            throw new Error("Error ya existe esa ruta")
        }
        return resultado
    } catch (error) {
        console.log("Error en update_user_last_login", error)
        throw error
    } finally {
       connection.end();
    }
    
}


async function update_user_next_pay(id_user, datetime) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call update_user_next_pay(?,?)',  [id_user, datetime])
        resultado = results[0]
        console.log('esto es el resultado',resultado)
        if (resultado == 0) {
            throw new Error("Error ya existe esa ruta")
        }
        return resultado
    } catch (error) {
        console.log("Error en update_user_last_login", error)
        throw error
    } finally {
       connection.end();
    }
    
}




//-------------------------------------------------------------------FILES-------------------------------------------------------------
//crear una ruta en la base
async function insert_path(path) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call insert_path(?)',  [path])
        resultado = results[0]
        console.log('esto',resultado)
        if (resultado == 0) {
            throw new Error("Error ya existe esa ruta")
        }
        return resultado
    } catch (error) {
        console.log("Error en insert_path", error)
        throw error
    } finally {
       connection.end();
    }
    
}

//crear archivo y directorio
async function insert_file(new_file_name, new_file_type, new_files_path_id, new_user_id, new_files_link ) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call insert_file(?,?,?,?,?)',  [new_file_name, new_file_type, new_files_path_id, new_user_id, new_files_link])
        resultado = results[0]
        console.log('esto',resultado)
        if (resultado == 0) {
            throw new Error("Error ya existe ese directorio o archivo")
        }
        return resultado
    } catch (error) {
        console.log("Error en insert_file", error)
        throw error
    } finally {
       connection.end();
    }
}


async function get_path_id_by_name(path_name) {
    const connection = await connect_to_db();
    try {
        const [results] = await connection.query('call get_path_id_by_name(?)',  [path_name])
        resultado = results[0][0].path_id
        if (resultado == 0) {
            throw new Error("No existe la ruta")
        }
        return resultado
    } catch (error) {
        console.log("Error en get_path_id_by_name", error)
        throw error
    } finally {
       connection.end();
    }
}



async function get_file_info(file_name, file_route, user_id) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call get_file_info(?,?,?)',  [file_name, file_route, user_id])
        resultado = results[0][0].result
        console.log('esto',resultado)
        if (resultado == 0) {
            throw new Error("Error de credenciales")
        }
        return resultado
    } catch (error) {
        console.log("Error al loguear usuario", error)
        throw error
    } finally {
       connection.end();
    }
}


async function get_files_by_path_id(path_id) {
    const connection = await connect_to_db()
    try {
        const [results] = await connection.query('call get_files_by_path_id(?)',  [path_id])
        resultado = results[0]
        console.log('esto',resultado)
        if (resultado == 0) {
            throw new Error("Error al obtener los files")
        }
        return resultado
    } catch (error) {
        console.log("Error al get_files_by_path_id", error)
        throw error
    } finally {
       connection.end();
    }
    
}

async function get_file_id_by_name_and_path(file_name, path_id) {
    const connection = await connect_to_db();
    try {
        const [rows] = await connection.execute('CALL get_file_id_by_name_and_path(?, ?)', [file_name, path_id]);
        console.log(rows[0][0])
        return rows[0][0].files_id; // Retorna el ID del archivo
    } catch (error) {
        throw new Error('Error al obtener el ID del archivo: ' + error.message);
    } finally {
        await connection.end();
    }
}

async function move_file_to_recycle(file_id) {
    const connection = await connect_to_db();
    try {
        // Suponiendo que tienes un procedimiento almacenado para mover a la papelera
        const [results] = await connection.query('call move_to_recycle(?)', [file_id]);
        return results[0][0]; // Retorna el resultado del procedimiento almacenado
    } catch (error) {
        console.log("Error al mover el archivo a la papelera", error);
        throw error;
    } finally {
        connection.end();
    }
}


async function update_file(filesId, newFilesName, newFilesType, newFilesPathId, newUserId, newFilesLink) {
    const connection = await connect_to_db();
    try {
        // Ejecutar el procedimiento almacenado con los parámetros
        const [rows] = await connection.execute(
            'CALL update_file(?, ?, ?, ?, ?, ?)',
            [filesId, newFilesName, newFilesType, newFilesPathId, newUserId, newFilesLink]
        );

        resultado = rows[0][0].resultado
        console.log('Resultado:', rows);
        
        // Verificar el resultado
        if (resultado == 0) {
            throw new Error("Error al obtener los files")
        }
        return 'Archivo enviado con exito'
    } catch (err) {
        console.error('Error al ejecutar el procedimiento:', err.message);
        return 'Error al mover archivo'
    } finally {
        // Cerrar la conexión
        await connection.end();
    }
}


async function delete_file(fileId) {
    const connection = await connect_to_db(); // Suponiendo que tienes una función para conectarte a la base de datos
    try {
        // Ejecutar el procedimiento almacenado con el ID del archivo
        const [rows] = await connection.execute(
            'CALL delete_files(?)',
            [fileId]
        );

        const resultado = rows[0][0].resultado;
        console.log('Resultado:', resultado);

        // Verificar el resultado
        if (resultado === 1) {
            return 'Archivo eliminado correctamente';
        } else {
            throw new Error('No se encontró el archivo para eliminar');
        }
    } catch (err) {
        console.error('Error al ejecutar el procedimiento:', err.message);
        return 'Error al eliminar el archivo';
    } finally {
        // Cerrar la conexión
        await connection.end();
    }
}

async function update_path_name(path_id, new_path_name) {
    const connection = await connect_to_db();
    try {
        const query = 'CALL update_path_name(?, ?)';
        const [result] = await connection.query(query, [path_id, new_path_name]);
        return result;
    } catch (error) {
        console.log("Error al ejecutar update_path_name:", error);
        throw error;
    } finally {
        connection.end();
    }
}


//--------------------------------------------------------AQUI HAREMOS TODAS LAS QUERIES PARA COMPARTIR CARPETAS------------------------
async function get_all_users_name() {
    const connection = await connect_to_db();
    try{
        const [result] = await connection.query('CALL get_all_users_name()')
        console.log(result[0])
        return result[0]
    }catch (error) {
        console.log("Error al ejecutar get_all_users_name", error)
        throw error
    }finally{
        connection.end()
    }
    
}

async function get_all_user_files(name) {
    const connection = await connect_to_db();
    try{
        const [result] = await connection.query('CALL get_all_user_files(?)', [name])
        console.log(result[0])
        return result[0]
    }catch (error) {
        console.log("Error al ejecutar get_all_user_files", error)
        throw error
    }finally{
        connection.end()
    }
    
}

async function share_file(file, host_user, shared_user) {
    const connection = await connect_to_db()
    try{
        const [result] = await connection.query('CALL share_file(?,?,?)', [file, host_user, shared_user])
        let resultado = result[0][0].result
        if(resultado === 0){
            throw new Error("Error al compartir el archivo")
        }
        return 
    } catch(error){
        console.log("Error al ejecutar share_file", error)
        throw error
    }finally{
        connection.end()
    }    
}

async function get_shared_files(shared_user) {
    const connection = await connect_to_db()
    try{
        const [result] = await connection.query('CALL get_shared_files(?)', [shared_user])
        console.log(result[0])
        return result[0]
    } catch(error){
        console.log("Error al obtener los archivos compartidos", error)
        throw error
    }finally{
        connection.end()
    }    
}

async function get_file_by_id(id) {
    const connection = await connect_to_db()
    try{
        const [result] = await connection.query('CALL get_file_by_id(?)', [id])
        console.log(result[0])
        return result[0][0]
    } catch(error){
        console.log("Error al obtener los archivos compartidos", error)
        throw error
    }finally{
        connection.end()
    }

    
}


async function remove_from_shared_files(filename, username) {
    const connection = await connect_to_db()
    try{
        const [result] = await connection.query('CALL remove_from_shared_files(?,?)', [filename, username])
        const resultado = result[0][0].result
        if(resultado === 0){
            throw new Error("Error al remover archivos")
        }
        return resultado
    } catch(error){
        console.log(error)
        throw error
    }finally{
        connection.end()
    }
}


async function get_host_shared(username){
    const connection = await connect_to_db()
    try{
        const [result] = await connection.query('CALL get_host_shared(?)', [username])
        const resultado = result[0]
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }finally{
        connection.end()
    }

}




//--------------------------------------------------------AQUI HAREMOS TODAS LAS QUERIES PARA CREAR LABELS------------------------
async function create_label(label_name, file_name, username) {
    const connection = await connect_to_db()
    try{
        const [result] = await connection.query('CALL create_label(?,?,?)', [label_name, file_name, username])
        console.log(result[0])
        return result[0][0]
    } catch(error){
        console.log("Error al obtener los archivos compartidos", error)
        throw error
    }finally{
        connection.end()
    }   
}

async function get_label_by_description(label_name, username) {
    const connection = await connect_to_db()
    try{
        const [result] = await connection.query('CALL get_label_by_description(?,?)', [label_name, username])
        console.log(result[0])
        return result[0]
    } catch(error){
        console.log("Error al obtener los archivos compartidos", error)
        throw error
    }finally{
        connection.end()
    }   
    
}


async function get_labels_by_user(username) {
    const connection = await connect_to_db()
    try{
        const [result] = await connection.query('CALL get_labels_by_user(?)', [username])
        console.log(result[0])
        return result[0]
    } catch(error){
        console.log("Error al obtener los archivos compartidos", error)
        throw error
    }finally{
        connection.end()
    }   
    
    
}

async function remove_label(label_name, file_name, username) {
    const connection = await connect_to_db()
    try{
        const [result] = await connection.query('CALL remove_label(?,?,?)', [label_name, file_name, username])
        const resultado = result[0][0].result
        if(resultado === 0){
            throw new Error("Error al remover archivos")
        }
        return result[0]
    } catch(error){
        console.log(error)
        throw error
    }finally{
        connection.end()
    }   
}

module.exports = {
    getAllUsers,
    insert_user,
    get_user_id,
    get_user_email,
    get_user_rol,
    get_user_space,
    get_user_info,
    get_user_info_username,
    delete_user,
    update_user,
    login,
    insert_path,
    insert_file,
    get_path_id_by_name,
    get_files_by_path_id,
    get_file_id_by_name_and_path,
    move_file_to_recycle,
    update_file,
    delete_file,
    update_path_name,
    update_user_is_in_delete_process,
    update_user_is_suspended,
    update_user_space,
    update_user_last_login,
    update_user_next_pay,
    get_all_users_name,
    get_all_user_files,
    share_file,
    get_shared_files,
    get_file_by_id,
    create_label,
    get_label_by_description,
    get_labels_by_user,
    remove_from_shared_files,
    remove_label,
    get_host_shared

}