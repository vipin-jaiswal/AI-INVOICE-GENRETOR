import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, Download, Edit2, Trash2, ArrowLeft } from "lucide-react";
import moment from "moment";
import Button from "../../components/ui/Button";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await axiosInstance.get(`${API_PATHS.INVOICE.GET_INVOICE}/${id}`);
      setInvoice(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching invoice:", err);
      setError("Failed to fetch invoice details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    
    try {
      await axiosInstance.delete(`${API_PATHS.INVOICE.DELETE_INVOICE}/${id}`);
      navigate("/invoices");
    } catch (err) {
      console.error("Error deleting invoice:", err);
      setError("Failed to delete invoice");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error || "Invoice not found"}
        </div>
        <button
          onClick={() => navigate("/invoices")}
          className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/invoices")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Invoices
      </button>

      <div className="bg-white rounded-lg shadow p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-8 border-b">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
            <p className="text-gray-600 mt-1">{invoice.invoiceNumber}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-2">Bill From</h3>
            <p className="font-semibold text-gray-900">{invoice.billFrom?.name}</p>
            <p className="text-gray-600">{invoice.billFrom?.email}</p>
            <p className="text-gray-600">{invoice.billFrom?.address}</p>
            <p className="text-gray-600">{invoice.billFrom?.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-2">Bill To</h3>
            <p className="font-semibold text-gray-900">{invoice.billTo?.name}</p>
            <p className="text-gray-600">{invoice.billTo?.email}</p>
            <p className="text-gray-600">{invoice.billTo?.address}</p>
            <p className="text-gray-600">{invoice.billTo?.phone}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-3 gap-8 mb-8 pb-8 border-b">
          <div>
            <p className="text-gray-600 text-sm">Invoice Date</p>
            <p className="font-semibold text-gray-900">{moment(invoice.invoiceDate).format("MMM DD, YYYY")}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Due Date</p>
            <p className="font-semibold text-gray-900">{moment(invoice.dueDate).format("MMM DD, YYYY")}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <p className={`font-semibold ${
              invoice.status === "Paid"
                ? "text-emerald-600"
                : invoice.status === "Pending"
                ? "text-yellow-600"
                : "text-red-600"
            }`}>
              {invoice.status || "Draft"}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-semibold text-gray-900">Description</th>
                <th className="text-right py-2 font-semibold text-gray-900">Quantity</th>
                <th className="text-right py-2 font-semibold text-gray-900">Unit Price</th>
                <th className="text-right py-2 font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-3 text-gray-900">{item.description}</td>
                  <td className="text-right py-3 text-gray-600">{item.quantity}</td>
                  <td className="text-right py-3 text-gray-600">${item.unitPrice?.toFixed(2)}</td>
                  <td className="text-right py-3 font-semibold text-gray-900">
                    ${(item.quantity * item.unitPrice + (item.quantity * item.unitPrice * item.taxPercent) / 100)?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-80 space-y-2">
            <div className="flex justify-between py-2 border-t">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold">${invoice.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Tax:</span>
              <span className="font-semibold">${invoice.taxTotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-gray-900">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="font-bold text-lg text-blue-600">${invoice.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8 pb-8 border-t">
            <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
            <p className="text-gray-600">{invoice.notes}</p>
          </div>
        )}

        {/* Payment Terms */}
        {invoice.paymentTerms && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600"><strong>Payment Terms:</strong> {invoice.paymentTerms}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;
