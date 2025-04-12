"use client"

import { Client, Wallet, xrpToDrops, dropsToXrp } from "xrpl"

// XRP Testnet server
const XRPL_SERVER = "wss://s.altnet.rippletest.net:51233"

// Create a client instance
let client: Client | null = null
let isConnected = false

// Connect to the XRP Ledger
async function ensureConnection() {
  if (!client) {
    client = new Client(XRPL_SERVER)
  }

  if (!isConnected) {
    await client.connect()
    isConnected = true
    console.log("XRPL client connected")
  }
  return client
}

// Get wallet from seed
export async function getWalletFromSeed(seed: string) {
  try {
    await ensureConnection()
    return Wallet.fromSeed(seed)
  } catch (error) {
    console.error("Error creating wallet from seed:", error)
    return null
  }
}

// Get wallet balance
export async function getWalletBalance(address: string) {
  try {
    const client = await ensureConnection()

    const response = await client.request({
      command: "account_info",
      account: address,
      ledger_index: "validated",
    })

    const drops = response.result.account_data.Balance
    return dropsToXrp(drops)
  } catch (error) {
    console.error("Error getting wallet balance:", error)
    return "0"
  }
}

// Process a payment
export async function processPayment(customerSeed: string, merchantAddress: string, amount: string) {
  try {
    const client = await ensureConnection()

    const wallet = Wallet.fromSeed(customerSeed)

    const tx = {
      TransactionType: "Payment",
      Account: wallet.address,
      Amount: xrpToDrops(amount),
      Destination: merchantAddress,
    }

    const submitted_tx = await client.submitAndWait(tx, {
      autofill: true,
      wallet: wallet,
    })

    if (submitted_tx.result.meta.TransactionResult === "tesSUCCESS") {
      return {
        success: true,
        txHash: submitted_tx.result.hash,
      }
    } else {
      throw new Error(`Transaction failed: ${submitted_tx.result.meta.TransactionResult}`)
    }
  } catch (error) {
    console.error("Error processing payment:", error)
    return { success: false }
  }
}

export const getTransactionStatus = async (txHash: string, client: xrpl.Client) => {
  const tx = await client.request({
    command: "tx",
    transaction: txHash,
  })

  return {
    validated: tx.result.validated,
    result: tx.result.meta.TransactionResult,
  }
}

// Generate a test wallet
export async function generateTestWallet() {
  try {
    const client = await ensureConnection()
    const fund_result = await client.fundWallet()
    return fund_result
  } catch (error) {
    console.error("Error generating test wallet:", error)
    throw new Error("Failed to generate test wallet")
  }
}

// Close the connection
export async function closeConnection() {
  if (client && isConnected) {
    await client.disconnect()
    isConnected = false
    client = null
    console.log("XRPL client disconnected")
  }
}
