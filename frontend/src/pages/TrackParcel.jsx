import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import TrackingTimeline from '../components/TrackingTimeline';
import ShippingLabelModal from '../components/ShippingLabelModal';
import {
  Search,
  Package,
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  AlertCircle,
  Phone,
  User,
  ArrowRight,
} from 'lucide-react';

export default function TrackParcel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTracking = searchParams.get('tracking') || '';

  const [inputCode, setInputCode] = useState(initialTracking);
  const [loading, setLoading] = useState(false);
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);

  const fetchTracking = async (code) => {
    if (!code) return;
    setLoading(true);
    setError(null);
    setParcel(null);

    try {
      const res = await api.get(`/parcels/track/${code.trim()}`);
      if (res.data.success) {
        setParcel(res.data.parcel);
      } else {
        setError(res.data.message || 'Parcel not found');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || `No shipment found matching tracking code '${code}'.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTracking) {
      setInputCode(initialTracking);
      fetchTracking(initialTracking);
    }
  }, [initialTracking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setSearchParams({ tracking: inputCode.trim() });
      fetchTracking(inputCode.trim());
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-800 border-orange-300 animate-pulse';
      case 'In Transit':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Picked Up':
      case 'Driver Assigned':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            Live Shipment Tracker
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Track Your Consignment
          </h1>
          <p className="text-sm text-slate-500">
            Enter your unique FastParcel tracking ID below to view instant checkpoint timeline, driver dispatch info, and delivery receipts.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter Tracking ID (e.g., TRK-784920)..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm text-slate-900 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Quick test pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Test:</span>
            {['TRK-784920', 'TRK-552190', 'TRK-392014', 'TRK-902381'].map((code) => (
              <button
                key={code}
                onClick={() => {
                  setInputCode(code);
                  setSearchParams({ tracking: code });
                  fetchTracking(code);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-600">Querying live logistics network...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-900">Shipment Not Found</h3>
          <p className="text-xs text-rose-600 max-w-md mx-auto">{error}</p>
          <div className="pt-2">
            <button
              onClick={() => {
                setInputCode('TRK-784920');
                setSearchParams({ tracking: 'TRK-784920' });
                fetchTracking('TRK-784920');
              }}
              className="px-4 py-2 bg-white border border-rose-300 text-rose-700 rounded-xl text-xs font-semibold hover:bg-rose-100 transition-colors"
            >
              Load Sample Parcel TRK-784920
            </button>
          </div>
        </div>
      )}

      {/* Tracking Result View */}
      {parcel && !loading && (
        <div className="space-y-6 animate-in fade-in">
          {/* Main Status Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black font-mono text-slate-900">
                    {parcel.trackingNumber}
                  </h2>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${getStatusBadge(
                      parcel.status
                    )}`}
                  >
                    {parcel.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Booked on {new Date(parcel.createdAt).toLocaleDateString()} • {parcel.deliveryType} Delivery
                </p>
              </div>

              {/* Print / Airbill Button */}
              <button
                onClick={() => setShowLabelModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>View Shipping Label</span>
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Route Origin &rarr; Dest
                </span>
                <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {parcel.sender.city} &rarr; {parcel.recipient.city}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Est. Delivery Date
                </span>
                <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  {parcel.actualDeliveryDate
                    ? `Delivered: ${new Date(parcel.actualDeliveryDate).toLocaleDateString()}`
                    : parcel.estimatedDeliveryDate
                    ? new Date(parcel.estimatedDeliveryDate).toLocaleDateString()
                    : 'Within 48h'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Assigned Courier Driver
                </span>
                <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-500" />
                  {parcel.assignedDriver ? parcel.assignedDriver.name : 'Dispatcher Assigning'}
                </p>
                {parcel.assignedDriver && (
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Vehicle: {parcel.assignedDriver.driverInfo?.vehicleType || 'Courier'} • {parcel.assignedDriver.phone}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Sorting Hub
                </span>
                <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-purple-500" />
                  {parcel.currentBranch ? parcel.currentBranch.name : 'Regional Transit Hub'}
                </p>
              </div>
            </div>

            {/* Proof of Delivery Banner if Delivered */}
            {parcel.status === 'Delivered' && parcel.proofOfDelivery && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      Proof of Delivery Confirmed
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Signed by: <span className="font-semibold">{parcel.proofOfDelivery.recipientSignature || parcel.recipient.name}</span>
                      {parcel.proofOfDelivery.deliveryNotes && ` • "${parcel.proofOfDelivery.deliveryNotes}"`}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-emerald-600 text-white rounded-full">
                  Delivered & Signed
                </span>
              </div>
            )}
          </div>

          {/* Interactive Checkpoint Timeline & Details Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline Column */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Live Tracking Checkpoints
              </h3>

              <TrackingTimeline
                history={parcel.trackingHistory}
                currentStatus={parcel.status}
              />
            </div>

            {/* Sender / Receiver & Parcel Specs Card */}
            <div className="space-y-6">
              {/* Addresses Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Address Details
                </h4>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Sender:
                  </span>
                  <p className="text-xs font-bold text-slate-800">{parcel.sender.name}</p>
                  <p className="text-xs text-slate-600">{parcel.sender.address}</p>
                  <p className="text-xs font-semibold text-slate-700">{parcel.sender.city}</p>
                  <p className="text-xs text-slate-500">{parcel.sender.phone}</p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Recipient:
                  </span>
                  <p className="text-xs font-bold text-slate-800">{parcel.recipient.name}</p>
                  <p className="text-xs text-slate-600">{parcel.recipient.address}</p>
                  <p className="text-xs font-semibold text-slate-700">{parcel.recipient.city}</p>
                  <p className="text-xs text-slate-500">{parcel.recipient.phone}</p>
                </div>
              </div>

              {/* Package Specs Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Shipment Specs
                </h4>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Category:</span>
                    <span className="font-semibold text-slate-800">{parcel.parcelDetails?.category}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Weight:</span>
                    <span className="font-semibold text-slate-800">{parcel.parcelDetails?.weight} KG</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Declared Value:</span>
                    <span className="font-semibold text-slate-800">${parcel.parcelDetails?.declaredValue || 0}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Status:</span>
                    <span className="font-semibold text-emerald-700">{parcel.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Amount:</span>
                    <span className="font-bold text-slate-900">${parcel.cost?.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for official shipping label */}
      {showLabelModal && (
        <ShippingLabelModal
          parcel={parcel}
          onClose={() => setShowLabelModal(false)}
        />
      )}
    </div>
  );
}
