import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/inputField";
import TextareaField from "../../components/ui/TextareaField";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "support@aiinvoiceapp.com",
      link: "mailto:support@aiinvoiceapp.com"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office",
      content: "123 Business Street, Tech City, TC 12345",
      link: null
    }
  ];

  const faqs = [
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-950" />,
      title: "Sales Inquiries",
      description: "Questions about pricing, features, or demos? Our sales team is here to help."
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-950" />,
      title: "Support Hours",
      description: "Monday - Friday: 9:00 AM - 6:00 PM EST. We respond within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-[#fbfbfb] overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[.05] bg-size-[60px_60px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 leading-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-blue-950 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-950 rounded-lg flex items-center justify-center text-white">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-950 mb-1">{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-600 hover:text-blue-950 transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-600">{info.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">{faq.icon}</div>
                    <div>
                      <h4 className="font-semibold text-blue-950 mb-1">{faq.title}</h4>
                      <p className="text-sm text-gray-600">{faq.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-blue-950 mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      label="Your Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                    <InputField
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <InputField
                    label="Subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                  />
                  
                  <TextareaField
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-2xl h-96 flex items-center justify-center text-white">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Visit Our Office</h3>
              <p className="text-blue-200">123 Business Street, Tech City, TC 12345</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses using AI Invoice App
          </p>
          <Link
            to="/signup"
            className="inline-block bg-gradient-to-r from-blue-950 to-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-200 hover:shadow-2xl transform"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
