import { useState,useEffect } from "react";
import { useNavigate,useLocation} from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Plus, Trash2 } from "lucide-react";
import moment from "moment";
import {useAuth} from "../../context/AuthContext";
import Button from "../../components/ui/Button";

const CreateInvoice = (
  { existingInvoice, onSave }
) => {

  const navigate = useNavigate();
  const location=useLocation();
  const {user}=useAuth();

  const[formDate,setFormDate]=useState(
    existingInvoice ||{
      invoiceNumber:"",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate:"",
      billFrom:{
        name:user?.businessName || "",
        email:user?.email || "",
        phone:user?.phone || "",
        address:user?.address || "",
      },
      billTo:{name:"",email:"",phone:"",address:""},
      items:[{description:"",quantity:1,unitPrice:0,taxPercent:0}],
      notes:"",
      paymentTerms:"Net 15",
    }
  );
  const [loading,setLoading]=useState(false);
  const [isGeneratingNumber,setIsGeneratingNumber]=useState(!existingInvoice);

  useEffect(()=>{
    const aiData=location.state?.aiData;
    if(aiData){
      setFormDate((prevData)=>({
        ...prevData,
        billTo:{
          name:aiData.clientName || "",
          email:aiData.clientEmail || "",
          phone:aiData.clientPhone || "",
          address:aiData.clientAddress || "",
        }
      }));
    }
    if(existingInvoice){
      setFormDate({...existingInvoice
        ,invoiceDate:moment(existingInvoice.invoiceDate).format("YYYY-MM-DD"),
        dueDate:moment(existingInvoice.dueDate).format("YYYY-MM-DD"),
      });
    } else{
      const generateInvoiceNumber=async()=>{
        setIsGeneratingNumber(true);
        try{
          const response=await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
          const invoices=response.data;
          let maxNumber=0;
          invoices.forEach((inv)=>{
            const num = parseInt(inv.invoiceNumber.split("-")[1]);
            if(!isNaN(num) && num > maxNumber) maxNumber = num;
          });
          const newInvoiceNumber=`INV-${(maxNumber + 1).toString().padStart(4,"0")}`;
          setFormDate((prev)=>({
            ...prev,
            invoiceNumber:newInvoiceNumber,
          }));
        } catch(error){
          console.error("Error generating invoice number:",error);
          setFormDate((prev)=>({ ...prev,invoiceNumber:`INV-${Date.now().toString().slice(-5)}` }));
        }
        setIsGeneratingNumber(false);
    };
    generateInvoiceNumber();
    }
  },[existingInvoice]);

  const handleInputChange=(e, section, index, field)=>{
    const { value } = e.target;
    if (section === "items") {
      const updatedItems = [...formDate.items];
      updatedItems[index][field] = field === "quantity" || field === "unitPrice" || field === "taxPercent" ? parseFloat(value) || 0 : value;
      setFormDate({ ...formDate, items: updatedItems });
    } else {
      setFormDate({
        ...formDate,
        [section]: { ...formDate[section], [field]: value },
      });
    }
  };

  const handleAddItem=()=>{
    setFormDate({ ...formDate, items:[...formDate.items,{description:"",quantity:1,unitPrice:0,taxPercent:0}] });
  }

  const handleRemoveItem=(index)=>{
    setFormDate({ ...formDate, items: formDate.items.filter((_, i) => i !== index) });
  }

  const{subtotal,taxTotal,total} = (() =>{
    let subtotal = 0, taxTotal = 0;
    formDate.items.forEach((item) => {
      const itemTotal =(item.quantity ||0)*(item.unitPrice || 0);
      subtotal += itemTotal;
      taxTotal += itemTotal * ((item.taxPercent || 0) / 100);
    });
    return {
      subtotal,
      taxTotal,
      total: subtotal + taxTotal,
    };
  })();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const invoiceData = {
        ...formDate,
        items: formDate.items.map(item => ({ ...item }))
      };
      if (existingInvoice) {
        await axiosInstance.put(`${API_PATHS.INVOICE.UPDATE_INVOICE}/${existingInvoice._id}`, invoiceData);
      } else {
        await axiosInstance.post(API_PATHS.INVOICE.CREATE_INVOICE, invoiceData);
      }
      if (onSave) {
        onSave();
      } else {
        navigate("/invoices");
      }
    } catch(error){
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{existingInvoice ? "Edit Invoice" : "Create Invoice"}</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Invoice Number</label>
            <input type="text" value={formDate.invoiceNumber} disabled className="border p-2 rounded w-full bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Invoice Date</label>
            <input type="date" value={formDate.invoiceDate} onChange={(e) => setFormDate({...formDate, invoiceDate: e.target.value})} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input type="date" value={formDate.dueDate} onChange={(e) => setFormDate({...formDate, dueDate: e.target.value})} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Terms</label>
            <input type="text" value={formDate.paymentTerms} onChange={(e) => setFormDate({...formDate, paymentTerms: e.target.value})} className="border p-2 rounded w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Bill From</h3>
            <input type="text" placeholder="Business Name" value={formDate.billFrom.name} onChange={(e) => handleInputChange(e, "billFrom", null, "name")} className="border p-2 rounded w-full mb-2" />
            <input type="email" placeholder="Email" value={formDate.billFrom.email} onChange={(e) => handleInputChange(e, "billFrom", null, "email")} className="border p-2 rounded w-full mb-2" />
            <input type="tel" placeholder="Phone" value={formDate.billFrom.phone} onChange={(e) => handleInputChange(e, "billFrom", null, "phone")} className="border p-2 rounded w-full mb-2" />
            <input type="text" placeholder="Address" value={formDate.billFrom.address} onChange={(e) => handleInputChange(e, "billFrom", null, "address")} className="border p-2 rounded w-full" />
          </div>
          <div>
            <h3 className="font-semibold mb-3">Bill To</h3>
            <input type="text" placeholder="Client Name" value={formDate.billTo.name} onChange={(e) => handleInputChange(e, "billTo", null, "name")} className="border p-2 rounded w-full mb-2" />
            <input type="email" placeholder="Email" value={formDate.billTo.email} onChange={(e) => handleInputChange(e, "billTo", null, "email")} className="border p-2 rounded w-full mb-2" />
            <input type="tel" placeholder="Phone" value={formDate.billTo.phone} onChange={(e) => handleInputChange(e, "billTo", null, "phone")} className="border p-2 rounded w-full mb-2" />
            <input type="text" placeholder="Address" value={formDate.billTo.address} onChange={(e) => handleInputChange(e, "billTo", null, "address")} className="border p-2 rounded w-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Invoice Items</h3>
            <Button onClick={handleAddItem} variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-right">Qty</th>
                  <th className="border p-2 text-right">Unit Price</th>
                  <th className="border p-2 text-right">Tax %</th>
                  <th className="border p-2 text-right">Total</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {formDate.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2"><input type="text" value={item.description} onChange={(e) => handleInputChange(e, "items", index, "description")} className="border p-1 rounded w-full" /></td>
                    <td className="border p-2"><input type="number" value={item.quantity} onChange={(e) => handleInputChange(e, "items", index, "quantity")} className="border p-1 rounded w-full text-right" /></td>
                    <td className="border p-2"><input type="number" value={item.unitPrice} onChange={(e) => handleInputChange(e, "items", index, "unitPrice")} className="border p-1 rounded w-full text-right" /></td>
                    <td className="border p-2"><input type="number" value={item.taxPercent} onChange={(e) => handleInputChange(e, "items", index, "taxPercent")} className="border p-1 rounded w-full text-right" /></td>
                    <td className="border p-2 text-right">${((item.quantity * item.unitPrice) + (item.quantity * item.unitPrice * (item.taxPercent / 100))).toFixed(2)}</td>
                    <td className="border p-2 text-center"><button type="button" onClick={() => handleRemoveItem(index)}><Trash2 className="h-4 w-4 text-red-500" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-4 text-lg font-semibold">
          <div>Subtotal: ${subtotal.toFixed(2)}</div>
          <div>Tax: ${taxTotal.toFixed(2)}</div>
          <div className="text-2xl">Total: ${total.toFixed(2)}</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea value={formDate.notes} onChange={(e) => setFormDate({...formDate, notes: e.target.value})} className="border p-2 rounded w-full" rows="3" />
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={() => navigate("/invoices")} variant="secondary">Cancel</Button>
          <Button type="submit" disabled={loading} variant="primary">
            {loading ? "Saving..." : existingInvoice ? "Update Invoice" : "Create Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;