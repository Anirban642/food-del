/**
 * mockOrders.js
 * Realistic mock order objects — one per timeline stage plus cancelled variants.
 * Used by MyOrders dev-preview and OrderTimeline tests.
 * Phase 10 will replace these with real Socket.IO events.
 */

export const MOCK_TIMELINE_ORDERS = [
  {
    _id: 'mock-placed',
    status: 'placed',
    items: [
      { name: 'Classic Margherita', quantity: 1 },
      { name: 'Garlic Bread', quantity: 2 },
    ],
    amount: 380,
    date: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    address: { firstName: 'Demo', lastName: 'User', city: 'Mumbai' },
    _mockStageLabel: 'Stage 1 — Order Placed',
  },
  {
    _id: 'mock-payment-confirmed',
    status: 'payment_confirmed',
    items: [
      { name: 'Butter Chicken', quantity: 1 },
      { name: 'Tandoori Roti', quantity: 3 },
    ],
    amount: 450,
    date: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    address: { firstName: 'Demo', lastName: 'User', city: 'Delhi' },
    _mockStageLabel: 'Stage 2 — Payment Confirmed',
  },
  {
    _id: 'mock-accepted',
    status: 'accepted',
    items: [
      { name: 'Paneer Tikka Masala', quantity: 2 },
      { name: 'Steamed Rice', quantity: 1 },
    ],
    amount: 520,
    date: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    address: { firstName: 'Demo', lastName: 'User', city: 'Bangalore' },
    _mockStageLabel: 'Stage 3 — Accepted',
  },
  {
    _id: 'mock-preparing',
    status: 'preparing',
    items: [
      { name: 'Chicken Biryani', quantity: 1 },
      { name: 'Raita', quantity: 1 },
      { name: 'Gulab Jamun', quantity: 2 },
    ],
    amount: 390,
    date: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    address: { firstName: 'Demo', lastName: 'User', city: 'Chennai' },
    _mockStageLabel: 'Stage 4 — Preparing',
  },
  {
    _id: 'mock-courier-assigned',
    status: 'courier_assigned',
    items: [
      { name: 'Masala Dosa', quantity: 2 },
      { name: 'Filter Coffee', quantity: 2 },
    ],
    amount: 280,
    date: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    address: { firstName: 'Demo', lastName: 'User', city: 'Hyderabad' },
    _mockStageLabel: 'Stage 5 — Courier Assigned',
  },
  {
    _id: 'mock-ready',
    status: 'ready',
    items: [
      { name: 'Chole Bhature', quantity: 1 },
      { name: 'Sweet Lassi', quantity: 2 },
    ],
    amount: 310,
    date: new Date(Date.now() - 26 * 60 * 1000).toISOString(),
    address: { firstName: 'Demo', lastName: 'User', city: 'Pune' },
    _mockStageLabel: 'Stage 6 — Ready',
  },
  {
    _id: 'mock-picked-up',
    status: 'picked_up',
    items: [
      { name: 'Pav Bhaji', quantity: 2 },
      { name: 'Nimbu Pani', quantity: 1 },
    ],
    amount: 260,
    date: new Date(Date.now() - 33 * 60 * 1000).toISOString(),
    address: { firstName: 'Demo', lastName: 'User', city: 'Kolkata' },
    _mockStageLabel: 'Stage 7 — Picked Up',
  },
  {
    _id: 'mock-nearby',
    status: 'nearby',
    items: [
      { name: 'Vada Pav', quantity: 4 },
      { name: 'Cutting Chai', quantity: 2 },
    ],
    amount: 140,
    date: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    address: { firstName: 'Demo', lastName: 'User', city: 'Jaipur' },
    _mockStageLabel: 'Stage 8 — Nearby',
  },
  {
    _id: 'mock-delivered',
    status: 'delivered',
    items: [
      { name: 'Dal Makhani', quantity: 1 },
      { name: 'Jeera Rice', quantity: 1 },
      { name: 'Mango Lassi', quantity: 1 },
    ],
    amount: 480,
    date: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    address: { firstName: 'Demo', lastName: 'User', city: 'Ahmedabad' },
    _mockStageLabel: 'Stage 9 — Delivered ✓',
  },
  {
    _id: 'mock-cancelled',
    status: 'Payment Cancelled',
    items: [{ name: 'Special Pizza', quantity: 1 }],
    amount: 350,
    date: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    address: { firstName: 'Demo', lastName: 'User', city: 'Lucknow' },
    _mockStageLabel: 'Cancelled',
  },
  {
    _id: 'mock-expired',
    status: 'Payment Expired',
    items: [{ name: 'Combo Thali', quantity: 1 }],
    amount: 299,
    date: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    address: { firstName: 'Demo', lastName: 'User', city: 'Surat' },
    _mockStageLabel: 'Payment Expired',
  },
];

/** Formats a JS date/ISO string into a human-readable relative time */
export const formatRelativeTime = (dateInput) => {
  const diff = Date.now() - new Date(dateInput).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1)  return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

