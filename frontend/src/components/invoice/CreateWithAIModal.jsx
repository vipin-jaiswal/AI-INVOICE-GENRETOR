import {useState} from "react";
import {Sparkles} from "lucide-react";
import Button  from "../ui/Button";
import TextareaField from "../ui/TextareaField";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const CreateWithAIModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState("model");
    const [text, setText] = useState("");
    const [modelDescription, setModelDescription] = useState("");
    const [clientName, setClientName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenerateFromText = async () => {
        if (!text.trim()) {
            toast.error("Please enter invoice text.");
            return;
        }

        setIsLoading(true);
        try {
            const payload = { text };
            if (clientName.trim()) payload.clientName = clientName;

            const response = await axiosInstance.post("/api/ai/parse-invoice-text-simple", payload);
            const { invoiceId } = response.data;

            toast.success("Invoice generated successfully!");
            onClose();
            setText("");
            setClientName("");
            navigate(`/invoices/${invoiceId}`);
        } catch (error) {
            console.error("Error generating invoice from text:", error);
            const errorMsg = error.response?.data?.message || error.response?.data?.details || error.message || "Failed to generate invoice";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateFromModel = async () => {
        setIsLoading(true);
        try {
            const payload = {};
            if (modelDescription.trim()) payload.description = modelDescription;
            if (clientName.trim()) payload.clientName = clientName;

            const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FROM_MODEL, payload);
            const { invoiceId } = response.data;

            toast.success("Invoice generated successfully!");
            onClose();
            setModelDescription("");
            setClientName("");
            navigate(`/invoices/${invoiceId}`);
        } catch (error) {
            console.error("Error generating invoice from model:", error);
            const errorMsg = error.response?.data?.message || error.response?.data?.details || error.message || "Failed to generate invoice";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <div className="fixed inset-0 bg-black/10 bg-opacity-50 transition-opacity" onClick={onClose}></div>
                
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative text-left transform transition-all max-h-screen overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-600"/>
                            Generate Invoice with AI
                        </h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b">
                        <button
                            onClick={() => setActiveTab("model")}
                            className={`px-4 py-2 font-medium transition ${
                                activeTab === "model"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            Generate from Model
                        </button>
                        <button
                            onClick={() => setActiveTab("text")}
                            className={`px-4 py-2 font-medium transition ${
                                activeTab === "text"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            Parse from Text
                        </button>
                    </div>

                    {/* Text Parsing Tab */}
                    {activeTab === "text" && (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600">
                                Paste invoice details (client name, items, quantities, prices) and AI will create an invoice.
                            </p>
                            <input
                                type="text"
                                placeholder="Client Name (optional)"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <TextareaField
                                name="invoiceText"
                                label="Invoice Details"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={10}
                                placeholder="e.g., 'Invoice for ABC Corp: 2 hours web development at ₹150/hr, 1 logo design for ₹500, 10% tax'"
                            />
                        </div>
                    )}

                    {/* Model Generation Tab */}
                    {activeTab === "model" && (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600">
                                Describe the invoice you want to generate. Be as specific or general as you like.
                            </p>
                            <input
                                type="text"
                                placeholder="Client Name (optional)"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <TextareaField
                                name="modelDescription"
                                label="Invoice Description"
                                value={modelDescription}
                                onChange={(e) => setModelDescription(e.target.value)}
                                rows={8}
                                placeholder="e.g., 'Web development services, API development, database design with 10% tax' or just 'Professional consulting services'"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end mt-6 space-x-3">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button 
                            onClick={activeTab === "text" ? handleGenerateFromText : handleGenerateFromModel} 
                            isLoading={isLoading}
                        >
                            {isLoading ? "Generating..." : "Generate Invoice"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateWithAIModal;