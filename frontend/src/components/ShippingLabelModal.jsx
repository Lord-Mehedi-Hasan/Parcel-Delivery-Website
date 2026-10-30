import { Printer, X, Package, QrCode } from 'lucide-react';

export default function ShippingLabelModal({ parcel, onClose }) {
  if (!parcel) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 animate-in fade-in zoom-in-95">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-bold text-slate-900">Official Shipping Label</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Label</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Label Area */}
        <div
          id="printable-shipping-label"
          className="border-2 border-slate-900 p-6 rounded-lg bg-white font-mono text-slate-900 text-xs shadow-xs space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <div>
              <span className="text-xl font-black tracking-tight font-sans">
                FAST<span className="text-orange-600">PARCEL</span> EXPRESS
              </span>
              <p className="text-[10px] text-slate-500 font-sans uppercase">
                Air Waybill / Domestic Consignment Note
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-slate-900 text-white font-bold text-xs rounded uppercase">
                {parcel.deliveryType} Delivery
              </span>
            </div>
          </div>

          {/* Barcode and Tracking # */}
          <div className="text-center py-2 border-b-2 border-slate-900">
            {/* Simulated Barcode */}
            <div className="inline-flex items-center justify-center gap-[2px] h-12 w-full max-w-sm mx-auto mb-1 px-4 bg-white">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full ${
                    i % 3 === 0
                      ? 'w-[3px] bg-slate-900'
                      : i % 5 === 0
                      ? 'w-[1.5px] bg-slate-900'
                      : i % 7 === 0
                      ? 'w-[4px] bg-slate-900'
                      : 'w-[1px] bg-slate-900'
                  }`}
                />
              ))}
            </div>
            <p className="text-base font-black tracking-widest text-slate-900">
              {parcel.trackingNumber}
            </p>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-2 gap-4 border-b-2 border-slate-900 pb-4">
            {/* From (Sender) */}
            <div className="border-r border-slate-300 pr-3">
              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                FROM (SHIPPER):
              </span>
              <p className="font-bold text-sm text-slate-900 mt-1">{parcel.sender.name}</p>
              <p>{parcel.sender.phone}</p>
              <p className="whitespace-pre-line text-slate-700">{parcel.sender.address}</p>
              <p className="font-bold text-slate-900 uppercase">{parcel.sender.city}</p>
              {parcel.sender.pickupInstructions && (
                <p className="text-[10px] text-slate-500 italic mt-1">
                  Note: {parcel.sender.pickupInstructions}
                </p>
              )}
            </div>

            {/* To (Recipient) */}
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                DELIVER TO (CONSIGNEE):
              </span>
              <p className="font-bold text-sm text-slate-900 mt-1">{parcel.recipient.name}</p>
              <p>{parcel.recipient.phone}</p>
              <p className="whitespace-pre-line text-slate-700">{parcel.recipient.address}</p>
              <p className="font-bold text-slate-900 uppercase">{parcel.recipient.city}</p>
              {parcel.recipient.deliveryInstructions && (
                <p className="text-[10px] text-slate-500 italic mt-1">
                  Note: {parcel.recipient.deliveryInstructions}
                </p>
              )}
            </div>
          </div>

          {/* Parcel Specs Table */}
          <div className="grid grid-cols-4 gap-2 border-b-2 border-slate-900 pb-3 text-center">
            <div className="border-r border-slate-300 pr-2">
              <span className="text-[10px] text-slate-500 block uppercase">Weight</span>
              <span className="font-bold text-xs">{parcel.parcelDetails?.weight} KG</span>
            </div>
            <div className="border-r border-slate-300 pr-2">
              <span className="text-[10px] text-slate-500 block uppercase">Category</span>
              <span className="font-bold text-xs">{parcel.parcelDetails?.category}</span>
            </div>
            <div className="border-r border-slate-300 pr-2">
              <span className="text-[10px] text-slate-500 block uppercase">Payment</span>
              <span className="font-bold text-xs">{parcel.paymentMethod}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Total Fee</span>
              <span className="font-bold text-xs">${parcel.cost?.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Routing & Verification */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border border-slate-400 p-1 flex items-center justify-center bg-slate-50">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-600 font-sans">
                <p className="font-semibold text-slate-800">FastParcel Routing Code: FP-{parcel.recipient.city.slice(0, 3).toUpperCase()}-99</p>
                <p>Status: {parcel.status}</p>
                <p>Issued: {new Date(parcel.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right font-sans">
              <p className="text-[10px] uppercase font-bold text-slate-400">Security Verified</p>
              <p className="text-xs font-semibold text-emerald-600">Tamper Seal Check: OK</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Shipping Label
          </button>
        </div>
      </div>
    </div>
  );
}
