let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Render Cart Items
    function renderCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <p>Your cart is empty</p>
                    <a href="index.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>₹${item.price}</p>
                    <div class="quantity-control">
                        <button class="quantity-btn decrease-btn">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                        <button class="quantity-btn increase-btn">+</button>
                    </div>
                    <button class="remove-btn">Remove</button>
                </div>
            </div>
        `).join('');

        calculateTotal();
        attachCartEventListeners();
    }

    // Calculate Total
    function calculateTotal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (cartTotalElement) {
            cartTotalElement.textContent = `₹${total}`;
        }
    }

    // Attach Cart Event Listeners
    function attachCartEventListeners() {
        // Quantity Decrease
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                const quantityInput = cartItem.querySelector('.quantity-input');
                let currentQuantity = parseInt(quantityInput.value);
                
                if (currentQuantity > 1) {
                    currentQuantity--;
                    quantityInput.value = currentQuantity;
                    updateCartItemQuantity(cartItem.dataset.id, currentQuantity);
                }
            });
        });

        // Quantity Increase
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                const quantityInput = cartItem.querySelector('.quantity-input');
                let currentQuantity = parseInt(quantityInput.value);
                
                currentQuantity++;
                quantityInput.value = currentQuantity;
                updateCartItemQuantity(cartItem.dataset.id, currentQuantity);
            });
        });

        // Remove Item
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                removeItemFromCart(cartItem.dataset.id);
            });
        });
    }

    // Update Cart Item Quantity
    function updateCartItemQuantity(productId, newQuantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            calculateTotal();
            updateCartCount();
        }
    }

    // Remove Item from Cart
    function removeItemFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }

    // Update Cart Count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.classList.toggle('cart-count-active', totalItems > 0);
        }
    }

    // Checkout Protection
    function protectCheckout() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checkout.');
            window.location.href = 'index.html';
        }
    }

    // Initial Render
    renderCartItems();
    updateCartCount();

    // Checkout Button Event
    checkoutBtn?.addEventListener('click', () => {
        protectCheckout();
    });
});
