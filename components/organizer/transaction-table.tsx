"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TransactionTableProps {
  transactions: any[]
  visitors: any[]
  vendors: any[]
  showPagination?: boolean
}

export function TransactionTable({ transactions, visitors, vendors, showPagination = false }: TransactionTableProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase()
    const vendor = vendors.find((v) => v.id === transaction.vendorId)
    const visitor = visitors.find((v) => v.id === transaction.visitorId)

    return (
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.description.toLowerCase().includes(searchLower) ||
      (vendor && vendor.name.toLowerCase().includes(searchLower)) ||
      (visitor && visitor.name.toLowerCase().includes(searchLower))
    )
  })

  // Paginate transactions
  const paginatedTransactions = showPagination
    ? filteredTransactions.slice((page - 1) * pageSize, page * pageSize)
    : filteredTransactions

  const totalPages = Math.ceil(filteredTransactions.length / pageSize)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500">Completed</Badge>
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "declined":
        return <Badge className="bg-red-500">Declined</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const getVisitorName = (visitorId: string) => {
    const visitor = visitors.find((v) => v.id === visitorId)
    return visitor ? visitor.name : "Unknown Visitor"
  }

  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find((v) => v.id === vendorId)
    return vendor ? vendor.name : "Unknown Vendor"
  }

  return (
    <div className="space-y-4">
      {showPagination && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search transactions..."
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
              <TableHead>Transaction ID</TableHead>
              <TableHead>Visitor</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-xs">{transaction.id.substring(0, 10)}...</TableCell>
                  <TableCell>{getVisitorName(transaction.visitorId)}</TableCell>
                  <TableCell>{getVendorName(transaction.vendorId)}</TableCell>
                  <TableCell className="font-medium">{transaction.amount} XRP</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{format(new Date(transaction.timestamp), "MMM d, yyyy h:mm a")}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No transactions found.
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
