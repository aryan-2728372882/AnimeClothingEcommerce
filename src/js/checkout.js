function initRazorpay() {
    const checkoutForm = document.getElementById('checkout-form');
    
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const options = {
            key: '{{ RAZORPAY_KEY_ID }}',
            amount: totalAmount * 100,  // Amount in paise
            currency: 'INR',
            name: 'Anime Threads',
            description: 'Anime Clothing Purchase',
            handler: function (response) {
                // Payment successful
                saveOrder(response.razorpay_payment_id);
            },
            prefill: {
                name: checkoutForm.querySelector('input[type="text"]').value,
                email: checkoutForm.querySelector('input[type="email"]').value,
                contact: checkoutForm.querySelector('input[type="tel"]').value
            },
            theme: {
                color: '#6A0DAD'
            }
        };
        
        const rzp1 = new Razorpay(options);
        rzp1.open();
    });
}

function saveOrder(paymentId) {
    const orderData = {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentId: paymentId,
        timestamp: new Date(),
        status: 'completed'
    };

    // Save order to Firestore
    db.collection('orders').add(orderData)
        .then(() => {
            alert('Order placed successfully!');
            cart = [];
            updateCart();
        })
        .catch(error => {
            console.error('Error saving order:', error);
        });
}

document.addEventListener('DOMContentLoaded', async () => {
    // Comprehensive Checkout Protection and Validation
    try {
        // Ensure user is authenticated
        const user = await getCurrentUser();
        if (!user) {
            Logger.warn('Unauthorized checkout attempt');
            window.location.href = 'login.html';
            return;
        }

        // Verify cart has items
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            Logger.warn('Attempted checkout with empty cart');
            alert('Your cart is empty. Please add items before checkout.');
            window.location.href = 'index.html';
            return;
        }

        const checkoutForm = document.getElementById('checkout-form');
        const checkoutCartItems = document.getElementById('checkout-cart-items');
        const checkoutCartTotal = document.getElementById('checkout-cart-total');

        // Form Validation
        const FormValidator = {
            validateCheckoutForm: (formData) => {
                const errors = [];

                if (!formData.get('full-name') || formData.get('full-name').trim().length < 2) {
                    errors.push('Please enter a valid full name');
                }

                const email = formData.get('email');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email || !emailRegex.test(email)) {
                    errors.push('Please enter a valid email address');
                }

                const phone = formData.get('phone');
                const phoneRegex = /^[6-9]\d{9}$/;
                if (!phone || !phoneRegex.test(phone)) {
                    errors.push('Please enter a valid 10-digit Indian mobile number');
                }

                if (!formData.get('address') || formData.get('address').trim().length < 10) {
                    errors.push('Please enter a complete delivery address');
                }

                return errors;
            }
        };

        // Render cart items on checkout page
        function renderCheckoutItems() {
            if (!checkoutCartItems) return;

            checkoutCartItems.innerHTML = cart.map(item => `
                <div class="checkout-cart-item">
                    <img src="${item.image}" alt="${item.name}" width="50">
                    <div class="item-details">
                        <span>${item.name}</span>
                        <span>₹${item.price}</span>
                        <span>Qty: ${item.quantity}</span>
                    </div>
                </div>
            `).join('');

            // Calculate and display total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (checkoutCartTotal) {
                checkoutCartTotal.textContent = `₹${total.toFixed(2)}`;
            }
        }

        // Handle checkout form submission
        checkoutForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(checkoutForm);
            const validationErrors = FormValidator.validateCheckoutForm(formData);

            if (validationErrors.length > 0) {
                alert(validationErrors.join('\n'));
                return;
            }

            try {
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                const orderDetails = {
                    userId: user.uid,
                    items: cart,
                    total: total,
                    customerName: formData.get('full-name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    address: formData.get('address'),
                    timestamp: new Date().toISOString(),
                    status: 'pending'
                };

                // Save order to Firestore
                await firebase.firestore().collection('orders').add(orderDetails);

                // Clear cart after successful order
                localStorage.removeItem('cart');
                
                // Log successful order
                Logger.log(`Order placed successfully for user ${user.uid}`);
                
                // Redirect or show success message
                alert('Order placed successfully! Thank you for your purchase.');
                window.location.href = 'index.html';
            } catch (error) {
                Logger.error(`Order placement failed: ${error.message}`);
                alert('Failed to place order. Please try again or contact support.');
            }
        });

        // Initial render of checkout items
        renderCheckoutItems();

    } catch (error) {
        Logger.error(`Checkout initialization failed: ${error.message}`);
        alert('An unexpected error occurred. Please try again.');
        window.location.href = 'index.html';
    }
});

// Get current user (helper function)
function getCurrentUser() {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
};
