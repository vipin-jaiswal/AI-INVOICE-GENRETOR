import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Plus, Trash2 } from "lucide-react";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";

import InputField from "../../components/ui/inputField";
import TextAreaField from "../../components/ui/TextareaField";
import SelectField from "../../components/ui/SelectField";

const CreateInvoice = ({ existingInvoice, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [formDate, setFormDate] = useState(
    existingInvoice || {
      invoiceNumber: "",
      invoiceDate: moment().format("DD-MM-YYYY"),
      dueDate: "",
      billFrom: {
        name: user?.businessName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
      },
      billTo: { name: "", email: "", phone: "", address: "" },
      items: [{ description: "", quantity: 1, unitPrice: 0, taxPercent: 0 }],
      notes: "",
      paymentTerms: "Net 15",
    }
  );
  const [loading, setLoading] = useState(false);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(
    !existingInvoice
  );

  useEffect(() => {
    const aiData = location.state?.aiData;
    if (aiData) {
      setFormDate((prevData) => ({
        ...prevData,
        billTo: {
          name: aiData.clientName || "",
          email: aiData.clientEmail || "",
          phone: aiData.clientPhone || "",
          address: aiData.clientAddress || "",
        },
      }));
    }
    if (existingInvoice) {
      setFormDate({
        ...existingInvoice,
        invoiceDate: moment(existingInvoice.invoiceDate).format("DD-MM-YYYY"),
        dueDate: moment(existingInvoice.dueDate).format("DD-MM-YYYY"),
      });
    } else {
      const generateInvoiceNumber = async () => {
        setIsGeneratingNumber(true);
        try {
          const response = await axiosInstance.get(
            API_PATHS.INVOICE.GET_ALL_INVOICES
          );
          const invoices = response.data;
          let maxNumber = 0;
          invoices.forEach((inv) => {
            const num = parseInt(inv.invoiceNumber.split("-")[1]);
            if (!isNaN(num) && num > maxNumber) maxNumber = num;
          });
          const newInvoiceNumber = `INV-${(maxNumber + 1)
            .toString()
            .padStart(4, "0")}`;
          setFormDate((prev) => ({
            ...prev,
            invoiceNumber: newInvoiceNumber,
          }));
        } catch (error) {
          console.error("Error generating invoice number:", error);
          setFormDate((prev) => ({
            ...prev,
            invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
          }));
        }
        setIsGeneratingNumber(false);
      };
      generateInvoiceNumber();
    }
  }, [existingInvoice]);

  const handleInputChange = (e, section, index, field) => {
    const { value } = e.target;
    if (section === "items") {
      const updatedItems = [...formDate.items];
      updatedItems[index][field] =
        field === "quantity" || field === "unitPrice" || field === "taxPercent"
          ? parseFloat(value) || 0
          : value;
      setFormDate({ ...formDate, items: updatedItems });
    } else {
      setFormDate({
        ...formDate,
        [section]: { ...formDate[section], [field]: value },
      });
    }
  };

  const handleAddItem = () => {
    setFormDate({
      ...formDate,
      items: [
        ...formDate.items,
        { description: "", quantity: 1, unitPrice: 0, taxPercent: 0 },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    setFormDate({
      ...formDate,
      items: formDate.items.filter((_, i) => i !== index),
    });
  };

  const { subtotal, taxTotal, total } = (() => {
    let subtotal = 0,
      taxTotal = 0;
    formDate.items.forEach((item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      subtotal += itemTotal;
      taxTotal += itemTotal * ((item.taxPercent || 0) / 100);
    });
    return {
      subtotal,
      taxTotal,
      total: subtotal + taxTotal,
    };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const invoiceData = {
        ...formDate,
        items: formDate.items.map((item) => ({ ...item })),
      };
      if (existingInvoice) {
        await axiosInstance.put(
          `${API_PATHS.INVOICE.UPDATE_INVOICE}/${existingInvoice._id}`,
          invoiceData
        );
      } else {
        await axiosInstance.post(API_PATHS.INVOICE.CREATE_INVOICE, invoiceData);
      }
      if (onSave) {
        onSave();
      } else {
        navigate("/invoices");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-[100vh]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {existingInvoice ? "Edit Invoice" : "Create Invoice"}
        </h2>
        <Button type="submit" isLoading={loading || isGeneratingNumber}>
          {existingInvoice ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Invoice Number</label>
            <input type="text" value={formDate.invoiceNumber} disabled className="border p-2 rounded w-full bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Invoice Date</label>
            <input 
              type="date" 
              value={moment(formDate.invoiceDate, "DD-MM-YYYY").format("YYYY-MM-DD")} 
              onChange={(e) => {
                const dateObj = moment(e.target.value, "YYYY-MM-DD");
                setFormDate({...formDate, invoiceDate: dateObj.format("DD-MM-YYYY")});
              }} 
              className="border p-2 rounded w-full" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input 
              type="date" 
              value={moment(formDate.dueDate, "DD-MM-YYYY").isValid() ? moment(formDate.dueDate, "DD-MM-YYYY").format("YYYY-MM-DD") : ""} 
              onChange={(e) => {
                const dateObj = moment(e.target.value, "YYYY-MM-DD");
                setFormDate({...formDate, dueDate: dateObj.format("DD-MM-YYYY")});
              }} 
              className="border p-2 rounded w-full" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Bill From</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input type="text" value={formDate.billFrom.name} onChange={(e) => handleInputChange(e, "billFrom", null, "name")} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={formDate.billFrom.email} onChange={(e) => handleInputChange(e, "billFrom", null, "email")} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" value={formDate.billFrom.phone} onChange={(e) => handleInputChange(e, "billFrom", null, "phone")} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea value={formDate.billFrom.address} onChange={(e) => handleInputChange(e, "billFrom", null, "address")} className="border p-2 rounded w-full" rows="2" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Bill To</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Client Name</label>
            <input type="text" value={formDate.billTo.name} onChange={(e) => handleInputChange(e, "billTo", null, "name")} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Client Email</label>
            <input type="email" value={formDate.billTo.email} onChange={(e) => handleInputChange(e, "billTo", null, "email")} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Client Phone</label>
            <input type="tel" value={formDate.billTo.phone} onChange={(e) => handleInputChange(e, "billTo", null, "phone")} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Client Address</label>
            <textarea value={formDate.billTo.address} onChange={(e) => handleInputChange(e, "billTo", null, "address")} className="border p-2 rounded w-full" rows="2" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm  shadow-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold">Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-2 sm:ps-6py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-2 sm:ps-6py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-2 sm:ps-6py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-2 sm:ps-6py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-2 sm:ps-6py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-2 sm:ps-6py-3 "></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formDate.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-2 sm:ps-6 py-4">
                    <input
                      type="text"
                      name="description"
                      value={item.description}
                      onChange={(e) =>
                        handleInputChange(e, "items", index, "description")
                      }
                      className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Item Name"
                    />
                  </td>
                  <td className="px-2 sm:ps-6 py-4">
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        handleInputChange(e, "items", index, "quantity")
                      }
                      className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </td>
                  <td className="px-2 sm:ps-6 py-4">
                    <input
                      type="number"
                      name="unitPrice"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleInputChange(e, "items", index, "unitPrice")
                      }
                      className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-2 sm:ps-6 py-4">
                    <input
                      type="number"
                      name="taxPercent"
                      value={item.taxPercent}
                      onChange={(e) =>
                        handleInputChange(e, "items", index, "taxPercent")
                      }
                      className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0%"
                    />
                  </td>
                  <td className=" px-2 sm:ps-6 py-4 font-semibold text-gray-900">
                    $
                    {(
                      (item.quantity || 0) *
                      (item.unitPrice || 0) *
                      (1 + (item.taxPercent || 0) / 100)
                    ).toFixed(2)}
                  </td>
                  <td className="px-2 sm:ps-6 py-4 text-right">
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddItem}
            icon={Plus}
          >
            Add Item
          </Button>
        </div>
      </div>

      
    </form>
  );
};
export default CreateInvoice;
