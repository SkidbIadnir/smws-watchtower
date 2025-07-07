# SMWS Watchtower

A modern web application for monitoring new whisky releases from the Scotch Malt Whisky Society (SMWS). This frontend application connects to a backend service that performs automated scraping and cross-referencing of distillery information to quickly detect new whisky releases.

## How it Works

The SMWS Watchtower consists of two main components:

### Frontend (This Application)

- Built with SvelteKit and styled with Tailwind CSS
- Provides a clean, responsive interface for browsing whisky releases
- Features filtering, sorting, and search capabilities
- Displays detailed information about each whisky including distillery, region, age, price, and tasting profile

### Backend Integration

- Connects to a backend API service (running on `localhost:3000`)
- The backend performs automated scraping of SMWS website data
- Cross-references distillery information and whisky details
- Continuously monitors for new whisky releases
- Provides real-time data about availability and pricing
- Marks new releases with a special indicator

## Features

- **Real-time Updates**: Displays the latest whisky releases as soon as they're detected by the backend
- **Advanced Filtering**: Filter by distillery, region, age, price range, and tasting profile
- **Smart Search**: Find specific whiskies by name, distillery, or other attributes
- **Visual Indicators**: Easy-to-read badges for tasting profiles and new release notifications
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (version 18 or higher)
2. **Backend API Service** running on `localhost:3000` with the endpoint `/scraping/smws/get-all`
3. **npm** or **pnpm** or **yarn** package manager

## Getting Started

1. **Clone the repository and install dependencies:**

```bash
npm install
# or
pnpm install
# or
yarn install
```

2. **Ensure your backend service is running** on `localhost:3000`

3. **Start the development server:**

```bash
npm run dev
# or start the server and open the app in a new browser tab
npm run dev -- --open
```

The application will be available at `https://smws.skidhub.fr`.

## API Integration

The application expects a backend service with the following endpoint:

- `GET http://localhost:3000/scraping/smws/get-all` - Returns an array of whisky objects

Each whisky object should include:

- Basic information (name, distillery, region, age, price, ABV)
- Availability status and URLs
- Tasting profile classification
- `is_new` flag for newly detected releases
- Timestamps for tracking when items were added/updated

## Building for Production

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Docker Deployment

The application includes a multi-stage Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t smws-watchtower .

# Run the container
docker run -p 3000:3000 smws-watchtower
```

The Docker container will:

1. Install dependencies and build the application
2. Create a minimal runtime environment
3. Serve the application on port 3000

**Note**: Make sure your backend API service is accessible from within the Docker container network.

## Architecture Notes

- **Frontend**: SvelteKit application with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Build Tool**: Vite for fast development and optimized builds
- **Backend Communication**: RESTful API calls to scraping service
- **Data Flow**: Backend scrapes SMWS → processes/stores data → frontend fetches and displays

The backend service handles all the heavy lifting of web scraping, data processing, and change detection, while this frontend focuses on providing an excellent user experience for browsing and discovering new whisky releases.
