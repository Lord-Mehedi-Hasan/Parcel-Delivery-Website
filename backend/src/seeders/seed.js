import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Branch from '../models/Branch.js';
import Parcel from '../models/Parcel.js';
import Review from '../models/Review.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/parcel_delivery_db';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Branch.deleteMany({});
    await Parcel.deleteMany({});
    await Review.deleteMany({});
    console.log('[Seed] Cleared existing data');

    // 1. Create Branches
    const branches = await Branch.create([
      {
        name: 'Metro Central Mega-Hub',
        code: 'HUB-NYC-01',
        city: 'New York',
        address: '450 Express Blvd, Manhattan, NY',
        contactPhone: '+1 (555) 234-5678',
        capacityStatus: 'Normal',
        isActive: true,
      },
      {
        name: 'North Region Sorting Facility',
        code: 'HUB-BOS-02',
        city: 'Boston',
        address: '12 Logistics Way, Boston, MA',
        contactPhone: '+1 (555) 345-6789',
        capacityStatus: 'Normal',
        isActive: true,
      },
      {
        name: 'West Gateway Terminal',
        code: 'HUB-LAX-03',
        city: 'Los Angeles',
        address: '880 Pacific Cargo Rd, Los Angeles, CA',
        contactPhone: '+1 (555) 456-7890',
        capacityStatus: 'Busy',
        isActive: true,
      },
      {
        name: 'Southern Freight Depot',
        code: 'HUB-ATL-04',
        city: 'Atlanta',
        address: '304 Runway Ave, Atlanta, GA',
        contactPhone: '+1 (555) 567-8901',
        capacityStatus: 'Normal',
        isActive: true,
      },
    ]);
    console.log(`[Seed] Created ${branches.length} branches`);

    // 2. Create Users
    // Admin
    const admin = await User.create({
      name: 'Operations Commander',
      email: 'admin@fastparcel.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 100-2000',
      address: {
        street: '100 Executive Way',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      },
    });

    // Drivers
    const driver1 = await User.create({
      name: 'David Miller',
      email: 'driver1@fastparcel.com',
      password: 'driver123',
      role: 'driver',
      phone: '+1 (555) 201-3001',
      address: { street: '78 Pine St', city: 'New York', state: 'NY', zipCode: '10002' },
      driverInfo: {
        vehicleType: 'Van',
        vehicleNumber: 'NY-VAN-882',
        licenseNumber: 'DL-992381',
        isAvailable: true,
        currentCity: 'New York',
        rating: 4.9,
        completedDeliveries: 142,
      },
    });

    const driver2 = await User.create({
      name: 'Alex Rivera',
      email: 'driver2@fastparcel.com',
      password: 'driver123',
      role: 'driver',
      phone: '+1 (555) 202-3002',
      address: { street: '124 Market St', city: 'Boston', state: 'MA', zipCode: '02108' },
      driverInfo: {
        vehicleType: 'Motorcycle',
        vehicleNumber: 'MA-MOTO-441',
        licenseNumber: 'DL-773412',
        isAvailable: true,
        currentCity: 'Boston',
        rating: 4.8,
        completedDeliveries: 98,
      },
    });

    const driver3 = await User.create({
      name: 'Marcus Chen',
      email: 'driver3@fastparcel.com',
      password: 'driver123',
      role: 'driver',
      phone: '+1 (555) 203-3003',
      address: { street: '55 Ocean Ave', city: 'Los Angeles', state: 'CA', zipCode: '90001' },
      driverInfo: {
        vehicleType: 'Truck',
        vehicleNumber: 'CA-TRK-900',
        licenseNumber: 'DL-665123',
        isAvailable: false,
        currentCity: 'Los Angeles',
        rating: 5.0,
        completedDeliveries: 230,
      },
    });

    // Customers
    const customer1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'customer@gmail.com',
      password: 'customer123',
      role: 'customer',
      phone: '+1 (555) 301-4001',
      address: { street: '420 Park Ave Apt 4B', city: 'New York', state: 'NY', zipCode: '10022' },
    });

    const customer2 = await User.create({
      name: 'Apex Electronics Inc',
      email: 'business@techstore.com',
      password: 'business123',
      role: 'customer',
      phone: '+1 (555) 302-4002',
      address: { street: '900 Silicon Way', city: 'Boston', state: 'MA', zipCode: '02110' },
    });
    console.log('[Seed] Created Admin, Drivers and Customers');

    // 3. Create Sample Parcels
    // Parcel 1: Delivered
    const p1Date = new Date();
    p1Date.setDate(p1Date.getDate() - 3);
    const p1DeliveredDate = new Date();
    p1DeliveredDate.setDate(p1DeliveredDate.getDate() - 1);

    await Parcel.create({
      trackingNumber: 'TRK-784920',
      sender: {
        userId: customer1._id,
        name: 'Sarah Jenkins',
        phone: '+1 (555) 301-4001',
        email: 'customer@gmail.com',
        address: '420 Park Ave Apt 4B',
        city: 'New York',
        pickupInstructions: 'Leave package at concierge desk',
      },
      recipient: {
        name: 'Emma Watson',
        phone: '+1 (555) 888-1122',
        email: 'emma.w@gmail.com',
        address: '742 Evergreen Terrace',
        city: 'Boston',
        deliveryInstructions: 'Ring doorbell twice and leave on front porch',
      },
      parcelDetails: {
        category: 'Fragile',
        weight: 2.5,
        dimensions: { length: 25, width: 20, height: 15 },
        declaredValue: 120,
        description: 'Handcrafted ceramic tea set with fragile glass cups',
      },
      deliveryType: 'Express',
      cost: {
        basePrice: 5.0,
        weightSurcharge: 3.75,
        expressSurcharge: 12.0, // express (8) + fragile (4)
        tax: 1.04,
        totalAmount: 21.79,
      },
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      status: 'Delivered',
      assignedDriver: driver2._id,
      currentBranch: branches[1]._id,
      estimatedDeliveryDate: p1DeliveredDate,
      actualDeliveryDate: p1DeliveredDate,
      proofOfDelivery: {
        recipientSignature: 'Emma Watson',
        photoUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60',
        deliveryNotes: 'Delivered directly to recipient at front door. Verified signature.',
        deliveredAt: p1DeliveredDate,
      },
      trackingHistory: [
        {
          status: 'Order Placed',
          title: 'Shipment Order Created',
          description: 'Shipment booked via Express Delivery service.',
          location: 'New York',
          timestamp: p1Date,
        },
        {
          status: 'Driver Assigned',
          title: 'Pickup Driver Assigned',
          description: `Courier driver ${driver1.name} assigned for collection.`,
          location: 'New York',
          timestamp: new Date(p1Date.getTime() + 1000 * 60 * 60 * 2),
        },
        {
          status: 'Picked Up',
          title: 'Package Collected from Sender',
          description: 'Package picked up from New York origin address.',
          location: 'New York',
          timestamp: new Date(p1Date.getTime() + 1000 * 60 * 60 * 4),
        },
        {
          status: 'At Sorting Hub',
          title: 'Arrived at Central Sorting Hub',
          description: 'Package sorted and scanned at Metro Central Mega-Hub.',
          location: 'New York',
          timestamp: new Date(p1Date.getTime() + 1000 * 60 * 60 * 8),
        },
        {
          status: 'In Transit',
          title: 'In Transit to Regional Hub',
          description: 'En route between NY Hub and Boston Facility.',
          location: 'Interstate 95 Corridor',
          timestamp: new Date(p1Date.getTime() + 1000 * 60 * 60 * 20),
        },
        {
          status: 'Out for Delivery',
          title: 'Out for Delivery',
          description: `Courier driver ${driver2.name} is on the way to recipient address.`,
          location: 'Boston',
          timestamp: new Date(p1DeliveredDate.getTime() - 1000 * 60 * 60 * 3),
        },
        {
          status: 'Delivered',
          title: 'Package Delivered',
          description: 'Package safely delivered. Received and signed by Emma Watson.',
          location: 'Boston',
          timestamp: p1DeliveredDate,
        },
      ],
    });

    // Parcel 2: Out for Delivery
    const p2Date = new Date();
    p2Date.setDate(p2Date.getDate() - 1);
    await Parcel.create({
      trackingNumber: 'TRK-552190',
      sender: {
        userId: customer2._id,
        name: 'Apex Electronics Inc',
        phone: '+1 (555) 302-4002',
        email: 'business@techstore.com',
        address: '900 Silicon Way',
        city: 'Boston',
        pickupInstructions: 'Warehouse Bay 4 loading dock',
      },
      recipient: {
        name: 'Liam Anderson',
        phone: '+1 (555) 443-9988',
        email: 'liam.anderson@example.com',
        address: '15 Beacon Street, Suite 300',
        city: 'Boston',
        deliveryInstructions: 'Reception desk on 3rd floor',
      },
      parcelDetails: {
        category: 'Electronics',
        weight: 1.8,
        dimensions: { length: 30, width: 25, height: 10 },
        declaredValue: 850,
        description: 'High-performance graphic tablet & accessories',
      },
      deliveryType: 'Same Day',
      cost: {
        basePrice: 5.0,
        weightSurcharge: 2.0,
        expressSurcharge: 18.5,
        tax: 1.28,
        totalAmount: 26.78,
      },
      paymentStatus: 'Paid',
      paymentMethod: 'Online Payment',
      status: 'Out for Delivery',
      assignedDriver: driver2._id,
      currentBranch: branches[1]._id,
      estimatedDeliveryDate: new Date(),
      trackingHistory: [
        {
          status: 'Order Placed',
          title: 'Same-Day Dispatch Booked',
          description: 'Priority commercial parcel booked for express dispatch.',
          location: 'Boston',
          timestamp: p2Date,
        },
        {
          status: 'Picked Up',
          title: 'Collected from Warehouse',
          description: `Driver ${driver2.name} confirmed cargo pickup.`,
          location: 'Boston Silicon Way',
          timestamp: new Date(p2Date.getTime() + 1000 * 60 * 60 * 2),
        },
        {
          status: 'At Sorting Hub',
          title: 'Inspected at North Sorting Hub',
          description: 'Security & barcode verification completed.',
          location: 'North Region Sorting Facility',
          timestamp: new Date(p2Date.getTime() + 1000 * 60 * 60 * 5),
        },
        {
          status: 'Out for Delivery',
          title: 'Out for Final Delivery',
          description: `Courier ${driver2.name} has loaded package onto vehicle. Est arrival today.`,
          location: 'Boston Downtown',
          timestamp: new Date(),
        },
      ],
    });

    // Parcel 3: In Transit
    const p3Date = new Date();
    await Parcel.create({
      trackingNumber: 'TRK-392014',
      sender: {
        userId: customer1._id,
        name: 'Sarah Jenkins',
        phone: '+1 (555) 301-4001',
        email: 'customer@gmail.com',
        address: '420 Park Ave Apt 4B',
        city: 'New York',
      },
      recipient: {
        name: 'Carlos Rodriguez',
        phone: '+1 (555) 777-6655',
        email: 'carlos.r@gmail.com',
        address: '1020 Sunset Blvd',
        city: 'Los Angeles',
      },
      parcelDetails: {
        category: 'Clothing',
        weight: 3.2,
        dimensions: { length: 40, width: 30, height: 20 },
        declaredValue: 200,
        description: 'Designer winter coats and fashion garments',
      },
      deliveryType: 'Standard',
      cost: {
        basePrice: 5.0,
        weightSurcharge: 5.5,
        expressSurcharge: 0.0,
        tax: 0.53,
        totalAmount: 11.03,
      },
      paymentStatus: 'Cash on Delivery',
      paymentMethod: 'Cash',
      status: 'In Transit',
      assignedDriver: driver1._id,
      currentBranch: branches[0]._id,
      estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
      trackingHistory: [
        {
          status: 'Order Placed',
          title: 'Shipment Booked',
          description: 'Sender booked standard parcel cross-country shipment.',
          location: 'New York',
          timestamp: p3Date,
        },
        {
          status: 'Picked Up',
          title: 'Picked Up by Driver',
          description: `Collected by courier ${driver1.name}.`,
          location: 'New York',
          timestamp: new Date(p3Date.getTime() + 1000 * 60 * 90),
        },
        {
          status: 'In Transit',
          title: 'Departed Central Super Hub',
          description: 'Loaded onto long-haul linehaul transport heading toward West Hub.',
          location: 'Metro Central Mega-Hub',
          timestamp: new Date(p3Date.getTime() + 1000 * 60 * 180),
        },
      ],
    });

    // Parcel 4: Order Placed (Waiting assignment)
    await Parcel.create({
      trackingNumber: 'TRK-902381',
      sender: {
        name: 'Michael Scott',
        phone: '+1 (555) 666-3322',
        email: 'mscott@dunder.com',
        address: '1725 Slough Ave',
        city: 'Scranton',
      },
      recipient: {
        name: 'Jim Halpert',
        phone: '+1 (555) 444-2211',
        email: 'jim@athltd.com',
        address: '200 Market St',
        city: 'Philadelphia',
      },
      parcelDetails: {
        category: 'Document',
        weight: 0.5,
        dimensions: { length: 30, width: 22, height: 2 },
        declaredValue: 50,
        description: 'Confidential paper contracts and catalog copies',
      },
      deliveryType: 'Standard',
      cost: {
        basePrice: 5.0,
        weightSurcharge: 0.0,
        expressSurcharge: 0.0,
        tax: 0.25,
        totalAmount: 5.25,
      },
      paymentStatus: 'Pending',
      paymentMethod: 'Cash',
      status: 'Order Placed',
      currentBranch: branches[0]._id,
      estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 72),
      trackingHistory: [
        {
          status: 'Order Placed',
          title: 'Shipment Registered',
          description: 'Awaiting courier driver assignment and pickup scheduling.',
          location: 'Scranton Hub',
          timestamp: new Date(),
        },
      ],
    });

    // 4. Create Reviews
    await Review.create([
      {
        name: 'Jennifer Laurence',
        role: 'E-commerce Brand Owner',
        rating: 5,
        comment:
          'FastParcel cut our delivery exceptions by 40%. The real-time tracking timeline and automated SMS notifications gave our customers huge peace of mind!',
      },
      {
        name: 'Robert Vance',
        role: 'Supply Chain Director',
        rating: 5,
        comment:
          'Outstanding logistics partner! The driver coordination and instant proof of delivery with digital signatures makes accounting seamless.',
      },
      {
        name: 'Sophia Martinez',
        role: 'Online Retailer',
        rating: 5,
        comment:
          'Same day delivery is genuinely same day. Our packages arrive ahead of estimated schedule with zero damage. Highly recommended platform!',
      },
    ]);
    console.log('[Seed] Created Reviews');

    console.log('\n===============================================');
    console.log(' SEEDING COMPLETED SUCCESSFULLY! ');
    console.log('===============================================');
    console.log('Demo Credentials:');
    console.log('  Admin:    admin@fastparcel.com    / admin123');
    console.log('  Driver:   driver1@fastparcel.com  / driver123');
    console.log('  Customer: customer@gmail.com      / customer123');
    console.log('Sample Track Codes:');
    console.log('  Delivered:       TRK-784920');
    console.log('  Out for Delivery: TRK-552190');
    console.log('  In Transit:      TRK-392014');
    console.log('  Order Placed:    TRK-902381');
    console.log('===============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
