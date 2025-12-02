const { GoogleGenAI } = require("@google/genai");
const Invoice = require("../models/Invoice");

// Initialize the AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Parse invoice from text
const parseInvoiceFromText = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    const prompt = `You are an expert invoice data extraction AI. Analyze the following text and extract the relevant information to create an invoice.
The output must be a valid JSON object.

The JSON object should have the following structure:
{
  "billTo": {
    "businessName": "string",
    "email": "string (if available)",
    "address": "string (if available)",
    "phone": "string (if available)"
  },
  "items": [
    {
      "name": "string",
      "quantity": "number",
      "unitPrice": "number",
      "taxPercent": "number (default 0)",
      "total": "number (quantity * unitPrice * (1 + taxPercent/100))"
    }
  ]
}

Here is the text to parse:
--- TEXT START ---
${text}
--- TEXT END ---
Provide only the JSON object.`;

    // Call the AI model
    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    // Extract the generated text correctly
    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error("No content returned from AI model.");
    }

    // Clean any formatting like ```json
    const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse JSON
    const parsedData = JSON.parse(cleanedJson);

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    // Transform items to match schema (name -> description)
    const transformedItems = parsedData.items.map(item => ({
      description: item.name || item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxPercent: item.taxPercent || 0,
      total: item.total || (item.quantity * item.unitPrice * (1 + (item.taxPercent || 0) / 100)),
    }));

    // Calculate totals
    const subtotal = transformedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxTotal = transformedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxPercent / 100), 0);
    const total = subtotal + taxTotal;

    // Create and save the invoice
    const newInvoice = new Invoice({
      user: req.user._id,
      invoiceNumber,
      billTo: {
        name: parsedData.billTo?.businessName || "Client",
        email: parsedData.billTo?.email,
        address: parsedData.billTo?.address,
        phone: parsedData.billTo?.phone,
      },
      items: transformedItems,
      status: "Unpaid",
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      subtotal,
      taxTotal,
      total,
    });

    await newInvoice.save();

    res.status(200).json({ invoiceId: newInvoice._id });
  } catch (error) {
    console.error("Error parsing invoice with AI:", error);
    res.status(500).json({
      message: "Failed to parse invoice data from text.",
      details: error.message,
    });
  }
};

// Generate reminder email
const generateReminderEmail = async (req, res) => {
  const { invoiceId } = req.body;

  if (!invoiceId) {
    return res.status(400).json({ message: "Invoice ID is required" });
  }

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Calculate total amount from items
    const totalAmount = invoice.items?.reduce((sum, item) => {
      return sum + (item.total || item.quantity * item.unitPrice);
    }, 0) || invoice.totalAmount || 0;

    const clientName = invoice.billTo?.businessName || "Valued Client";
    const invoiceNumber = invoice.invoiceNumber || invoice._id;

    const prompt = `You are a professional and polite accountant. Write a friendly reminder email to a client about an overdue or upcoming invoice.

    Use the following invoice details to personalize the email:

    - Client Name: ${clientName}
    - Invoice Number: ${invoiceNumber}
    - Amount Due: $${totalAmount.toFixed(2)}
    - Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Not specified'}

    The tone should be friendly but clear. Keep it concise. Start the email with "Subject:".`;

    // Call the AI model
    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    // Extract the generated text correctly
    const reminderText = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reminderText) {
      throw new Error("No content returned from AI model.");
    }

    res.status(200).json({ reminderText });
  } catch (error) {
    console.error("Error generating reminder email with AI:", error);
    res.status(500).json({
      message: "Failed to generate reminder email.",
      details: error.message,
    });
  }
};

// Get dashboard summary
const getDashboardSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id });

    if (invoices.length === 0) {
      return res.status(200).json({ insights: ["No invoices available yet. Start by creating your first invoice!"] });
    }

    // Calculate totals correctly from items
    const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
    const unpaidInvoices = invoices.filter(inv => inv.status === 'Unpaid');
    
    const totalRevenue = invoices.reduce((sum, inv) => {
      const amount = inv.items?.reduce((itemSum, item) => itemSum + (item.total || 0), 0) || 0;
      return sum + amount;
    }, 0);

    const totalOutstanding = unpaidInvoices.reduce((sum, inv) => {
      const amount = inv.items?.reduce((itemSum, item) => itemSum + (item.total || 0), 0) || 0;
      return sum + amount;
    }, 0);

    const insights = [];

    // Generate insights without AI if API is not available
    try {
      if (process.env.GEMINI_API_KEY) {
        const dataSummary = `
        - Total number of invoices: ${invoices.length}
        - Total paid invoices: ${paidInvoices.length}
        - Total unpaid/pending invoices: ${unpaidInvoices.length}
        - Total revenue from all invoices: $${totalRevenue.toFixed(2)}
        - Total outstanding amount from unpaid invoices: $${totalOutstanding.toFixed(2)}
        - Recent invoices (last 5): ${invoices.slice(0, 5).map(inv => {
          const amount = inv.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
          return `Invoice#${inv.invoiceNumber} - $${amount.toFixed(2)} - Status: ${inv.status}`;
        }).join(', ')}
        `;

        const prompt = `You are a friendly and insightful business analyst for a small business owner. 
        Based on the following invoice data summary, provide 2-3 concise and insightful observations.
        Each insight should be a short string in a JSON array.
        The insights should be encouraging and helpful. Do not just repeat the data.
        For example: if there is high outstanding amount, suggest sending reminders; if revenue is high, be encouraging.

        Data Summary:
        ${dataSummary}

        Return your response as a JSON object with a single key "insights" containing an array of strings.
        Example format: { "insights": [ "Your revenue is looking strong this month", "You have 5 overdue invoices. Consider sending reminders to get paid faster." ] }`;

        // Call the AI model
        const response = await ai.models.generateContent({
          model: "models/gemini-2.5-flash",
          contents: prompt,
        });

        // Extract the generated text correctly
        const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
        const responseTextCleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedData = JSON.parse(responseTextCleaned);

        return res.status(200).json(parsedData);
      }
    } catch (aiError) {
      console.warn("AI model not available, using fallback insights:", aiError.message);
    }

    // Fallback: Generate insights locally
    if (paidInvoices.length > 0) {
      const paymentRate = ((paidInvoices.length / invoices.length) * 100).toFixed(0);
      insights.push(`Great! You have ${paymentRate}% payment completion rate (${paidInvoices.length} of ${invoices.length} invoices paid).`);
    }

    if (totalOutstanding > 0) {
      insights.push(`You have $${totalOutstanding.toFixed(2)} outstanding. Consider sending payment reminders to speed up collection.`);
    }

    if (totalRevenue > 0) {
      insights.push(`Your total revenue is $${totalRevenue.toFixed(2)} from ${invoices.length} invoices.`);
    }

    if (insights.length === 0) {
      insights.push("Keep creating invoices to get more detailed insights about your business.");
    }

    res.status(200).json({ insights });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard summary.",
      details: error.message,
    });
  }
};

module.exports = { parseInvoiceFromText, generateReminderEmail, getDashboardSummary };
