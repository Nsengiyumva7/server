//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const pool = require("./db.js");
const cors = require("cors");
require("dotenv").config();
// Middleware
app.use(bodyParser.json());

// Routes
app.get("/student", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM student");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/student/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { rows } = await pool.query("SELECT * FROM student WHERE id = $1", [
      id,
    ]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/student", async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log({ name, email });
    const insertQuery = "INSERT INTO student ( name, email) VALUES ($1, $2)";
    const values = [name, email];

    pool.query(insertQuery, values, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error inserting data");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("Data inserted successfully");
      }
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.put("/student/:id", async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE student SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/student/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM student WHERE id = $1", [id]);
    res.status(204).json(res.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
