import React from "react";
import { Link } from "react-router-dom";
import dashboardImage from "../assets/ medical-dashboard.png";

const Home: React.FC = () => {
  return (
    <div className="w-full min-h-full bg-[#F8FAFC]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#2D5BFF] via-[#6B4FFE] to-[#2D5BFF] w-full">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Hero Content */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Smart Healthcare Decisions with
                <span className="text-[#00D1C5] block mt-2">
                  AI-Powered Insights
                </span>
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                Empower your medical practice with real-time analytics,
                intelligent patient management, and evidence-based clinical
                support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#2D5BFF] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Open Dashboard
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200"
                >
                  Manage Patients
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              {/* Add a decorative pattern behind the image */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00D1C5]/20 to-transparent rounded-3xl transform rotate-3"></div>
              <img
                src={dashboardImage}
                alt="MediAssist Dashboard"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[#1E293B] mb-4">
            Comprehensive Healthcare Management
          </h2>
          <p className="text-[#94A3B8] text-lg">
            Everything you need to provide excellent patient care and make
            informed medical decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
            title="Patient Management"
            description="Track patient history, symptoms, and treatment plans in real-time."
            color="#2D5BFF"
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
            title="Clinical Analysis"
            description="AI-powered insights for better diagnosis and treatment decisions."
            color="#00D1C5"
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            }
            title="Smart Assistance"
            description="24/7 AI support for medical queries and drug interactions."
            color="#6B4FFE"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <StatCard number="10k+" label="Patients Managed" />
            <StatCard number="95%" label="Accuracy Rate" />
            <StatCard number="24/7" label="AI Support" />
            <StatCard number="50+" label="Leading Hospitals" />
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      {/* ... Rest of the home page code ... */}
    </div>
  );
};

// Helper Components
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}> = ({ icon, title, description, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
      style={{ backgroundColor: `${color}15` }}
    >
      <div style={{ color: color }}>{icon}</div>
    </div>
    <h3 className="text-xl font-semibold text-[#1E293B] mb-2">{title}</h3>
    <p className="text-[#94A3B8]">{description}</p>
  </div>
);

const StatCard: React.FC<{ number: string; label: string }> = ({
  number,
  label,
}) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-[#2D5BFF] mb-2">{number}</div>
    <div className="text-[#94A3B8]">{label}</div>
  </div>
);

export default Home;
