import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LabelList, Label } from 'recharts';

interface PieChartProps {
  /** Series data — one number per slice */
  series?: number[];
  /** Labels for each slice */
  labels?: string[];
  /** Chart height in pixels */
  height?: number;
}

const CHART_COLORS = [
  'var(--primary)', // primary brand color from CSS
  '#3b82f6', // blue-500     — blue
  '#f59e0b', // amber-500    — yellow / amber
  '#8b5cf6', // violet-500   — purple
  '#f43f5e', // rose-500     — rose / pink
  '#06b6d4', // cyan-500     — cyan / teal
];

export const PieChart01 = ({
  series = [320, 280, 200, 160, 140, 100],
  labels = ['AWS Cloud', 'Data Science', 'Cybersecurity', 'PM Pro', 'X Research', 'DevOps'],
  height = 280,
}: PieChartProps) => {
  // Transform ApexCharts format to Recharts format
  const chartData = useMemo(() => {
    if (!series || !labels) return [];
    return labels.map((label, idx) => ({
      name: label,
      value: series[idx] || 0,
      fill: CHART_COLORS[idx % CHART_COLORS.length],
    }));
  }, [series, labels]);

  // Calculate total certificates
  const totalCertificates = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  // Custom tooltips matching the dashboard aesthetic
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-3 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold text-foreground mb-1">{data.name}</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.fill }} />
            <p className="text-xs font-medium text-muted-foreground">
              Issued: <span className="font-bold text-foreground">{data.value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend matching the dashboard aesthetic
  const CustomLegend = ({ payload }: any) => {
    if (!payload) return null;
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-2">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.payload.fill }} />
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full flex items-center justify-center relative overflow-hidden" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={48}
            outerRadius={75}
            paddingAngle={2.5}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="var(--card)" strokeWidth={2.5} />
            ))}
            <LabelList
              dataKey="value"
              position="inside"
              className="fill-white font-bold"
              stroke="none"
              fontSize={10}
              formatter={(value: any) => {
                if (totalCertificates === 0) return '';
                const numericValue = Number(value);
                const pct = (numericValue / totalCertificates) * 100;
                return pct >= 8 ? `${pct.toFixed(0)}%` : '';
              }}
            />
            <Label
              position="center"
              content={({ viewBox }: any) => {
                const { cx, cy } = viewBox || { cx: 0, cy: 0 };
                return (
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
                    <tspan x={cx} dy="-8" className="fill-muted-foreground text-[10px] font-bold uppercase tracking-wider">Total</tspan>
                    <tspan x={cx} dy="18" className="fill-foreground text-2xl font-bold tracking-tight">{totalCertificates}</tspan>
                  </text>
                );
              }}
            />
          </Pie>
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart01;
