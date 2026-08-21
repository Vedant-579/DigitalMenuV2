import { useEffect, useState } from "react";

function AdminMenu() {

    const [menu, setMenu] = useState([]);

    const [menuName, setMenuName] = useState("");
    const [price, setPrice] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [quantities, setQuantities] = useState([]);
    const [quantityId, setQuantityId] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [updateId, setUpdateId] = useState("");
    const [deleteId, setDeleteId] = useState("");

useEffect(() => {
    getMenu();
}, []);


    function getMenu() {
    fetch("http://localhost:3000/menu")
        .then(response => response.json())
        .then(data => {
            setMenu(data);
        });
}



const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/menu", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            menu_name: menuName,
            price: price,
            category_id: categoryId,
            quantity_id: quantityId,
            image_url: imageUrl
        })
    })
    .then(response => response.json())
    .then(() => {
        getMenu();

        setMenuName("");
        setPrice("");
        setCategoryId("");
        setQuantityId("");
        setImageUrl("");
    });
};

function loadMenu() {
    fetch(`http://localhost:3000/menu/${updateId}`)
        .then(response => response.json())
        .then(data => {
            setMenuName(data.menu_name);
            setPrice(data.price);
            setCategoryId(data.category_id);
            setQuantityId(data.quantity_id);
            setImageUrl(data.image_url || "");
        });
}

function updateMenu() {
    fetch(`http://localhost:3000/menu/${updateId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            menu_name: menuName,
            price: price,
            category_id: categoryId,
            quantity_id: quantityId,
            image_url: imageUrl
        })
    })
    .then(response => response.json())
    .then(() => {
        getMenu();
    });
}
function deleteMenu() {
    fetch(`http://localhost:3000/menu/${deleteId}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(() => {
        getMenu();
        setDeleteId("");
    });
}


useEffect(() => {
    getMenu();

    fetch("http://localhost:3000/categories")
        .then(response => response.json())
        .then(data => {
            setCategories(data);
        });

    fetch("http://localhost:3000/quantities")
        .then(response => response.json())
        .then(data => {
            setQuantities(data);
        });
}, []);
    return (
    <div className="admin-section">
        <h1>Menu Management</h1>

        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Menu Name"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
            />

            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />

            <input
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />

            <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
            >
                <option value="">Select Category</option>

                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.category_name}
                    </option>
                ))}
            </select>

            <select
                value={quantityId}
                onChange={(e) => setQuantityId(e.target.value)}
            >
                <option value="">Select Quantity</option>

                {quantities.map(quantity => (
                    <option key={quantity.id} value={quantity.id}>
                        {quantity.size}
                    </option>
                ))}
            </select>

            <button type="submit">Add Menu</button>
            <input
    type="number"
    placeholder="Enter Menu ID to Update"
    value={updateId}
    onChange={(e) => setUpdateId(e.target.value)}
/>

<button type="button" onClick={loadMenu}>
    Load Menu
</button>

<button type="button" onClick={updateMenu}>
    Update Menu
</button>
<input
    type="number"
    placeholder="Enter Menu ID to Delete"
    value={deleteId}
    onChange={(e) => setDeleteId(e.target.value)}
/>

<button type="button" onClick={deleteMenu}>
    Delete Menu
</button>
        </form>
    </div>
);
}

export default AdminMenu;