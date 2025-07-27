# 📊 Market Seasonality Explorer

A modern, responsive web-based trading dashboard built with **React**, **Vite**, and **Tailwind CSS**. The application provides dynamic visualizations and UI components for order books, trading summaries, and user-friendly data interaction.

---

## Tech Stack

- **React** – Component-based UI framework  
- **Vite** – Lightning-fast build tool  
- **Tailwind CSS** – Utility-first CSS for styling  
- **JavaScript (ES6+)**  
- **Context API** – For state and theme management  

---

## Project Structure

```
Trading_Project-main/
├── public/                  # Static assets
│   └── vite.svg
├── src/
│   ├── Components/        # Reusable components
│   │   |   │── Calendar/
│   │   |   |    │──Calendar.jsx
│   │   |   |    │──CalendarCell.jsx
│   │   |   |    │──DailyMetrics.jsx
│   │   |   |    │──DashboardPanel.jsx
│   │   |   |    │──generateDailyData.js
│   │   |   |    │──MetricLegend.jsx
│   │   |   |    │──summaries.js
│   │   |   |    │──TooltipContent.jsx
│   │   ├── AnomalyLegend.jsx
│   │   ├── Cursor.jsx
│   │   ├── OrderBookPanel.jsx
│   │   ├── ThemeContext.jsx
│   │   └── background.jsx
│   │   └── gradient_text.jsx
│   │   └── starborder.jsx
│   │   └── summaryChart.jsx
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # App entry point
│   ├── index.css            # Global styles
│   └── tailwind.config.js   # Tailwind configuration
├── index.html               # HTML entry file
├── package.json             # Project metadata and scripts
├── vite.config.js           # Vite build config
└── README.md                # Project documentation
```

---

## Installation & Running Locally

Make sure you have **Node.js (v16 or higher)** and **npm** or **yarn** installed.

### 1. Clone or Unzip the Project

```bash
git clone https://github.com/ananya32000/Trading_Project.git
cd Trading_Project-main
```

Or unzip the provided folder and open it in your terminal or editor.

---

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

---

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173/` to view the app.

---

## Available Scripts

| Command            | Description                         |
|--------------------|-------------------------------------|
| `npm run dev`      | Run app in development mode         |
| `npm run build`    | Builds the app for production       |
| `npm run preview`  | Preview built app before deploy     |

---

## Features

- Real-time UI elements (e.g., order book panel)  
- Dynamic theme support (HighContrast/Colorblind)  
- Chart visualizations and anomaly detection legend  
- Custom components with Tailwind styling(Custom cursor)  
- Modular structure for easy scalability  

---

## Customization

- **Theme Configuration**: Controlled via `ThemeContext.jsx`  
- **Chart & Panels**: Customize or add features inside `/Components/`  
- **Styling**: Modify `tailwind.config.js` for theme tokens or custom styles  

---

## Linting

You can configure ESLint via `eslint.config.js`. Consider extending this with rules or integrating `prettier`.

---

## Build for Production

```bash
npm run build
```

Output will be stored in the `dist/` directory.

---

## Contact

For queries or support, please contact:  
📧 **Email-ananya32000@gmail.com**
