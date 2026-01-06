import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "../../utils/data";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Header Section --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 text-blue-600 text-xs font-bold uppercase tracking-wide mb-4">
                <Star className="w-3 h-3 fill-blue-600" />
                Wall of Love
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
                Trusted by <span className="text-blue-600">builders</span> and <span className="text-blue-600">founders</span>
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
                Join thousands of businesses who use our AI to automate their financial workflows.
            </p>
        </div>

        {/* --- Masonry Layout --- */}
        {/* 'columns' classes create the masonry effect where cards fit together vertically */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mx-auto">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={testimonial.id ?? index}
              className="break-inside-avoid relative group bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              {/* Decorative Quote Mark (Watermark style) */}
              <div className="absolute top-6 right-6 text-gray-100 group-hover:text-blue-50 transition-colors duration-300">
                <Quote className="w-10 h-10 fill-current" />
              </div>

              {/* Rating */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="relative text-gray-700 leading-relaxed mb-6 font-medium">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                <div className="relative">
                    <img
                        src={testimonial.avatar}
                        alt={`${testimonial.author} avatar`}
                        loading="lazy"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-100 transition-all"
                    />
                    {/* Online status indicator */}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">
                    {testimonial.author}
                  </span>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {testimonial.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* --- Social Proof Footer --- */}
        <div className="mt-16 text-center border-t border-gray-200 pt-10">
            <p className="text-sm text-gray-500 font-medium mb-6">TRUSTED BY TEAMS AT</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholder logos for visual context - you can replace these with SVGs */}
                <span className="text-xl font-bold text-gray-400">Acme Corp</span>
                <span className="text-xl font-bold text-gray-400">GlobalBank</span>
                <span className="text-xl font-bold text-gray-400">Starlight</span>
                <span className="text-xl font-bold text-gray-400">NextGen</span>
                <span className="text-xl font-bold text-gray-400">Umbrella</span>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;