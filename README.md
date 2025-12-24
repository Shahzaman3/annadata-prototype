# ANNADATA+ 🍲
> **Bridging Surplus to Scarcity.**

A high-fidelity hackathon prototype demonstrating a real-time food redistribution network. ANNADATA+ connects food donors with NGOs using geolocation and hunger mapping data to ensure food goes where it's needed most, prioritizing urgency over first-come-first-serve.

![ANNADATA+ Banner](https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop)

## 🌟 Key Features
*   **High-Impact Landing Page**: A cinematic entry point setting the tone for the mission.
*   **Smart Food Submission**: Rule-based validation for food safety (checks cooking time & storage).
*   **Hunger Priority Map (USP)**: Visualizes hunger zones using a heatmap. High-need areas (red zones) get priority matching.
*   **NGO Logic Dashboard**: Requests are sorted by **Urgency Score** (Hunger Index + Food Perishability), not just distance.
*   **Real-Time Impact**: Tracks meals served and hunger reduction progression.

## 🛠️ Tech Stack
*   **Frontend**: React (Vite), Tailwind CSS
    *   *Animations*: Framer Motion, GSAP
    *   *Maps*: React Leaflet (OpenStreetMap)
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v14+)
*   MongoDB (Local instance running on default port `27017`)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Shahzaman3/annadata-prototype.git
    cd annadata-prototype
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    *Server runs on `http://localhost:5000`*

3.  **Setup Frontend** (Open a new terminal)
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *Client runs on `http://localhost:5173`*

## 🎭 Demo Flow (Script)

1.  **Landing Page**: Start at `/`. Click "Launch Prototype".
2.  **Donate**: Submit a food donation (e.g., "Rice, 20kg"). Watch the validation.
3.  **Map**: Check the **Priority Map** to see where the hunger zones are.
4.  **NGO**: Go to **NGO Dashboard**. Accept the request you just created.
5.  **Impact**: View the **Impact Dashboard** to see the "Meals Served" counter go up.

## 🤝 Contribution
This is a hackathon prototype meant for demonstration purposes. Feel free to fork and expand!
