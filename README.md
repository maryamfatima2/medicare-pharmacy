# Healora Pharmacy

**Wellness Delivered with Care** — A premium MERN stack online pharmacy platform with professional branding, real medicine product images, 3D hero slider, and full e-commerce functionality.

## Brand

| | |
|---|---|
| **Name** | Healora Pharmacy |
| **Tagline** | Wellness Delivered with Care |
| **Colors** | Blue (#2563eb) + Emerald (#10b981) + White |
| **Support** | support@healora.com |

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Swiper.js, Axios
- **Backend:** Node.js, Express, MongoDB Atlas, JWT, bcrypt
- **UI:** Glassmorphism, 3D hero slider, scroll animations, responsive layout

## Quick Start

```bash
# Install
cd backend && npm install
cd ../frontend && npm install --legacy-peer-deps

# Configure backend/.env (see backend/.env.example)
cd backend && npm run seed && npm run dev

# Frontend
cd frontend && npm run dev
```

- **Site:** http://localhost:5173  
- **API:** http://localhost:5000/api  

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@healora.com | admin123 |
| User | john@healora.com | user123 |

> After rebrand, run `npm run seed` in `backend/` to refresh product images and demo users.

## Features

- Animated hero slider with floating 3D medicine showcase
- Real product images per medicine (Panadol, Vitamin C, etc.)
- Categories, featured, bestsellers, offers, testimonials, brands
- Why Choose Us, newsletter, professional footer
- Full cart, wishlist, checkout, order success flow
- Admin dashboard with analytics

## License

MIT
