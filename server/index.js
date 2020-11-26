const express = require('express')
const multer = require('multer')
const cors = require('cors')
const firebase = require('./firebase')

const app = express()

const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true,
  };

app.use(cors(corsOptions))

const upload = multer({
    storage: multer.memoryStorage()
})


app.post('/upload', upload.single('file'), (req, res) => {
    if(!req.file) {
        res.status(400).send("Error: No files found")
    } else {
        const blob = firebase.bucket.file(req.file.originalname)
        
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        })
        
        blobWriter.on('error', (err) => {
            console.log(err)
        })
        
        blobWriter.on('finish', () => {
            res.status(200).send("File uploaded.")
        })
        
        blobWriter.end(req.file.buffer)
    }
})

app.listen(5000, () => {
    console.log('🚀Server listening on port 5000')
})