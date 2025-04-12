"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, RefreshCw, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { TransactionStatus } from "@/components/transaction-status"

interface TransactionDetails {
  type: string
  merchantAddress: string
  amount: string
  description: string
  orderId: string
  customerAddress: string
  customerSeed: string
  status: "pending" | "completed" | "declined"
  timestamp: string
  txHash?: string
}

export default function TransactionPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null)
  const [xrplService, setXrplService] = useState<any>(null)

  // Load the XRPL service dynamically
  useEffect(() => {
    const loadXrplService = async () => {
      try {
        // Import all functions from the service
        const service = await import("@/lib/xrpl-service")
        setXrplService(service)
        console.log("XRPL service loaded successfully")
      } catch (error) {
        console.error("Failed to load XRPL service:", error)
        toast({
          title: "Service Error",
          description: "Failed to load the XRPL service. Please try refreshing the page.",
          variant: "destructive",
        })
      }
    }

    loadXrplService()
  }, [toast])

  useEffect(() => {
    // Get transaction details from localStorage
    const transactionData = localStorage.getItem("currentTransaction")

    if (transactionData) {
      try {
        const parsedTransaction = JSON.parse(transactionData)
        if (parsedTransaction.orderId === params.id) {
          setTransaction(parsedTransaction)
        } else {
          toast({
            title: "Transaction not found",
            description: "The transaction you're looking for doesn't exist.",
            variant: "destructive",
          })
          router.push("/customer")
        }
      } catch (error) {
        console.error("Error parsing transaction data:", error)
        toast({
          title: "Error loading transaction",
          description: "Could not load transaction details. Please try again.",
          variant: "destructive",
        })
        router.push("/customer")
      }
    } else {
      toast({
        title: "No transaction found",
        description: "No transaction data was found.",
        variant: "destructive",
      })
      router.push("/customer")
    }

    setLoading(false)
  }, [params.id, router, toast])

  const handleApprove = async () => {
    if (!transaction) return

    if (!xrplService) {
      toast({
        title: "Service not loaded",
        description: "Please wait for the XRPL service to load.",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    try {
      // Process the payment using the XRPL service
      const result = await xrplService.processPayment(
        transaction.customerSeed,
        transaction.merchantAddress,
        transaction.amount,
      )

      if (result.success) {
        // Update transaction status
        const updatedTransaction = {
          ...transaction,
          status: "completed" as const,
          txHash: result.txHash,
        }

        setTransaction(updatedTransaction)
        localStorage.setItem("currentTransaction", JSON.stringify(updatedTransaction))

        // here we'll update the merchant orders in localStorage
        const updatedMerchantOrders = JSON.parse(
          localStorage.getItem("merchantOrders") || "[]",
        ).map((order: any) => {
          if (order.id === transaction.orderId) {
            return {
              ...order,
              status: "completed",
              txHash: result.txHash,
            }
          }
          return order
        })

        localStorage.setItem("merchantOrders", JSON.stringify(updatedMerchantOrders))

        // Save to customer's transaction history
        const transactionHistoryKey = `transactions_${transaction.customerAddress}`
        const customerTransactions = JSON.parse(localStorage.getItem(transactionHistoryKey) || "[]")
        customerTransactions.push(updatedTransaction)
        localStorage.setItem(transactionHistoryKey, JSON.stringify(customerTransactions))

        // we'll also update the merchant via webSocket
        // const socket = new WebSocket("ws://localhost:3001")
        const socket = new WebSocket("wss://3cdb-153-46-253-205.ngrok-free.app")

        socket.onopen = () => {
          socket.send(
            JSON.stringify({
              type: "update",
              orderId: transaction.orderId,
              status: "completed",
              txHash: result.txHash,
            })
          )
          socket.close()
        }

        toast({
          title: "Payment successful",
          description: "Your transaction has been successfully processed.",
        })
      } else {
        throw new Error("Transaction failed")
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      toast({
        title: "Error processing payment",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleDecline = async () => {
    if (!transaction) return

    setProcessing(true)

    try {
      // Update transaction status
      const updatedTransaction = {
        ...transaction,
        status: "declined" as const,
      }

      setTransaction(updatedTransaction)
      localStorage.setItem("currentTransaction", JSON.stringify(updatedTransaction))

      // Update merchant orders in localStorage to reflect declined payment
      const merchantOrders = JSON.parse(localStorage.getItem("merchantOrders") || "[]")
      const updatedOrders = merchantOrders.map((order: any) => {
        if (order.id === transaction.orderId) {
          return {
            ...order,
            status: "declined",
          }
        }
        return order
      })
      localStorage.setItem("merchantOrders", JSON.stringify(updatedOrders))

      // Save to customer's transaction history
      const transactionHistoryKey = `transactions_${transaction.customerAddress}`
      const customerTransactions = JSON.parse(localStorage.getItem(transactionHistoryKey) || "[]")
      customerTransactions.push(updatedTransaction)
      localStorage.setItem(transactionHistoryKey, JSON.stringify(customerTransactions))

      toast({
        title: "Payment declined",
        description: "You have declined this transaction.",
      })
    } catch (error) {
      console.error("Error declining transaction:", error)
      toast({
        title: "Error",
        description: "There was an error declining the transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/customer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customer Portal
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Transaction Details</h1>

      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin mb-4" />
            <p>Loading transaction details...</p>
          </CardContent>
        </Card>
      ) : transaction ? (
        <Card>
          <CardHeader>
            <CardTitle>Payment Request</CardTitle>
            <CardDescription>Review the transaction details before approving or declining.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
              <p className="font-mono">{transaction.orderId}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Merchant Address</h3>
              <p className="font-mono text-xs break-all">{transaction.merchantAddress}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p>{transaction.description}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Amount</h3>
              <p className="text-2xl font-bold">{transaction.amount} XRP</p>
            </div>

            {transaction.txHash && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">Transaction Hash</h3>
                <p className="font-mono text-xs break-all">{transaction.txHash}</p>
              </div>
            )}

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <TransactionStatus status={transaction.status} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {transaction.status === "pending" ? (
              <>
                <Button className="w-full" onClick={handleApprove} disabled={processing || !xrplService}>
                  {processing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : !xrplService ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Loading Service...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve & Pay
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleDecline} disabled={processing}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline
                </Button>
              </>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => router.push("/customer")}>
                Return to Customer Portal
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <XCircle className="h-8 w-8 text-red-500 mb-4" />
            <p className="text-center">Transaction not found or has been deleted.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
