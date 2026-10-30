import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ShippingLabelModal from '../components/ShippingLabelModal';
import {
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Truck,
  DollarSign,
  Clock,
  CheckCircle2,
  Copy,
  Printer,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function BookParcel() {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderAddress: '',
    senderCity: 'New York',
    pickupInstructions: '',

    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    recipientAddress: '',
    recipientCity: 'Boston',
    deliveryInstructions: '',

    category: 'Parcel',
    weight: 2,
    length: 20,
    width: 15,
    height: 10,
    declaredValue: 50,
    description: '',

    deliveryType: 'Standard',
    paymentMethod: 'Cash on Delivery',
  });

  const [costEstimate, setCostEstimate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookedParcel, setBookedParcel] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);

  // Auto fill sender if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        senderName: prev.senderName || user.name || '',
        senderEmail: prev.senderEmail || user.email || '',
        senderPhone: prev.senderPhone || user.phone || '',
        senderAddress: prev.senderAddress || user.address?.street || '',
        senderCity: prev.senderCity || user.address?.city || 'New York',
      }));
    }
  }, [user]);

  // Recalculate cost whenever weight, category, deliveryType changes
  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await api.post('/calculator/estimate', {
          weight: formData.weight,
          deliveryType: formData.deliveryType,
          category: formData.category,
        });
        if (res.data.success) {
          setCostEstimate(res.data);
        }
      } catch (err) {
        console.error('Error calculating estimate', err);
      }
    };
    fetchEstimate();
  }, [formData.weight, formData.deliveryType, formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.senderName || !formData.senderPhone || !formData.senderAddress) {
      addToast('Please complete all required sender fields', 'error');
      return;
    }
    if (!formData.recipientName || !formData.recipientPhone || !formData.recipientAddress) {
      addToast('Please complete all required recipient fields', 'error');
      return;
    }

    setSubmitting(true);

    const payload = {
      sender: {
        name: formData.senderName,
        phone: formData.senderPhone,
        email: formData.senderEmail,
        address: formData.senderAddress,
        city: formData.senderCity,
        pickupInstructions: formData.pickupInstructions,
      },
      recipient: {
        name: formData.recipientName,
        phone: formData.recipientPhone,
        email: formData.recipientEmail,
        address: formData.recipientAddress,
        city: formData.recipientCity,
        deliveryInstructions: formData.deliveryInstructions,
      },
      parcelDetails: {
        category: formData.category,
        weight: Number(formData.weight),
        dimensions: {
          length: Number(formData.length),
          width: Number(formData.width),
          height: Number(formData.height),
        },
        declaredValue: Number(formData.declaredValue),
        description: formData.description,
      },
      deliveryType: formData.deliveryType,
      paymentMethod: formData.paymentMethod,
    };

    try {
      const res = await api.post('/parcels', payload);
      if (res.data.success) {
        setBookedParcel(res.data.parcel);
        addToast('Shipment booked successfully!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to book parcel', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyTracking = () => {
    if (bookedParcel) {
      navigator.clipboard.writeText(bookedParcel.trackingNumber);
      addToast('Tracking number copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Package className="w-3.5 h-3.5" />
          Easy Online Booking
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Book a Parcel Shipment
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Schedule contactless door-to-door courier pickup and instant real-time consignment routing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Sender Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sender (Shipper) Information</h3>
                  <p className="text-xs text-slate-500">Where our courier will collect the parcel</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sender Full Name *
                  </label>
                  <input
                    type="text"
                    name="senderName"
                    required
                    value={formData.senderName}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="senderPhone"
                    required
                    value={formData.senderPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="senderEmail"
                    required
                    value={formData.senderEmail}
                    onChange={handleChange}
                    placeholder="sarah@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pickup City *
                  </label>
                  <select
                    name="senderCity"
                    value={formData.senderCity}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="New York">New York</option>
                    <option value="Boston">Boston</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="Atlanta">Atlanta</option>
                    <option value="Chicago">Chicago</option>
                    <option value="Houston">Houston</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pickup Street Address *
                  </label>
                  <input
                    type="text"
                    name="senderAddress"
                    required
                    value={formData.senderAddress}
                    onChange={handleChange}
                    placeholder="e.g. 420 Park Ave, Apt 4B"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pickup Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="pickupInstructions"
                    value={formData.pickupInstructions}
                    onChange={handleChange}
                    placeholder="e.g. Leave with building doorman, Ring Bell 2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Recipient Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recipient (Consignee) Information</h3>
                  <p className="text-xs text-slate-500">Destination delivery location & contact</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    required
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="e.g. Emma Watson"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recipient Phone *
                  </label>
                  <input
                    type="tel"
                    name="recipientPhone"
                    required
                    value={formData.recipientPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    name="recipientEmail"
                    value={formData.recipientEmail}
                    onChange={handleChange}
                    placeholder="emma@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery City *
                  </label>
                  <select
                    name="recipientCity"
                    value={formData.recipientCity}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="Boston">Boston</option>
                    <option value="New York">New York</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="Atlanta">Atlanta</option>
                    <option value="Chicago">Chicago</option>
                    <option value="Houston">Houston</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery Street Address *
                  </label>
                  <input
                    type="text"
                    name="recipientAddress"
                    required
                    value={formData.recipientAddress}
                    onChange={handleChange}
                    placeholder="e.g. 742 Evergreen Terrace"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery Notes / Gate Code
                  </label>
                  <input
                    type="text"
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleChange}
                    placeholder="e.g. Gate Code #1234, Leave on front porch"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Parcel Details & Service Level */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Package Specs & Delivery Speed</h3>
                  <p className="text-xs text-slate-500">Weight, dimensions, contents & shipping speed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Package Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="Document">Document</option>
                    <option value="Parcel">Parcel</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fragile">Fragile Goods</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Heavy Goods">Heavy Cargo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Weight (KG) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    name="weight"
                    required
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Declared Value ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="declaredValue"
                    value={formData.declaredValue}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Package Description / Item Names
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. Ceramic tea set, winter jacket, contracts"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Delivery Speed Options */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Delivery Speed
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'Standard', name: 'Standard', time: '3-5 Days', tag: 'Economical' },
                    { id: 'Express', name: 'Express', time: '1-2 Days', tag: 'Popular' },
                    { id: 'Same Day', name: 'Same Day', time: 'Today', tag: 'Fastest' },
                    { id: 'Overnight', name: 'Overnight', time: 'Tomorrow 10AM', tag: 'Priority' },
                  ].map((speed) => (
                    <button
                      key={speed.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, deliveryType: speed.id }))}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        formData.deliveryType === speed.id
                          ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-200 text-orange-950'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {speed.tag}
                      </span>
                      <p className="font-bold text-xs mt-2">{speed.name}</p>
                      <p className="text-[11px] text-slate-500">{speed.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Payment Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Cash on Delivery', 'Credit Card', 'Online Payment'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: method }))}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                        formData.paymentMethod === method
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <span>Generating Consignment & Booking...</span>
              ) : (
                <>
                  <span>Confirm & Book Shipment (${costEstimate?.totalAmount?.toFixed(2) || '0.00'})</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Rate Summary Sidebar (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs sticky top-24 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Consignment Summary
              </h3>
              <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
                {formData.deliveryType}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Carriage Rate:</span>
                <span className="font-semibold">${costEstimate?.basePrice?.toFixed(2) || '5.00'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Weight Surcharge ({formData.weight} kg):</span>
                <span className="font-semibold">${costEstimate?.weightSurcharge?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Speed / Handling Fee:</span>
                <span className="font-semibold">${costEstimate?.expressSurcharge?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Regulatory Tax (5%):</span>
                <span className="font-semibold">${costEstimate?.tax?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-800">Total Payable:</span>
                <span className="text-2xl font-black text-orange-600">
                  ${costEstimate?.totalAmount?.toFixed(2) || '0.00'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Est. Delivery: {costEstimate?.estimatedDays || '3-5 business days'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 space-y-1.5">
              <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                What is included:
              </p>
              <p>• Doorstep pickup within 45 minutes</p>
              <p>• Unique tracking code with live updates</p>
              <p>• Digital proof of delivery upon handover</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {bookedParcel && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center animate-in zoom-in-95 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Parcel Booked Successfully!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your shipment has been registered in the FastParcel network and is queued for pickup dispatch.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Your Unique Tracking Number
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xl font-black font-mono text-orange-600">
                  {bookedParcel.trackingNumber}
                </span>
                <button
                  onClick={copyTracking}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                  title="Copy Tracking ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowLabelModal(true)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Label</span>
              </button>
              <button
                onClick={() => navigate(`/track?tracking=${bookedParcel.trackingNumber}`)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-sm"
              >
                <span>Track Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Label Modal */}
      {showLabelModal && bookedParcel && (
        <ShippingLabelModal
          parcel={bookedParcel}
          onClose={() => setShowLabelModal(false)}
        />
      )}
    </div>
  );
}
