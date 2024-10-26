import React, { useState } from "react";
import { Modal, Box, Button } from "@mui/material";
import { apiURL } from "../logic/constants";

const FilePreview = ({ open, onClose, file }) => {
  const getFileType = (fileName) => {
    const match = fileName.match(/\.(pdf|png|jpg|jpeg|gif|mp4|webm|mp3|wav)/i);
    return match ? match[1].toLowerCase() : null;
  };

  const add_file_recent = async () => {
    const data = {
      path: file
    }
    console.log(data)
    try{
      const response =  await fetch(`${apiURL}/files/add/recientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });
      if (response.status != 200) {
        const result =  response;
        console.log(result)
      }

      console.log("Se ha realizado correctamente la peticion para insertar a cola en recientes")
      
    }catch(error){
      console.error("Error al insertar la cola en recientes", error)
    }

  } 


  const renderPreview = () => {
    if (file === undefined || file == false) {
      return;
    }

    add_file_recent()
    const fileType = getFileType(file.files_link);
    if (fileType === "pdf") {
      return (
        <iframe
          src={file.files_link}
          style={{ width: "100%", height: "90vh" }}
          title="PDF Preview"
        />
      );
    } else if (["png", "jpg", "jpeg", "gif"].includes(fileType)) {
      return (
        // <img src={file.files_link} alt="Preview" style={{ maxWidth: "100%" }} />
        <iframe
          src={file.files_link}
          style={{ width: "100%", height: "90vh" }}
          title="PDF Preview"
        />
      );
    } else if (["mp4", "webm"].includes(fileType)) {
      return (
        // <video controls src={file.files_link} style={{ maxWidth: "100%" }} />
        <iframe
          src={file.files_link}
          style={{ width: "100%", height: "90vh" }}
          title="PDF Preview"
        />
      );
    } else if (["mp3", "wav"].includes(fileType)) {
      return (
        // <audio controls src={file.files_link} />
        <iframe
          src={file.files_link}
          style={{ width: "100%", height: "40vh" }}
          title="PDF Preview"
        />
      );
    } else {
      return <p>Vista previa no disponible para este tipo de archivo</p>;
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{ p: 2, backgroundColor: "#fff", maxWidth: "80%", margin: "auto" }}
      >
        {renderPreview()}
      </Box>
    </Modal>
  );
};

export default FilePreview;
