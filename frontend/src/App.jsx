import { useState } from "react";
import Menu from "./Menu";
import AdminMenu from "./pages/AdminMenu";
import "./App.css";
import AdminOrders from "./components/AdminOrders";

function App() {
    const [page, setPage] = useState("menu");

    return (
        <div>
           <nav className="navbar">
    <h2>Digital Menu</h2>

    <div>
        <button onClick={() => setPage("menu")}>
            Menu
        </button>

        <button onClick={() => setPage("admin")}>
            Admin
        </button>
        <button onClick={() => setPage("orders")}>
    Orders
</button>
    </div>
</nav>

            {page === "menu" && <Menu />}
            {page === "admin" && <AdminMenu />}
            {page === "orders" && <AdminOrders />}
        </div>
    );
}

export default App;