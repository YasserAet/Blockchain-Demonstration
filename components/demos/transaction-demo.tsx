"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Clock, Database, Hash, Lock, RefreshCw, Server, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BlockVisualizer, type Block } from "@/components/ui/block-visualizer"
import { useWeb3 } from "@/lib/web3-context"
import { ethers } from "ethers"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Transaction = {
  id: string
  from: string
  to: string
  amount: string
  status: "pending" | "verifying" | "confirmed"
  timestamp: number
}

interface TransactionDemoProps {
  isRealMode?: boolean
}

export function TransactionDemo({ isRealMode = false }: TransactionDemoProps) {
  const [amount, setAmount] = useState("0.5")
  const [recipient, setRecipient] = useState("0x3D2...B1C")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 1,
      hash: "0x0000...8a9f",
      previousHash: "0x0000...0000",
      transactions: 1,
      timestamp: Date.now() - 100000,
      nonce: 12345,
    },
  ])
  const [isMining, setIsMining] = useState(false)
  
  const { contract, isConnected, account } = useWeb3()

  const sendTransaction = async () => {
    if (isRealMode) {
      if (!isConnected || !contract) {
        alert("Please connect wallet and ensure contract is deployed")
        return
      }
      
      setIsMining(true)
      try {
        const amountWei = ethers.parseEther(amount || "0")
        const tx = await contract.sendPayment(recipient, { value: amountWei })
        
        const newTx: Transaction = {
          id: tx.hash.substring(0, 10) + "...",
          from: account || "You",
          to: recipient,
          amount,
          status: "verifying",
          timestamp: Date.now(),
        }
        setTransactions((prev) => [newTx, ...prev])

        await tx.wait()
        
        setTransactions((prev) =>
          prev.map((t) => (t.id === newTx.id ? { ...t, status: "confirmed" } : t))
        )

        const newBlock: Block = {
          id: blocks.length + 1,
          hash: tx.hash,
          previousHash: blocks[0].hash,
          transactions: 1,
          timestamp: Date.now(),
          nonce: Math.floor(Math.random() * 1000000),
        }
        setBlocks((prev) => [newBlock, ...prev])
        
      } catch (err: any) {
        console.error(err)
        alert("Transaction failed: " + err.message)
      } finally {
        setIsMining(false)
      }
      return
    }

    const newTx: Transaction = {
      id: Math.random().toString(36).substring(7),
      from: "Wallet A (You)",
      to: "Wallet B (Merchant)",
      amount,
      status: "pending",
      timestamp: Date.now(),
    }
    setTransactions((prev) => [newTx, ...prev])
  }

  const mineBlock = async () => {
    if (isRealMode) return

    const pendingTxs = transactions.filter((tx) => tx.status === "pending")
    if (pendingTxs.length === 0) return

    setIsMining(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setTransactions((prev) =>
      prev.map((tx) => (tx.status === "pending" ? { ...tx, status: "verifying" } : tx))
    )

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newBlock: Block = {
      id: blocks.length + 1,
      hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      previousHash: blocks[0].hash,
      transactions: pendingTxs.length,
      timestamp: Date.now(),
      nonce: Math.floor(Math.random() * 1000000),
    }

    setBlocks((prev) => [newBlock, ...prev])
    setTransactions((prev) =>
      prev.map((tx) => (tx.status === "verifying" ? { ...tx, status: "confirmed" } : tx))
    )
    setIsMining(false)
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Cryptocurrency Transaction
            {isRealMode && <Badge variant="secondary">Real Mode</Badge>}
          </h2>
          <p className="text-muted-foreground">
            {isRealMode ? "Send real ETH (testnet) via Smart Contract" : "Simulate sending funds and mining blocks."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-1 rounded-full border border-border">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Network Active
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="space-y-6 flex flex-col">
          <Card className="p-6 border-primary/20 bg-primary/5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="h-4 w-4" /> Initiate Transaction
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <div className="p-2 bg-background rounded border text-sm font-mono truncate">
                    {isRealMode ? (account || "Not connected") : "0x71C...9A2"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">To</Label>
                  {isRealMode ? (
                    <Input 
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="font-mono text-sm h-[38px]"
                      placeholder="0x..."
                    />
                  ) : (
                    <div className="p-2 bg-background rounded border text-sm font-mono truncate">
                      0x3D2...B1C
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Amount (ETH)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="font-mono"
                  />
                  <Button 
                    onClick={sendTransaction} 
                    disabled={isMining || (isRealMode && !isConnected)}
                  >
                    {isMining ? "Sending..." : "Send"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="flex-1 p-6 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" /> Mempool
              </h3>
              <span className="text-xs text-muted-foreground">
                {transactions.filter((t) => t.status !== "confirmed").length} Pending
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              <AnimatePresence initial={false}>
                {transactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    layout
                    className={cn(
                      "p-3 rounded-lg border text-sm flex items-center justify-between",
                      tx.status === "confirmed"
                        ? "bg-green-500/10 border-green-500/20"
                        : tx.status === "verifying"
                        ? "bg-yellow-500/10 border-yellow-500/20"
                        : "bg-muted border-border"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-muted-foreground">Tx: {tx.id}</span>
                      <span className="font-bold">{tx.amount} ETH</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {tx.status === "confirmed" ? (
                        <span className="text-xs text-green-500 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Confirmed
                        </span>
                      ) : tx.status === "verifying" ? (
                        <span className="text-xs text-yellow-500 flex items-center gap-1">
                          <RefreshCw className="h-3 w-3 animate-spin" /> Verifying
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No transactions yet. Send some funds!
                  </div>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button
                className="w-full"
                variant={isMining ? "secondary" : "default"}
                onClick={mineBlock}
                disabled={isRealMode || isMining || transactions.filter((t) => t.status === "pending").length === 0}
              >
                {isMining ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Mining Block...
                  </>
                ) : (
                  <>
                    <Server className="mr-2 h-4 w-4" /> {isRealMode ? "Auto-Mined by Node" : "Mine Block"}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Card className="h-full p-6 bg-muted/30 border-dashed flex flex-col">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Hash className="h-4 w-4" /> Blockchain Ledger
            </h3>
            <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center gap-4 pb-4 px-2">
              <AnimatePresence initial={false}>
                {blocks.map((block, index) => (
                  <BlockVisualizer key={block.id} block={block} isLatest={index === 0} />
                ))}
              </AnimatePresence>
              <div className="h-32 w-32 rounded-xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-muted-foreground/50 text-xs text-center p-4">
                Next Block
              </div>
            </div>
            <div className="mt-4 p-4 bg-background/50 rounded-lg border text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary mt-0.5">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Immutable Record</p>
                  <p className="text-xs mt-1">
                    Each block contains a cryptographic hash of the previous block. This links them together, making it
                    impossible to alter past transactions without breaking the entire chain.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
