import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Calculator,
  DollarSign,
  Clock,
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function CalculatorPage() {
  const navigate = useNavigate();
  const [weight, setWeight] = useState(3);
  const [category, setCategory] = useState('Parcel');
  const [deliveryType, setDeliveryType] = useState('Standard');
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch estimates for all delivery types to show full comparison table
  useEffect(() => {
    const fetchAllRates = async () => {
      setLoading(true);
      try {
        const types = ['Standard', 'Express', 'Same Day', 'Overnight'];
        const results = {};
        for (const t of types) {
          const res = await api.post('/calculator/estimate', {
            weight,
            category,
            deliveryType: t,
          });
          if (res.data.success) {
            results[t] = res.data;
          }
        }
        setRates(results);
      } catch (err) {
        console.error('Error calculating rates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllRates();
  }, [weight, category]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" />
          Transparent Pricing Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Shipping Rate Calculator
        </h1>
        <p className="text-sm text-slate-500">
          Calculate instant shipping quotes and compare service speeds across our nationwide carrier network.
        </p>
      </div>

      {/* Input Parameters Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Weight Control */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Package Weight (KG)
              </label>
              <span className="text-xl font-black text-orange-600">{weight} KG</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>0.5 kg (Light Document)</span>
              <span>15 kg</span>
              <span>30 kg</span>
              <span>50 kg (Heavy Cargo)</span>
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Package Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Document', 'Parcel', 'Electronics', 'Fragile', 'Clothing', 'Heavy Goods'].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      category === cat
                        ? 'border-orange-500 bg-orange-50 text-orange-800'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            type: 'Standard',
            title: 'Standard Ground',
            desc: 'Best for non-urgent shipments and e-commerce parcels.',
            badge: 'Most Economical',
            badgeColor: 'bg-slate-100 text-slate-700',
          },
          {
            type: 'Express',
            title: 'Express Delivery',
            desc: 'Priority routing with expedited regional linehaul.',
            badge: 'Most Popular',
            badgeColor: 'bg-orange-100 text-orange-700',
          },
          {
            type: 'Same Day',
            title: 'Same-Day Rush',
            desc: 'Dedicated courier for immediate intra-city transit.',
            badge: 'Fastest Local',
            badgeColor: 'bg-emerald-100 text-emerald-700',
          },
          {
            type: 'Overnight',
            title: 'Priority Overnight',
            desc: 'Guaranteed delivery by 10:30 AM next business day.',
            badge: 'Guaranteed Morning',
            badgeColor: 'bg-purple-100 text-purple-700',
          },
        ].map((card) => {
          const rateData = rates[card.type];
          return (
            <div
              key={card.type}
              className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                card.type === 'Express'
                  ? 'bg-orange-50/40 border-orange-300 shadow-md ring-2 ring-orange-200'
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="space-y-4">
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${card.badgeColor}`}
                >
                  {card.badge}
                </span>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.desc}</p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-900">
                    ${rateData?.totalAmount ? rateData.totalAmount.toFixed(2) : '--'}
                  </span>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Est: {rateData?.estimatedDays || 'Calculating...'}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Freight:</span>
                    <span>${rateData?.basePrice?.toFixed(2) || '5.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight Fee:</span>
                    <span>${rateData?.weightSurcharge?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed / Handling:</span>
                    <span>${rateData?.expressSurcharge?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%):</span>
                    <span>${rateData?.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/book')}
                className="w-full mt-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Select & Book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
