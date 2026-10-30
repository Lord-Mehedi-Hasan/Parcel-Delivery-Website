import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Search,
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Package,
  CheckCircle2,
  MapPin,
  Star,
  Zap,
  Globe,
  DollarSign,
  ChevronRight,
  Building,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState('');
  
  // Quick calculator widget state
  const [calcWeight, setCalcWeight] = useState(2);
  const [calcCategory, setCalcCategory] = useState('Parcel');
  const [calcSpeed, setCalcSpeed] = useState('Standard');
  const [calcResult, setCalcResult] = useState(null);

  // Reviews from backend
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch rate estimate
    const fetchEstimate = async () => {
      try {
        const res = await api.post('/calculator/estimate', {
          weight: calcWeight,
          deliveryType: calcSpeed,
          category: calcCategory,
        });
        if (res.data.success) {
          setCalcResult(res.data);
        }
      } catch (err) {
        console.error('Error fetching estimate', err);
      }
    };
    fetchEstimate();
  }, [calcWeight, calcSpeed, calcCategory]);

  useEffect(() => {
    // Fetch testimonials
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        if (res.data.success) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        console.error('Error fetching reviews', err);
      }
    };
    fetchReviews();
  }, []);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/track?tracking=${encodeURIComponent(trackingNumber.trim())}`);
    }
  };

  const handleQuickTrack = (trk) => {
    setTrackingNumber(trk);
    navigate(`/track?tracking=${trk}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Generation Intelligent Logistics Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Fast, Reliable & Secure <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400">
                Parcel Delivery
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Send packages across town or nationwide with real-time GPS checkpoint tracking, guaranteed delivery schedules, and digital proof of delivery.
            </p>

            {/* Tracking Input Bar */}
            <div className="max-w-2xl mx-auto pt-4">
              <form
                onSubmit={handleTrackSubmit}
                className="p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1 flex items-center pl-4">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter Tracking Number (e.g., TRK-784920)..."
                    className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Parcel</span>
                </button>
              </form>

              {/* Sample Quick Tracking Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Try live tracking codes:
                </span>
                <button
                  onClick={() => handleQuickTrack('TRK-784920')}
                  className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono transition-colors"
                >
                  TRK-784920 (Delivered)
                </button>
                <button
                  onClick={() => handleQuickTrack('TRK-552190')}
                  className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono transition-colors"
                >
                  TRK-552190 (Out for Delivery)
                </button>
                <button
                  onClick={() => handleQuickTrack('TRK-392014')}
                  className="px-2.5 py-1 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-mono transition-colors"
                >
                  TRK-392014 (In Transit)
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-orange-400">99.8%</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">On-Time Arrival</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">150,000+</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Parcels Delivered</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">45+ Min</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Instant City Pickup</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">24 / 7</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Live GPS Tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Shipping Rate Estimator Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-slate-100 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                <DollarSign className="w-3.5 h-3.5" />
                Live Rate Calculator
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Estimate Shipping Cost in Real-Time
              </h2>
              <p className="text-sm text-slate-500">
                Transparent pricing with no hidden surcharges or surprise handling fees.
              </p>
            </div>
            <Link
              to="/book"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-2"
            >
              <span>Book Parcel Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            {/* Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weight Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Package Weight
                  </label>
                  <span className="text-base font-extrabold text-orange-600">
                    {calcWeight} KG
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>0.5 kg (Document)</span>
                  <span>10 kg</span>
                  <span>25 kg</span>
                  <span>50 kg (Freight)</span>
                </div>
              </div>

              {/* Delivery Speed / Service */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Delivery Speed
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Standard', 'Express', 'Same Day'].map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setCalcSpeed(speed)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        calcSpeed === speed
                          ? 'border-orange-500 bg-orange-50/50 text-orange-900 ring-2 ring-orange-200'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <p className="text-xs font-bold">{speed}</p>
                      <p className="text-[11px] text-slate-500">
                        {speed === 'Standard' && '3-5 Days'}
                        {speed === 'Express' && '1-2 Days'}
                        {speed === 'Same Day' && 'Today by 8PM'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Package Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Document', 'Parcel', 'Electronics', 'Fragile', 'Clothing', 'Heavy Goods'].map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCalcCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          calcCategory === cat
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Rate Quote Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Estimated Quote
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Live Rates
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Freight Fee:</span>
                    <span className="font-semibold">${calcResult?.basePrice?.toFixed(2) || '5.00'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Weight Surcharge:</span>
                    <span className="font-semibold">${calcResult?.weightSurcharge?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Speed / Handling Surcharge:</span>
                    <span className="font-semibold">${calcResult?.expressSurcharge?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Tax (5%):</span>
                    <span className="font-semibold">${calcResult?.tax?.toFixed(2) || '0.25'}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-slate-800">Total Price:</span>
                    <span className="text-3xl font-black text-orange-600">
                      ${calcResult?.totalAmount?.toFixed(2) || '5.25'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Est Arrival: {calcResult?.estimatedDays || '3-5 business days'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/book')}
                className="w-full mt-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
              >
                Proceed to Book Delivery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Streamlined Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            How FastParcel Works in 4 Steps
          </h2>
          <p className="text-sm text-slate-500">
            From pickup to final delivery signature, our platform keeps you updated at every checkpoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Book Online</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fill in sender & receiver details, choose your preferred delivery speed, and generate an instant tracking code.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Doorstep Pickup</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our verified courier arrives at your location to scan and inspect your package with contactless receipt.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Real-Time Hub Scans</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Follow every movement via our live tracking timeline as your parcel transitions through automated sorting centers.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Verified Delivery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Recipients receive digital confirmation, recipient signature capture, and delivery photo proof.
            </p>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Tailored Logistics
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Enterprise & Personal Shipping Solutions
            </h2>
            <p className="text-sm text-slate-500">
              Whether you are an individual sending a gift or an e-commerce enterprise shipping thousands of orders daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-orange-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-5 shadow-md shadow-orange-500/20">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Express Domestic Courier</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Fast door-to-door delivery with standard, express, and overnight options tailored for documents and general freight.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Free package pickup from home/office
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  SMS & Email status checkpoints
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Up to $500 included liability insurance
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-orange-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-5 shadow-md shadow-amber-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Same-Day City Rush</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Critical documents, sensitive medical supplies, or urgent e-commerce packages delivered within hours across the metropolitan area.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Pickup within 45 minutes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Direct point-to-point courier dispatch
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Immediate digital signature handover
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-orange-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/20">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">E-Commerce Logistics Hub</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Automated warehousing, sorting hubs, cash on delivery (COD) reconciliation, and bulk shipment management for merchants.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Cash on Delivery (COD) collection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Automated return parcel handling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  API integrations for merchant webstores
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Client Feedback
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Trusted by Thousands of Senders
          </h2>
          <p className="text-sm text-slate-500">
            See what businesses and personal shippers say about their experience with FastParcel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.length > 0 ? (
            reviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center uppercase">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{rev.name}</h4>
                    <p className="text-[10px] text-slate-500">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3 text-slate-500 text-sm">Loading reviews...</p>
          )}
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-8 sm:p-14 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Send Your First Parcel?
            </h2>
            <p className="text-sm text-orange-100 leading-relaxed">
              Book online in under 2 minutes. Transparent rates, fast pickups, and complete tracking visibility from sender to recipient.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/book"
              className="px-8 py-3.5 rounded-xl bg-white text-orange-600 font-bold text-sm shadow-md hover:bg-orange-50 transition-colors"
            >
              Book Shipment Now
            </Link>
            <Link
              to="/track"
              className="px-8 py-3.5 rounded-xl bg-orange-700/60 hover:bg-orange-700 text-white font-semibold text-sm border border-white/20 transition-colors"
            >
              Track an Existing Parcel
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
