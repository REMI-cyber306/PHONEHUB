const grid = document.getElementById("productGrid");
const productModal = document.getElementById("productModal");
const productDetail = document.getElementById("productDetail");
const cartDrawer = document.getElementById("cartDrawer");
const checkoutModal = document.getElementById("checkoutModal");
let activeFilter = "All";
let cart = JSON.parse(localStorage.getItem("phonehub-cart") || "[]");
let currentUser = JSON.parse(
  localStorage.getItem("phonehub-current-user") || "null",
);

const money = (n) => "UGX " + Number(n).toLocaleString("en-US");
const getUsers = () =>
  JSON.parse(localStorage.getItem("phonehub-users") || "[]");
const getOrders = () =>
  JSON.parse(localStorage.getItem("phonehub-orders") || "[]");

const phoneMarkup = (p, extra = "") =>
  `<div class="phone-model ${extra}"><div class="phone-back" style="background:${p.color}"><div class="camera-island"><i></i><i></i><i></i><b></b></div><span class="phone-logo">PH</span></div><div class="phone-front"><div class="screen-wallpaper ${p.wallpaper}"></div><div class="dynamic-island"></div><div class="screen-time">9:41</div></div><div class="phone-side"></div></div>`;

function renderProducts() {
  let list = products.filter(
    (p) => activeFilter === "All" || p.brand === activeFilter,
  );
  const sort = document.getElementById("sortSelect").value;
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);
  grid.innerHTML = list
    .map(
      (
        p,
      ) => `<article class="product-card" data-id="${p.id}" tabindex="0" aria-label="View ${p.name}">
    <div class="product-art"><span class="product-tag">${p.tag}</span>${phoneMarkup(p)}</div>
    <div class="product-info"><span class="product-brand">${p.brand}</span><h3>${p.name}</h3><p class="product-short">${p.screen} | ${p.ram} RAM | ${p.storage}</p><div class="product-bottom"><strong class="product-price">${money(p.price)}</strong><span class="view-product">View details</span></div></div></article>`,
    )
    .join("");
  grid.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => openProduct(Number(card.dataset.id)));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openProduct(Number(card.dataset.id));
    });
  });
}

function openProduct(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  productDetail.innerHTML = `<div class="detail-layout"><div><div class="detail-stage">${phoneMarkup(p, "detail-phone")}</div><p class="detail-controls">3D VIEW | Tap pause to inspect.</p><div style="text-align:center"><button class="filter-tab" id="pauseSpin">Pause rotation</button></div></div><div class="detail-copy"><span class="product-brand">${p.brand} | ${p.tag}</span><h2>${p.name}</h2><div class="detail-price">${money(p.price)}</div><p class="detail-description">${p.description}</p><div class="spec-grid">${[
    ["Display", p.screen],
    ["Resolution", p.resolution],
    ["Processor", p.processor],
    ["RAM", p.ram],
    ["Storage", p.storage],
    ["Rear camera", p.camera],
    ["Selfie camera", p.selfie],
    ["Battery", p.battery],
    ["Charging", p.charging],
    ["Operating system", p.os],
  ]
    .map(
      ([a, b]) => `<div class="spec-item"><small>${a}</small><b>${b}</b></div>`,
    )
    .join(
      "",
    )}</div><b style="font-size:11px">Key features</b><ul class="detail-features">${p.features.map((f) => `<li>${f}</li>`).join("")}</ul><div class="detail-actions"><input class="quantity-input" id="detailQty" type="number" min="1" max="10" value="1" aria-label="Quantity"><button class="button button-dark" id="addFromDetail">Add to cart</button></div></div></div>`;
  productModal.classList.add("open");
  productModal.setAttribute("aria-hidden", "false");
  document.getElementById("pauseSpin").addEventListener("click", (e) => {
    const model = productDetail.querySelector(".detail-phone");
    model.classList.toggle("paused");
    e.target.textContent = model.classList.contains("paused")
      ? "Resume rotation"
      : "Pause rotation";
  });
  document.getElementById("addFromDetail").addEventListener("click", () => {
    const qty = Math.max(
      1,
      Math.min(10, Number(document.getElementById("detailQty").value) || 1),
    );
    addToCart(id, qty);
    closeProduct();
  });
}
function closeProduct() {
  productModal.classList.remove("open");
  productModal.setAttribute("aria-hidden", "true");
}
function saveCart() {
  localStorage.setItem("phonehub-cart", JSON.stringify(cart));
  renderCart();
}
function addToCart(id, qty = 1) {
  const found = cart.find((x) => x.id === id);
  if (found) found.qty = Math.min(99, found.qty + qty);
  else cart.push({ id, qty });
  saveCart();
  toast("Added to your cart");
}
function renderCart() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  document.getElementById("cartCount").textContent = count;
  const items = document.getElementById("cartItems");
  if (!cart.length) {
    items.innerHTML =
      '<div class="empty-cart">Your cart is empty.<br>Explore the collection to find your phone.</div>';
  } else
    items.innerHTML = cart
      .map((item) => {
        const p = products.find((x) => x.id === item.id);
        return `<div class="cart-row"><div class="cart-thumb">P</div><div><b>${p.name}</b><small>${item.qty} × ${money(p.price)}</small><button data-remove="${p.id}">Remove</button></div><strong style="font-size:10px">${money(p.price * item.qty)}</strong></div>`;
      })
      .join("");
  items.querySelectorAll("[data-remove]").forEach((b) =>
    b.addEventListener("click", () => {
      cart = cart.filter((x) => x.id !== Number(b.dataset.remove));
      saveCart();
    }),
  );
  document.getElementById("cartSubtotal").textContent = money(
    cart.reduce(
      (s, x) => s + products.find((p) => p.id === x.id).price * x.qty,
      0,
    ),
  );
}
function toast(message) {
  const t = document.getElementById("toast");
  t.textContent = message;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}
