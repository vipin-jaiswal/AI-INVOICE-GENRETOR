import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, Plus, Trash2, Eye, Edit, Search, FileText, AlertCircle, Sparkles, Mail } from "lucide-react";
import moment from "moment";
import Button from "../../components/ui/Button";
import CreateWithAIModal from "../../components/invoice/CreateWithAIModal";
import ReminderModal from "../../components/invoice/ReminderModal";


const AllInvoices = () => {

  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  


  useEffect(() => {
  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
      setInvoices(response.data.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)));
    } catch (err) {
      console.error( err);
      setError("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };
  fetchInvoices();
}, []);

  const handleDelete = async (id) => {
  
  }

  const handleStatusChange = async (invoice) => {
  };

  const handleOpenReminderModal = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminderModalOpen(true);
  }

  const filteredInvoices = invoices
    .filter(invoice => statusFilter === "All" || invoice.status === statusFilter)
    .filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.billTo.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-8 w-8 text-gray-600" /></div>
  }


  return (
    <div className="p-8">
      <CreateWithAIModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} invoiceId={selectedInvoiceId} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div >
            <h1 className="text-2xl font-semibold text-gray-800">All Invoices</h1>
            <p className="text-gray-600 mt-1">Manage all your invoices in one place</p>
          </div>  
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(true)} icon={Sparkles} >Create with AI</Button>
            <Button onClick={() => navigate("/invoices/create")} icon={Plus}>
              Create Invoice
              </Button>

          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
            </div>
          </div>
        )}

          {/* all invoices table */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <div className=" flex flex-col sm:flex-row  gap-4">
              <div className="relative grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by Invoice Number or Client Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=" w-full h-10 pl-10 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                />
              </div>
              <div className="shrink-0">
                <select
                  value={statusFilter}
                  className="w-full sm:w-auto h-10 py-2 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Unpaid</option>
                </select>
                </div>
              </div>
            </div>
            
            {filteredInvoices.length === 0 ? (
              <div className=" flex flex-col items-center justify-center py-12 text-center ">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center ">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-700">No invoices found</h3>
                <p className="text-slate-500 mb-6 max-w-md ">Your search or filter criteria did not match any invoices.try adjusting your search </p>
                {invoices.length === 0 && (
                  <Button onClick={() => navigate("/invoices/create")} icon={Plus}>
                    Create your first invoice
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-slate-50">  
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-max sm:min-w-fit">Invoice</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-max sm:min-w-fit">Client</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-max sm:min-w-fit">Amount</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-max sm:min-w-fit">Due Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-max sm:min-w-fit">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider min-w-max">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50 text-xs sm:text-sm">
                      <td onClick={()=>navigate(`/invoices/${invoice.id}`)} className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-slate-900 cursor-pointer">{invoice.invoiceNumber}</td>
                      <td onClick={()=>navigate(`/invoices/${invoice.id}`)} className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-slate-900 cursor-pointer">{invoice.billTo.clientName}</td>
                      <td onClick={()=>navigate(`/invoices/${invoice.id}`)} className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-slate-900 cursor-pointer">${invoice.total.toFixed(2)}</td>
                      <td onClick={()=>navigate(`/invoices/${invoice.id}`)} className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-slate-900 cursor-pointer">{moment(invoice.dueDate).format("MMM D, YYYY")}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === "Paid" ? "bg-green-100 text-green-800" :
                          invoice.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                          }`}>
                         {invoice.status}
                       </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex items-center justify-end gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="small"
                            variant="secondary"
                            onClick={()=> handleStatusChange(invoice)}
                            isLoading={statusChangeLoading===invoice.id}
                            >
                            {invoice.status === "Paid" ? "Unpaid" : "Paid"}
                            </Button>
                          <Button size="small" variant="ghost" onClick={() => navigate(`/invoices/${invoice.id}`)} ><Edit className="h-4 w-4"/></Button>
                          <Button size="small" variant="ghost" onClick={() => handleDelete(invoice.id)} ><Trash2 className="h-4 w-4 text-red-500"/></Button>
                          {invoice.status !== "Paid" && (
                            <Button size="small" variant="ghost" onClick={() => handleOpenReminderModal(invoice.id)} title="Generate Reminder" ><Mail className="h-4 w-4 text-blue-500"/></Button>
                          )}
                        </div>
                      </td>                 
                    </tr>
                  ))}
                </tbody>     
                </table>
                </div>
              )} 
          </div>
        </div>
  );
};

export default AllInvoices;
