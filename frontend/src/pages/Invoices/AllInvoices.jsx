import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, Plus, Trash2, Eye } from "lucide-react";
import moment from "moment";
import Button from "../../components/ui/Button";

const AllInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
      setInvoices(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    
    try {
      await axiosInstance.delete(`${API_PATHS.INVOICE.DELETE_INVOICE}/${id}`);
      setInvoices(invoices.filter((inv) => inv._id !== id));
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Invoices App</h1>
        <Button onClick={() => navigate("/invoices/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {invoices.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Invoice ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.billTo?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${invoice.total?.toFixed(2) || "0.00"}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status === "Paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : invoice.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {invoice.status || "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {moment(invoice.dueDate).format("MMM DD, YYYY")}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-3 flex">
                      <button
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(invoice._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No invoices found. Create your first invoice to get started.</p>
          <Button onClick={() => navigate("/invoices/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllInvoices;
