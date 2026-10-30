import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ShippingLabelModal from '../components/ShippingLabelModal';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  XCircle,
  Plus,
  Search,
  ExternalLink,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedParcelForLabel, setSelectedParcelForLabel] = useState(null);

  const fetchMyParcels = async () => {
    try {
      setLoading(true);
      const res = await api.get('/parcels/my-parcels');
      if (res.data.success) {
        setParcels(res.data.parcels);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load your shipments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyParcels();
  }, []);

  const handleCancelParcel = async (id, trackingNumber) => {
    if (!window.confirm(`Are you sure you want to cancel parcel ${trackingNumber}?`)) {
      return;
    }
    try {
      const res = await api.put(`/parcels/${id}/cancel`, {
        reason: 'Customer requested cancellation via portal',
      });
      if (res.data.success) {
        addToast(`Shipment ${trackingNumber} has been cancelled`, 'info');
        fetchMyParcels();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to cancel shipment', 'error');
    }
  };

  // Compute metrics
  const totalBooked = parcels.length;
  const inTransitCount = parcels.filter((p) =>
    ['Order Placed', 'Driver Assigned', 'Picked Up', 'In Transit', 'Out for Delivery'].includes(
      p.status
    )
  ).length;
  const deliveredCount = parcels.filter((p) => p.status === 'Delivered').length;
  const totalSpent = parcels
    .filter((p) => p.status !== 'Cancelled')
    .reduce((sum, p) => sum + (p.cost?.totalAmount || 0), 0);

  // Filter parcels
  const filteredParcels = parcels.filter((p) => {
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesSearch =
      p.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.recipient.name.toLowerCase().includes(search.toLowerCase()) ||
      p.recipient.city.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'In Transit':
      case 'Picked Up':
      case 'Driver Assigned':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" />
            Customer Portal
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome, {user?.name || 'Shipper'}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your outgoing consignments, monitor delivery milestones, and download official receipts.
          </p>
        </div>
        <Link
          to="/book"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Parcel</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Booked</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalBooked}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Shipments</p>
          <p className="text-2xl sm:text-3xl font-black text-orange-600 mt-1">{inTransitCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivered Safely</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{deliveredCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Shipping Spend</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            ${totalSpent.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Shipments List & Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">My Consignments</h2>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tracking # or recipient..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Driver Assigned">Driver Assigned</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Parcels Table */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Retrieving your shipments...</p>
          </div>
        ) : filteredParcels.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No shipments found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't booked any shipments yet or no records match your search filter.
            </p>
            <Link
              to="/book"
              className="inline-block mt-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors"
            >
              Book Your First Shipment
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Tracking ID</th>
                  <th className="py-3.5 px-6">Recipient & City</th>
                  <th className="py-3.5 px-6">Speed & Category</th>
                  <th className="py-3.5 px-6">Booked Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredParcels.map((parcel) => (
                  <tr key={parcel._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {parcel.trackingNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{parcel.recipient.name}</div>
                      <div className="text-[11px] text-slate-500">{parcel.recipient.city}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800">{parcel.deliveryType}</span>
                      <span className="text-[11px] text-slate-500 block">
                        {parcel.parcelDetails?.category} ({parcel.parcelDetails?.weight} kg)
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(parcel.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getStatusBadge(
                          parcel.status
                        )}`}
                      >
                        {parcel.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      ${parcel.cost?.totalAmount?.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/track?tracking=${parcel.trackingNumber}`}
                          className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
                          title="Track Live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setSelectedParcelForLabel(parcel)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Print Shipping Label"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {['Order Placed', 'Driver Assigned'].includes(parcel.status) && (
                          <button
                            onClick={() => handleCancelParcel(parcel._id, parcel.trackingNumber)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Cancel Shipment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for official shipping label */}
      {selectedParcelForLabel && (
        <ShippingLabelModal
          parcel={selectedParcelForLabel}
          onClose={() => setSelectedParcelForLabel(null)}
        />
      )}
    </div>
  );
}
