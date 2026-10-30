import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ShieldCheck,
  Package,
  Truck,
  Users,
  DollarSign,
  Search,
  ExternalLink,
  UserCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  Building,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('parcels'); // 'parcels', 'drivers', 'users'
  const [stats, setStats] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal States
  const [selectedParcelForDriver, setSelectedParcelForDriver] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [assigning, setAssigning] = useState(false);

  const [selectedParcelForStatus, setSelectedParcelForStatus] = useState(null);
  const [adminStatus, setAdminStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, parcelsRes, driversRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/parcels?status=${statusFilter}&search=${search}`),
        api.get('/admin/drivers'),
        api.get('/admin/users'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (parcelsRes.data.success) setParcels(parcelsRes.data.parcels);
      if (driversRes.data.success) setDrivers(driversRes.data.drivers);
      if (usersRes.data.success) setUsersList(usersRes.data.users);
    } catch (err) {
      console.error(err);
      addToast('Failed to load operations data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleAssignDriver = async (e) => {
    e.preventDefault();
    if (!selectedParcelForDriver || !selectedDriverId) return;

    setAssigning(true);
    try {
      const res = await api.put(`/admin/parcels/${selectedParcelForDriver._id}/assign-driver`, {
        driverId: selectedDriverId,
      });
      if (res.data.success) {
        addToast(res.data.message || 'Driver assigned successfully', 'success');
        setSelectedParcelForDriver(null);
        fetchData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to assign driver', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleAdminStatusOverride = async (e) => {
    e.preventDefault();
    if (!selectedParcelForStatus || !adminStatus) return;

    setUpdatingStatus(true);
    try {
      const res = await api.put(`/admin/parcels/${selectedParcelForStatus._id}/update-status`, {
        status: adminStatus,
        notes: adminNotes,
      });
      if (res.data.success) {
        addToast('Shipment updated successfully', 'success');
        setSelectedParcelForStatus(null);
        fetchData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteParcel = async (id, trackingNumber) => {
    if (!window.confirm(`Permanently remove parcel ${trackingNumber}?`)) return;
    try {
      const res = await api.delete(`/admin/parcels/${id}`);
      if (res.data.success) {
        addToast('Parcel deleted successfully', 'info');
        fetchData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete parcel', 'error');
    }
  };

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
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Central Dispatch Command
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Logistics Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global monitoring of consignment pipelines, fleet driver allocations, and revenue tracking.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Operations</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Consignments</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats?.totalParcels || 0}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Transit Pipeline</p>
          <p className="text-2xl sm:text-3xl font-black text-orange-600 mt-1">
            {stats?.inTransitCount || 0}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivered Rate</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            {stats?.deliveredCount || 0}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</p>
          <p className="text-2xl sm:text-3xl font-black text-purple-600 mt-1">
            ${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Drivers</p>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
            {stats?.activeDrivers || 0} / {stats?.totalDrivers || 0}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('parcels')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'parcels'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Consignments ({parcels.length})
        </button>
        <button
          onClick={() => setActiveTab('drivers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'drivers'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Courier Drivers ({drivers.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Registered Users ({usersList.length})
        </button>
      </div>

      {/* TAB 1: Parcels Operations */}
      {activeTab === 'parcels' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-base font-bold text-slate-900">Consignment Dispatch Ledger</h2>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search code, sender, recipient..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </form>

              {/* Status Select */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Driver Assigned">Driver Assigned</option>
                <option value="Picked Up">Picked Up</option>
                <option value="In Transit">In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Querying dispatch data...</p>
            </div>
          ) : parcels.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No shipments found matching current query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-6">Tracking ID</th>
                    <th className="py-3.5 px-6">Route (Origin &rarr; Dest)</th>
                    <th className="py-3.5 px-6">Courier Driver</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Fare</th>
                    <th className="py-3.5 px-6 text-right">Dispatch Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {parcels.map((parcel) => (
                    <tr key={parcel._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        {parcel.trackingNumber}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900">
                          {parcel.sender.city} &rarr; {parcel.recipient.city}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          To: {parcel.recipient.name} ({parcel.recipient.phone})
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {parcel.assignedDriver ? (
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                            <Truck className="w-3.5 h-3.5 text-blue-500" />
                            <span>{parcel.assignedDriver.name}</span>
                          </div>
                        ) : (
                          <span className="text-amber-600 font-semibold italic text-[11px]">
                            Unassigned
                          </span>
                        )}
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
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live Track */}
                          <Link
                            to={`/track?tracking=${parcel.trackingNumber}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-slate-100"
                            title="View Track"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          {/* Assign Driver */}
                          <button
                            onClick={() => {
                              setSelectedParcelForDriver(parcel);
                              setSelectedDriverId(parcel.assignedDriver?._id || '');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px]"
                            title="Assign or reassign driver"
                          >
                            Assign Driver
                          </button>
                          {/* Override status */}
                          <button
                            onClick={() => {
                              setSelectedParcelForStatus(parcel);
                              setAdminStatus(parcel.status);
                              setAdminNotes('');
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                            title="Update Status"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteParcel(parcel._id, parcel.trackingNumber)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Drivers Fleet */}
      {activeTab === 'drivers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Carrier Driver Fleet</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Driver Name</th>
                  <th className="py-3.5 px-6">Contact & Email</th>
                  <th className="py-3.5 px-6">Vehicle & License</th>
                  <th className="py-3.5 px-6">Operating Hub City</th>
                  <th className="py-3.5 px-6">Active Tasks</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {drivers.map((driver) => (
                  <tr key={driver._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                        {driver.name.charAt(0)}
                      </div>
                      <span>{driver.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p>{driver.phone}</p>
                      <p className="text-[11px] text-slate-400">{driver.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800">
                        {driver.driverInfo?.vehicleType || 'Courier'}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        No: {driver.driverInfo?.vehicleNumber || 'N/A'} • Lic: {driver.driverInfo?.licenseNumber || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">{driver.driverInfo?.currentCity || 'Central'}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 font-bold">
                        {driver.activeTasks || 0} active
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          driver.driverInfo?.isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {driver.driverInfo?.isAvailable ? 'Available' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">User Accounts Directory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Name</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Phone</th>
                  <th className="py-3.5 px-6">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{u.name}</td>
                    <td className="py-4 px-6 text-slate-600">{u.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'driver'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">{u.phone || 'N/A'}</td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Driver Modal */}
      {selectedParcelForDriver && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in zoom-in-95 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Assign Driver to {selectedParcelForDriver.trackingNumber}
              </h3>
              <button
                onClick={() => setSelectedParcelForDriver(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignDriver} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Registered Driver
                </label>
                <select
                  required
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="">-- Choose a Driver --</option>
                  {drivers.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.driverInfo?.vehicleType || 'Courier'}) - {d.activeTasks} active tasks
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedParcelForDriver(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning || !selectedDriverId}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm disabled:opacity-50"
                >
                  {assigning ? 'Assigning...' : 'Assign Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Status Override Modal */}
      {selectedParcelForStatus && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in zoom-in-95 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Manual Override: {selectedParcelForStatus.trackingNumber}
              </h3>
              <button
                onClick={() => setSelectedParcelForStatus(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminStatusOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Override Status Checkpoint
                </label>
                <select
                  value={adminStatus}
                  onChange={(e) => setAdminStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Driver Assigned">Driver Assigned</option>
                  <option value="Picked Up">Picked Up</option>
                  <option value="In Transit">In Transit</option>
                  <option value="At Sorting Hub">At Sorting Hub</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Operations Note
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Cleared security check at central sorting facility."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedParcelForStatus(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm disabled:opacity-50"
                >
                  {updatingStatus ? 'Updating...' : 'Save Override'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
