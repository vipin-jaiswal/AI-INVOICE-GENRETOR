import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, Edit, Printer, AlertCircle, Mail} from "lucide-react";
import  toast from "react-hot-toast";
import CreateInvoice from "./CreateInvoice";
import ReminderModal from "../../components/invoice/ReminderModal";
import Button from "../../components/ui/Button";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const invoiceRef = useRef(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

   
  const fetchInvoice = async () => {
    try {
      const url = `${API_PATHS.INVOICE.GET_ALL_INVOICES}/${id}`;
      console.log("Fetching invoice from:", url);
      const response = await axiosInstance.get(url);
      console.log("Invoice data received:", response.data);
      setInvoice(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching invoice:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch invoice details");
      toast.error(err.response?.data?.message || "Failed to fetch invoice details");   
    } finally {
      setLoading(false);
    }
  };


  const handleUpdate = async (formData) => {
    try {
      const response = await axiosInstance.put(`${API_PATHS.INVOICE.GET_ALL_INVOICES}/${id}`, formData);
      toast.success("Invoice updated successfully");
      setIsEditing(false);
      setInvoice(response.data);
    } catch (err) {
      console.error("Update error details:", err.response?.data || err.message || err);
      toast.error(err.response?.data?.message || "Failed to update invoice");
    }
  };


  const handlePrint = () => {
    window.print();
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }


  if ( !invoice) {
    return (
      <div className="flex flex-col item-center justify-center py-12 text-center bg-slate-50 rounded-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          {error?.includes("Not authorized") ? "Access Denied" : "Invoice Not Found"}
        </h3>
        <p className="text-slate-500 mb-2 max-w-md">
          {error || "The invoice you are looking for does not exist or could not be loaded."}
        </p>
        {error?.includes("Not authorized") && (
          <p className="text-sm text-slate-400 mb-6">You don't have permission to view this invoice. Please make sure you're logged in with the correct account.</p>
        )}
        <p className="text-xs text-slate-400 mb-6">Invoice ID: {id}</p>
        <Button onClick={() => navigate("/invoices")}>Back to Invoices</Button>
      </div>
    );
  }



  if (isEditing) {
    return <CreateInvoice existingInvoice={invoice} onSave={handleUpdate} />;
  }

  return (
    <>
      <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} invoiceId={id}/>  
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4 sm:mb-0">
          Invoice <span className="font-mono text-slate-500">{invoice.invoiceNumber}</span>
        </h1>
        <div className="flex items-center gap-2">
          {invoice.status !== "Paid" && (
             <Button variant="secondary" onClick={() => setIsReminderModalOpen(true)} icon={Mail}>Generate Reminder</Button>
          )}
          <Button variant="primary" onClick={() => setIsEditing(true)} icon={Edit}>Edit</Button>
          <Button variant="primary" onClick={handlePrint} icon={Printer}>Print Invoice</Button>
        </div>
      </div>
    </>
  );
};


export default InvoiceDetails;
