require('dotenv').config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const appRoutes = require('./routes/appRoutes')

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT' ,'DELETE' ],
}

const app = express()
app.use(bodyParser.json())

app.use(cors(corsOptions))

app.use('/', appRoutes)

const PORT = process.env.PORT || 1601

app.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}...`)
});
