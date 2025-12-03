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

      <div id="invoice-content-wrapper">
        <div
           ref={invoiceRef}
           id="invoice-preview"
           className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-200"
           >
            <div className="flex flex-col sm:flex-row justify-between items-start pb-8 border-b border-slate-200">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Invoice</h2>
                <p className="text-sm text-slate-500 mt-2"># {invoice.invoiceNumber}</p>
              </div>
              <div className="text-left sm:text-right mt-4 sm:mt-0">
                <p className="">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  invoice.status === "Paid"
                    ? "bg-green-100 text-green-800"
                    : invoice.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                     }`}>
                  {invoice.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Bill From</h3>
                <p className="font-semibold text-slate-800">{invoice.billFrom.name}</p>
                <p className="text-slate-600">{invoice.billFrom.address}</p>
                <p className="text-slate-600">{invoice.billFrom.email}</p>
                <p className="text-slate-600">{invoice.billFrom.phone}</p>
              </div>
              <div className="text-left sm:text-right">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Bill To</h3>
                <p className="font-semibold text-slate-800">{invoice.billTo.name}</p>
                <p className="text-slate-600">{invoice.billTo.address}</p>
                <p className="text-slate-600">{invoice.billTo.email}</p>
                <p className="text-slate-600">{invoice.billTo.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 my-8">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Invoice Date</p>
                <p className="font-semibold text-slate-800">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Due Date</p>
                <p className="font-semibold text-slate-800">{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Payment Terms</p>
                <p className="font-semibold text-slate-800">{invoice.paymentTerms}</p>
              </div>
             
            </div>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr >
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider">Item</th>
                    <th className="px-4 sm:px-6 py-3 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">Qty</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 sm:px-6 text-sm font-medium text-slate-800">{item.description}</td>
                      <td className="px-4 py-3 sm:px-6 text-center text-sm font-medium text-slate-600">{item.quantity}</td>
                      <td className="px-4 py-3 sm:px-6 text-right text-sm font-medium text-slate-600">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 sm:px-6 text-right text-sm font-medium text-slate-800">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-end mt-8 gap-4">
              <div className="w-full sm:w-1/2 lg:w-1/3">
                <div className="flex justify-between text-sm text-slate-600 mb-2">  
                  <span>Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Tax:</span>
                  <span>${invoice.taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Notes</h3>
                <p className="text-sm text-slate-600 ">{invoice.notes}</p>
              </div>
            )}
        </div>
      </div>

      <style>
        {`
        @page{
        padding :10 px;
        }
        
        @media print {
          body * {
            visibility: hidden; 
          }
            
          #invoice-context-wrapper, #invoice-content-wrapper * {
            visibility: visible;
          }

          #invoice-content-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
        }
            #invoice-preview {
              box-shadow: none;
              border: none;
              padding: 0;
              border-radius: 0;
            }
        }
        `}
      </style>
           
    </>
  );
};


export default InvoiceDetails;
