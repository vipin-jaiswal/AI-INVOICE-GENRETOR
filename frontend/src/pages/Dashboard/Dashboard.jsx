import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, FileText, DollarSign, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "../../components/ui/Button";
import AlInsightsCard from "../../components/AlInsightsCard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fatchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );
        const invoices = response.data;
        const totalInvoices = invoices.length;
        
        // Helper function to safely get invoice total
        const getInvoiceTotal = (invoice) => {
          // First try invoice.total
          if (invoice.total && typeof invoice.total === 'number') {
            return invoice.total;
          }
          
          // Fallback: calculate from items
          if (invoice.items && Array.isArray(invoice.items)) {
            return invoice.items.reduce((sum, item) => {
              const lineTotal = (item.unitPrice || 0) * (item.quantity || 0);
              const tax = lineTotal * ((item.taxPercent || 0) / 100);
              return sum + lineTotal + tax;
            }, 0);
          }
          
          return 0;
        };
        
        const totalPaid = invoices
          .filter((inv) => inv.status?.toLowerCase() === "paid")
          .reduce((acc, inv) => acc + getInvoiceTotal(inv), 0);
        
        const totalUnpaid = invoices
          .filter((inv) => inv.status?.toLowerCase() !== "paid")
          .reduce((acc, inv) => acc + getInvoiceTotal(inv), 0);

        setStats({
          totalInvoices,
          totalPaid,
          totalUnpaid,
        });
        setRecentInvoices(
          invoices
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fatchDashboardData();
  }, []);

  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats.totalInvoices,
      color: "blue",
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: `$${stats.totalPaid.toFixed(2)}`,
      color: "emerald",
    },
    {
      icon: DollarSign,
      label: "Total Unpaid",
      value: `$${stats.totalUnpaid.toFixed(2)}`,
      color: "red",
    },
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-800" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-800" },
    red: { bg: "bg-red-100", text: "text-red-800" },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="p-8 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's your invoice overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const colorClass = colorClasses[stat.color];
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${colorClass.bg} p-3 rounded-lg`}>
                  <Icon className={`${colorClass.text} h-6 w-6`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <AlInsightsCard/>
      </div>

      {/* recent invoices */}
      <div className="w-full bg-white border border-slate-200 rounded-lg shadow-sm shadow-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
          <Button variant="secondary" onClick={() => navigate("/invoices")}>
            View ALL
          </Button>
        </div>
        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto w-[90vh] md:w-auto">
            <table className="w-full min-w-[600px] divide-y divide-slate-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentInvoices.map((invoice) => {
                  const invoiceTotal = invoice.total && typeof invoice.total === 'number' ? invoice.total :
                    (invoice.items?.reduce((sum, item) => {
                      const lineTotal = (item.unitPrice || 0) * (item.quantity || 0);
                      const tax = lineTotal * ((item.taxPercent || 0) / 100);
                      return sum + lineTotal + tax;
                    }, 0) || 0);
                  
                  return (
                  <tr
                    key={invoice._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm font-medium text-gray-900">
                       {invoice.billTo?.name || "N/A"}
                       </div>
                     <div className="text-xs text-gray-400">
                       {invoice.invoiceNumber}
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${invoiceTotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status?.toLowerCase() === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : invoice.status?.toLowerCase() === "unpaid"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {moment(invoice.dueDate).format("MMM DD, YYYY")}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
         <div className="flex flex-col justify-center items-center text-center py-12">
           <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
             <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400 " />  
             </div>
             <h3 className="text-lg font-medium">
                No recent invoices found.
              </h3>
              <p className="text-slate-500 mb-6 max-w-md">
                You haven't created any invoices yet. Get started by creating your first invoice.
              </p>
              <Button
                onClick={() => navigate("/invoices/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
         </div> 
        )}  
      </div>
    </div>
  );
};
export default Dashboard;
