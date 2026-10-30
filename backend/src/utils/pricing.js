export const calculateShippingCost = ({
  weight = 1,
  deliveryType = 'Standard',
  category = 'Parcel',
}) => {
  const numericWeight = Math.max(0.1, Number(weight) || 1);
  const basePrice = 5.0;

  // Weight surcharge: $2.50 per kg beyond the first 1kg
  let weightSurcharge = 0;
  if (numericWeight > 1) {
    weightSurcharge = Math.round((numericWeight - 1) * 2.5 * 100) / 100;
  }

  // Delivery type surcharge
  let expressSurcharge = 0;
  switch (deliveryType) {
    case 'Express':
      expressSurcharge = 8.0;
      break;
    case 'Same Day':
      expressSurcharge = 15.0;
      break;
    case 'Overnight':
      expressSurcharge = 20.0;
      break;
    default:
      expressSurcharge = 0.0;
      break;
  }

  // Category handling fee
  let handlingFee = 0;
  if (category === 'Fragile') handlingFee = 4.0;
  else if (category === 'Electronics') handlingFee = 3.5;
  else if (category === 'Heavy Goods') handlingFee = 10.0;

  const subtotal = basePrice + weightSurcharge + expressSurcharge + handlingFee;
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
  const totalAmount = Math.round((subtotal + tax) * 100) / 100;

  let estimatedDays = '3-5 business days';
  if (deliveryType === 'Express') estimatedDays = '1-2 business days';
  if (deliveryType === 'Same Day') estimatedDays = 'Today by 8:00 PM';
  if (deliveryType === 'Overnight') estimatedDays = 'Next morning by 10:30 AM';

  return {
    basePrice,
    weightSurcharge,
    expressSurcharge: expressSurcharge + handlingFee,
    tax,
    totalAmount,
    estimatedDays,
  };
};
