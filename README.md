# TradeMind - AI Trading Consultant

TradeMind is a sophisticated trading dashboard and AI consultant application designed to provide real-time market data, portfolio management, and intelligent trading insights powered by Gemini 1.5 Pro.

![TradeMind Banner](https://via.placeholder.com/1200x400?text=TradeMind+AI+Dashboard)

## 🚀 Features

*   **Real-time Market Data**: Live stock prices and interactive charts using `lightweight-charts`.
*   **AI Consultant**: Integrated Chat interface with a "Persona" system (Warren Buffett, Hedge Fund Manager, etc.) for personalized financial advice.
*   **Portfolio Management**: Track assets, wishlist, and P&L in real-time.
*   **News Aggregation**: Curated financial news feed powered by Yahoo Finance (`yfinance`).
*   **Secure Authentication**: User management and data persistence via Supabase.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Radix UI.
*   **Backend**: Python FastAPI, Supabase, Google Gemini AI.
*   **Data**: Yahoo Finance API (yfinance).

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

*   Node.js 18+
*   Python 3.10+
*   Git

### 1. Backend Setup

Navigate to the backend directory and set up the Python environment:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend/` directory:

```ini
GEMINI_API_KEY=your_gemini_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

**Run Server:**
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

**Environment Variables:**
Create a `.env.local` file in the `frontend/` directory (if not already present) for any frontend-specific keys.

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License.
