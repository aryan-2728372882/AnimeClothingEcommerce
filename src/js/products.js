const products = [
    {
        id: 1,
        name: "Naruto Shippuden Hoodie",
        price: 1999,
        image: "images/naruto-hoodie.jpg",
        description: "Premium quality hoodie featuring Naruto Uzumaki",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 2,
        name: "Attack on Titan Jacket",
        price: 2499,
        image: "images/aot-jacket.jpg",
        description: "Survey Corps inspired jacket with detailed embroidery",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 3,
        name: "One Piece T-Shirt",
        price: 799,
        image: "images/onepiece-tshirt.jpg",
        description: "Comfortable cotton t-shirt with Luffy print",
        sizes: ["S", "M", "L", "XL"]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const cartCount = document.getElementById('cart-count');

    // Fetch and render products
    function renderProducts(products) {
        if (!productContainer) return;

        productContainer.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="product-details">
                    <div class="box-sizes">
                        ${product.sizes.map(size => `<span>${size}</span>`).join(' ')}
                    </div>
                    <div class="product-price-cart">
                        <span class="price">₹${product.price}</span>
                        <button class="add-to-cart-btn" 
                                data-id="${product.id}" 
                                data-name="${product.name}" 
                                data-price="${product.price}" 
                                data-image="${product.image}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to Add to Cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // Add to Cart functionality
    function addToCart(event) {
        const button = event.target;
        const productId = button.dataset.id;
        const productName = button.dataset.name;
        const productPrice = parseFloat(button.dataset.price);
        const productImage = button.dataset.image;

        // Get current cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if product already in cart
        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }

        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart count
        updateCartCount();

        // Show notification
        showNotification(`${productName} added to cart`);
    }

    // Update Cart Count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.classList.add('cart-count-active');
        }
    }

    // Show Notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('notification-hide');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 2000);
    }

    // Initial calls
    renderProducts(products);
    updateCartCount();
});
