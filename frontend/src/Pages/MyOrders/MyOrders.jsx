import React, { useContext, useState, useEffect, useCallback } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import OrderTimeline, { isCancelledStatus } from '../../Components/OrderTimeline/OrderTimeline';
import { MOCK_TIMELINE_ORDERS, formatRelativeTime } from '../../data/mockOrders';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Summarise an items array as "Item A ×2, Item B ×1" */
const summariseItems = (items = []) =>
  items.map((item) => `${item.name} ×${item.quantity}`).join(', ');

/** Derive a CSS modifier class from the status string */
const statusModifier = (status) => {
  if (isCancelledStatus(status)) return 'cancelled';
  if (status === 'Delivered' || status === 'delivered') return 'delivered';
  return 'in-progress';
};

// ── OrderCard ─────────────────────────────────────────────────────────────────

const OrderCard = ({ order, isMock = false }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`mo-card ${isMock ? 'mo-card--mock' : ''}`}>
      {/* ── Card header ── */}
      <div className="mo-card-header">
        <img src={assets.parcel_icon} alt="Order" className="mo-parcel-icon" />

        <div className="mo-card-info">
          <p className="mo-items-summary" title={summariseItems(order.items)}>
            {summariseItems(order.items)}
          </p>
          <div className="mo-meta">
            <span className="mo-amount">₹{order.amount}.00</span>
            <span className="mo-separator" aria-hidden="true">·</span>
            <span className="mo-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
            <span className="mo-separator" aria-hidden="true">·</span>
            <span className="mo-date">{formatRelativeTime(order.date)}</span>
          </div>
        </div>

        <div className="mo-card-right">
          {/* Compact status strip */}
          <div className={`mo-status-badge mo-status-badge--${statusModifier(order.status)}`}>
            {isCancelledStatus(order.status) ? (
              <span>{order.status}</span>
            ) : (
              <OrderTimeline status={order.status} compact />
            )}
          </div>

          {/* Track / collapse button */}
          {!isCancelledStatus(order.status) && (
            <button
              className={`mo-track-btn ${expanded ? 'mo-track-btn--active' : ''}`}
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls={`timeline-${order._id}`}
            >
              {expanded ? 'Hide ▲' : 'Track Order ▼'}
            </button>
          )}
        </div>
      </div>

      {/* ── Expandable full timeline ── */}
      {expanded && !isCancelledStatus(order.status) && (
        <div
          id={`timeline-${order._id}`}
          className="mo-timeline-wrapper"
          role="region"
          aria-label="Order timeline"
        >
          <OrderTimeline status={order.status} />
        </div>
      )}

      {/* Cancelled state always inline (no expand needed) */}
      {isCancelledStatus(order.status) && (
        <div className="mo-timeline-wrapper">
          <OrderTimeline status={order.status} />
        </div>
      )}

      {/* Mock badge */}
      {isMock && order._mockStageLabel && (
        <div className="mo-mock-badge" aria-hidden="true">
          🛠 {order._mockStageLabel}
        </div>
      )}
    </div>
  );
};

// ── MyOrders page ─────────────────────────────────────────────────────────────

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMockPreview, setShowMockPreview] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        url + '/api/order/userorders',
        {},
        { headers: { token } }
      );
      setData(response.data.data ?? []);
    } catch {
      setError('Could not load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token, fetchOrders]);

  return (
    <div className="my-orders">
      {/* ── Page header ── */}
      <div className="mo-page-header">
        <h2>My Orders</h2>
        {token && (
          <button
            className="mo-refresh-btn"
            onClick={fetchOrders}
            disabled={loading}
            aria-label="Refresh orders"
          >
            {loading ? 'Refreshing…' : '↻ Refresh'}
          </button>
        )}
      </div>

      {/* ── Real orders ── */}
      <div className="mo-list">
        {!token && (
          <p className="mo-empty">Sign in to view your orders.</p>
        )}
        {token && loading && (
          <p className="mo-empty">Loading orders…</p>
        )}
        {token && !loading && error && (
          <p className="mo-empty mo-empty--error" role="alert">{error}</p>
        )}
        {token && !loading && !error && data.length === 0 && (
          <p className="mo-empty">You haven't placed any orders yet.</p>
        )}
        {data.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {/* ── Dev preview: all 9 stages ── */}
      <div className="mo-mock-section">
        <button
          className="mo-mock-toggle"
          onClick={() => setShowMockPreview((v) => !v)}
          aria-expanded={showMockPreview}
        >
          <span className="mo-mock-toggle-icon">{showMockPreview ? '▼' : '▶'}</span>
          🛠&nbsp; Timeline Stage Preview — all 9 stages + edge cases
        </button>

        {showMockPreview && (
          <div className="mo-mock-grid">
            <p className="mo-mock-note">
              Mock data only — no backend wiring. Each card shows the stepper at a
              different pipeline stage. This panel is removed before Phase 8.
            </p>
            {MOCK_TIMELINE_ORDERS.map((order) => (
              <OrderCard key={order._id} order={order} isMock />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
