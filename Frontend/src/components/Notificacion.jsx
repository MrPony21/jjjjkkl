import React, { useState, useEffect } from 'react';

import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";

export default function Notificacion({message, tipo, mostrar, handelMostrar}) {
  return(
    <Fade
        in={mostrar}
        timeout={{ enter: 1000, exit: 1000 }}
        addEndListener={() => {
            setTimeout(() => {
                handelMostrar(false)
            }, 4000);
        }}
    >
       <Alert severity={tipo} variant="filled" className="alert">
            {message}
        </Alert>
    </Fade>
  )
}