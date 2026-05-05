import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import type { Candidate } from "../lib/store"

interface VoteChartProps {
  candidates: Candidate[];
  type?: 'bar' | 'pie';
}

const COLORS = ['hsl(217 91% 50%)', 'hsl(262 80% 58%)', 'hsl(142 71% 45%)', 'hsl(38 92% 50%)', 'hsl(0 72% 51%)'];

const VoteChart: React.FC<VoteChartProps> = ({ candidates, type = 'bar' }) => {
  const data = candidates.map((c, i) => ({
    name: c.name.split(' ')[0],
    fullName: c.name,
    votes: c.voteCount,
    party: c.party,
    fill: COLORS[i % COLORS.length]
  }));

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  if (type === 'pie') {
    const pieData = data.map(d => ({ ...d, value: d.votes }));
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} votes (${totalVotes > 0 ? ((value / totalVotes) * 100).toFixed(1) : 0}%)`, 'Votes']}
            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220 15% 88%)', fontSize: '12px' }}
          />
          <Legend formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 92%)" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(220 10% 50%)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'hsl(220 10% 50%)' }} allowDecimals={false} />
        <Tooltip
          formatter={(value: number, _name: string, props) => [
            `${value} votes`,
            props.payload?.fullName || 'Candidate'
          ]}
          contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220 15% 88%)', fontSize: '12px' }}
        />
        <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VoteChart;