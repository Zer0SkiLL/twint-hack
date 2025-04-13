"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Copy, Eye, EyeOff, RefreshCw, Music, Ticket } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { TransactionStatus } from "@/components/transaction-status"
import { TransactionHistory } from "@/components/transaction-history" 
import { FestivalHeader } from "@/components/festival-header"

export default function MerchantPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showSeed, setShowSeed] = useState(false)
  const [walletSeed, setWalletSeed] = useState("")
  const [walletInfo, setWalletInfo] = useState<{
    address: string
    balance: string
    isValid: boolean
  } | null>(null)
  const [orderData, setOrderData] = useState({
    description: "",
    amount: "",
    currency: "XRP",
  })
  const [activeOrder, setActiveOrder] = useState<{
    id: string
    description: string
    amount: string
    currency: string
    status: "pending" | "completed" | "declined"
    qrCode: string,
    txHash?: string
  } | null>(null)
  const [xrplService, setXrplService] = useState<any>(null)
  const [orderHistory, setOrderHistory] = useState<any[]>([])

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

  // Check if wallet is stored in localStorage
  useEffect(() => {
    if (xrplService) {
      const storedSeed = localStorage.getItem("merchantWalletSeed")
      if (storedSeed) {
        setWalletSeed(storedSeed)
        validateWallet(storedSeed)
      }
    }
  }, [xrplService])

  // Load order history from localStorage
  useEffect(() => {
    const loadOrderHistory = () => {
      const orders = JSON.parse(localStorage.getItem("merchantOrders") || "[]")
      setOrderHistory(orders)
    }

    loadOrderHistory()

    // Set up an interval to refresh the order history
    const interval = setInterval(loadOrderHistory, 5000)
    return () => clearInterval(interval)
  }, [])

  const validateWallet = async (seed: string) => {
    if (!xrplService) {
      toast({
        title: "Service not loaded",
        description: "Please wait for the XRPL service to load.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const wallet = await xrplService.getWalletFromSeed(seed)
      if (wallet) {
        const balance = await xrplService.getWalletBalance(wallet.address)
        setWalletInfo({
          address: wallet.address,
          balance: balance,
          isValid: true,
        })
        localStorage.setItem("merchantWalletSeed", seed)
      } else {
        setWalletInfo(null)
        toast({
          title: "Invalid wallet seed",
          description: "The seed you entered is not valid.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error validating wallet:", error)
      setWalletInfo(null)
      toast({
        title: "Error validating wallet",
        description: "There was an error validating your wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSeedSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletSeed) {
      toast({
        title: "Missing information",
        description: "Please enter your wallet seed.",
        variant: "destructive",
      })
      return
    }
    await validateWallet(walletSeed)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setOrderData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderData.description || !orderData.amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (!walletInfo?.isValid) {
      toast({
        title: "Invalid wallet",
        description: "Please enter a valid wallet seed first.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Create a unique order ID
      const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`

      // Create QR code data with merchant address and amount
      const qrData = {
        type: "xrpl_payment",
        merchantAddress: walletInfo.address,
        amount: orderData.amount,
        description: orderData.description,
        orderId: orderId,
      }

      // Convert to JSON string for QR code
      const qrCodeData = JSON.stringify(qrData)

      setActiveOrder({
        id: orderId,
        description: orderData.description,
        amount: orderData.amount,
        currency: orderData.currency,
        status: "pending",
        qrCode: qrCodeData,
      })

      // Store the order in localStorage for status tracking
      const orders = JSON.parse(localStorage.getItem("merchantOrders") || "[]")
      const newOrder = {
        id: orderId,
        description: orderData.description,
        amount: orderData.amount,
        currency: orderData.currency,
        status: "pending",
        merchantAddress: walletInfo.address,
        timestamp: new Date().toISOString(),
      }

      orders.push(newOrder)
      localStorage.setItem("merchantOrders", JSON.stringify(orders))

      // Update the order history
      setOrderHistory([...orders])

      toast({
        title: "Order created",
        description: `Order ID: ${orderId} has been created successfully.`,
      })
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error creating order",
        description: "There was an error creating your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }



  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    })
  }

  const resetForm = () => {
    setOrderData({
      description: "",
      amount: "",
      currency: "XRP",
    })
    setActiveOrder(null)
  }

  const clearWallet = () => {
    localStorage.removeItem("merchantWalletSeed")
    setWalletSeed("")
    setWalletInfo(null)
    toast({
      title: "Wallet cleared",
      description: "Your wallet information has been cleared.",
    })
  }

  const generateTestWallet = async () => {
    if (!xrplService) {
      toast({
        title: "Service not loaded",
        description: "Please wait for the XRPL service to load.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await xrplService.generateTestWallet()
      if (result) {
        setWalletSeed(result.wallet.seed)
        setWalletInfo({
          address: result.wallet.address,
          balance: result.balance,
          isValid: true,
        })
        localStorage.setItem("merchantWalletSeed", result.wallet.seed)
        toast({
          title: "Test wallet generated",
          description: "A test wallet has been generated and funded with XRP.",
        })
      }
    } catch (error) {
      console.error("Error generating test wallet:", error)
      toast({
        title: "Error generating wallet",
        description: "There was an error generating a test wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!activeOrder?.id) return
  
    // const socket = new WebSocket("ws://localhost:3001")
    const socket = new WebSocket("wss://3cdb-153-46-253-205.ngrok-free.app")

  
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "subscribe", orderId: activeOrder.id }))
    }
  
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      if (data.orderId === activeOrder.id) {
        setActiveOrder((prev) => ({
          ...prev!,
          status: data.status,
          txHash: data.txHash,
        }))

        if (data.status === "completed") {
          const orders = JSON.parse(localStorage.getItem("merchantOrders") || "[]")
          const orderIndex = orders.findIndex((order: any) => order.id === activeOrder.id)
          if (orderIndex !== -1) {
            orders[orderIndex].status = "completed"
            localStorage.setItem("merchantOrders", JSON.stringify(orders))
          }

          // update balance
          const newBalance = await xrplService.getWalletBalance(walletInfo!.address)

          setWalletInfo((prev) => ({
            ...prev!,
            balance: newBalance,
          }))
        }
        if (data.status === "declined") {
          const orders = JSON.parse(localStorage.getItem("merchantOrders") || "[]")
          const orderIndex = orders.findIndex((order: any) => order.id === activeOrder.id)
          if (orderIndex !== -1) {
            orders[orderIndex].status = "declined"
            localStorage.setItem("merchantOrders", JSON.stringify(orders))
          }
        }

        // update order history
        const updatedOrderHistory = orderHistory.map((order) => {
          if (order.id === activeOrder.id) {
            return {
              ...order,
              status: data.status,
              txHash: data.txHash,
            }
          }
          return order
        })
        setOrderHistory(updatedOrderHistory)
  
        toast({
          title: `Order ${data.status}`,
          description: data.txHash ? `TxHash: ${data.txHash}` : undefined,
        })
      }
    }
  
    return () => {
      socket.close()
    }
  }, [activeOrder?.id])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <FestivalHeader title="Vendor Portal" showBackButton backUrl="/" />
        <div className="container mx-auto py-8 px-4">


      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center mb-6 space-x-2">
            <Ticket className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200">Vendor Portal</h1>
          </div>

          {!walletInfo?.isValid ? (
            <Card className="festival-card">
              <CardHeader>
                <CardTitle className="text-purple-700 dark:text-purple-300">Connect Your Wallet</CardTitle>
                <CardDescription>
                  Enter your XRP Ledger wallet seed to create orders and receive payments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSeedSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletSeed">Wallet Seed</Label>
                    <div className="relative">
                      <Input
                        id="walletSeed"
                        type={showSeed ? "text" : "password"}
                        placeholder="Enter your wallet seed..."
                        value={walletSeed}
                        onChange={(e) => setWalletSeed(e.target.value)}
                        required
                        className="festival-input"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-600"
                        onClick={() => setShowSeed(!showSeed)}
                      >
                        {showSeed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      For testing, you can use a test wallet from the XRP Testnet Faucet.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full festival-button bg-gradient-to-r from-purple-600 to-pink-600"
                    disabled={loading || !xrplService}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : !xrplService ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Loading Service...
                      </>
                    ) : (
                      "Connect Wallet"
                    )}
                  </Button>

                  <div className="text-center mt-2">
                    <p className="text-sm text-gray-500 mb-2">- or -</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateTestWallet}
                      className="festival-button"
                      disabled={loading || !xrplService}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : !xrplService ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Loading Service...
                        </>
                      ) : (
                        "Generate Test Wallet"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="create-order" className="w-full">
              <TabsList className="grid w-full grid-cols-3 festival-button p-1 bg-purple-100 dark:bg-purple-900/30">
                <TabsTrigger
                  value="create-order"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  Create Order
                </TabsTrigger>
                <TabsTrigger
                  value="order-history"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  Order History
                </TabsTrigger>
                <TabsTrigger
                  value="wallet-info"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  Wallet Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create-order">
                <Card className="festival-card">
                  <CardHeader>
                    <CardTitle className="text-purple-700 dark:text-purple-300">Create New Order</CardTitle>
                    <CardDescription>
                      Fill in the details to create a new order and generate a QR code for customer payment.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateOrder} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="description">Order Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Enter order details..."
                          value={orderData.description}
                          onChange={handleInputChange}
                          required
                          className="festival-input"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.000001"
                            placeholder="0.00"
                            value={orderData.amount}
                            onChange={handleInputChange}
                            required
                            className="festival-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <Input
                            id="currency"
                            name="currency"
                            value={orderData.currency}
                            onChange={handleInputChange}
                            disabled
                            className="festival-input"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full festival-button bg-gradient-to-r from-purple-600 to-pink-600"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Creating Order...
                          </>
                        ) : (
                          "Create Order & Generate QR Code"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="order-history">
                <Card className="festival-card">
                  <CardHeader>
                    <CardTitle className="text-purple-700 dark:text-purple-300">Order History</CardTitle>
                    <CardDescription>View all your past orders and their payment status.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionHistory transactions={orderHistory} userType="merchant" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wallet-info">
                <Card className="festival-card">
                  <CardHeader>
                    <CardTitle className="text-purple-700 dark:text-purple-300">Wallet Information</CardTitle>
                    <CardDescription>Your XRP Ledger wallet details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Wallet Address</Label>
                      <div className="flex items-center gap-2">
                        <Input value={walletInfo.address} readOnly className="festival-input font-mono" />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(walletInfo.address)}
                            className="text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                          >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Balance</Label>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {walletInfo.balance} XRP
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Wallet Seed (Keep Secret!)</Label>
                      <div className="relative">
                        <Input
                            type={showSeed ? "text" : "password"}
                            value={walletSeed}
                            readOnly
                            className="festival-input font-mono"
                          />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-600"
                          onClick={() => setShowSeed(!showSeed)}
                        >
                          {showSeed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button variant="destructive" onClick={clearWallet} className="w-full mt-4 festival-button">
                      Clear Wallet Information
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div>
        <div className="flex items-center mb-6 space-x-2">
          <Music className="h-6 w-6 text-pink-600" />
          <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-300">Active Order</h2>
        </div>

          {activeOrder ? (
            <Card className="festival-card festival-card-glow">
              <CardHeader>
                <CardTitle className="text-pink-600 dark:text-pink-300">Order #{activeOrder.id}</CardTitle>
                <CardDescription>Share this QR code with your customer to complete the payment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-white">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <div className="bg-white p-2 rounded-lg">
                      <QRCodeSVG
                        value={activeOrder.qrCode}
                        size={200}
                        level="H"
                        includeMargin
                        bgColor="#FFFFFF"
                        fgColor="#9333EA"
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-center text-gray-500">Scan to view transaction details</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Description</Label>
                      <p className="font-medium text-purple-800 dark:text-purple-200">{activeOrder.description}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Amount</Label>
                      <p className="font-medium text-purple-800 dark:text-purple-200">
                        {activeOrder.amount} {activeOrder.currency}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">QR Code Data</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input value={activeOrder.qrCode} readOnly className="festival-input font-mono text-xs" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(activeOrder.qrCode)}
                          className="text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                        >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">Status</Label>
                    <TransactionStatus status={activeOrder.status} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full festival-button" onClick={resetForm}>
                  Create New Order
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="festival-card h-[500px] flex flex-col items-center justify-center">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-6 mb-4 festival-pulse">
                  <Ticket className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-purple-800 dark:text-purple-200">No Active Order</h3>
                <p className="text-center text-gray-500 mb-4">
                  Create a new order to generate a QR code for customer payment.
                </p>
              </CardContent>
            </Card>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}
