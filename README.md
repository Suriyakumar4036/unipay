# UniPay: NEXUS Banking Platform 🏦✨🦾

UniPay (NEXUS Banking) is a cutting-edge, cloud-native financial intelligence platform designed for the modern era. It combines high-performance Java/Spring Boot architecture with a sleek, premium Next.js interface and live AI insights.

## 🚀 Key Features

- **Neural Portfolio**: A high-performance dashboard with real-time AI analysis of global assets.
- **Multi-Currency Wallets**: Support for USD, EUR, INR, GBP, JPY, and AUD with instant cloud-based balance tracking.
- **AI Financial Intelligence**: Powered by Groq's Llama 3.3 Versatile model, providing personalized wealth strategies and spending analysis.
- **Cloud-Native Architecture**: Fully integrated with MongoDB Atlas for secure, distributed, and persistent data storage.
- **Secure Authentication**: JWT-based security with high-entropy encryption for all financial transactions.
- **Premium Aesthetics**: A dark-mode, glassmorphism-inspired UI designed for a "Nexus" feel.

## 🛠️ Technology Stack

### Backend
- **Core**: Java 26
- **Framework**: Spring Boot 3.2.4
- **Database**: MongoDB Atlas (Cloud)
- **Security**: Spring Security + JWT
- **AI Engine**: Groq API (Llama 3.3 70B)
- **Build Tool**: Apache Maven 3.9.6

### Frontend
- **Framework**: Next.js 16 (Turbopack)
- **Styling**: Vanilla CSS (Premium Custom Design)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks + LocalStorage

## 📦 Project Structure

```
/ai-banking    - Next.js frontend application
/backend       - Spring Boot backend application
README.md      - Project documentation
```

## ⚙️ Setup & Installation

### Prerequisites
- JDK 21+ (Java 26 recommended)
- Node.js & npm
- MongoDB Atlas Account
- Groq API Key

### Backend Setup
1. Navigate to `/backend`.
2. Update `src/main/resources/application.yml` with your MongoDB URI and Groq API Key.
3. Run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to `/ai-banking`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🌍 Public Access & Production
To allow everyone to access your website while running locally:
1. **Start the Tunnel**: Use a service like Localtunnel to expose your backend.
   ```bash
   npx localtunnel --port 8080 --subdomain unipay-production-api
   ```
2. **Update Frontend**: Ensure the `NEXT_PUBLIC_API_URL` in your Netlify settings matches the tunnel URL.
3. **Always On**: For 24/7 access, deploy the backend to a cloud provider like **Render** or **Railway** using the provided `Dockerfile` in the `/backend` directory.


## 🔐 Security & Compliance
- All data is encrypted in transit using TLS.
- Passwords are hashed using BCrypt.
- Stateless authentication via JWT ensures high scalability and security.

## 📜 License
This project is for demonstration purposes for the Advanced Agentic Coding team.

---
Built with 🦾 by **Antigravity AI**
