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
    document.addEventListener("click", (e) => {
      if (e.target.closest("#cartToggle")) {
        this.renderCartItems();
        new bootstrap.Offcanvas(
          document.getElementById("cartOffcanvas")
        ).show();
      }

      if (e.target.closest("#cartToggleDesktop")) {
        this.renderCartItems();
        new bootstrap.Offcanvas(
          document.getElementById("cartOffcanvas")
        ).show();
      }

      if (e.target.closest("#checkoutBtn")) {
        this.proceedToCheckout();
      }

      if (e.target.closest("#confirmOrderBtn")) {
        this.confirmOrder();
      }

      //? Handle quantity changes
      if (e.target.closest('.cart-item [onclick*="updateQuantity"]')) {
        const match = e.target
          .getAttribute("onclick")
          .match(/updateQuantity\((\d+),\s*(\d+)\)/);
        if (match) {
          this.updateQuantity(parseInt(match[1]), parseInt(match[2]));
        }
      }

      // ?Handle remove item
      if (e.target.closest('.cart-item [onclick*="removeItem"]')) {
        const match = e.target
          .closest('[onclick*="removeItem"]')
          .getAttribute("onclick")
          .match(/removeItem\((\d+)\)/);
        if (match) {
          this.removeItem(parseInt(match[1]));
        }
      }
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
    const badgeDesktop = document.getElementById("cartBadgeDesktop");
    if (badgeDesktop) {
      badgeDesktop.textContent = totalItems;
    }

    if (badge) {
      badge.textContent = totalItems;
    }
  }

  renderCartCountForDesktop() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cartBadgeDesktop");
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

      //! Add variations prices
      item.variations.forEach((variation) => {
        itemTotal += variation.additionalPrice * item.quantity;
      });

      total += itemTotal;

      itemsHTML += `
        <div class="cart-item mb-3 pb-3 border-bottom">
          <div class="d-flex">
            <img src="${
              item.imageUrl || "https://via.placeholder.com/100?text=No+Image"
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
                  ${v.name}: ${v.option} ${
                    v.additionalPrice > 0 ? `(+Rs${v.additionalPrice})` : ""
                  }
                </small>
              `
                )
                .join("")}
              <div class="d-flex justify-content-between align-items-center mt-2">
                <div class="input-group input-group-sm" style="width: 120px;">
                  <button class="btn btn-outline-secondary" 
                          type="button"
                          onclick="cart.updateQuantity(${index}, ${
        item.quantity - 1
      })">-</button>
                  <input type="text" class="form-control text-center" 
                        value="${item.quantity}"
                        onchange="cart.updateQuantity(${index}, parseInt(this.value))">
                  <button class="btn btn-outline-secondary" 
                          type="button"
                          onclick="cart.updateQuantity(${index}, ${
        item.quantity + 1
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
      this.showAlert("Your cart is empty!", "warning");
      return;
    }

    this.renderCheckoutItems();
    const checkoutModal = new bootstrap.Modal(
      document.getElementById("checkoutModal")
    );
    checkoutModal.show();

    const cartOffcanvas = bootstrap.Offcanvas.getInstance(
      document.getElementById("cartOffcanvas")
    );
    if (cartOffcanvas) cartOffcanvas.hide();
  }

  renderCheckoutItems() {
    const container = document.getElementById("checkoutItemsContainer");
    let itemsHTML = "";
    let subtotal = 0;

    this.cart.forEach((item, index) => {
      let itemTotal = item.basePrice * item.quantity;

      //! Add variations prices
      item.variations.forEach((variation) => {
        itemTotal += variation.additionalPrice * item.quantity;
      });

      subtotal += itemTotal;

      itemsHTML += `
                <div class="list-group-item">
                    <div class="d-flex align-items-center">
                        <img src="${
                          item.imageUrl ||
                          "https://via.placeholder.com/80?text=No+Image"
                        }" 
                            class="rounded me-3" 
                            width="60" 
                            height="60"
                            alt="${item.name}">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${item.name}</h6>
                            ${item.variations
                              .map(
                                (v) => `
                                <small class="d-block text-muted">
                                    ${v.name}: ${v.option} ${
                                  v.additionalPrice > 0
                                    ? `(+Rs${v.additionalPrice})`
                                    : ""
                                }
                                </small>
                            `
                              )
                              .join("")}
                            <div class="d-flex justify-content-between align-items-center mt-1">
                                <span class="text-muted">Qty: ${
                                  item.quantity
                                }</span>
                                <span class="fw-bold">Rs${itemTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    });

    container.innerHTML = itemsHTML;

    //! Calculate totals
    const deliveryFee = 0;
    const taxRate = 0;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + deliveryFee + taxAmount;

    //! Update summary
    document.getElementById(
      "checkoutSubtotal"
    ).textContent = `Rs${subtotal.toFixed(2)}`;
    // document.getElementById("taxAmount").textContent = `Rs${taxAmount.toFixed(
    //   2
    // )}`;
    document.getElementById("checkoutTotal").textContent = `Rs${total.toFixed(
      2
    )}`;
  }

  confirmOrder() {
    const form = document.getElementById("deliveryForm");
    const name = document.getElementById("deliveryName").value;
    const phone = document.getElementById("deliveryPhone").value;
    const deliveryDate = document.getElementById("deliveryDate").value;
    const address = document.getElementById("deliveryAddress").value;

    if (!name || !phone || !address || !deliveryDate) {
      this.showAlert(
        "Please fill in all required delivery information",
        "danger"
      );
      return;
    }

    const paymentMethod = document.querySelector(
      'input[name="paymentMethod"]:checked'
    ).id;
    const notes = document.getElementById("deliveryNotes").value;
    const subtotal = parseFloat(
      document.getElementById("checkoutSubtotal").textContent.replace("Rs", "")
    );

    //! Create order object
    const order = {
      items: this.cart,
      deliveryDate: deliveryDate,
      status: "pending",
      paymentMethod,
      user_id: "5TBHDIkC7XcYbqVysOhZiWiIMQ53",
      user_email: "dileepaashen81@gmail.com",
      user_name: name,
      deliveryAddress: address,
      specialNotes: notes,
      user_mobile: phone,
      subtotal: subtotal,
      // deliveryFee: parseFloat(
      //   document.getElementById("deliveryFee").textContent.replace("Rs", "")
      // ),
      // tax: parseFloat(
      //   document.getElementById("taxAmount").textContent.replace("Rs", "")
      // ),
      total: parseFloat(
        document.getElementById("checkoutTotal").textContent.replace("Rs", "")
      ),
      createdAt: new Date().toISOString(),
    };

    // todo : send order to backend
    console.log("Order confirmed:", order);
    fetch("http://localhost:3000/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => {
        if (!response.status) {
          throw new Error("Failed to place order");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Order saved to backend:", data);

        this.showAlert("Order confirmed successfully!", "success");

        this.cart = [];
        this.saveCart();
        this.renderCartItems();

        const checkoutModal = bootstrap.Modal.getInstance(
          document.getElementById("checkoutModal")
        );
        checkoutModal?.hide();

        const cartOffcanvas = bootstrap.Offcanvas.getInstance(
          document.getElementById("cartOffcanvas")
        );
        cartOffcanvas?.hide();
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        this.showAlert("Failed to place order. Please try again.", "danger");
      });
  }

  showAlert(message, type) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = "alert";
    alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

    const modalBody = document.querySelector("#checkoutModal .modal-body");
    const existingAlert = modalBody.querySelector(".alert");
    if (existingAlert) existingAlert.remove();

    modalBody.prepend(alert);

    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000);
  }
}

const cart = new Cart();
