import { useState, useEffect } from 'react';
import api from '../services/api';
import { Building, MapPin, Phone, ShieldCheck, Search, Activity } from 'lucide-react';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await api.get('/branches');
        if (res.data.success) {
          setBranches(res.data.branches);
        }
      } catch (err) {
        console.error('Error fetching branches', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
          <Building className="w-3.5 h-3.5" />
          Carrier Network & Warehouses
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Distribution Hubs & Facilities
        </h1>
        <p className="text-sm text-slate-500">
          Strategically located automated sortation terminals connecting nationwide delivery corridors.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto pt-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by city, hub name, or station code..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading branch networks...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBranches.map((branch) => (
            <div
              key={branch._id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-orange-300 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                    {branch.code}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{branch.name}</h3>
                  <p className="text-xs font-semibold text-orange-600">{branch.city} Region</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                    branch.capacityStatus === 'Normal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : branch.capacityStatus === 'Busy'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  {branch.capacityStatus} Load
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{branch.contactPhone}</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  24/7 Security CCTV Monitored
                </span>
                <span className="text-slate-500 font-medium">Automated Sorting</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
