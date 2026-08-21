const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Digital Menu Backend is running");
});

app.get("/menu", async (req, res) => {
  const result = await pool.query(`
    SELECT
        menu.id,
        menu.menu_name,
        menu.price,
        menu.image_url,
        food_categories.category_name,
        quantities.size
    FROM menu
    JOIN food_categories
        ON menu.category_id = food_categories.id
    JOIN quantities
        ON menu.quantity_id = quantities.id
`);
    res.json(result.rows);
});

app.get("/menu/:id", async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "SELECT * FROM menu WHERE id = $1",
        [id]
    );

    res.json(result.rows[0]);
});

app.post("/menu", async (req, res) => {
    const { menu_name, price, category_id, quantity_id, image_url } = req.body;

    const result = await pool.query(
        `INSERT INTO menu
        (menu_name, price, category_id, quantity_id, image_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [menu_name, price, category_id, quantity_id, image_url]
    );

    res.status(201).json(result.rows[0]);
});

app.put("/menu/:id", async (req, res) => {
    const { id } = req.params;
    const { menu_name, price, category_id, quantity_id, image_url } = req.body;

    const result = await pool.query(
        `UPDATE menu
         SET menu_name = $1,
             price = $2,
             category_id = $3,
             quantity_id = $4,
             image_url = $5
         WHERE id = $6
         RETURNING *`,
        [menu_name, price, category_id, quantity_id, image_url, id]
    );

    res.json(result.rows[0]);
});


app.delete("/menu/:id", async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        `DELETE FROM menu
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    res.json(result.rows[0]);
});

app.get("/categories", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM food_categories"
    );

    res.json(result.rows);
});

app.get("/quantities", async(req, res)=>{
  const result = await pool.query(
    "SELECt * FROM quantities"
  );

  res.json(result.rows);
})


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});