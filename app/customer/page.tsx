"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, RefreshCw, ScanLine } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
// import { Html5QrcodeScanner } from "html5-qrcode";
import { QrReader } from 'react-qr-reader';
import BarcodeScannerComponent from "react-qr-barcode-scanner";


export default function CustomerPage() {
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
  const [qrData, setQrData] = useState("")
  const [xrplService, setXrplService] = useState<any>(null)
  const qrRegionId = "qr-scanner-region";
  const [isScanning, setIsScanning] = useState(false);
  // const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  //test
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // video testing

  


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
      const storedSeed = localStorage.getItem("customerWalletSeed")
      if (storedSeed) {
        setWalletSeed(storedSeed)
        validateWallet(storedSeed)
      }
    }
  }, [xrplService])

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
        localStorage.setItem("customerWalletSeed", seed)
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

  const handleQrDataSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    handleQrDataSubmitData(qrData)
  }

  const handleQrDataSubmitData = async (qrData?: string) => {
    if (!qrData) {
      toast({
        title: "Missing information",
        description: "Please enter QR code data.",
        variant: "destructive",
      })
      return
    }

    if (!walletInfo?.isValid) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    try {
      // Try to parse the QR data as JSON
      const parsedData = JSON.parse(qrData)

      // Check if it's a valid XRPL payment QR code
      if (parsedData.type === "xrpl_payment" && parsedData.merchantAddress && parsedData.amount) {
        // Store the transaction data in localStorage for the transaction page
        localStorage.setItem(
          "currentTransaction",
          JSON.stringify({
            ...parsedData,
            customerAddress: walletInfo.address,
            customerSeed: walletSeed,
            status: "pending",
            timestamp: new Date().toISOString(),
          }),
        )

        // Navigate to the transaction page
        router.push(`/customer/transaction/${parsedData.orderId}`)
      } else {
        toast({
          title: "Invalid QR code",
          description: "The QR code data is not a valid XRPL payment.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error parsing QR data:", error)
      toast({
        title: "Invalid QR code",
        description: "The QR code data is not valid JSON.",
        variant: "destructive",
      })
    }
  }

  // const handleScanQR = () => {
  //   toast({
  //     title: "QR Scanner",
  //     description: "In a real app, this would open your device camera to scan a QR code.",
  //   })

  //   // In a real app, this would use the device camera to scan a QR code
  //   // For demo purposes, we'll just show a prompt to enter QR data manually
  //   setTimeout(() => {
  //     toast({
  //       title: "Please use manual entry",
  //       description: "For this demo, please use the manual entry tab to enter QR code data.",
  //     })
  //   }, 2000)
  // }

  const clearWallet = () => {
    localStorage.removeItem("customerWalletSeed")
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
        localStorage.setItem("customerWalletSeed", result.wallet.seed)
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

  // const handleScanQR = async () => {
  //   const hasPermission = await checkCameraPermission();
  //   if (!hasPermission) return;

  //   if (isScanning) return;
  
  //   setIsScanning(true);
  
  //   const config = {
  //     fps: 10,
  //     qrbox: 250,
  //     aspectRatio: 1.0,
  //   };
  
  //   const scanner = new Html5QrcodeScanner(qrRegionId, config, false);
  //   scannerRef.current = scanner;
  
  //   scanner.render(
  //     (decodedText) => {
  //       console.log("QR Code Scanned: ", decodedText);
  //       scanner.clear();
  //       setIsScanning(false);
  //       setQrData(decodedText);
  //       handleQrDataSubmitData();
  //       // Optionally, you can stop the scanner here

  //     },
  //     (errorMessage) => {
  //       console.warn("QR Code Scan Error:", errorMessage);
  //     }
  //   );
  // };

  const checkCameraPermission = async () => {
    try {
      // Check for camera permission using the Permissions API
      const result = await navigator.permissions.query({ name: "camera" as PermissionName });
  
      if (result.state === "granted") {
        return true; // Already granted
      } else if (result.state === "prompt") {
        // Trigger prompt by requesting media access
        await navigator.mediaDevices.getUserMedia({ video: true });
        return true;
      } else {
        alert("Camera access is denied. Please enable it in your browser settings.");
        return false;
      }
    } catch (error) {
      console.error("Error checking camera permission:", error);
      return false;
    }
  };
  

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Customer Portal</h1>

        {!walletInfo?.isValid ? (
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Wallet Seed</CardTitle>
              <CardDescription>Enter your XRP Ledger wallet seed to make payments to merchants.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSeedSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerWalletSeed">Wallet Seed</Label>
                  <div className="relative">
                    <Input
                      id="customerWalletSeed"
                      type={showSeed ? "text" : "password"}
                      placeholder="Enter your wallet seed..."
                      value={walletSeed}
                      onChange={(e) => setWalletSeed(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowSeed(!showSeed)}
                    >
                      {showSeed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    For testing, you can use a test wallet from the XRP Testnet Faucet.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading || !xrplService}>
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
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Wallet Connected</CardTitle>
                <CardDescription>Your XRP Ledger wallet is connected and ready to make payments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={walletInfo.address} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Balance</Label>
                  <div className="text-2xl font-bold">{walletInfo.balance} XRP</div>
                </div>
                <Button variant="outline" onClick={clearWallet} className="w-full">
                  Disconnect Wallet
                </Button>
              </CardContent>
            </Card>

            <Tabs defaultValue="scan-qr" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scan-qr">Scan QR Code</TabsTrigger>
                <TabsTrigger value="manual-entry">Manual Entry</TabsTrigger>
              </TabsList>

              <TabsContent value="scan-qr">
                <Card>
                  <CardHeader>
                    <CardTitle>Scan QR Code</CardTitle>
                    <CardDescription>Scan a merchant's QR code to view and approve a transaction.</CardDescription>
                  </CardHeader>
                  {/* <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="rounded-full bg-gray-100 p-6 mb-4">
                      <ScanLine className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-center text-gray-500 mb-6">
                      Position the QR code within the scanner frame to automatically detect it.
                    </p>
                    <Button onClick={handleScanQR} className="w-full">
                      Open Camera to Scan
                    </Button>
                  </CardContent> */}
                  <CardContent className="flex flex-col items-center justify-center p-6">
                  {showScanner && (
                  <>
                  <BarcodeScannerComponent
                    width={500}
                    height={500}
                    onUpdate={(err, result) => {
                      if (result) {
                        // setQrData(result.getText());
                        setResult(result.getText());
                        handleQrDataSubmitData(result.getText());
                      } 
                      else setResult("Not Found");
                    }}
                  />
                  <p>{result}</p>
                </>
                  )}
                  <Button onClick={() => setShowScanner(true)}>
                    Open Camera to Scan
                  </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manual-entry">
                <Card>
                  <CardHeader>
                    <CardTitle>Enter QR Code Data</CardTitle>
                    <CardDescription>Manually enter the QR code data provided by the merchant.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleQrDataSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="qrData">QR Code Data</Label>
                        <Input
                          id="qrData"
                          placeholder="Paste QR code data here..."
                          value={qrData}
                          onChange={(e) => setQrData(e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Process Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
