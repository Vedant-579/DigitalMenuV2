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

app.post("/orders", async (req, res) => {
    const { customer_name, table_number, items } = req.body;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        let totalAmount = 0;

        // Create the order first with temporary total
        const orderResult = await client.query(
            `INSERT INTO orders
            (customer_name, table_number, total_amount)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [customer_name, table_number, 0]
        );

        const order = orderResult.rows[0];

        for (const item of items) {

            // Get actual price from database
            const menuResult = await client.query(
                `SELECT price
                 FROM menu
                 WHERE id = $1`,
                [item.id]
            );

            if (menuResult.rows.length === 0) {
                throw new Error(`Menu item ${item.id} not found`);
            }

            const actualPrice = menuResult.rows[0].price;

            totalAmount += actualPrice * item.cartQuantity;

            await client.query(
                `INSERT INTO order_items
                (order_id, menu_id, quantity, price)
                VALUES ($1, $2, $3, $4)`,
                [
                    order.id,
                    item.id,
                    item.cartQuantity,
                    actualPrice
                ]
            );
        }

        // Update order with calculated total
        const updatedOrder = await client.query(
            `UPDATE orders
             SET total_amount = $1
             WHERE id = $2
             RETURNING *`,
            [totalAmount, order.id]
        );

        await client.query("COMMIT");

        res.status(201).json(updatedOrder.rows[0]);

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            error: "Failed to create order"
        });

    } finally {
        client.release();
    }
});

app.get("/orders", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                orders.id,
                orders.customer_name,
                orders.table_number,
                order_items.quantity,
                order_items.price,
                menu.menu_name,
                orders.total_amount,
                orders.status,
                orders.created_at
            FROM orders

            JOIN order_items
                ON orders.id = order_items.order_id

            JOIN menu
                ON order_items.menu_id = menu.id

            ORDER BY orders.id DESC;
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch orders"
        });
    }
});


app.put("/orders/:id/status", async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
        `UPDATE orders
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [status, id]
    );

    res.json(result.rows[0]);

});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});