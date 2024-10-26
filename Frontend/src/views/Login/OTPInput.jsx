import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Grid, TextField, Button, Alert, Link, Box, Paper } from "@mui/material";

export const OTPInput = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [timerCount, setTimer] = React.useState(60);
  const [OTPinput, setOTPinput] = useState(['', '', '', '']);
  const [disable, setDisable] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp, verification, formData, page } = location.state || {};

  const handleOTPChange = (index, value) => {
    const newOTPinput = [...OTPinput];
    newOTPinput[index] = value;
    setOTPinput(newOTPinput);
  };

  async function resendOTP() {
    console.log(disable)
    if (disable) return;
    let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
    }

    let bodyContent = JSON.stringify({
    "recipient_email": email,
    "OTP": otp
    }
    );

    let response = await fetch(`${apiUrl}email/send_recovery_email`, { 
    method: "POST",
    body: bodyContent,
    headers: headersList
    });

    let data = await response.text();
    console.log(data);
    if (response.status === 200) {
      setDisable(true)
      alert("Un nuevo OTP ha sido enviado a tu email exitosamente.")
      setTimer(60)
    }
  }

  async function verfiyOTP() {
    if (parseInt(OTPinput.join("")) === otp) {
      alert("Se ha verificado tu cuenta exitosamente.")
      if (verification) {
        console.log(formData);
        try {
            // Send the registration data to the server
            const response = await fetch(`${apiUrl}user/add`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Registro correcto!");
                const now = new Date(); // Fecha actual
                const nextPayDate = new Date(now.setMonth(now.getMonth() + 3));
                const formattedNextPayDate = nextPayDate.toISOString();
                const formDataPay = {
                  username: formData['username'],
                  next_pay: formattedNextPayDate,
                };
                const responsePay = await fetch(`${apiUrl}user/updateNextPay`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formDataPay),
                });
                const formDataP = {
                  username: formData['username'],
                  path_padre: formData['username'],
                  name: 'Papelera'
                };
                const responseP = await fetch(`${apiUrl}files/create/directory`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formDataP),
                });
                if (responseP.ok) {
                  console.log('Carpeta Papelera Creada');
                }
                return navigate("/login");
            } else {
                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.error);
                }
                alert(
                  "Registro incorrecto: Datos incorrectos"
                );
                return navigate("/registrate");
            }

        } catch (error) {
            alert("Error - Registro incorrecto: " + error.message);
            return navigate("/registrate");
        }
      }
      if (page === "Forgot") {
        return navigate("/reset", { state: { Verified: true, email: email } });
      }
      else if (page === "Settings") {
        try {
        const response = await fetch(`${apiUrl}user/suspendAccount?username=${formData['username']}&suspend=${1}`, {
          method: 'PUT',
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Account suspend status:', data.message);
      } catch (error) {
        console.error('Error suspending account:', error.message);
      }
       try {
        const response = await fetch(`${apiUrl}user/changeToDeleteProcess?username=${formData['username']}&process=${1}`, {
          method: 'PUT',
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Account suspend status:', data.message);
      } catch (error) {
        console.error('Error suspending account:', error.message);
      }
      localStorage.clear();  
      return navigate("/login", { state: { Verified: true, email: email } });
      }
    }
    alert(
      "El codigo que ingresaste no es correcto, prueba de nuevo o reenvia el link"
    );
    return;
  }

  React.useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [disable]);

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
        <div className="mx-auto d-flex flex-column text-center">
          <div className="mb-4">
            <h2 className="font-weight-bold">Verificación de Email</h2>
          </div>
          <p className="text-muted">Hemos enviado un código a tu correo {email}</p>
        </div>

        <form>
          <div className="mb-4 d-flex justify-content-between">
            {OTPinput.map((value, index) => (
              <input
                key={index}
                maxLength="1"
                className="form-control text-center mx-1"
                type="text"
                style={{ width: "60px", height: "60px", fontSize: "24px" }}
                value={value}
                onChange={(e) => handleOTPChange(index, e.target.value)}
              />
            ))}
          </div>

          <div className="d-flex flex-column">

            <Button
                variant="contained"
                color="primary"
                onClick={verfiyOTP}
                fullWidth
                sx={{ marginTop: 2, marginBottom: 2 }}
            >
                Verificar Cuenta
            </Button>
            
            <Box className="text-center text-muted" sx={{alignContent: 'center', textAlign: 'center'}}>
              <p>
                ¿No recibiste el código?
              </p>
              <a
                href="#"
                className="text-primary"
                onClick={resendOTP}
                style={{
                  pointerEvents: disable ? "none" : "auto",
                  textDecoration: disable ? "none" : "underline",
                  cursor: disable ? "default" : "pointer",
                }}
              >
                {disable ? `Reenviar código en ${timerCount}s` : "Reenviar código"}
              </a>
            </Box>
          </div>
        </form>
      </Paper>
    </Box>

  );
}