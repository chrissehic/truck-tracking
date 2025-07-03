# Truck Tracking Assignment

This project is a web application for real-time truck tracking. It allows users to monitor truck locations, status, and routes effectively.

## Features

- Real-time truck location tracking on a map
- Display truck details and status
- Route visualization
- Responsive design for desktop and mobile
- Integration with external APIs for geolocation

## Technologies Used

- Next.js
- Leaflet (for maps)
- Leaflet Routing Machine for routing
- Typescript
- Node.js
- Tailwind CSS

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chrissehic/truck-tracking.git
   ```
2. Navigate to the project directory:
   ```bash
   cd truck-tracking
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   npm install
   ```
4. Configure environment variables as needed (e.g., API keys).

5. Start the development server:
   ```bash
   npm start
   ```

## Usage

- Open the app in your browser at `http://localhost:3000`
- View and track trucks in real-time on the map
- Access truck details by clicking on markers

## Limitations

- **Mobile Responsiveness:**  
  The current version of the application does not include specific styling or layout adjustments for mobile screen sizes. The interface was primarily designed and tested on desktop resolutions, which means the user experience on smaller devices such as smartphones may be suboptimal.  
  Future iterations should incorporate responsive design techniques and thorough mobile testing to ensure usability across all device sizes.

- **API Endpoint Limitations:**  
  All API endpoints currently provide static or mock data and do not support real-time updates via subscriptions or WebSocket connections. As a result, live tracking of truck locations is not available in this version. Implementing real-time data streaming would be essential for a fully functional live tracking experience.


## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.
