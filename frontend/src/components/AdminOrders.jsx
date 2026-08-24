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

{orderList.map(order => (
    <div key={order.orderId}>

        <h2>Order #{order.orderId}</h2>

        <p>Customer: {order.customer_name}</p>
        <p>Table: {order.table_number}</p>

        <h3>Items</h3>

        {order.items.map((item, index) => (
            <p key={index}>
                {item.menu_name} × {item.quantity} - ₹{item.price}
            </p>
        ))}

        <p>Total: ₹{order.total_amount}</p>
        <p>Status: {order.status}</p>

        <hr />

    </div>
))}
        </div>
    );
}

export default AdminOrders;