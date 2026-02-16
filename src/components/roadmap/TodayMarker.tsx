interface TodayMarkerProps {
  x: number;
  height: number;
  topOffset: number;
}

export function TodayMarker({ x, height, topOffset }: TodayMarkerProps) {
  return (
    <g>
      <line
        x1={x}
        y1={topOffset}
        x2={x}
        y2={height}
        stroke="#EF4444"
        strokeWidth={2}
        strokeDasharray="5,5"
      />
      <text
        x={x + 5}
        y={topOffset + 15}
        className="text-xs font-semibold fill-red-600"
      >
        Today
      </text>
    </g>
  );
}
