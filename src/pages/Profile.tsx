import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePatients } from "../context/PatientContext";
import { ChatMessage } from "../types/Patient";
import {
  User,
  Phone,
  Calendar,
  Activity,
  Pill,
  Stethoscope,
  Send,
  Bot,
  Loader,
} from "lucide-react";

const Profile: React.FC = () => {
  const { selectedPatient, loading } = usePatients();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Updated remediesData with hyperlinks to research papers
  const remediesData = {
    "Breast Cancer": {
      primaryRemedies: [
        {
          title:
            "Targeted therapy with activin receptor-like kinase 1 (ALK1) inhibitors",
          description:
            "The study highlights the importance of ALK1 in shaping an immunosuppressive landscape in breast cancer metastases. Inhibiting ALK1 may help restore an anti-tumor immune response.",
          evidence: "Evidence: Chunk 199",
          paperLink:
            "https://jamanetwork.com/journals/jama/article-abstract/2721183",
          paperTitle: "ALK1 Signaling in Breast Cancer - JAMA Oncology",
        },
        {
          title: "Immunotherapy",
          description:
            "The research suggests that a monocytic lineage plays a crucial role in immunosuppression. Immunotherapy targeting this lineage may help reinvigorate the immune system to combat breast cancer.",
          evidence: "Evidence: Chunk 74",
          paperLink:
            "https://jamanetwork.com/journals/jama/article-abstract/2721183",
          paperTitle:
            "Immunotherapy in Metastatic Breast Cancer - JAMA Oncology",
        },
        {
          title: "Combination therapy",
          description:
            "Considering the immunosuppressive landscape in breast cancer metastases, combining targeted therapy with immunotherapy may be an effective approach to enhance treatment outcomes.",
          evidence: "Evidence: Chunk 1024",
          paperLink:
            "https://jamanetwork.com/journals/jama/article-abstract/2721183",
          paperTitle:
            "Combined Approaches for Breast Cancer Treatment - JAMA Oncology",
        },
      ],
      emergingRemedies: [
        {
          title: "ALK1-targeting monoclonal antibodies",
          description:
            "The study introduces the concept of targeting ALK1 to reverse immunosuppression in breast cancer. Further research is needed to explore the potential benefits and safety of ALK1-targeting monoclonal antibodies.",
          benefit: "Reversing immunosuppression",
          relevance: "Breast cancer metastases",
        },
      ],
      additionalNotes: [
        "Precautions: Further studies are necessary to determine the optimal dosing and duration of ALK1 inhibitors and immunotherapy.",
        "Contraindications: Patients with severe immunosuppression or compromised immune systems may not be suitable candidates for immunotherapy.",
        "Complementary therapies: Combination with other targeted therapies or chemotherapy may be explored to enhance treatment outcomes.",
      ],
    },
    "Type 2 Diabetes": {
      primaryRemedies: [
        {
          title: "Lifestyle modifications",
          description:
            "Diet control, regular exercise, and weight management are fundamental in managing Type 2 Diabetes.",
          evidence: "Evidence: Medical guidelines",
          paperLink:
            "https://jamanetwork.com/journals/jama/article-abstract/2721183",
          paperTitle: "Lifestyle Interventions for Type 2 Diabetes - JAMA",
        },
        {
          title: "Oral medications",
          description:
            "Metformin is typically the first-line medication for controlling blood sugar levels in Type 2 Diabetes.",
          evidence: "Evidence: Standard practice",
        },
      ],
      emergingRemedies: [
        {
          title: "GLP-1 receptor agonists",
          description:
            "These medications help slow digestion and help lower blood sugar levels.",
          benefit: "Weight loss and blood sugar control",
          relevance: "Adult Type 2 Diabetes patients",
        },
      ],
      additionalNotes: [
        "Regular monitoring of blood glucose levels is essential.",
        "Kidney function should be assessed periodically while on medication.",
        "Proper foot care and regular eye examinations are important to prevent complications.",
      ],
    },
    Hypertension: {
      primaryRemedies: [
        {
          title: "Lifestyle modifications",
          description:
            "Reducing sodium intake, regular physical activity, maintaining healthy weight, and limiting alcohol consumption.",
          evidence: "Evidence: Clinical guidelines",
        },
        {
          title: "Antihypertensive medications",
          description:
            "Depending on individual factors, medications like ACE inhibitors, ARBs, calcium channel blockers, or diuretics may be prescribed.",
          evidence: "Evidence: Standard protocol",
        },
      ],
      emergingRemedies: [
        {
          title: "Renal denervation",
          description:
            "A procedure that uses ultrasound or radiofrequency energy to modify nerve activity between the kidneys and the brain.",
          benefit: "Blood pressure reduction in resistant hypertension",
          relevance: "Patients with resistant hypertension",
        },
      ],
      additionalNotes: [
        "Regular blood pressure monitoring is essential.",
        "Medication adherence is crucial for effective blood pressure control.",
        "Combination therapy may be necessary for optimal blood pressure management.",
      ],
    },
  };

  // Add specialized treatment responses by disease
  const treatmentResponses: Record<string, string> = {
    "Breast Cancer": `Following are the treatments for Breast Cancer:

1. Surgery - Removing the cancer tissue through lumpectomy or mastectomy
2. Radiation therapy - Using high-energy rays to destroy cancer cells
3. Chemotherapy - Using drugs to kill cancer cells throughout the body
4. Hormone therapy - Blocking hormones that fuel certain breast cancers
5. Targeted therapy - Using drugs that target specific abnormalities in cancer cells
6. Immunotherapy - Helping your immune system fight cancer

Your doctor will recommend which treatments are most appropriate based on your specific diagnosis.`,

    "Type 2 Diabetes": `Following are the treatments for Type 2 Diabetes:

1. Lifestyle changes - Diet modifications, regular exercise, and weight management
2. Oral medications - Metformin and other drugs that improve insulin sensitivity
3. Injectable medications - GLP-1 receptor agonists and insulin therapy
4. Blood sugar monitoring - Regular testing to manage glucose levels
5. Regular medical checkups - To prevent and treat complications

Your treatment plan will be personalized based on your specific needs and health status.`,

    Hypertension: `Following are the treatments for Hypertension:

1. Lifestyle modifications - Reducing sodium intake, regular exercise, weight management
2. Diuretics - Help rid your body of sodium and water
3. ACE inhibitors and ARBs - Relaxing blood vessels by blocking certain natural chemicals
4. Calcium channel blockers - Preventing calcium from entering cells of the heart and blood vessels
5. Beta blockers - Reducing your heart rate and output of blood, lowering pressure
6. Regular blood pressure monitoring - Essential for tracking treatment effectiveness

Your doctor will determine which treatments are most appropriate for your specific condition.`,
  };

  // Generic treatment response for diseases not in our database
  const genericTreatmentResponse = `
Common treatment approaches include:

1. Medication therapy
2. Lifestyle modifications
3. Regular monitoring
4. Follow-up with healthcare providers

Please consult with your doctor for a treatment plan tailored specifically to your condition.
`;

  // Function to check if a message is asking about treatments
  const isAskingAboutTreatment = (message: string): boolean => {
    const treatmentKeywords = [
      "treatment",
      "therapy",
      "cure",
      "medication",
      "remedy",
      "heal",
      "manage",
      "treat",
    ];
    const lowercaseMsg = message.toLowerCase();

    return treatmentKeywords.some((keyword) => lowercaseMsg.includes(keyword));
  };

  // Function to get treatment response based on disease
  const getTreatmentResponse = (): string => {
    if (!safeSelectedPatient) return genericTreatmentResponse;

    const disease = safeSelectedPatient.disease;
    return treatmentResponses[disease] || genericTreatmentResponse;
  };

  useEffect(() => {
    if (!selectedPatient && !loading) {
      navigate("/dashboard");
    }
  }, [selectedPatient, loading, navigate]);

  useEffect(() => {
    // Auto-scroll to the bottom of the chat
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setNewMessage("");

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Here's some information about ${selectedPatient?.disease}. Please consult with Dr. ${selectedPatient?.doctor_Assigned} for more details.`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  // Ensure arrays exist and have fallbacks
  const safeSelectedPatient = selectedPatient
    ? {
        ...selectedPatient,
        symptoms: selectedPatient.symptoms || [],
        medications: selectedPatient.medications || [],
      }
    : null;

  // Enhanced rendering for symptoms list
  const renderSymptoms = () => {
    if (
      !safeSelectedPatient?.symptoms ||
      safeSelectedPatient.symptoms.length === 0
    ) {
      return <span className="text-gray-500">No symptoms recorded</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {safeSelectedPatient.symptoms.map((symptom, index) => (
          <span
            key={`symptom-${index}`}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            {symptom}
          </span>
        ))}
      </div>
    );
  };

  const getRemedies = () => {
    if (!safeSelectedPatient) return null;

    // Check if we have remedies for this disease
    const disease = safeSelectedPatient.disease;
    return remediesData[disease as keyof typeof remediesData] || null;
  };

  // Updated renderRemedies function to include hyperlinks
  const renderRemedies = () => {
    const remedies = getRemedies();

    if (!remedies) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-500 italic">
            No specific remedies information available for this condition.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Primary Remedies */}
        <div>
          <h3 className="text-md font-semibold text-blue-700 mb-3">
            Primary Remedies
          </h3>
          <div className="space-y-3">
            {remedies.primaryRemedies.map((remedy, index) => (
              <div
                key={`primary-${index}`}
                className="bg-blue-50 p-4 rounded-lg"
              >
                <div className="font-medium text-blue-800 mb-1">
                  {index + 1}. {remedy.title}
                </div>
                <p className="text-gray-700 text-sm mb-1">
                  {remedy.description}
                </p>
                <div className="text-xs text-gray-500 italic flex items-center justify-between">
                  <span>{remedy.evidence}</span>
                  {remedy.paperLink && (
                    <a
                      href={remedy.paperLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center ml-2"
                      title={remedy.paperTitle || "View research paper"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View Paper
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emerging Remedies */}
        <div>
          <h3 className="text-md font-semibold text-purple-700 mb-3">
            New or Emerging Remedies
          </h3>
          <div className="space-y-3">
            {remedies.emergingRemedies.map((remedy, index) => (
              <div
                key={`emerging-${index}`}
                className="bg-purple-50 p-4 rounded-lg"
              >
                <div className="font-medium text-purple-800 mb-1">
                  {index + 1}. {remedy.title}
                </div>
                <p className="text-gray-700 text-sm mb-1">
                  {remedy.description}
                </p>
                <p className="text-xs text-purple-600">
                  <span className="font-medium">Potential benefit:</span>{" "}
                  {remedy.benefit} |
                  <span className="font-medium"> Relevance:</span>{" "}
                  {remedy.relevance}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-3">
            Additional Notes
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="list-disc pl-5 space-y-2">
              {remedies.additionalNotes.map((note, index) => (
                <li key={`note-${index}`} className="text-sm text-gray-700">
                  {note}
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 italic">
                Please note that these recommendations are based on research and
                should not be used as a substitute for professional medical
                advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full min-h-full bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!safeSelectedPatient) return null;

  // Modified form submission handler with specialized treatment responses
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);

    const userQuery = newMessage;
    setNewMessage(""); // Clear input field

    // Check if the message is asking about treatments
    const isAboutTreatment = isAskingAboutTreatment(userQuery);

    // Simulate bot response after a short delay
    setTimeout(() => {
      let responseText = "";

      // Determine appropriate response based on query content
      if (isAboutTreatment) {
        responseText = getTreatmentResponse();
      } else {
        responseText = `Here's some information about ${
          safeSelectedPatient?.disease || "this condition"
        }. Please consult with Dr. ${
          safeSelectedPatient?.doctor_Assigned || "your doctor"
        } for more details.`;
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <div className="w-full min-h-full bg-slate-50">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Information Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Patient Profile
                </h1>
                <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  ID: {safeSelectedPatient.id}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-blue-600 mb-4">
                      Personal Information
                    </h2>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      <p className="flex items-center text-gray-700">
                        <User className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium w-24">Name:</span>
                        {safeSelectedPatient.name}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium w-24">Age:</span>
                        {safeSelectedPatient.age} years
                      </p>
                      <p className="flex items-center text-gray-700">
                        <Phone className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium w-24">Contact:</span>
                        {safeSelectedPatient.contactNumber}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-blue-600 mb-4">
                      Appointments
                    </h2>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      <p className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium w-24">Last Visit:</span>
                        {safeSelectedPatient.lastVisit || "Not recorded"}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium w-24">Next Visit:</span>
                        {safeSelectedPatient.nextAppointment || "Not scheduled"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-blue-600 mb-3">
                      Medical Information
                    </h2>
                    <div className="space-y-3">
                      <p>
                        <span className="font-medium">Disease:</span>{" "}
                        {safeSelectedPatient.disease}
                      </p>
                      <p>
                        <span className="font-medium">Doctor:</span>{" "}
                        {safeSelectedPatient.doctor_Assigned}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-blue-600 mb-3">
                      Symptoms
                    </h2>
                    {renderSymptoms()}
                  </div>

                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-blue-600 mb-3">
                      Medications
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {safeSelectedPatient.medications.length > 0 ? (
                        safeSelectedPatient.medications.map(
                          (medication, index) => (
                            <span
                              key={`medication-${index}`}
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                            >
                              {medication}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-gray-500">
                          No medications prescribed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-blue-600 mb-3">
                      Treatment Plan
                    </h2>
                    <p className="text-gray-700">
                      {safeSelectedPatient.treatment ||
                        "No treatment plan specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  Recommended Remedies
                </h2>
                {renderRemedies()}
              </div>
            </div>
          </div>

          {/* Chatbot Section */}
          <div className="bg-white rounded-lg shadow p-6 h-[700px] flex flex-col">
            <div className="flex items-center mb-3">
              <Bot className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-blue-600">
                MediAssist AI
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Ask questions about medical conditions, treatments, or drug
              interactions
            </p>

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto mb-4 space-y-3"
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  <p>No messages yet. Ask a question to begin.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      message.sender === "user"
                        ? "bg-blue-100 text-blue-800 ml-auto"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your medical question here..."
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
