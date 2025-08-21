import React from "react";

interface MapPinInfoBoxProps {
  title: string;
  dateRange?: string;
  accommodationCount?: number;
  activityCount?: number;
  onViewClick?: () => void;
}

const MapPinInfoBox: React.FC<MapPinInfoBoxProps> = ({
  title,
  dateRange,
  accommodationCount,
  activityCount,
  onViewClick,
}) => {
  return (
    <div
      style={{
        borderRadius: "6px",
        border: "1px solid var(--colour-border, #E2E8F0)",
        background: "var(--colour-card, #FFF)",
        boxShadow: "0 2px 8px rgba(16, 24, 40, 0.05)",
        padding: "20px",
        minWidth: 260,
        maxWidth: 320,
        color: "var(--colour-text, #1A202C)",
        fontFamily: "inherit",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>{title}</div>
      {dateRange && (
        <div
          style={{
            fontWeight: 500,
            fontSize: 18,
            color: "var(--colour-muted, #64748B)",
            marginBottom: 12,
          }}
        >
          {dateRange}
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        {typeof accommodationCount === "number" && (
          <span style={{ color: "var(--colour-muted, #64748B)", fontSize: 16 }}>
            {accommodationCount} Accommodation
          </span>
        )}
        {typeof activityCount === "number" && (
          <span style={{ color: "var(--colour-muted, #64748B)", fontSize: 16 }}>
            {activityCount} Activities
          </span>
        )}
      </div>
      {onViewClick && (
        <button
          onClick={onViewClick}
          style={{
            background: "none",
            border: "none",
            color: "var(--colour-primary, #2563EB)",
            fontWeight: 500,
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: 0,
          }}
        >
          View <span style={{ fontSize: 18, marginLeft: 2 }}>→</span>
        </button>
      )}
    </div>
  );
};

export default MapPinInfoBox;
