'use client';

import dynamic from 'next/dynamic';

interface ChartComponentProps {
  data: Array<{ date: string; value: number }>;
  color: string;
}

const ChartComponents = dynamic(
  () =>
    import('recharts').then((mod) => ({
      default: ({ data, color }: ChartComponentProps) => {
        const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = mod;
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      },
    })),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-slate-100 rounded" />,
  }
);

interface ChartProps {
  data: Array<{ date: string; value: number }>;
  color: string;
}

export function HealthChart({ data, color }: ChartProps) {
  return <ChartComponents data={data} color={color} />;
}

export default HealthChart;
