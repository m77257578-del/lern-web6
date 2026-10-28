import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { UserOrder } from '../services/storageService';

interface ClientSpendingChartProps {
  orders: UserOrder[];
  lang: 'ar' | 'en';
}

const ClientSpendingChart: React.FC<ClientSpendingChartProps> = ({ orders, lang }) => {
  const isRtl = lang === 'ar';

  const chartData = useMemo(() => {
    const months: Record<string, { month: string; monthIndex: number; subscriptions: number; tools: number }> = {};
    
    // Sort orders by date to process chronologically
    const sortedOrders = [...orders].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    sortedOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthLabel = date.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short' });
      const yearLabel = date.getFullYear();
      const key = `${monthLabel} ${yearLabel}`;

      if (!months[key]) {
        months[key] = {
          month: key,
          monthIndex: date.getMonth() + date.getFullYear() * 12,
          subscriptions: 0,
          tools: 0
        };
      }

      // Parse amount (e.g., "950 EGP" -> 950)
      const amount = parseFloat(order.amount.replace(/[^\d.]/g, '')) || 0;

      if (order.planType === 'full') {
        months[key].tools += amount;
      } else {
        months[key].subscriptions += amount;
      }
    });

    return Object.values(months).sort((a, b) => a.monthIndex - b.monthIndex);
  }, [orders, lang]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-slate-200 font-bold mb-2 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              <span className="text-slate-400">
                {entry.name}:
              </span>
              <span className="text-white font-mono font-bold">
                {entry.value.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (orders.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm font-medium italic">
        {lang === 'ar' ? 'لا توجد بيانات مالية مسجلة بعد' : 'No financial data recorded yet'}
      </div>
    );
  }

  return (
    <div className="w-full h-80 mt-4" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
          />
          <Bar 
            name={lang === 'ar' ? 'الاشتراكات' : 'Subscriptions'} 
            dataKey="subscriptions" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
          />
          <Bar 
            name={lang === 'ar' ? 'أدوات تعليمية' : 'Edu Tools'} 
            dataKey="tools" 
            fill="#8b5cf6" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClientSpendingChart;
