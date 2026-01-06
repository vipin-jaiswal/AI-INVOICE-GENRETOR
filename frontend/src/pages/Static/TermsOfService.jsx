import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, CreditCard } from "lucide-react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";

const TermsOfService = () => {
  const lastUpdated = "January 4, 2026";

  const sections = [
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-950" />,
      title: "Acceptance of Terms",
      content: [
        {
          text: "By accessing and using AI Invoice App ('the Service'), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service."
        },
        {
          text: "These Terms of Service constitute a legally binding agreement between you and AI Invoice App regarding your use of the Service. Your continued use of the Service will be deemed as acceptance of any updates or modifications to these terms."
        }
      ]
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-950" />,
      title: "Description of Service",
      content: [
        {
          text: "AI Invoice App provides an AI-powered platform for creating, managing, and sending invoices. Our service includes features such as automatic invoice generation from text, payment reminders, analytics, and insights."
        },
        {
          text: "We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice. We may also impose limits on certain features or restrict access to parts of the Service without notice or liability."
        }
      ]
    },
    {
      icon: <CreditCard className="w-6 h-6 text-blue-950" />,
      title: "Account Registration and Security",
      content: [
        {
          subtitle: "Account Creation",
          text: "To use our Service, you must create an account by providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials."
        },
        {
          subtitle: "Account Responsibility",
          text: "You are responsible for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security."
        },
        {
          subtitle: "Account Termination",
          text: "We reserve the right to suspend or terminate your account if you violate these Terms of Service or engage in fraudulent or illegal activities."
        }
      ]
    },
    {
      icon: <Scale className="w-6 h-6 text-blue-950" />,
      title: "User Responsibilities and Conduct",
      content: [
        {
          subtitle: "Acceptable Use",
          text: "You agree to use the Service only for lawful purposes and in accordance with these Terms. You will not use the Service to generate fraudulent invoices or engage in any illegal activities."
        },
        {
          subtitle: "Content Accuracy",
          text: "You are solely responsible for the accuracy and legality of the data and content you input into the Service, including invoice details, customer information, and payment amounts."
        },
        {
          subtitle: "Prohibited Activities",
          text: "You may not attempt to gain unauthorized access to the Service, interfere with its proper functioning, or use automated systems to access the Service without our express permission."
        }
      ]
    },
    {
      icon: <CreditCard className="w-6 h-6 text-blue-950" />,
      title: "Payment and Billing",
      content: [
        {
          subtitle: "Subscription Plans",
          text: "Access to certain features of the Service requires a paid subscription. Subscription fees are billed in advance on a monthly or annual basis, depending on your chosen plan."
        },
        {
          subtitle: "Payment Processing",
          text: "By providing payment information, you authorize us to charge your payment method for all fees incurred. All payments are processed securely through third-party payment processors."
        },
        {
          subtitle: "Refunds",
          text: "Subscription fees are non-refundable except as required by law or as explicitly stated in our refund policy. You may cancel your subscription at any time, effective at the end of the current billing period."
        },
        {
          subtitle: "Price Changes",
          text: "We reserve the right to modify our pricing at any time. We will provide advance notice of any price changes, and changes will take effect at the start of your next billing cycle."
        }
      ]
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-blue-950" />,
      title: "Intellectual Property Rights",
      content: [
        {
          subtitle: "Our Property",
          text: "The Service, including all content, features, functionality, software, and design, is owned by AI Invoice App and is protected by copyright, trademark, and other intellectual property laws."
        },
        {
          subtitle: "Your Content",
          text: "You retain all rights to the content you create using the Service, including invoices and customer data. By using the Service, you grant us a limited license to use your content solely to provide the Service."
        },
        {
          subtitle: "License to Use",
          text: "We grant you a limited, non-exclusive, non-transferable license to access and use the Service for your personal or business purposes in accordance with these Terms."
        }
      ]
    },
    {
      icon: <XCircle className="w-6 h-6 text-blue-950" />,
      title: "Disclaimers and Limitations of Liability",
      content: [
        {
          subtitle: "Service 'As Is'",
          text: "The Service is provided 'as is' and 'as available' without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free."
        },
        {
          subtitle: "AI Accuracy",
          text: "While we strive for accuracy, our AI-powered features may not always produce perfect results. You are responsible for reviewing and verifying all AI-generated content before use."
        },
        {
          subtitle: "Limitation of Liability",
          text: "To the maximum extent permitted by law, AI Invoice App shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service."
        },
        {
          subtitle: "Maximum Liability",
          text: "Our total liability to you for any claims arising from your use of the Service shall not exceed the amount you paid us in the twelve months preceding the claim."
        }
      ]
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-950" />,
      title: "Data Protection and Privacy",
      content: [
        {
          text: "Your use of the Service is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. By using the Service, you consent to our data practices as described in the Privacy Policy."
        },
        {
          text: "We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security."
        }
      ]
    },
    {
      icon: <Scale className="w-6 h-6 text-blue-950" />,
      title: "Indemnification",
      content: [
        {
          text: "You agree to indemnify, defend, and hold harmless AI Invoice App, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service, your violation of these Terms, or your violation of any rights of another party."
        }
      ]
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-blue-950" />,
      title: "Termination",
      content: [
        {
          subtitle: "By You",
          text: "You may terminate your account at any time by contacting us or using the account deletion feature in your settings. Upon termination, your right to use the Service will immediately cease."
        },
        {
          subtitle: "By Us",
          text: "We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms."
        },
        {
          subtitle: "Effect of Termination",
          text: "Upon termination, all provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability."
        }
      ]
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-950" />,
      title: "Governing Law and Dispute Resolution",
      content: [
        {
          subtitle: "Governing Law",
          text: "These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions."
        },
        {
          subtitle: "Dispute Resolution",
          text: "Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration, except that either party may seek injunctive relief in court for intellectual property infringement."
        },
        {
          subtitle: "Class Action Waiver",
          text: "You agree that any arbitration or proceeding shall be limited to the dispute between you and AI Invoice App individually. You waive any right to participate in a class action lawsuit or class-wide arbitration."
        }
      ]
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-950" />,
      title: "General Provisions",
      content: [
        {
          subtitle: "Entire Agreement",
          text: "These Terms, together with our Privacy Policy, constitute the entire agreement between you and AI Invoice App regarding the Service."
        },
        {
          subtitle: "Severability",
          text: "If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect."
        },
        {
          subtitle: "No Waiver",
          text: "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights."
        },
        {
          subtitle: "Assignment",
          text: "You may not assign or transfer these Terms or your rights under them without our prior written consent. We may assign our rights and obligations without restriction."
        }
      ]
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-950 rounded-2xl mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 leading-tight mb-6">
              Terms of Service
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Please read these terms carefully before using AI Invoice App.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed">
              Welcome to AI Invoice App. These Terms of Service ('Terms') govern your use of our website and services. By creating an account and using our platform, you agree to comply with and be bound by these Terms. Please read them carefully.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {sections.map((section, index) => (
            <div key={index} className="scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-950 rounded-lg flex items-center justify-center text-white">
                  {section.icon}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-950">
                  {index + 1}. {section.title}
                </h2>
              </div>
              <div className="space-y-4 ml-0 sm:ml-15">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-gray-50 rounded-lg p-6">
                    {item.subtitle && (
                      <h3 className="text-lg font-semibold text-blue-950 mb-2">
                        {item.subtitle}
                      </h3>
                    )}
                    <p className="text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Changes to Terms */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-6">
            Changes to These Terms
          </h2>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <p className="text-gray-600 leading-relaxed mb-4">
              We reserve the right to modify or replace these Terms at any time at our sole discretion. If we make material changes, we will provide notice by posting the updated Terms on this page and updating the "Last Updated" date.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Your continued use of the Service after any such changes constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you must stop using the Service and may terminate your account.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Questions About These Terms?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            If you have any questions about these Terms of Service, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="mailto:legal@aiinvoiceapp.com"
              className="inline-block bg-white text-blue-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform"
            >
              Email: legal@aiinvoiceapp.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
