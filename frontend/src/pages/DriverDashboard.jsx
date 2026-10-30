import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Power,
  Package,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DriverDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('active'); // 'active' or 'completed'
  const [loading, setLoading] = useState(true);

  // Status Update Modal State
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [newStatus, setNewStatus] = useState('In Transit');
  const [statusNotes, setStatusNotes] = useState('');
  const [recipientSignature, setRecipientSignature] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/driver/deliveries?filter=${filter}`);
      if (res.data.success) {
        setDeliveries(res.data.deliveries);
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load driver tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [filter]);

  const handleToggleAvailability = async () => {
    try {
      const res = await api.put('/driver/availability');
      if (res.data.success) {
        addToast(res.data.message, 'info');
        fetchDeliveries();
      }
    } catch (err) {
      addToast('Failed to update availability', 'error');
    }
  };

  const openStatusModal = (delivery) => {
    setSelectedDelivery(delivery);
    // suggest logical next status
    if (delivery.status === 'Driver Assigned') setNewStatus('Picked Up');
    else if (delivery.status === 'Picked Up') setNewStatus('In Transit');
    else if (delivery.status === 'In Transit' || delivery.status === 'At Sorting Hub') setNewStatus('Out for Delivery');
    else if (delivery.status === 'Out for Delivery') setNewStatus('Delivered');
    else setNewStatus('Delivered');
    
    setStatusNotes('');
    setRecipientSignature(delivery.recipient.name || '');
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    setUpdating(true);
    try {
      const res = await api.put(`/driver/deliveries/${selectedDelivery._id}/status`, {
        status: newStatus,
        notes: statusNotes,
        recipientSignature: newStatus === 'Delivered' ? recipientSignature : undefined,
      });

      if (res.data.success) {
        addToast(`Shipment status updated to ${newStatus}`, 'success');
        setSelectedDelivery(null);
        fetchDeliveries();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5" />
            Courier Operations Terminal
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome, Driver {user?.name}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vehicle: {user?.driverInfo?.vehicleType || 'Courier'} • License: {user?.driverInfo?.licenseNumber || 'Active'}
          </p>
        </div>

        {/* Availability Toggle */}
        <button
          onClick={handleToggleAvailability}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all ${
            stats?.isAvailable
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>Status: {stats?.isAvailable ? 'Available (Online)' : 'Offline'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Tasks</p>
          <p className="text-2xl sm:text-3xl font-black text-orange-600 mt-1">
            {stats?.active || 0}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today Delivered</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            {stats?.delivered || 0}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lifetime Deliveries</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats?.completedDeliveries || 0}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Driver Rating</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
            ★ {user?.driverInfo?.rating || '5.0'}
          </p>
        </div>
      </div>

      {/* Task Filters Bar */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filter === 'active'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Active Tasks ({stats?.active || 0})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filter === 'completed'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Completed Archive ({stats?.delivered || 0})
        </button>
      </div>

      {/* Deliveries List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading delivery run sheet...</p>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">All clear! No pending tasks</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You currently have no assigned parcels in this tab. Keep your status online to receive new dispatch requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900">
                      {delivery.trackingNumber}
                    </span>
                    <Link
                      to={`/track?tracking=${delivery.trackingNumber}`}
                      target="_blank"
                      className="text-slate-400 hover:text-orange-600"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
                    {delivery.status}
                  </span>
                </div>

                {/* Pickup & Dropoff summary */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Deliver To:
                    </span>
                    <p className="font-bold text-slate-900">{delivery.recipient.name}</p>
                    <p className="text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      {delivery.recipient.address}, {delivery.recipient.city}
                    </p>
                    <p className="text-slate-600 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {delivery.recipient.phone}
                    </p>
                    {delivery.recipient.deliveryInstructions && (
                      <p className="text-[11px] text-amber-700 font-medium italic pt-1">
                        Instructions: "{delivery.recipient.deliveryInstructions}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-slate-600 pt-1">
                    <span>
                      Cargo: <strong>{delivery.parcelDetails?.weight} kg</strong> ({delivery.parcelDetails?.category})
                    </span>
                    <span className="font-bold text-slate-900">
                      Collect: ${delivery.cost?.totalAmount?.toFixed(2)} ({delivery.paymentStatus})
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              {filter === 'active' && (
                <button
                  onClick={() => openStatusModal(delivery)}
                  className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Update Shipment Status</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Status Update Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in zoom-in-95 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Update Status: {selectedDelivery.trackingNumber}
              </h3>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  New Status Checkpoint
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="Picked Up">Picked Up (Cargo Collected)</option>
                  <option value="In Transit">In Transit (En Route)</option>
                  <option value="At Sorting Hub">At Sorting Hub</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered (Handed to Recipient)</option>
                  <option value="Failed Delivery">Failed Delivery (Attempt Failed)</option>
                </select>
              </div>

              {newStatus === 'Delivered' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Recipient Signature Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientSignature}
                    onChange={(e) => setRecipientSignature(e.target.value)}
                    placeholder="Recipient's verified signature name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Driver Notes / Observations
                </label>
                <textarea
                  rows={3}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="e.g. Handed package to front desk attendant / Customer verified contents."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDelivery(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Confirm Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
