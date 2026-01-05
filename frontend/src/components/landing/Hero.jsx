import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2, PlayCircle } from "lucide-react";
import HERO_IMAGE from "../../assets/Hero_img.png";
import { useAuth } from "../../context/AuthContext";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative bg-white overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24">
      {/* --- Background Effects --- */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100/40 rounded-[100%] blur-3xl -z-10 pointer-events-none opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-100/40 rounded-[100%] blur-3xl -z-10 pointer-events-none opacity-50"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* --- Announcement Pill --- */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            v2.0 is now live
            <span className="text-blue-300">|</span>
            <span className="flex items-center gap-1">
               See what's new <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* --- Main Headline --- */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
            Invoicing, but <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x">
              Intelligent & Effortless
            </span>
          </h1>

          {/* --- Subheadline --- */}
          <p className="text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto">
            Stop chasing payments. Let our AI draft invoices from simple text, 
            automate follow-ups, and predict your cash flow in real-time.
          </p>

          {/* --- CTA Buttons --- */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-800 hover:-translate-y-1 transition-all duration-200 shadow-lg shadow-gray-900/20"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-800 hover:-translate-y-1 transition-all duration-200 shadow-lg shadow-gray-900/20"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                Start for Free
              </Link>
            )}
            
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              <PlayCircle className="w-4 h-4 text-gray-400" />
              Watch Demo
            </a>
          </div>

          {/* --- Trust Badge / Social Proof --- */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>14-day free trial</span>
            </div>
          </div>
        </div>

        {/* --- Hero Image Section --- */}
        <div className="mt-16 sm:mt-24 relative">
            {/* Glow Effect behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-blue-500/10 blur-[100px] -z-10 rounded-full"></div>
            
            <div className="relative rounded-2xl bg-gray-900/5 p-2 sm:p-4 border border-gray-200/50 backdrop-blur-sm">
                <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-blue-900/10 bg-white border border-gray-100">
                    {/* Fake Browser Header (Optional - adds 'App' feel) */}
                    <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/60"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/60"></div>
                    </div>
                    
                    <img
                        src={HERO_IMAGE}
                        alt="AI Invoice App Dashboard Interface"
                        className="w-full h-auto"
                    />
                </div>
            </div>
            
            {/* Floating Elements (Optional decorative badges) */}
            <div className="hidden lg:block absolute -right-12 top-1/4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-bounce-slow">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <span className="font-bold">$</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Invoice Paid</p>
                        <p className="font-bold text-gray-900">$1,250.00</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;