function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function ensureWallet(user) {
  if (typeof user.walletBalance !== "number") user.walletBalance = 10000000;
  const users = getUsers();
  const i = users.findIndex((u) => u.email === user.email);
  if (i >= 0) users[i] = { ...users[i], ...user };
  else users.push(user);
  localStorage.setItem("phonehub-users", JSON.stringify(users));
  localStorage.setItem("phonehub-current-user", JSON.stringify(user));
  return user;
}
function updateAccountUi() {
  const button = document.getElementById("accountButton");
  if (currentUser) {
    button.textContent = `${currentUser.name} | ${money(currentUser.walletBalance)}`;
  } else {
    button.textContent = "Log in";
  }
}

function openLogin() {
  document.getElementById("loginModal").classList.add("open");
}
function closeLogin() {
  document.getElementById("loginModal").classList.remove("open");
}

document.getElementById("filterTabs").addEventListener("click", (e) => {
  const b = e.target.closest("[data-filter]");
  if (!b) return;
  activeFilter = b.dataset.filter;
  document
    .querySelectorAll(".filter-tab")
    .forEach((x) => x.classList.toggle("active", x === b));
  renderProducts();
});
document
  .getElementById("sortSelect")
  .addEventListener("change", renderProducts);
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("closeProduct").addEventListener("click", closeProduct);
productModal.addEventListener("click", (e) => {
  if (e.target === productModal) closeProduct();
});
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.length) {
    toast("Your cart is empty");
    return;
  }
  if (!currentUser) {
    closeCart();
    openLogin();
    toast("Log in to create a virtual payment");
    return;
  }
  closeCart();
  renderCheckout();
  checkoutModal.classList.add("open");
  checkoutModal.setAttribute("aria-hidden", "false");
});
document.getElementById("closeCheckout").addEventListener("click", () => {
  checkoutModal.classList.remove("open");
  checkoutModal.setAttribute("aria-hidden", "true");
});
checkoutModal.addEventListener("click", (e) => {
  if (e.target === checkoutModal) {
    checkoutModal.classList.remove("open");
    checkoutModal.setAttribute("aria-hidden", "true");
  }
});

function renderCheckout() {
  const total = cart.reduce(
    (s, x) => s + products.find((p) => p.id === x.id).price * x.qty,
    0,
  );
  document.getElementById("walletAmount").textContent = money(
    currentUser.walletBalance,
  );
  document.getElementById("checkoutTotal").textContent = money(total);
  document.getElementById("checkoutName").value = currentUser.name || "";
  document.getElementById("checkoutPhone").value = currentUser.phone || "";
}

