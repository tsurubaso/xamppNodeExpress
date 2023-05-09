const express = require('express');
const {engine} = require('express-handlebars');
const fileUpload = require('express-fileupload');

const app = express();
const PORT= 5000;
app.use(fileUpload());
app.use(express.static("upload"));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');






app.get('/', (req, res) => res.render('home'));
app.post('/', (req, res) => {
    if(!req.files) return res.status(400).send('No files were uploaded.');
    let imageFile = req.files.imageFile;
    if (!imageFile.mimetype.startsWith('image')) {
        return res.status(400).send('Please upload an image.');
    }
    let uploadPath= __dirname+"/upload/"+imageFile.name;
    imageFile.mv(uploadPath, (err) => {
            if (err) return res.status(500).send(err);
            res.send("uploaded succesfully");
            //res.redirect('/');
        });

    console.log(req.files);
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
