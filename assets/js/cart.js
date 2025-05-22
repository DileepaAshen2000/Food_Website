class Cart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem("cart")) || [];
        this.init();
    }

    init() {
        this.renderCartCount();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById("cartToggle")?.addEventListener("click", () => {
            this.renderCartItems();
            new bootstrap.Offcanvas("#cartOffcanvas").show();
        });

        document.getElementById("checkoutBtn")?.addEventListener("click", () => {
            this.proceedToCheckout();
        });
    }

    addItem(item) {
        const existingItem = this.cart.find(
            (cartItem) =>
                cartItem.id === item.id &&
                JSON.stringify(cartItem.variations) === JSON.stringify(item.variations)
        );

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.cart.push(item);
        }

        this.saveCart();
        this.showAddToCartNotification(item);
    }

    removeItem(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.renderCartItems();
    }

    updateQuantity(index, newQuantity) {
        if (newQuantity < 1) newQuantity = 1;
        this.cart[index].quantity = newQuantity;
        this.saveCart();
        this.renderCartItems();
    }

    saveCart() {
        localStorage.setItem("cart", JSON.stringify(this.cart));
        this.renderCartCount();
    }

    renderCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.getElementById("cartBadge");
        if (badge) badge.textContent = totalItems;
    }

    renderCartItems() {
        const container = document.getElementById("cartItemsContainer");
        const emptyMessage = document.getElementById("emptyCartMessage");
        const cartTotal = document.getElementById("cartTotal");

        if (this.cart.length === 0) {
            container.innerHTML = `
        <div class="text-center py-5" id="emptyCartMessage">
          <i class="bi bi-cart-x" style="font-size: 3rem; color: #6c757d;"></i>
          <p class="mt-3">Your cart is empty</p>
        </div>
      `;
            cartTotal.textContent = "Rs0";
            return;
        }

        let itemsHTML = "";
        let total = 0;

        this.cart.forEach((item, index) => {
            let itemTotal = item.basePrice * item.quantity;

            // Add variations prices
            item.variations.forEach((variation) => {
                itemTotal += variation.additionalPrice * item.quantity;
            });

            total += itemTotal;

            itemsHTML += `
        <div class="cart-item mb-3 pb-3 border-bottom">
          <div class="d-flex">
            <img src="${item.imageUrl || "https://via.placeholder.com/100?text=No+Image"
                }" 
                 class="rounded me-3" 
                 width="80" 
                 height="80"
                 alt="${item.name}">
            <div class="flex-grow-1">
              <h6 class="mb-1">${item.name}</h6>
              ${item.variations
                    .map(
                        (v) => `
                <small class="d-block text-muted">
                  ${v.name}: ${v.option} ${v.additionalPrice > 0 ? `(+Rs${v.additionalPrice})` : ""
                            }
                </small>
              `
                    )
                    .join("")}
              <div class="d-flex justify-content-between align-items-center mt-2">
                <div class="input-group input-group-sm" style="width: 120px;">
                  <button class="btn btn-outline-secondary" 
                          type="button"
                          onclick="cart.updateQuantity(${index}, ${item.quantity - 1
                })">-</button>
                  <input type="text" class="form-control text-center" 
                         value="${item.quantity}"
                         onchange="cart.updateQuantity(${index}, parseInt(this.value))">
                  <button class="btn btn-outline-secondary" 
                          type="button"
                          onclick="cart.updateQuantity(${index}, ${item.quantity + 1
                })">+</button>
                </div>
                <span class="fw-bold">Rs${itemTotal}</span>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-danger ms-2 align-self-start" 
                    onclick="cart.removeItem(${index})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      `;
        });

        container.innerHTML = itemsHTML;
        cartTotal.textContent = `Rs${total}`;
    }

    showAddToCartNotification(item) {
        const toast = document.createElement("div");
        toast.className = "position-fixed bottom-0 end-0 p-3";
        toast.style.zIndex = "1100";
        toast.innerHTML = `
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-success text-white">
          <strong class="me-auto">Added to cart</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${item.quantity} ${item.name} added to your cart
        </div>
      </div>
    `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert("Proceeding to checkout with " + this.cart.length + " items");
        // window.location.href = '/checkout.html';
    }
}

// Initialize cart
const cart = new Cart();
