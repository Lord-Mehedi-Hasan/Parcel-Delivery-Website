import { Link } from 'react-router-dom';
import { Package, Phone, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Fast<span className="text-orange-500">Parcel</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Global express courier & parcel delivery service. Delivering seamless logistics, real-time checkpoint tracking, and reliable door-to-door delivery since 2018.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Insured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>99.8% On-Time</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-orange-400" />
                <span>ISO 9001 Certified</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/book" className="hover:text-orange-400 transition-colors">
                  Express Courier
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-orange-400 transition-colors">
                  Same-Day Delivery
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-orange-400 transition-colors">
                  Fragile & Heavy Cargo
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-orange-400 transition-colors">
                  Rate Calculator
                </Link>
              </li>
              <li>
                <Link to="/branches" className="hover:text-orange-400 transition-colors">
                  Warehousing & Hubs
                </Link>
              </li>
            </ul>
          </div>

          {/* Logistics Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Tracking & Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/track" className="hover:text-orange-400 transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link to="/branches" className="hover:text-orange-400 transition-colors">
                  Hub Locations
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-orange-400 transition-colors">
                  Driver Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-orange-400 transition-colors">
                  Admin Dispatch
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                <span>450 Express Blvd, Manhattan, NY 10001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+1 (800) 555-PARCEL</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>support@fastparcel.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FastParcel Logistics Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Carriage</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
