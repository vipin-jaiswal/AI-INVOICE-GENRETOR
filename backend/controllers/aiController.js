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
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

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
      "taxPercent": "number (default 0)"
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
      model: "models/gemini-2.0-flash",
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
      total: item.quantity * item.unitPrice,
    }));

    // Calculate totals (subtotal + tax)
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
    
    // Check if it's a quota error
    let message = "Failed to parse invoice data from text.";
    let details = error.message;
    
    if (error.status === 429 || error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("quota")) {
      message = "Gemini API quota exceeded. Please try again later or use 'Generate from Model' option instead.";
      details = "Free tier API limit reached. Try the AI Model generation mode.";
    }
    
    res.status(500).json({
      message,
      details,
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
    - Amount Due: ₹${totalAmount.toFixed(2)}
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
        - Total revenue from all invoices: ₹${totalRevenue.toFixed(2)}
        - Total outstanding amount from unpaid invoices: ₹${totalOutstanding.toFixed(2)}
        - Recent invoices (last 5): ${invoices.slice(0, 5).map(inv => {
          const amount = inv.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
          return `Invoice#${inv.invoiceNumber} - ₹${amount.toFixed(2)} - Status: ${inv.status}`;
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
          model: "models/gemini-2.0-flash",
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
      insights.push(`You have ₹${totalOutstanding.toFixed(2)} outstanding. Consider sending payment reminders to speed up collection.`);
    }

    if (totalRevenue > 0) {
      insights.push(`Your total revenue is ₹${totalRevenue.toFixed(2)} from ${invoices.length} invoices.`);
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

// Generate invoice from ML model
// Deterministic random number generator based on seed
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Helper function to create invoice items consistently
function createInvoiceItems(getRandom, baseAmount, itemCount, taxPercent, preferredServices, serviceTypes) {
  const items = [];
  const itemPrices = [];
  
  // Distribute base amount across items
  let remaining = baseAmount;
  for (let i = 0; i < itemCount; i++) {
    const isLastItem = i === itemCount - 1;
    const itemPrice = isLastItem
      ? remaining
      : Math.floor(remaining / (itemCount - i));
    itemPrices.push(itemPrice);
    remaining -= itemPrice;
  }

  for (let i = 0; i < itemCount; i++) {
    const quantity = Math.floor(getRandom() * 5) + 1;
    const unitPrice = Math.floor(itemPrices[i] / quantity);
    const itemSubtotal = quantity * unitPrice;
    
    // Use the provided tax percent or default to 0
    const finalTaxPercent = taxPercent !== null ? taxPercent : 0;
    const itemTax = itemSubtotal * (finalTaxPercent / 100);
    const itemTotal = itemSubtotal + itemTax;
    
    // Use preferred service types if available
    let serviceDescription;
    if (preferredServices.length > 0) {
      serviceDescription = preferredServices[i % preferredServices.length];
    } else {
      serviceDescription = serviceTypes[Math.floor(getRandom() * serviceTypes.length)];
    }
    
    items.push({
      description: serviceDescription,
      quantity,
      unitPrice,
      taxPercent: finalTaxPercent,
      total: itemTotal,
    });
  }
  
  return items;
}

const generateInvoiceFromModel = async (req, res) => {
  try {
    const { description, clientName, clientEmail, numItems } = req.body;
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    // Extract client name from description if not provided
    let finalClientName = clientName || "Generated Client";
    
    // Only try to extract from description if clientName not explicitly provided
    if (!clientName && description) {
      const descLower = description.toLowerCase();
      // Try to extract client name from description
      const clientMatch = description.match(/(?:for|to|client:?)\s+([A-Za-z\s&.,'-]+?)(?:\s*(?:,|with|\.|:)|$)/i);
      if (clientMatch && clientMatch[1]) {
        finalClientName = clientMatch[1].trim().replace(/\s+/g, ' ');
      }
    }
    
    // Create a seed from the description to ensure consistent results
    let seed = 0;
    const inputStr = (description || "default") + finalClientName;
    for (let i = 0; i < inputStr.length; i++) {
      seed = ((seed << 5) - seed) + inputStr.charCodeAt(i);
      seed = seed & seed; // Convert to 32bit integer
    }
    
    // Create a seeded RNG function
    const getRandom = (() => {
      let currentSeed = Math.abs(seed);
      return () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
      };
    })();
    
    // Service types for realistic invoices
    const serviceTypes = [
      "Web Development",
      "UI/UX Design",
      "Mobile App Development",
      "Cloud Infrastructure Setup",
      "Database Design",
      "API Development",
      "Testing & QA",
      "DevOps Consultation",
      "Security Audit",
      "Performance Optimization",
      "Maintenance & Support",
      "Training & Documentation",
      "Code Review",
      "Architecture Design",
      "Technical Consultation"
    ];

    // Parse description for hints about tax rate and service types
    let preferredTaxRate = null;
    let preferredServices = [];
    
    if (description && description.trim()) {
      const descLower = description.toLowerCase();
      
      // Extract tax rate if mentioned
      if (descLower.includes("5% tax") || descLower.includes("5 percent")) {
        preferredTaxRate = 5;
      } else if (descLower.includes("10% tax") || descLower.includes("10 percent")) {
        preferredTaxRate = 10;
      } else if (descLower.includes("15% tax") || descLower.includes("15 percent")) {
        preferredTaxRate = 15;
      } else if (descLower.includes("no tax") || descLower.includes("0% tax")) {
        preferredTaxRate = 0;
      }
      
      // Extract service types mentioned in description
      serviceTypes.forEach(service => {
        if (descLower.includes(service.toLowerCase())) {
          preferredServices.push(service);
        }
      });
    }
    
    // Try to extract amounts from description, otherwise use generated amount
    let baseAmount = 0;
    let amountMatches = [];
    if (description) {
      amountMatches = description.match(/₹?(\d+(?:,\d{3})*(?:\.\d{2})?)/g) || [];
      if (amountMatches.length > 0) {
        baseAmount = amountMatches.reduce((sum, match) => {
          return sum + parseFloat(match.replace(/[₹,]/g, ''));
        }, 0);
      }
    }
    
    // If no amounts found in description, generate a base amount
    if (baseAmount === 0) {
      baseAmount = Math.floor(getRandom() * (9000 - 2000 + 1)) + 2000;
    }
    
    
    // Use same itemCount logic as text parsing: either from amounts found or use numItems
    let itemCount = amountMatches.length > 0 ? Math.min(amountMatches.length, 10) : Math.min(numItems || 5, 10);
    
    // Use helper function to create items consistently
    const items = createInvoiceItems(getRandom, baseAmount, itemCount, preferredTaxRate, preferredServices, serviceTypes);

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxPercent / 100), 0);
    const total = subtotal + taxTotal;
    const invoiceNumber = `INV-${Date.now()}`;

    // Create invoice
    const newInvoice = new Invoice({
      user: req.user._id,
      invoiceNumber,
      billTo: {
        name: finalClientName,
        email: clientEmail || undefined,
        address: "123 Business Street, Tech City",
        phone: "+1 (555) 123-4567",
      },
      items,
      status: "Unpaid",
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      subtotal,
      taxTotal,
      total,
    });

    await newInvoice.save();
    res.status(200).json({ invoiceId: newInvoice._id, invoice: newInvoice });
  } catch (error) {
    console.error("Error generating invoice from model:", error);
    res.status(500).json({
      message: "Failed to generate invoice from model.",
      details: error.message,
    });
  }
};

// Generate invoice from text without AI (simple parsing)
const generateInvoiceFromTextSimple = async (req, res) => {
  try {
    const { text, clientName: providedClientName } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Create a seeded random generator for consistent results from same text
    let seed = 0;
    for (let i = 0; i < text.length; i++) {
      seed = ((seed << 5) - seed) + text.charCodeAt(i);
      seed = seed & seed; // Convert to 32bit integer
    }

    const getRandom = (() => {
      let currentSeed = Math.abs(seed);
      return () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
      };
    })();

    // Simple text parsing - extract numbers and keywords
    const lines = text.split('\n').filter(line => line.trim());
    
    // Extract client name from text - try multiple patterns
    let clientName = providedClientName || "Client";
    let clientEmail = "";
    let totalAmount = 0;
    let taxPercent = 0;
    
    // Only try to extract client name from text if not provided
    if (!providedClientName) {
      // Try to extract client name from common patterns
      // Pattern 1: "Invoice for John Smith" or "Bill to ABC Corp"
      let clientMatch = text.match(/(?:invoice|bill)\s+(?:for|to)\s+([A-Za-z\s&.,'-]+?)(?:\s*(?::|,|at|email|phone)|$)/i);
      
      // Pattern 2: "Client: XYZ Company" or "Customer: John Doe"
      if (!clientMatch) {
        clientMatch = text.match(/(?:client|customer|company|name)\s*:\s*([A-Za-z\s&.,'-]+?)(?:\s*(?:,|email|phone)|$)/i);
      }
      
      // Pattern 3: First proper noun after "to" or "for"
      if (!clientMatch) {
        clientMatch = text.match(/(?:to|for)\s+([A-Z][A-Za-z\s&.,'-]+?)(?:\s*(?:,|\.|:)|$)/);
      }
      
      if (clientMatch && clientMatch[1]) {
        clientName = clientMatch[1].trim().replace(/\s+/g, ' ');
      }
    }
    
    // Parse text for tax percentage
    const taxMatch = text.match(/(\d+)\s*%\s*tax/i);
    if (taxMatch) {
      taxPercent = parseInt(taxMatch[1]);
    }
    
    // Extract amounts and services
    const amountMatches = text.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/g) || [];
    const serviceMatches = text.match(/([a-zA-Z\s]+?)(?:\s+at\s+|\s*\$|\s+for|\s+x)/gi) || [];
    
    if (amountMatches.length === 0) {
      return res.status(400).json({ 
        message: "No amounts found in text. Please include prices like '₹100' or '100'." 
      });
    }

    // Create items from extracted data
    let remainingAmount = 0;
    amountMatches.forEach((match, index) => {
      const amount = parseFloat(match.replace(/[$,]/g, ''));
      remainingAmount += amount;
    });
    
    totalAmount = remainingAmount;

    // Create realistic items
    const serviceTypes = [
      "Web Development",
      "UI/UX Design",
      "API Development",
      "Database Design",
      "Testing & QA",
      "Consulting",
      "Support & Maintenance"
    ];

    const itemCount = Math.min(amountMatches.length, 5);
    
    // Use helper function to create items consistently
    const items = createInvoiceItems(getRandom, totalAmount, itemCount, taxPercent, [], serviceTypes);

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxPercent / 100), 0);
    const total = subtotal + taxTotal;
    const invoiceNumber = `INV-${Date.now()}`;

    // Create invoice
    const newInvoice = new Invoice({
      user: req.user._id,
      invoiceNumber,
      billTo: {
        name: clientName,
        email: clientEmail || undefined,
        address: "Client Address",
        phone: undefined,
      },
      items,
      status: "Unpaid",
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotal,
      taxTotal,
      total,
    });

    await newInvoice.save();
    res.status(200).json({ invoiceId: newInvoice._id, invoice: newInvoice });
  } catch (error) {
    console.error("Error generating invoice from text:", error);
    res.status(500).json({
      message: "Failed to generate invoice from text.",
      details: error.message,
    });
  }
};

module.exports = { parseInvoiceFromText, generateReminderEmail, getDashboardSummary, generateInvoiceFromModel, generateInvoiceFromTextSimple };