document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const total = cart.reduce(
    (s, x) => s + products.find((p) => p.id === x.id).price * x.qty,
    0,
  );
  if (total > currentUser.walletBalance) {
    toast("Insufficient virtual wallet balance");
    return;
  }
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  currentUser.walletBalance -= total;
  ensureWallet(currentUser);
  updateAccountUi();
  const order = {
    reference: "PH" + Date.now().toString().slice(-7),
    customer: {
      name: data.name,
      phone: data.phone,
      location: data.location,
      email: currentUser.email,
    },
    items: cart.map((i) => ({ ...i })),
    total,
    createdAt: new Date().toISOString(),
    deliveryDate: deliveryDate.toISOString(),
    status: "Confirmed",
    payment: "Virtual Wallet",
    paymentStatus: "Paid",
  };
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem("phonehub-orders", JSON.stringify(orders));
  cart = [];
  saveCart();
  e.target.reset();
  document.getElementById("orderSuccess").hidden = false;
  document.getElementById("orderSuccess").innerHTML =
    `<b>Payment successful</b><br>Reference: ${order.reference}<br>Thank you, ${data.name}.<br><b>Expected delivery: ${deliveryDate.toLocaleDateString("en-UG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</b><br>The customer notification has been saved for this account.`;
  renderAdmin();
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const users = getUsers();
  let user = users.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase(),
  );
  if (!user) {
    user = {
      name: data.name || data.email.split("@")[0],
      email: data.email,
      phone: "",
      walletBalance: 10000000,
    };
  }
  currentUser = ensureWallet(user);
  updateAccountUi();
  closeLogin();
  e.target.reset();
  toast("Login successful. Your virtual wallet is ready");
});
document.getElementById("closeLogin").addEventListener("click", closeLogin);
document.getElementById("accountButton").addEventListener("click", () => {
  if (currentUser) {
    if (confirm("Log out of this account?")) {
      currentUser = null;
      localStorage.removeItem("phonehub-current-user");
      updateAccountUi();
      toast("Logged out");
    }
  } else openLogin();
});

document
  .getElementById("adminButton")
  .addEventListener("click", () =>
    document.getElementById("adminModal").classList.add("open"),
  );

document.getElementById("adminLoginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  if (data.username === "admin" && data.password === "admin123") {
    document.getElementById("adminLogin").hidden = true;
    document.getElementById("adminDashboard").hidden = false;
    renderAdmin();
  } else toast("Invalid admin credentials");
});
document
  .getElementById("closeAdmin")
  .addEventListener("click", () =>
    document.getElementById("adminModal").classList.remove("open"),
  );

document.getElementById("logoutAdmin").addEventListener("click", () => {
  document.getElementById("adminLogin").hidden = false;
  document.getElementById("adminDashboard").hidden = true;
  document.getElementById("adminModal").classList.remove("open");
});

function renderAdmin() {
  const orders = getOrders();
  document.getElementById("adminOrdersCount").textContent = orders.length;
  document.getElementById("adminRevenue").textContent = money(
    orders
      .filter((o) => o.paymentStatus === "Paid")
      .reduce((s, o) => s + o.total, 0),
  );
  document.getElementById("adminPaidCount").textContent = orders.filter(
    (o) => o.paymentStatus === "Paid",
  ).length;
  document.getElementById("adminUsersCount").textContent = getUsers().length;
  document.getElementById("adminTableBody").innerHTML = orders.length
    ? orders
        .slice()
        .reverse()
        .map(
          (o) =>
            `<tr><td>${o.reference}</td><td>${o.customer.name}</td><td>${money(o.total)}</td><td>${o.status}</td><td>${o.paymentStatus}</td><td>${new Date(o.deliveryDate).toLocaleDateString("en-UG")}</td></tr>`,
        )
        .join("")
    : '<tr><td colspan="6">No orders yet.</td></tr>';
}

document
  .getElementById("menuToggle")
  .addEventListener("click", () =>
    document.querySelector(".main-nav").classList.toggle("open"),
  );
document
  .querySelectorAll(".main-nav a")
  .forEach((a) =>
    a.addEventListener("click", () =>
      document.querySelector(".main-nav").classList.remove("open"),
    ),
  );
document.getElementById("searchToggle").addEventListener("click", () => {
  const q = prompt("Search by phone brand or model:");
  if (q) {
    const found = products.find((p) =>
      (p.brand + " " + p.name).toLowerCase().includes(q.toLowerCase()),
    );
    if (found) openProduct(found.id);
    else toast("No matching phone found");
  }
});
document.getElementById("year").textContent = new Date().getFullYear();
if (currentUser) ensureWallet(currentUser);
updateAccountUi();
renderProducts();
renderCart();
renderAdmin();
