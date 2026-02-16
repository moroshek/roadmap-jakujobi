import type { TimelineScale } from "@/lib/gantt/calculateTimelineScale";

interface TimelineAxisProps {
  scale: TimelineScale;
  height: number;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function TimelineAxis({ scale, height }: TimelineAxisProps) {
  const months: Array<{ label: string; x: number }> = [];
  const current = new Date(scale.startDate);

  while (current <= scale.endDate) {
    const daysFromStart =
      (current.getTime() - scale.startDate.getTime()) / MS_PER_DAY;
    const x = daysFromStart * scale.dayWidth;

    months.push({
      label: current.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      x,
    });

    current.setMonth(current.getMonth() + 1);
  }

  return (
    <g>
      <rect
        x={0}
        y={0}
        width={scale.totalWidth}
        height={height}
        fill="#F9FAFB"
      />
      {months.map((month, idx) => (
        <g key={idx}>
          <line
            x1={month.x}
            y1={0}
            x2={month.x}
            y2={height}
            stroke="#E5E7EB"
            strokeWidth={1}
          />
          <text
            x={month.x + 10}
            y={height / 2}
            dominantBaseline="middle"
            className="text-sm font-medium fill-gray-600"
          >
            {month.label}
          </text>
        </g>
      ))}
    </g>
  );
}
