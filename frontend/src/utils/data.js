import { Sparkles, BarChart2, Mail, FileText, QrCode, LayoutDashboard,Plus,Users } from "lucide-react";


export const FEATURES = [
  {
    icons: Sparkles,
    title: "AI-Powered Invoice Generation",
    description:
      "Paste any text, email or receipt, and let our AI instantly generate a complete, accurate invoice for you."
  },
  {
    icons: BarChart2,
    title: "AI-Powered Dashboard",
    description:
      "Get smart, actionable insights about your business finances, generated automatically by our AI analysts."
  },
  {
    icons: Mail,
    title: "Automated Reminders",
    description:
      "Automatically generate polite and effective payment reminder emails for overdue invoices with a single click."
  },
  {
    icons: FileText,
    title: "Easy Invoice Management",
    description:
      "Easily manage all your invoices, track payments, and reminders for overdue payments."
  }
];

export const TESTIMONIALS = [
  {
    quote: "This app saved me hours of work. I can now create and send invoices in minutes",
    author: "Vipin Jaiswal",
    title: "Freelance Designer",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=VP"
  },
  {
    quote: "The best invoicing app I have ever used. Simple, intuitive, and powerful",
    author: "John Doe",
    title: "Small Business Owner",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=JD"
  },
  {
    quote: "I love the dashboard and reporting features. It helps me keep track of my finances",
    author: "Peter Jones",
    title: "Consultant",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=PJ"
  }
];

export const FAQS =[
    {
        question:"How does the AI invoicing creation work",
        answer:"AI invoice creation automates the end-to-end process of generating and processing invoices using artificial intelligence "
    },
    {
        question:"Is there a free trial available",
        answer:"Yes, free trials or free-to-use AI invoice generators are available."
    },
    {
        question:"Can I change my plan later?",
        answer:"Yes, you can change your plan later. Many AI invoicing tools, such as Invoicer.ai and Simplified, allow you to upgrade, downgrade, or pause your subscription at any time"
    },
    { question:"What is your cancellation policy?",
        answer:"Cancellation policies vary by provider, but many AI invoice tools allow you to cancel or modify your subscription at any time"
    },
    { 
        question:"Can other into be added to an invoice?",
        answer:"Yes, you can add other information to an invoice using custom fields, header/footer text, or item-specific details, depending on the invoicing platform"
    },
    { 
        question:"How does billing work?",
        answer:"Billing is the process by which a business generates and sends an invoice to a customer for goods or services provided, requesting payment"
    }
    
];

export const NAVIGETION_MENU = [
    {id:"dashboard", name:"Dashboard",icon: LayoutDashboard},
    {id:"invoices", name:"Invoices",icon: FileText},
    {id:"invoices/create",name:"Create Invoice",icon: Plus},
    {id:"profile", name:"Profile", icon: Users},
];