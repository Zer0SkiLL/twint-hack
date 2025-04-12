"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"

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
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Sort:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
          >
            {sortOrder === "newest" ? "Newest First" : "Oldest First"}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Filter:</span>
          <div className="flex space-x-1">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </Button>
            <Button
              variant={statusFilter === "declined" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("declined")}
            >
              Declined
            </Button>
          </div>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-center text-gray-500 py-8">No transactions found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(transaction.id)}
              >
                <div className="flex flex-col">
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(transaction.timestamp), "MMM d, yyyy h:mm a")}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">
                      {transaction.amount} {transaction.currency ? transaction.currency : "XRP"}
                    </div>
                    <TransactionStatus status={transaction.status} />
                  </div>
                  {expandedTransaction === transaction.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedTransaction === transaction.id && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Order ID</div>
                      <div className="font-mono text-sm">{transaction.id}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Date & Time</div>
                      <div>{format(new Date(transaction.timestamp), "PPpp")}</div>
                    </div>

                    {userType === "merchant" && transaction.customerAddress && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Customer Address</div>
                        <div className="font-mono text-xs break-all">{transaction.customerAddress}</div>
                      </div>
                    )}

                    {userType === "customer" && transaction.merchantAddress && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Merchant Address</div>
                        <div className="font-mono text-xs break-all">{transaction.merchantAddress}</div>
                      </div>
                    )}

                    {transaction.txHash && (
                      <div className="md:col-span-2">
                        <div className="text-sm font-medium text-gray-500">Transaction Hash</div>
                        <div className="flex items-center">
                          <span className="font-mono text-xs break-all mr-2">{transaction.txHash}</span>
                          <Button
                            variant="ghost"
                            size="icon"
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
