import { ArrowRight, Zap } from "lucide-react";
import { FEATURES } from "../../utils/data";

const Features = () => {
  return (
    <section id="features" className="relative py-24 bg-white overflow-hidden">
      {/* Background Decor (Matching the Hero) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide mb-4">
            <Zap className="w-3 h-3" />
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            Everything you need to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              scale your finances
            </span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Stop switching between tools. We've combined invoicing, payments, and analytics 
            into one cohesive platform designed for speed.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300">
                <feature.icons className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Hover Action */}
              <div className="flex items-center text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Learn more
                <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;