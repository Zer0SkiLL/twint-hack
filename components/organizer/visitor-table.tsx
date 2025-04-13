"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VisitorTableProps {
  visitors: any[]
  transactions: any[]
  showPagination?: boolean
}

export function VisitorTable({ visitors, transactions, showPagination = false }: VisitorTableProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter visitors based on search term
  const filteredVisitors = visitors.filter((visitor) => {
    const searchLower = searchTerm.toLowerCase()
    return visitor.name.toLowerCase().includes(searchLower) || visitor.walletAddress.toLowerCase().includes(searchLower)
  })

  // Paginate visitors
  const paginatedVisitors = showPagination
    ? filteredVisitors.slice((page - 1) * pageSize, page * pageSize)
    : filteredVisitors

  const totalPages = Math.ceil(filteredVisitors.length / pageSize)

  // Calculate visitor stats
  const getVisitorStats = (visitorId: string) => {
    const visitorTransactions = transactions.filter((t) => t.visitorId === visitorId)
    const totalSpent = visitorTransactions
      .reduce((sum, t) => sum + (t.status === "completed" ? Number.parseFloat(t.amount) : 0), 0)
      .toFixed(2)

    return {
      transactionCount: visitorTransactions.length,
      totalSpent,
    }
  }

  return (
    <div className="space-y-4">
      {showPagination && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search visitors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">Rows per page:</p>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-16">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitor Name</TableHead>
              <TableHead>Wallet Address</TableHead>
              <TableHead>Check-in Time</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVisitors.length > 0 ? (
              paginatedVisitors.map((visitor) => {
                const stats = getVisitorStats(visitor.id)
                const visitorTransactions = transactions.filter((t) => t.visitorId === visitor.id)
                const lastActivity =
                  visitorTransactions.length > 0
                    ? new Date(Math.max(...visitorTransactions.map((t) => new Date(t.timestamp).getTime())))
                    : visitor.checkInTime

                return (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">{visitor.name}</TableCell>
                    <TableCell className="font-mono text-xs">{visitor.walletAddress.substring(0, 10)}...</TableCell>
                    <TableCell>{format(new Date(visitor.checkInTime), "MMM d, yyyy h:mm a")}</TableCell>
                    <TableCell>{stats.transactionCount}</TableCell>
                    <TableCell>{stats.totalSpent} XRP</TableCell>
                    <TableCell>{format(new Date(lastActivity), "MMM d, yyyy h:mm a")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No visitors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
