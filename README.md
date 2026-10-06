# 🚛 TruckBuddy

### AI-Powered Truck Booking & Freight Management Platform

TruckBuddy is a smart logistics platform designed to connect **Shippers, Transporters, and Drivers** through a unified digital platform.

The platform aims to simplify truck booking, improve freight transportation efficiency, reduce empty return trips through **AI-powered backhaul matching**, and provide intelligent logistics insights using AI, weather information, and journey data.

---

## 🚀 Key Features

### 👤 Role-Based Platform

TruckBuddy provides dedicated experiences for different users:

- 📦 Shipper
- 🚛 Transporter
- 👨‍✈️ Driver
- 🛡️ Administrator

Each role has access to features and information relevant to their responsibilities.

---

## 📦 Shipper

Shippers can use TruckBuddy to manage their freight transportation requirements.

### Features

- Create shipment requests
- Find and connect with transporters
- Manage bookings
- Track shipments
- View shipment status
- View booking history
- Manage membership
- Payment integration
- Notifications
- Profile management

---

## 🚛 Transporter

Transporters can manage their trucks, drivers, bookings, and available freight.

### Features

- View available loads
- Manage trucks
- Manage drivers
- Accept and manage bookings
- Manage active trips
- View completed trips
- Monitor earnings
- Find return-load opportunities
- Notifications
- Profile management

---

## 👨‍✈️ Driver

Drivers get a dedicated workspace focused on their current and upcoming journeys.

### Features

- View assigned trips
- View pickup and destination
- Track trip status
- Route and journey information
- View trip history
- View earnings
- Notifications
- Return-load opportunities
- Profile management

---

# 🔄 AI-Powered Backhaul / Return Load Matching

One of the core ideas behind TruckBuddy is reducing **empty return trips**.

For example:

```text
Indore
   ↓
   🚛
   ↓
Mumbai
The platform can help transporters and drivers discover these potential return loads while the original journey is still in progress.

Benefits
Reduce empty truck returns
Improve truck utilization
Increase earning opportunities
Reduce unnecessary transportation capacity
Improve overall logistics efficiency
🌦️ Weather & Journey Intelligence

TruckBuddy incorporates weather and journey-related information to provide better logistics insights.

The goal is to help users make more informed transportation decisions by considering factors that may affect a journey.

🧠 AI Freight Advisor

TruckBuddy includes an AI-powered freight advisor designed to assist users with logistics-related information and recommendations.

The system can use relevant freight information and knowledge sources to provide more useful and contextual responses.

🔎 RAG Integration

TruckBuddy can use Retrieval-Augmented Generation (RAG) to provide AI responses based on relevant external or platform-specific information.

A typical RAG workflow is:

User Question
      ↓
Information Retrieval
      ↓
Relevant Context
      ↓
AI / LLM
      ↓
Generated Response

This can be useful for:

Platform information
Freight-related knowledge
Policies and guidelines
Frequently asked questions
Logistics documentation
Context-aware AI assistance
💳 Shipper Membership Plans

TruckBuddy provides three membership options for Shippers.

Plan	Price	Benefit
Standard	₹500	5 Rides
Premium	₹1,000	15 Days
Gold	₹2,200	3 Months
Standard

₹500

5 rides
Premium

₹1,000

15-day subscription
Gold

₹2,200

3-month subscription

Payment functionality can be operated using a test/sandbox environment during development and prototyping.

🌐 Multilingual Support

TruckBuddy supports multiple languages to make the platform more accessible.

Currently supported:

🇬🇧 English
🇮🇳 Hindi

Users can select their preferred language during the initial application experience and can change their language later through the application settings.

🗺️ Freight & Route Visualization

TruckBuddy includes freight and journey visualization capabilities to help users understand transportation information more clearly.

The platform can display relevant:

Pickup locations
Destination locations
Freight information
Journey information
Trip status
🛡️ Admin Dashboard

TruckBuddy includes a dedicated web-based administrative interface for managing the platform.

The Admin Dashboard is designed to provide centralized visibility into platform operations.

Admin capabilities include:
User management
Shipper management
Transporter management
Driver management
Shipment management
Booking management
Truck management
Trip monitoring
Payment information
Platform analytics
Notifications
Operational monitoring

The Admin Dashboard is separate from the mobile-focused user experience.

📱 Mobile Application

TruckBuddy is being designed with a mobile-first user experience for:

Shippers
Transporters
Drivers

The application focuses on:

Touch-friendly interfaces
Responsive layouts
Easy navigation
Mobile-friendly booking
Trip management
Shipment tracking
Notifications
Freight information

The project can be packaged for Android as the development progresses.

🌐 Web Application

TruckBuddy can also be accessed through a web browser.

The web version is designed to provide:

Platform access through a URL
Responsive user experience
Administrative functionality
Desktop-friendly management tools
🏗️ Technology Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
Lucide React
Framer Motion
Backend & Database
Supabase
PostgreSQL
Supabase Authentication
Supabase Storage
AI
Generative AI / LLM
Retrieval-Augmented Generation (RAG)
AI Freight Advisor
AI-powered backhaul/return-load assistance
Maps & Logistics
Freight/route visualization
Location-based logistics information
Weather-related journey intelligence
Payments
Razorpay
Test/Sandbox environment for development
Deployment
Vercel
📂 Project Structure
TruckBuddy/
│
├── app/
│   ├── admin/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── admin/
│   ├── AIAndFreightAdvisor/
│   ├── LiveFreightMap/
│   ├── RoleWorkspaces/
│   ├── ShipperMembership/
│   ├── Payment/
│   └── ...
│
├── hooks/
│
├── lib/
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
