const express = require("express");
const { engine } = require("express-handlebars");
const fileUpload = require("express-fileupload");
const mysql = require("mysql");

const app = express();
const PORT = 5000;
app.use(fileUpload());
app.use(express.static("upload"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "image-uploader",
});

app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);
    connection.query("SELECT * FROM image", (err, rows) => {
      connection.release();
      console.log(rows);
      if (!err) {
        res.render("home", { layout: false, rows });
      }
    });
  });
});

app.post("/", (req, res) => {

    
   
    
  if (!req.files) return res.status(400).send("No files were uploaded.");
  let imageFile = req.files.imageFile;

  if (!imageFile.mimetype.startsWith("image")) {
    return res.status(400).send("Please upload an image.");
  }
  let uploadPath = __dirname + "/upload/" + imageFile.name;
  console.log(imageFile.name);
  imageFile.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);
    //res.send("uploaded succesfully");
    //res.redirect('/');

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("New connection at : " + connection.threadId);
        connection.query(`INSERT INTO image values ("","${imageFile.name}")`, (err, rows) => {
          connection.release();
          //console.log(rows);
          if (!err) {
            res.redirect("/");
          } else{
            console.log(err);
    
          }
        });
      });


  });








 // console.log(req.files);
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
