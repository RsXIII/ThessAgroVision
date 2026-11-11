# AgroVision – Smart Agriculture Dashboard

AgroVision is a web-based smart agriculture dashboard designed to help farmers manage agricultural fields, monitor weather conditions, organize crops, track irrigation activities, and visualize important agricultural data through a centralized interface.

The application provides a clean, responsive interface with support for Greek and English languages.

## Features

- **Dashboard:** Overview of farm information, active fields, total agricultural area, and key statistics.
- **Fields Management:** Create, edit, delete, and manage agricultural fields.
- **Crops Management:** Organize and monitor crop information.
- **Weather Monitoring:** Access weather information for the selected agricultural field.
- **7-Day Weather Forecast:** View upcoming weather conditions.
- **Irrigation Management:** Record and manage irrigation activities.
- **Analytics & Reports:** Visualize agricultural information and statistics through charts.
- **Settings:** Configure farm information and application preferences.
- **Active Field Selection:** Select an agricultural field and display its relevant information across the application.
- **Multilingual Interface:** Switch between Greek and English.

## Technologies

- Vue 3
- JavaScript
- Vite
- HTML5
- CSS3
- Leaflet
- Chart.js
- Open-Meteo API
- Browser Local Storage

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd AgroVision
```

Install dependencies:

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

The application will be available at the local URL displayed in your terminal.

### Production Build

To generate the production build:

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

## Data Storage

The application uses browser Local Storage for persistent storage of locally managed application data.

Weather information is retrieved through the Open-Meteo API.

## Project Structure

## Project Structure

```text
AgroVision/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ForecastCard.vue
│   │   ├── Header.vue
│   │   ├── MainLayout.vue
│   │   ├── Sidebar.vue
│   │   └── WeatherCard.vue
│   ├── data/
│   ├── router/
│   │   └── index.js
│   ├── services/
│   │   ├── cropService.js
│   │   ├── fieldService.js
│   │   ├── irrigationService.js
│   │   ├── languageService.js
│   │   ├── settingsService.js
│   │   └── weatherService.js
│   ├── views/
│   │   ├── Analytics.vue
│   │   ├── Crops.vue
│   │   ├── Dashboard.vue
│   │   ├── Fields.vue
│   │   ├── Irrigation.vue
│   │   ├── Settings.vue
│   │   └── Weather.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Project Status

AgroVision is an ongoing personal development project focused on smart agriculture, data visualization, and modern web application development.

