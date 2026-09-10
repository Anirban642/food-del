import React from 'react';
import './OrderTimeline.css';

/**
 * All 9 order pipeline stages in sequence.
 * key  — matches both mock status strings and future Phase-10 socket event payloads.
 * label — short display name shown in the stepper.
 * desc  — sub-label shown only for the currently active step.
 */
export const ORDER_STAGES = [
  { key: 'placed',            label: 'Placed',             desc: 'Your order has been received' },
  { key: 'payment_confirmed', label: 'Payment Confirmed',  desc: 'Payment verified successfully' },
  { key: 'accepted',          label: 'Accepted',           desc: 'Restaurant confirmed your order' },
  { key: 'preparing',         label: 'Preparing',          desc: 'Chef is working on your food' },
  { key: 'courier_assigned',  label: 'Courier Assigned',   desc: 'A rider has been dispatched' },
  { key: 'ready',             label: 'Ready',              desc: 'Order packed and waiting for pickup' },
  { key: 'picked_up',         label: 'Picked Up',          desc: 'Rider has your order' },
  { key: 'nearby',            label: 'Nearby',             desc: "Almost there — rider is close!" },
  { key: 'delivered',         label: 'Delivered',          desc: 'Enjoy your meal! 🎉' },
];

/**
 * Maps any status string — current backend values OR Phase-10 stage keys — to
 * a 0-based stage index in ORDER_STAGES.
 *
 * Backend values today:  "Food Processing" | "Out For Delivery" | "Delivered"
 * Phase-10 stage keys:   the .key fields from ORDER_STAGES above
 */
const STATUS_TO_INDEX = {
  // ── Current backend statuses ──────────────────────────────────────────
  'Food Processing': 2,   // restaurant accepted & preparing
  'Out For Delivery': 6,  // courier has picked up
  'Delivered': 8,         // final stage

  // ── Mock / Phase-10 socket event keys ────────────────────────────────
  placed:            0,
  payment_confirmed: 1,
  accepted:          2,
  preparing:         3,
  courier_assigned:  4,
  ready:             5,
  picked_up:         6,
  nearby:            7,
  delivered:         8,
};

const CANCELLED_STATUSES = new Set([
  'Payment Cancelled',
  'Payment Expired',
  'Cancelled',
]);

/** Resolve a status string to its 0-based stage index. */
export const resolveStageIndex = (status) => STATUS_TO_INDEX[status] ?? 0;

/** Returns true for any cancelled / failed payment status. */
export const isCancelledStatus = (status) => CANCELLED_STATUSES.has(status);

// ── SVG icons used inside the step circles ────────────────────────────────────

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="ot-check-icon">
    <path
      d="M5 13l4 4L19 7"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="ot-x-icon">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
  </svg>
);

// ── Main component ────────────────────────────────────────────────────────────

/**
 * OrderTimeline
 *
 * Props:
 *   status {string} — any backend status string or ORDER_STAGES key.
 *   compact {bool}  — if true, renders a compact single-line summary instead
 *                     of the full stepper (useful inside order cards before expansion).
 */
const OrderTimeline = ({ status, compact = false }) => {
  // ── Cancelled / failed payment state ─────────────────────────────────
  if (isCancelledStatus(status)) {
    return (
      <div className="ot-root ot-cancelled" role="status" aria-label={`Order status: ${status}`}>
        <div className="ot-cancelled-badge">
          <span className="ot-cancelled-circle">
            <XIcon />
          </span>
          <div className="ot-cancelled-text">
            <span className="ot-cancelled-title">{status}</span>
            <span className="ot-cancelled-sub">
              {status === 'Payment Expired'
                ? 'Your payment session timed out. Please place a new order.'
                : 'This order was cancelled. Any charged amount will be refunded.'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const activeIndex = resolveStageIndex(status);
  const activeStage = ORDER_STAGES[activeIndex];

  // ── Compact summary strip ─────────────────────────────────────────────
  if (compact) {
    return (
      <div className="ot-compact" role="status">
        <span className="ot-compact-dot" aria-hidden="true" />
        <span className="ot-compact-label">{activeStage.label}</span>
        <span className="ot-compact-step">
          Step {activeIndex + 1} of {ORDER_STAGES.length}
        </span>
      </div>
    );
  }

  // ── Full stepper ──────────────────────────────────────────────────────
  return (
    <div
      className="ot-root ot-stepper"
      role="list"
      aria-label="Order delivery progress"
    >
      {ORDER_STAGES.map((stage, index) => {
        const isCompleted = index < activeIndex;
        const isActive    = index === activeIndex;
        // derive class suffix
        const state = isCompleted ? 'completed' : isActive ? 'active' : 'future';

        return (
          <div
            key={stage.key}
            className={`ot-item ot-item--${state}`}
            role="listitem"
            aria-current={isActive ? 'step' : undefined}
          >
            {/* ── Circle ── */}
            <div className="ot-circle" aria-hidden="true">
              {isCompleted ? <CheckIcon /> : <span className="ot-step-num">{index + 1}</span>}
            </div>

            {/* ── Label block ── */}
            <div className="ot-label">
              <span className="ot-label-main">{stage.label}</span>
              {isActive && (
                <span className="ot-label-desc">{stage.desc}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;

