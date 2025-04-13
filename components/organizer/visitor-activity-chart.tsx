"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface VisitorActivityChartProps {
  data: any[]
}

export function VisitorActivityChart({ data }: VisitorActivityChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="hour"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}:00`}
          />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value: number) => [`${value}`, "Transactions"]}
            labelFormatter={(label) => `Hour: ${label}:00`}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: "#8b5cf6" }}
            activeDot={{ r: 6, fill: "#d946ef" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
