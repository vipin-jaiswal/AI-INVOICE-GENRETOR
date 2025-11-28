import {useEffect,useState} from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2,FileText,DollarSign,Plus } from "lucide-react";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import Button from "../../components/ui/Button"

const Dashboard = () => {

  const [stats,setStats] = useState({
    totalInvoices:0,
    totalPaid:0,
    totalUnpaid:0,
  });
  const [recentInvoices,setRecentInvoices] = useState([]);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fatchDashboardData = async () => {
      try{
      const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
      const invoices = response.data;
      const totalInvoices = invoices.length;
      const totalPaid = invoices
      .filter((inv) => inv.status === "Paid")
      .reduce((acc,inv) => acc + inv.total,0);
      const totalUnpaid = invoices
      .filter((inv) => inv.status !== "Paid")
      .reduce((acc,inv) => acc + inv.total,0);
     
      setStats({
        totalInvoices,
        totalPaid,
        totalUnpaid,
      });
      setRecentInvoices(
        invoices
        .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0,5)
      );
    }catch(error){
      console.error("Error fetching dashboard data:",error);
    }finally{
      setLoading(false);
    }
    };
    fatchDashboardData();
  },[]);

  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats.totalInvoices,
      color:"blue"
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: `$${stats.totalPaid.toFixed(2)}`,
      color:"emerald",
    },
    {
      icon: DollarSign,
      label: "Total Unpaid",
      value: `$${stats.totalUnpaid.toFixed(2)}`,
      color:"red",
    },
    
  ];

const colorClasses = {
  blue:{bg:"bg-blue-100",text:"text-blue-800"},
  emerald:{bg:"bg-emerald-100",text:"text-emerald-800"},
  red:{bg:"bg-red-100",text:"text-red-800"},
};
 
if(loading){
  return (<div className="flex justify-center items-center h-full">
    <Loader2 className="animate-spin h-6 w-6 text-gray-600"/>
</div>
  );
}

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your invoice overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const colorClass = colorClasses[stat.color];
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${colorClass.bg} p-3 rounded-lg`}>
                  <Icon className={`${colorClass.text} h-6 w-6`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
          <Button onClick={() => navigate("/invoices/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/invoices/${invoice._id}`)}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice._id.slice(-8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.clientName}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${invoice.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'Paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{moment(invoice.createdAt).format('MMM DD, YYYY')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-600">No invoices yet. Create your first invoice to get started.</p>
            <Button onClick={() => navigate("/invoices/create")} className="mt-4">
              Create First Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}   
export default Dashboard;