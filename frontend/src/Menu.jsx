import { useEffect, useState } from "react";
import MenuCard from "./components/MenuCard";

function Menu() {
    const [menu, setMenu] = useState([]);
    
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(""); //filter at homepage veg/nonveg etc
     
     const [searchTerm, setSearchTerm] = useState("");

     const [cart, setCart] = useState([]);

     const [customerName, setCustomerName] = useState("");
const [tableNumber, setTableNumber] = useState("");


const [orderSuccess, setOrderSuccess] = useState(false);

     function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        setCart(
            cart.map(cartItem =>
                cartItem.id === item.id
                    ? {
                        ...cartItem,
                        cartQuantity: cartItem.cartQuantity + 1
                    }
                    : cartItem
            )
        );
    } else {
        setCart([
            ...cart,
            {
                ...item,
                cartQuantity: 1
            }
        ]);
    }
}

function increaseQuantity(id) {
    setCart(
        cart.map(item =>
            item.id === id
                ? {
                    ...item,
                    cartQuantity: item.cartQuantity + 1
                }
                : item
        )
    );
}

function decreaseQuantity(id) {
    setCart(
        cart.map(item =>
            item.id === id
                ? {
                    ...item,
                    cartQuantity: Math.max(1, item.cartQuantity - 1)
                }
                : item
        )
    );
}

function removeFromCart(id) {
    setCart(
        cart.filter(item => item.id !== id)
    );
}

const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0
);


async function placeOrder() {
    const orderData = {
    customer_name: customerName,
    table_number: tableNumber,
    items: cart
};

    const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    });

    const data = await response.json();

    console.log(data);

    setCart([]);
    setCustomerName("");
    setTableNumber("");
    setOrderSuccess(true);
}

    


    function getMenu() {
    fetch("http://localhost:3000/menu")
        .then(response => response.json())
        .then(data => {
            setMenu(data);
        });
}

    
 
   
    

 useEffect(() => {
    getMenu();

    fetch("http://localhost:3000/categories")
        .then(response => response.json())
        .then(data => {
            setCategories(data);
        });
}, []);


   return (
    <div>
        <h1>Menu</h1>

        <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
        >
            <option value="">All Categories</option>

            {categories.map(category => (
                <option key={category.id} value={category.category_name}>
                    {category.category_name}
                </option>
            ))}
        </select>
        
         

          <div className="cart">
    <h2>Cart</h2>

    {cart.map(item => (
        <div key={item.id}>
            <p>
                {item.menu_name} - ₹{item.price}
            </p>

            <button onClick={() => decreaseQuantity(item.id)}>
                −
            </button>

            <span> {item.cartQuantity} </span>

            <button onClick={() => increaseQuantity(item.id)}>
                +
            </button>
            <button onClick={() => removeFromCart(item.id)}>
             Remove
            </button>
        </div>
    ))}

    <h3>Total: ₹{cartTotal}</h3>
    <div className="checkout">
    <h2>Place Order</h2>

    <input
        type="text"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
    />

    <input
        type="number"
        placeholder="Table Number"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
    />

    <button onClick={placeOrder}>
    Place Order
</button>
</div>
</div>

{orderSuccess && (
    <div className="order-success">
        <h2>Order Placed Successfully! 🎉</h2>
        <p>Your order has been sent to the restaurant.</p>
    </div>
)}



        <div className="menu-grid">
            {menu
                .filter(item =>
                    (selectedCategory === "" ||
                        item.category_name === selectedCategory) &&
                    item.menu_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
                .map(item => (
                   <MenuCard
    key={item.id}
    item={item}
    addToCart={addToCart}
/>
                ))
            }
        </div>
    </div>
);
}

export default Menu;