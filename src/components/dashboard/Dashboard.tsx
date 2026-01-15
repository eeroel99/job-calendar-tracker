import { Briefcase, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJobApplications } from '@/hooks/useJobApplications';
import { StatsCard } from './StatsCard';
import { STATUS_CONFIG } from '@/types/job-application';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function Dashboard() {
  const { getStats } = useJobApplications();
  const stats = getStats();

  const chartData = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
    name: config.label,
    value: stats.byStatus[key as keyof typeof stats.byStatus] || 0,
    color: config.color,
  })).filter(item => item.value > 0);

  const COLORS = [
    'hsl(240, 5%, 65%)',      // no_applied
    'hsl(217, 91%, 60%)',     // applied
    'hsl(45, 93%, 47%)',      // interviewed
    'hsl(0, 84%, 60%)',       // rejected
    'hsl(142, 71%, 45%)',     // accepted
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Lamaran"
          value={stats.total}
          icon={<Briefcase className="h-6 w-6" />}
        />
        <StatsCard
          title="Bulan Ini"
          value={stats.thisMonth}
          icon={<Calendar className="h-6 w-6" />}
        />
        <StatsCard
          title="Diterima"
          value={stats.byStatus.accepted || 0}
          icon={<CheckCircle className="h-6 w-6" />}
        />
        <StatsCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Status Lamaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[Object.keys(STATUS_CONFIG).indexOf(
                          Object.entries(STATUS_CONFIG).find(([_, v]) => v.label === entry.name)?.[0] || ''
                        )]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
