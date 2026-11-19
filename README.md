# PHONEHUB | Virtual E-Commerce Demonstration

A responsive smartphone e-commerce front-end project built with HTML, CSS and vanilla JavaScript.

## Open in Visual Studio Code

1. Download and extract `PHONEHUB.zip`.
2. Open Visual Studio Code.
3. Choose **File → Open Folder** and select the extracted `PHONEHUB` folder.
4. Open `index.html`.
5. Recommended: install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.

You can also double-click `index.html` to open it in a browser.

## Project structure

```text
PHONEHUB/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── products.js
    └── app.js
```

## Features

- Responsive homepage and product catalogue
- Brand filters and price sorting
- Six smartphone listings
- Product detail view with specifications and descriptions
- Shopping cart with quantity and subtotal
- Customer login with an UGX 10,000,000 virtual wallet
- Virtual wallet payment at checkout
- Two-day delivery confirmation
- Administrator login and order dashboard
- Browser localStorage persistence

## Important notes

- This front-end is a demonstration. It does not move real money or contact a real courier.
- The listed phone prices and specifications are sample data.
- Wallet, accounts, orders and admin information are stored in browser localStorage.
- Admin access in this demonstration uses username `admin` and password `admin123`. Change this or replace it with secure authentication before production use.
- For a production launch, add server-side authentication, encrypted database storage, inventory management, HTTPS and an approved payment and courier integration.

## Deploy to Vercel

1. Push this project to GitHub or GitLab.
2. Import the repository in Vercel.
3. Select this folder as the project root.
4. Deploy without a build command; Vercel serves `index.html` as a static site.

The included `vercel.json` supports clean static hosting.
