require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Configurar el cliente de S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETACCESSKEY,
  }
});

// Función para subir archivo a S3
async function upload_file_s3(file, path, name) {
  try {
    // Crear el nombre único del archivo con un timestamp
    const full_path = `${path}/${name}`;
    const key = `${full_path}_${Date.now()}`;

    // Parámetros de subida a S3
    const uploadParams = {
      Bucket: process.env.BUCKETNAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Subimos el archivo a S3
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    // Generar la URL del archivo subido
    const fileUrl = `https://${process.env.BUCKETNAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { fileUrl };
  } catch (err) {
    console.log("Error al subir el archivo a S3", err)
    throw new Error('Error al subir el archivo a S3');
  }
}

module.exports = { upload_file_s3 };
