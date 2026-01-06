import { Shield, Lock, Eye, UserCheck, Database, FileText } from "lucide-react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";

const PrivacyPolicy = () => {
  const lastUpdated = "January 4, 2026";

  const sections = [
    {
      icon: <Database className="w-6 h-6 text-blue-950" />,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you create an account, we collect information such as your name, email address, company name, and billing information. This information is necessary to provide our services and process payments."
        },
        {
          subtitle: "Invoice Data",
          text: "We collect and store invoice information you create, including customer details, invoice items, amounts, and payment status. This data is essential for the core functionality of our service."
        },
        {
          subtitle: "Usage Data",
          text: "We automatically collect information about how you interact with our service, including IP addresses, browser type, device information, and usage patterns. This helps us improve our platform and user experience."
        }
      ]
    },
    {
      icon: <Lock className="w-6 h-6 text-blue-950" />,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Delivery",
          text: "We use your information to provide, maintain, and improve our AI-powered invoicing services, including generating invoices, sending reminders, and providing insights."
        },
        {
          subtitle: "Communication",
          text: "We may use your email address to send you service-related notifications, updates, security alerts, and marketing communications (which you can opt out of at any time)."
        },
        {
          subtitle: "AI Training",
          text: "We may use aggregated and anonymized data to improve our AI models and enhance the accuracy of our invoice generation and insights features."
        },
        {
          subtitle: "Analytics",
          text: "We analyze usage patterns to understand how our service is used and to improve functionality, user experience, and develop new features."
        }
      ]
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-950" />,
      title: "Data Security",
      content: [
        {
          subtitle: "Encryption",
          text: "All data transmitted to and from our service is encrypted using industry-standard SSL/TLS protocols. Data at rest is encrypted using AES-256 encryption."
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls and authentication measures to ensure only authorized personnel can access user data, and only when necessary for support or maintenance."
        },
        {
          subtitle: "Regular Audits",
          text: "Our security practices are regularly reviewed and audited to ensure compliance with industry standards and best practices."
        }
      ]
    },
    {
      icon: <UserCheck className="w-6 h-6 text-blue-950" />,
      title: "Your Rights",
      content: [
        {
          subtitle: "Access and Export",
          text: "You have the right to access all your personal data and export it in a portable format at any time through your account settings."
        },
        {
          subtitle: "Correction",
          text: "You can update or correct your personal information at any time through your account settings or by contacting our support team."
        },
        {
          subtitle: "Deletion",
          text: "You have the right to request deletion of your account and all associated data. We will permanently delete your data within 30 days of your request."
        },
        {
          subtitle: "Opt-Out",
          text: "You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails or updating your preferences in account settings."
        }
      ]
    },
    {
      icon: <Eye className="w-6 h-6 text-blue-950" />,
      title: "Data Sharing",
      content: [
        {
          subtitle: "Third-Party Services",
          text: "We use trusted third-party service providers for payment processing, email delivery, and analytics. These providers are contractually obligated to protect your data and use it only for the services they provide to us."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law, court order, or government regulation, or if we believe such action is necessary to comply with legal obligations."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change in ownership."
        },
        {
          subtitle: "Never Sold",
          text: "We will never sell your personal information to third parties for marketing purposes. Your data belongs to you."
        }
      ]
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-950" />,
      title: "Data Retention",
      content: [
        {
          subtitle: "Active Accounts",
          text: "We retain your data for as long as your account is active and as necessary to provide our services."
        },
        {
          subtitle: "Deleted Accounts",
          text: "After account deletion, we retain certain information for a limited period to comply with legal obligations, resolve disputes, and enforce our agreements. All data is permanently deleted after 30 days."
        },
        {
          subtitle: "Backup Systems",
          text: "Data in backup systems is retained for up to 90 days and is then permanently deleted in accordance with our data retention schedule."
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 leading-tight mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
              At AI Invoice App, we take your privacy seriously. This Privacy Policy describes how we collect, use, store, and protect your personal information when you use our service. By using AI Invoice App, you agree to the collection and use of information in accordance with this policy.
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
                  {section.title}
                </h2>
              </div>
              <div className="space-y-6 ml-0 sm:ml-15">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-950 mb-2">
                      {item.subtitle}
                    </h3>
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

      {/* Cookies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-6">
            Cookies and Tracking Technologies
          </h2>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <p className="text-gray-600 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our service and store certain information. Cookies are files with small amounts of data that are sent to your browser from a website and stored on your device.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-950 p-4 mt-4">
              <p className="text-sm text-gray-700">
                <strong>Types of cookies we use:</strong> Session cookies (temporary), Persistent cookies (stored on your device), and Analytics cookies (to understand usage patterns).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Children's Privacy */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-6">
            Children's Privacy
          </h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-gray-600 leading-relaxed">
              Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us so we can take necessary action.
            </p>
          </div>
        </div>
      </section>

      {/* Changes to Policy */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-6">
            Changes to This Privacy Policy
          </h2>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <p className="text-gray-600 leading-relaxed mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. Continued use of our service after any modifications indicates your acceptance of the updated policy.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Questions About Our Privacy Policy?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            If you have any questions or concerns about this privacy policy, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="mailto:privacy@aiinvoiceapp.com"
              className="inline-block bg-white text-blue-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform"
            >
              Email: privacy@aiinvoiceapp.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
