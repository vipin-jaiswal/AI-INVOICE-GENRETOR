import { Link } from "react-router-dom";
import { FileText, Users, Target, Zap, Heart, TrendingUp } from "lucide-react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";

const AboutUs = () => {
  const values = [
    {
      icon: <Users className="w-8 h-8 text-blue-950" />,
      title: "Customer First",
      description: "We build solutions that truly solve our customers' problems and make their lives easier."
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-950" />,
      title: "Innovation",
      description: "We leverage cutting-edge AI technology to continuously improve and innovate our platform."
    },
    {
      icon: <Heart className="w-8 h-8 text-blue-950" />,
      title: "Simplicity",
      description: "Complex problems deserve simple solutions. We make invoicing effortless and intuitive."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-950" />,
      title: "Growth",
      description: "We're committed to helping small businesses grow by streamlining their financial operations."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      description: "10+ years in fintech and AI, passionate about empowering small businesses."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description: "Former AI researcher with expertise in natural language processing and automation."
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      description: "Product leader focused on creating delightful user experiences."
    },
    {
      name: "David Kim",
      role: "Head of Customer Success",
      description: "Dedicated to ensuring every customer achieves their invoicing goals."
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
              About AI Invoice App
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              We're on a mission to revolutionize invoicing for small businesses and freelancers with the power of artificial intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  AI Invoice App was born from a simple frustration: creating and managing invoices was taking too much time away from actually running a business.
                </p>
                <p>
                  In 2024, our founders came together with a vision to use artificial intelligence to solve this problem. We believed that AI could understand natural language and automatically generate professional invoices, send reminders, and provide valuable insights.
                </p>
                <p>
                  Today, thousands of businesses trust AI Invoice App to handle their invoicing needs, saving countless hours and getting paid faster.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-2xl p-8 text-white">
              <div className="space-y-8">
                <div>
                  <div className="text-5xl font-bold mb-2">10,000+</div>
                  <div className="text-blue-200">Active Users</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">500,000+</div>
                  <div className="text-blue-200">Invoices Generated</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">98%</div>
                  <div className="text-blue-200">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-blue-950 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate individuals working to make your invoicing effortless
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-950 to-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-1">{member.name}</h3>
                <p className="text-blue-950 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Invoicing?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Join thousands of businesses already using AI Invoice App
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-blue-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
