class MenuComponent {
    constructor() {
        this.init();
    }

    init() {
        this.createMenuStructure();
        this.fetchCategories();
        this.addStyles();
    }

    createMenuStructure() {
        const menuSection = document.getElementById("menu");
        if (!menuSection) return;

        menuSection.innerHTML = `
      <div class="container section-title" data-aos="fade-up">
        <h2>Our Menu</h2>
        <p><span>Check Our</span> <span class="description-title">Yummy Menu</span></p>
      </div>

      <div class="container">
        <ul id="menuCategories" class="nav nav-tabs d-flex justify-content-center" data-aos="fade-up" data-aos-delay="100">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading categories...</span>
          </div>
        </ul>

        <div id="menuContent" class="tab-content" data-aos="fade-up" data-aos-delay="200">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading menu items...</span>
            </div>
          </div>
        </div>
      </div>
    `;
    }

    addStyles() {
        const styleId = "menu-component-styles";
        if (document.getElementById(styleId)) return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
      /* Add any custom styles here */
    `;
        document.head.appendChild(style);
    }

    fetchCategories() {
        fetch("https://mensa-api.onrender.com/api/category")
            .then((response) => response.json())
            .then((data) => {
                if (data.status && data.data && data.data.length > 0) {
                    this.renderMenuCategories(data.data);
                    this.loadCategoryItems(data.data[0].id, data.data[0].name);
                } else {
                    this.showMenuError("No categories found.");
                }
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                this.showMenuError("Failed to load menu categories.");
            });
    }

    renderMenuCategories(categories) {
        const categoriesContainer = document.getElementById("menuCategories");
        categoriesContainer.innerHTML = ""; // Clear loading spinner

        categories.forEach((category, index) => {
            const li = document.createElement("li");
            li.className = "nav-item";

            const a = document.createElement("a");
            a.className = `nav-link ${index === 0 ? "active show" : ""}`;
            a.setAttribute("data-bs-toggle", "tab");
            a.setAttribute("data-bs-target", `#menu-${category.id}`);
            a.innerHTML = `<h4>${this.capitalizeFirstLetter(category.name)}</h4>`;

            a.addEventListener("click", () => {
                this.loadCategoryItems(category.id, category.name);
            });

            li.appendChild(a);
            categoriesContainer.appendChild(li);
        });
    }

    loadCategoryItems(categoryId, categoryName) {
        const menuContent = document.getElementById("menuContent");
        menuContent.innerHTML = `
    <div class="tab-pane fade active show" id="menu-${categoryId}">
      <div class="tab-header text-center">
        <p>Menu</p>
        <h3>${this.capitalizeFirstLetter(categoryName)}</h3>
      </div>
      <div class="row gy-5" id="menu-items-${categoryId}">
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading items...</span>
          </div>
        </div>
      </div>
    </div>
  `;

        fetch(`https://mensa-api.onrender.com/api/foods/getByCategoryId/${categoryId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status && data.data && data.data.length > 0) {
                    this.renderMenuItems(categoryId, data.data);
                } else {
                    this.renderMenuItems(categoryId, []);
                }
            })
            .catch((error) => {
                console.error("Error fetching menu items:", error);
                this.showMenuItemsError(categoryId);
            });
    }

    renderMenuItems(categoryId, items) {
        const itemsContainer = document.getElementById(`menu-items-${categoryId}`);

        if (!items || items.length === 0) {
            itemsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-emoji-frown fs-1 text-muted"></i>
          <p class="mt-3">No items found in this category.</p>
        </div>
      `;
            return;
        }

        itemsContainer.innerHTML = "";

        items.forEach((item) => {
            // console.log("Items",JSON.stringify(item, null, 2));
            const menuItem = document.createElement("div");
            menuItem.className = "col-lg-4 menu-item";
            menuItem.innerHTML = `
         <div class="menu-image-wrapper position-relative">
            <img src="${item.imageUrls[0]?.url}" class="menu-img img-fluid" alt="${item.name}">
            <div class="image-overlay d-flex justify-content-center align-items-center">
                <button class="btn btn-outline-light view-more-btn" data-id="${item.id}">View More 
                    <i class="bi bi-arrow-right ms-2"></i> 
                </button>
            </div>
        </div>
        <h4>${item.name}</h4>
        <p class="ingredients">${item.description}</p>
        <p class="price">LKR : ${item.basePrice}</p>
        `;
            itemsContainer.appendChild(menuItem);
        });

        if (window.GLightbox) {
            GLightbox({ selector: ".glightbox" });
        }
        this.bindViewMoreButtons();
    }

    bindViewMoreButtons() {
        document.querySelectorAll(".view-more-btn").forEach((button) => {
            button.addEventListener("click", (e) => {
                const itemId = e.target.getAttribute("data-id");
                window.location.href = `/pages/ProductPage.html?id=${itemId}`;
            });
        });
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    showMenuError(message) {
        const categoriesContainer = document.getElementById("menuCategories");
        categoriesContainer.innerHTML = `
      <div class="alert alert-danger w-100 text-center">
        ${message}
      </div>
    `;

        const menuContent = document.getElementById("menuContent");
        menuContent.innerHTML = "";
    }

    showMenuItemsError(categoryId) {
        const itemsContainer = document.getElementById(`menu-items-${categoryId}`);
        if (itemsContainer) {
            itemsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="alert alert-danger">
            Failed to load menu items.
          </div>
        </div>
      `;
        }
    }
}

// Initialize the component
document.addEventListener("DOMContentLoaded", () => {
    new MenuComponent();
});
