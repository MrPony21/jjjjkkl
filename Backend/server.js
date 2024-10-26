const express = require('express')
const cors = require('cors');
app = express()
const userRoute = require('./routes/user')
const emailRoute = require('./routes/email')
const filesRoute = require('./routes/files')

app.use(cors())
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});


app.get('/', (req, res) => {
    console.log('hola')
    res.send('Server funciona')
})

app.use("/user", userRoute)
app.use("/email", emailRoute)
app.use("/files", filesRoute)

app.listen(2000)