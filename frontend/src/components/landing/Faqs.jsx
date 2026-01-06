import React, { useState } from "react";
import { ChevronDown, HelpCircle, Mail, MessageCircle } from "lucide-react";
import { FAQS } from "../../utils/data";

const FaqItem = ({ faq, isOpen, onClick }) => {
  return (
    <div 
      className={`group border rounded-2xl transition-all duration-300 ease-in-out ${
        isOpen 
          ? "bg-white border-blue-100 shadow-lg shadow-blue-900/5" 
          : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 cursor-pointer focus:outline-none"
      >
        <span 
          className={`text-lg font-semibold text-left transition-colors duration-300 ${
            isOpen ? "text-blue-900" : "text-gray-900"
          }`}
        >
          {faq.question}
        </span>
        
        {/* Animated Icon Container */}
        <div 
          className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
            isOpen 
              ? "bg-blue-600 border-blue-600 rotate-180" 
              : "bg-white border-gray-200 group-hover:border-gray-300"
          }`}
        >
          <ChevronDown 
            className={`w-4 h-4 transition-colors duration-300 ${
              isOpen ? "text-white" : "text-gray-500"
            }`} 
          />
        </div>
      </button>
      
      {/* Content Transition */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-0 text-gray-500 leading-relaxed">
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
};

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(0); // Default first one open
  
  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="relative py-24 bg-white overflow-hidden">
        {/* Background Grid Pattern (Consistent with Hero/Features) */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide mb-4">
                    <HelpCircle className="w-3 h-3" />
                    Help Center
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                    Frequently asked questions
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Everything you need to know about the product, billing, and technical support.
                </p>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
                {FAQS.map((faq, index) => (
                    <FaqItem
                        key={index}
                        faq={faq}
                        isOpen={openIndex === index}
                        onClick={() => handleClick(index)}
                    />
                ))}
            </div>

            {/* "Still stuck" Card */}
            <div className="mt-16 p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center">
                <div className="flex justify-center -space-x-2 mb-4">
                    {/* Fake avatars for support team */}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">JD</div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">AS</div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-xs font-bold text-green-600">MR</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Still have questions?</h3>
                <p className="text-gray-500 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                        <MessageCircle className="w-4 h-4" />
                        Chat with us
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                        <Mail className="w-4 h-4" />
                        Send an email
                    </button>
                </div>
            </div>

        </div>
    </section>
  );
};

export default Faqs;