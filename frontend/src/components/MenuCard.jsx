function MenuCard({ item }) {
    return (
        <div className="menu-card">
           {item.image_url ? (
    <img
        src={item.image_url}
        alt={item.menu_name}
    />
) : (
    <div className="no-image">
        No Image
    </div>
)}

            <h3>{item.menu_name}</h3>
           <p>{item.category_name} • {item.size}</p>
           <p>₹{item.price}</p>
        </div>
    );
}

export default MenuCard;