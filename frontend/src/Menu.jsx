import { useEffect, useState } from "react";
import MenuCard from "./components/MenuCard";

function Menu() {
    const [menu, setMenu] = useState([]);
    
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(""); //filter at homepage veg/nonveg etc



    


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

<div className="menu-grid">
    {menu
        .filter(item =>
            selectedCategory === "" ||
            item.category_name === selectedCategory
        )
        .map(item => (
            <MenuCard key={item.id} item={item} />
        ))
    }
</div>

</div>
    );
}

export default Menu;