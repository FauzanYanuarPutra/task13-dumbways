const express = require("express");
const app = express();
var methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/assets/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// sequalize image
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

const path = require("path");
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "src/assets"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.post("/projects", upload.single("image"), postProject);

app.use(express.static("src/assets"));

app.get("/", home);

app.get("/projects/:id", showProject);
app.post("/projects", upload.single("image"), postProject);
app.patch("/projects/:id", upload.single("image"), updateProject);
app.delete("/projects/:id", deleteProject);

app.get("/testi", testi);
app.get("/testi/rating/:bintang", testiBintang);
app.get("/contact", contact);
app.post("/contact", postContact);

app.listen(port, () => {
  console.log("Berjalan Di Port http://localhost:5000");
});

const availableTechnologies = [
  { value: "node-js", label: "Node.js" },
  { value: "react", label: "React" },
  { value: "socket-io", label: "Socket io" },
  { value: "typescript", label: "Typescript" },
];

let dataTesti = [];

fetch("https://api.npoint.io/11be16bc5f763e5ba191")
  .then((response) => response.json())
  .then((testimonials) => {
    dataTesti.push(...testimonials);
  })
  .catch((error) => {
    console.error("Error fetching testimonials:", error);
  });

async function home(req, res) {
  try {
    const query = `SELECT * FROM "Projects";`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    const data = obj.map((res) => ({
      ...res,
      author: "Fauzan",
    }));

    res.render("views/index", {
      dataProject: data,
      availableTechnologies,
    });
  } catch (error) {
    console.log(error);
  }
}

// project

async function showProject(req, res) {
  const id = req.params.id;

  try {
    const query = `SELECT * FROM "Projects" WHERE id=${id};`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    const data = obj.map((res) => ({
      ...res,
      author: "Fauzan",
    }));

    const dataProject = data[0];

    res.render("views/detail", {
      dataProject,
      availableTechnologies,
    });
  } catch (error) {
    console.log(error);
  }
}

function postProject(req, res) {
  const {
    name,
    startDate,
    endDate,
    technologies,
    description,
    imageDescription,
  } = req.body;

  const technologiesArray = Array.isArray(technologies)
    ? technologies
    : [technologies];

  const newProject = {
    id: uuidv4(),
    name,
    startDate,
    endDate,
    technologies: technologiesArray,
    description,
    image: "/images/" + req.file.filename,
    imageDescription,
  };

  dataProject.push(newProject);
  res.redirect("/");
}

function updateProject(req, res) {
  const id = req.params.id;
  const projectIndex = dataProject.findIndex((project) => project.id === id);

  if (projectIndex !== -1) {
    const {
      name,
      startDate,
      endDate,
      technologies,
      description,
      imageDescription,
    } = req.body;

    const technologiesArray = Array.isArray(technologies)
      ? technologies
      : [technologies];

    const updatedProject = {
      id,
      name,
      startDate,
      endDate,
      technologies: technologiesArray,
      description,
      imageDescription,
    };

    if (req.file) {
      updatedProject.image = "/images/" + req.file.filename;
    } else {
      updatedProject.image = dataProject[projectIndex].image;
    }

    dataProject[projectIndex] = updatedProject;
  }

  res.redirect("/");
}

function deleteProject(req, res) {
  const { id } = req.params;
  dataProject = dataProject.filter((c) => c.id !== id);
  res.redirect("/");
}

// end project

function testi(req, res) {
  res.render("views/testimonials", { dataTesti });
}

function testiBintang(req, res) {
  const { bintang } = req.params;
  const dataBintang = dataTesti.filter((b) => b.rating == bintang);
  res.render("views/testimonials", { dataTesti: dataBintang, bintang });
}

function contact(req, res) {
  res.render("views/contact");
}

function postContact(req, res) {
  const name = req.body.name;
  // const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  const emailReceiver = "fauzanyanuarp@gmail.com";
  const mailtoLink = `mailto:${emailReceiver}?subject=${subject}&body=Hello nama saya ${name}, ${subject}, ${message}`;
  res.redirect(mailtoLink);
}
