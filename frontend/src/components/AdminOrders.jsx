import { useEffect, useState } from "react";

function AdminOrders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/orders")
            .then(response => response.json())
            .then(data => {
                setOrders(data);
            });
    }, []);

   async function updateStatus(id, status) {
    const response = await fetch(`http://localhost:3000/orders/${id}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: status
        })
    });

    if (!response.ok) {
    console.error("Failed to update order status");
    return;
}

    const data = await response.json();

    setOrders(
        orders.map(order =>
            order.id === id
                ? {
                    ...order,
                    status: data.status
                }
                : order
        )
    );
}

    const groupedOrders = orders.reduce((acc, currentItem) => {

    if (!acc[currentItem.id]) {
        acc[currentItem.id] = {
            orderId: currentItem.id,
            customer_name: currentItem.customer_name,
            table_number: currentItem.table_number,
            total_amount: currentItem.total_amount,
            status: currentItem.status,
            created_at: currentItem.created_at,
            items: []
        };
    }

    acc[currentItem.id].items.push({
        menu_name: currentItem.menu_name,
        quantity: currentItem.quantity,
        price: currentItem.price
    });

    return acc;

}, {});

const orderList = Object.values(groupedOrders); //converts our grouped object into an array that React can use with .map().


    return (
        <div>
            <h1>Orders</h1>
<div className="order-list">
{orderList.map(order => (
    <div className="order-card" key={order.orderId}>

        <h2>Order #{order.orderId}</h2>

        <p>Customer: {order.customer_name}</p>
        <p>Table: {order.table_number}</p>

        <h3>Items</h3>

        {order.items.map((item, index) => (
            <p className="order-item" key={index}>
                {item.menu_name} × {item.quantity} - ₹{item.price}
            </p>
        ))}

        <p>Total: ₹{order.total_amount}</p>
       <p>Status:</p>

<select
    className="order-status"
    value={order.status}
    onChange={(e) => updateStatus(order.orderId, e.target.value)}
>
    <option value="Pending">Pending</option>
    <option value="Preparing">Preparing</option>
    <option value="Ready">Ready</option>
    <option value="Completed">Completed</option>
</select>

        <hr />

    </div>
))}
</div>
        </div>
    );
}

export default AdminOrders;