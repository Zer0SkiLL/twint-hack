"use client"

import { Users, CreditCard, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface OrganizerStatsProps {
  data: any
}

export function OrganizerStats({ data }: OrganizerStatsProps) {
  // Calculate stats from data
  const totalVisitors = data.visitors.length
  const totalTransactions = data.transactions.length

  const totalRevenue = data.transactions
    .reduce((sum: number, transaction: any) => sum + Number.parseFloat(transaction.amount), 0)
    .toFixed(2)

  // Calculate average transaction time (in minutes)
  const transactionTimes = data.transactions
    .map((t: any) => {
      if (t.completedAt && t.createdAt) {
        return (new Date(t.completedAt).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60)
      }
      return null
    })
    .filter(Boolean)

  const avgTransactionTime =
    transactionTimes.length > 0
      ? (transactionTimes.reduce((sum: number, time: number) => sum + time, 0) / transactionTimes.length).toFixed(1)
      : "N/A"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="festival-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Visitors</p>
              <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">{totalVisitors}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="festival-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-full">
              <CreditCard className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transactions</p>
              <h3 className="text-2xl font-bold text-pink-600 dark:text-pink-300">{totalTransactions}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="festival-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-300">{totalRevenue} XRP</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="festival-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Transaction Time</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
                {avgTransactionTime} {avgTransactionTime !== "N/A" ? "min" : ""}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
