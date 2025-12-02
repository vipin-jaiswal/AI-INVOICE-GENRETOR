const Invoice = require ("../models/Invoice");

//@desc Create new Invoice 
//@route POST / api/invoice
//@ access Private
exports.createInvoice = async (req, res) => 
  {
  try {
    const {
      invoiceNumber,
      invoiceDate,     // fixed typo
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
    } = req.body;

    // Parse dates - handle both DD-MM-YYYY and YYYY-MM-DD formats
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      
      // If it's already a Date object, validate it
      if (dateStr instanceof Date) {
        if (isNaN(dateStr.getTime())) return null; // Invalid date
        return dateStr;
      }
      
      // Convert to string if not already
      const str = String(dateStr).trim();
      
      // Try YYYY-MM-DD format (from HTML date input)
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        const date = new Date(str + 'T00:00:00Z');
        return isNaN(date.getTime()) ? null : date;
      }
      
      // Try DD-MM-YYYY format (from moment formatting)
      if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
        const [day, month, year] = str.split('-');
        const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
        return isNaN(date.getTime()) ? null : date;
      }
      
      // Fallback to Date parsing
      const date = new Date(str);
      return isNaN(date.getTime()) ? null : date;
    };

    let parsedInvoiceDate = parseDate(invoiceDate);
    let parsedDueDate = parseDate(dueDate);

    // Calculate subtotal & tax
    let subtotal = 0;
    let taxTotal = 0;

    const itemsWithTotals = items.map(item => {
      const lineTotal = item.unitPrice * item.quantity;
      const lineTax = (lineTotal * (item.taxPercent || 0)) / 100;
      subtotal += lineTotal;
      taxTotal += lineTax;
      
      return {
        ...item,
        total: lineTotal + lineTax
      };
    });

    const total = subtotal + taxTotal;

    const invoice = await Invoice.create({
      user: req.user._id,
      invoiceNumber,
      invoiceDate: parsedInvoiceDate,
      dueDate: parsedDueDate,
      billFrom,      // fixed field name
      billTo,
      items: itemsWithTotals,
      notes,
      paymentTerms,
      subtotal,
      taxTotal,
      total,
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Create invoice error:", error);
    res.status(500).json({ message: "Error creating invoice", error: error.message });
  }
};

//@desc Get all invoice of logged-in user
//@route GET / api/invoice
//@ access Private
exports.getInvoices =async(req,res) =>{
    try{
        const invoices =await Invoice.find({ user: req.user._id }).populate("user","name email");
        res.json(invoices);

     } catch(error){
        res
         .status(500)
         .json({message: "Error fetching invoice", error: error.message});
     }
}

//@desc Get single invoice by ID 
//@route GET / api/invoice/:id
//@ access Private
exports.getInvoiceById =async (req,res) => {
    try{
        const invoice =await Invoice.findById(req.params.id).populate("user","name email");
        if(!invoice) return res.status(404).json({message: "Invoice not found"});

        if(invoice.user._id.toString() !== req.user._id.toString()){
          return res.status(403).json({message: "Not authorized to view this invoice"});
        }

        res.json(invoice);
     } catch(error){
        res
         .status(500)
         .json({message: "Error fetching invoice", error: error.message});
     }
};

//@desc Update invoice 
//@route PUT / api/invoice/:id
//@ access Private
exports.updateInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      status,
    } = req.body;

    // Parse dates - handle both DD-MM-YYYY and YYYY-MM-DD formats
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      
      // If it's already a Date object, validate it
      if (dateStr instanceof Date) {
        if (isNaN(dateStr.getTime())) return null; // Invalid date
        return dateStr;
      }
      
      // Convert to string if not already
      const str = String(dateStr).trim();
      
      // Try YYYY-MM-DD format (from HTML date input)
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        const date = new Date(str + 'T00:00:00Z');
        return isNaN(date.getTime()) ? null : date;
      }
      
      // Try DD-MM-YYYY format (from moment formatting)
      if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
        const [day, month, year] = str.split('-');
        const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
        return isNaN(date.getTime()) ? null : date;
      }
      
      // Fallback to Date parsing
      const date = new Date(str);
      return isNaN(date.getTime()) ? null : date;
    };

    let parsedInvoiceDate = parseDate(invoiceDate);
    let parsedDueDate = parseDate(dueDate);

    // Recalculate totals only if items are sent
    let updateData = {
      invoiceNumber,
      invoiceDate: parsedInvoiceDate,
      dueDate: parsedDueDate,
      billFrom,
      billTo,
      notes,
      paymentTerms,
      status,
    };

    if (items && Array.isArray(items)) {
      let subtotal = 0;
      let taxTotal = 0;

      const itemsWithTotals = items.map(item => {
        const lineTotal = item.unitPrice * item.quantity;
        const lineTax = (lineTotal * (item.taxPercent || 0)) / 100;
        subtotal += lineTotal;
        taxTotal += lineTax;
        
        return {
          ...item,
          total: lineTotal + lineTax
        };
      });

      updateData.items = itemsWithTotals;
      updateData.subtotal = subtotal;
      updateData.taxTotal = taxTotal;
      updateData.total = subtotal + taxTotal;
    }

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },  // Security: only owner can update
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found or not authorized" });
    }

    res.json(updatedInvoice);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc Delete invoice 
//@route DELETE / api/invoice/:id
//@ access Private
exports.deleteInvoice =async (req,res) => {
    try{
        const invoice = await Invoice.findById(req.params.id);
        if(!invoice) return res.status(404).json({message: "Invoice not found"});
        
        if(invoice.user.toString() !== req.user._id.toString()){
          return res.status(403).json({message: "Not authorized to delete this invoice"});
        }

        await Invoice.findByIdAndDelete(req.params.id);
        
        res.json({ message: "Invoice deleted successfully", invoice });
     } catch(error){
        res
         .status(500)
         .json({message: "Error deleting invoice", error: error.message});
     }
};