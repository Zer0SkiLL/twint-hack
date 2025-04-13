"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface PopularVendorsChartProps {
  data: any[]
}

export function PopularVendorsChart({ data }: PopularVendorsChartProps) {
  // Colors for the pie chart segments
  const COLORS = ["#8b5cf6", "#d946ef", "#f59e0b", "#10b981", "#3b82f6", "#6366f1"]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} XRP`, "Revenue"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
