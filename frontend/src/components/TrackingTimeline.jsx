import { CheckCircle2, Clock, Truck, Warehouse, PackageCheck, AlertTriangle, XCircle, MapPin } from 'lucide-react';

export default function TrackingTimeline({ history = [], currentStatus = 'Order Placed' }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Driver Assigned':
        return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'Picked Up':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'At Sorting Hub':
        return <Warehouse className="w-5 h-5 text-purple-500" />;
      case 'In Transit':
        return <Truck className="w-5 h-5 text-sky-500" />;
      case 'Out for Delivery':
        return <Truck className="w-5 h-5 text-orange-500 animate-pulse" />;
      case 'Delivered':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Failed Delivery':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Standard step progression
  const steps = [
    { key: 'Order Placed', label: 'Order Placed' },
    { key: 'Picked Up', label: 'Picked Up' },
    { key: 'In Transit', label: 'In Transit' },
    { key: 'Out for Delivery', label: 'Out for Delivery' },
    { key: 'Delivered', label: 'Delivered' },
  ];

  const getStepState = (stepKey) => {
    const statusOrder = [
      'Order Placed',
      'Driver Assigned',
      'Picked Up',
      'At Sorting Hub',
      'In Transit',
      'Out for Delivery',
      'Delivered',
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentStatus === 'Cancelled') return 'cancelled';
    if (currentIndex >= stepIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="space-y-8">
      {/* Visual Progress Bar (Desktop & Tablet) */}
      <div className="hidden sm:block p-6 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between relative">
          {/* Connector line */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 z-0"></div>

          {steps.map((step, idx) => {
            const state = getStepState(step.key);
            const isCompleted = state === 'completed';
            const isCurrent = currentStatus === step.key;

            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-orange-500 text-white ring-4 ring-orange-100 shadow-md'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span
                  className={`mt-2 text-xs font-semibold whitespace-nowrap ${
                    isCurrent ? 'text-orange-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Checkpoint Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {history.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No tracking updates recorded yet.</p>
        ) : (
          [...history].reverse().map((checkpoint, index) => (
            <div key={index} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[27px] sm:-left-[35px] top-1 p-1 bg-white rounded-full border border-slate-200 shadow-xs group-hover:scale-110 transition-transform">
                {getStatusIcon(checkpoint.status)}
              </div>

              {/* Checkpoint Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  index === 0
                    ? 'bg-orange-50/60 border-orange-200 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {checkpoint.title || checkpoint.status}
                    {index === 0 && (
                      <span className="text-[10px] font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Latest Update
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    {formatDate(checkpoint.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                  {checkpoint.description}
                </p>

                {checkpoint.location && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{checkpoint.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
