# AlphaByte - AI-Powered Healthcare Management System

AlphaByte is a modern healthcare management platform that leverages artificial intelligence to provide better patient care, streamline medical workflows, and deliver evidence-based clinical support.

## Features

- **Patient Dashboard**: View and manage patients with filtering, sorting and search capabilities
- **Patient Records**: Comprehensive patient profiles with medical history, symptoms, and treatment plans
- **AI-Powered Chatbot**: Answer medical queries about conditions, treatments, and medications
- **Evidence-Based Remedies**: Access research-backed treatment options with citations
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React (v19.0.0), TypeScript, Tailwind CSS
- **Routing**: React Router v7
- **Icons & UI**: Lucide React
- **Networking**: Axios with caching support
- **Build Tools**: Vite, SWC

## Project Structure

```
AlphaByte/
├── src/
│   ├── assets/         # Static assets, images
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   │   └── PatientContext.tsx  # Patient data management
│   ├── lib/            # Shared utilities
│   │   └── axios.ts    # API configuration with caching
│   ├── pages/          # Application pages
│   │   ├── Dashboard.tsx   # Patient listing and management
│   │   ├── Home.tsx        # Landing page
│   │   └── Profile.tsx     # Patient details with AI support
│   ├── services/       # API services
│   │   └── patient.service.ts  # Patient data operations
│   └── types/          # TypeScript type definitions
├── .env                # Environment variables
└── package.json        # Project dependencies
```

## Key Features

### Patient Management

- **Patient Dashboard**: Comprehensive overview with filtering and sorting
- **Patient Profiles**: Complete medical information including symptoms and treatments
- **Record Management**: Add, update, and manage patient records

### AI-Assisted Medical Support

- **Smart Chatbot**: Answers treatment and medication questions based on conditions
- **Research-Backed Remedies**: Provides evidence-based treatment options
- **Treatment Insights**: Offers detailed information on primary and emerging remedies

### User Experience

- **Responsive Design**: Works on all devices from mobile to desktop
- **Real-time Updates**: Immediate data refresh capability
- **Intuitive Interface**: Clean and modern UI for healthcare professionals

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/AlphaByte.git
   cd AlphaByte
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the project root with the following content:

   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Start the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## API Integration

This frontend connects to a backend service with the following endpoints:

- `GET /patient_all` - Retrieve all patients
- `GET /patientRecord/{patient_id}?id={id}` - Get detailed record for a patient
- `POST /patient` - Create a new patient
- `PUT /patient/{id}` - Update a patient
- `DELETE /patient/{id}` - Delete a patient

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Medical data and treatment recommendations are for demonstration purposes only
- Always consult with healthcare professionals for medical advice
