"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ChevronDown, ChevronUp, ExternalLink, Filter, SortDesc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TransactionStatus } from "@/components/transaction-status"

interface Transaction {
  id: string
  description: string
  amount: string
  currency: string
  status: "pending" | "completed" | "declined"
  timestamp: string
  merchantAddress?: string
  customerAddress?: string
  txHash?: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
  userType: "merchant" | "customer"
}

export function TransactionHistory({ transactions, userType }: TransactionHistoryProps) {
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "declined">("all")

  console.log("Transactions:", transactions)
  // Sort transactions by date
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime()
    const dateB = new Date(b.timestamp).getTime()
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB
  })

  // Filter transactions by status
  const filteredTransactions = sortedTransactions.filter((transaction) => {
    if (statusFilter === "all") return true
    return transaction.status === statusFilter
  })

  const toggleExpand = (id: string) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null)
    } else {
      setExpandedTransaction(id)
    }
  }

  const openXrplExplorer = (txHash: string) => {
    window.open(`https://testnet.xrpl.org/transactions/${txHash}`, "_blank")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4 p-4 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm">
        <div className="flex items-center space-x-2">
          <SortDesc className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium">Sort:</span>
          <Button
            variant="outline"
            size="sm"
            className="festival-button"
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
          >
            {sortOrder === "newest" ? "Newest First" : "Oldest First"}
          </Button>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <Filter className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium">Filter:</span>
          <div className="flex space-x-1">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              className="festival-button"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              className="festival-button"
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              className="festival-button"
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </Button>
            <Button
              variant={statusFilter === "declined" ? "default" : "outline"}
              size="sm"
              className="festival-button"
              onClick={() => setStatusFilter("declined")}
            >
              Declined
            </Button>
          </div>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <Card className="festival-card">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-center text-gray-500 py-8">No transactions found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="festival-card overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                onClick={() => toggleExpand(transaction.id)}
              >
                <div className="flex flex-col">
                  <div className="font-medium text-purple-800 dark:text-purple-200">{transaction.description}</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(transaction.timestamp), "MMM d, yyyy h:mm a")}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                   <div className="font-medium text-lg">
                      {transaction.amount} {transaction.currency ? transaction.currency : "XRP"}
                    </div>
                    <TransactionStatus status={transaction.status} />
                  </div>
                  {expandedTransaction === transaction.id ? (
                    <ChevronUp className="h-5 w-5 text-purple-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-purple-500" />
                  )}
                </div>
              </div>

              {expandedTransaction === transaction.id && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="p-4 border-t border-purple-100 dark:border-purple-800/30 bg-purple-50/50 dark:bg-purple-900/10">
                    <div>
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-300">Order ID</div>
                      <div className="font-mono text-sm">{transaction.id}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-300">Date & Time</div>
                      <div>{format(new Date(transaction.timestamp), "PPpp")}</div>
                    </div>

                    {userType === "merchant" && transaction.customerAddress && (
                      <div>
                        <div className="text-sm font-medium text-purple-600 dark:text-purple-300">Customer Address</div>
                        <div className="font-mono text-xs break-all">{transaction.customerAddress}</div>
                      </div>
                    )}

                    {userType === "customer" && transaction.merchantAddress && (
                      <div>
                        <div className="text-sm font-medium text-purple-600 dark:text-purple-300">Merchant Address</div>
                        <div className="font-mono text-xs break-all">{transaction.merchantAddress}</div>
                      </div>
                    )}

                    {transaction.txHash && (
                      <div className="md:col-span-2">
                        <div className="text-sm font-medium text-purple-600 dark:text-purple-300">Transaction Hash</div>
                        <div className="flex items-center">
                          <span className="font-mono text-xs break-all mr-2">{transaction.txHash}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 dark:text-purple-300 dark:hover:text-purple-100 dark:hover:bg-purple-900/30"
                            onClick={(e) => {
                              e.stopPropagation()
                              openXrplExplorer(transaction.txHash!)
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
