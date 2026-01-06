import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, FileText, Send, Globe } from "lucide-react";

// Helper component for section headings
const FooterHeading = ({ children }) => (
  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
    {children}
  </h3>
);

// Helper component for links (handles both React Router and external links)
const FooterLink = ({ href, to, children }) => {
  const className =
    "text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200 block py-1.5";
  
  if (to) {
    return <Link to={to} className={className}>{children}</Link>;
  }
  return <a href={href} className={className}>{children}</a>;
};

// Helper component for Social Icons
const SocialLink = ({ href, icon: Icon }) => {
  return (
    <a
      href={href}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Main Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Brand Column (Spans 2 cols on large screens) */}
          <div className="col-span-2 lg:col-span-2 pr-8">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Invoice<span className="text-blue-600">AI</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              Automating financial workflows for the next generation of business builders. 
              Simple, intelligent, and secure.
            </p>
            
            {/* Newsletter Input */}
            <div className="max-w-xs">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">Subscribe to updates</h4>
                <div className="flex gap-2">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="col-span-1">
            <FooterHeading>Product</FooterHeading>
            <ul>
              <li><FooterLink href="#features">Features</FooterLink></li>
              <li><FooterLink href="#pricing">Pricing</FooterLink></li>
              <li><FooterLink href="#api">API</FooterLink></li>
              <li><FooterLink href="#integrations">Integrations</FooterLink></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="col-span-1">
            <FooterHeading>Company</FooterHeading>
            <ul>
              <li><FooterLink to="/about">About</FooterLink></li>
              <li><FooterLink to="/blog">Blog</FooterLink></li>
              <li><FooterLink to="/careers">Careers</FooterLink></li>
              <li><FooterLink to="/contact">Contact</FooterLink></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="col-span-1">
            <FooterHeading>Legal</FooterHeading>
            <ul>
              <li><FooterLink to="/privacy">Privacy</FooterLink></li>
              <li><FooterLink to="/terms">Terms</FooterLink></li>
              <li><FooterLink to="/security">Security</FooterLink></li>
            </ul>
          </div>

          {/* Links Column 4 (Status) */}
          <div className="col-span-1">
             <FooterHeading>Status</FooterHeading>
             <div className="flex items-center gap-2 mb-4">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </div>
                <span className="text-sm font-medium text-green-600">All systems normal</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                <Globe className="w-4 h-4" />
                <span>English (US)</span>
             </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} InvoiceAI Inc. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-2">
            <SocialLink href="#" icon={Twitter} />
            <SocialLink href="#" icon={Github} />
            <SocialLink href="#" icon={Linkedin} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;