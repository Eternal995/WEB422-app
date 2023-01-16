// Setup
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const cors = require("cors");
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

app.post("/api/movies", (req, res) => {
  db.addNewMovie(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.get("/api/movies", (req, res) => {
  if (!req.query.page || !req.query.perPage)
    res.status(500).json({ error: "Query Parameters Needed." });
  else {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
      .then((data) => {
        if (!data) res.status(204).json({ message: "No data found" });
        else res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
});

app.get("/api/movies/:id", (req, res) => {
  db.getMovieById(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.put("/api/movie/:id", (req, res) => {
  db.updateMovieById(req.body, req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: err });
    });
});

app.delete("/api/movies/:id", (req, res) => {
  db.deleteMovieById(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// 404 Page
app.use((req, res) => {
  res.status(404).send("404 Page Not Found!");
});

// Initialize
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
