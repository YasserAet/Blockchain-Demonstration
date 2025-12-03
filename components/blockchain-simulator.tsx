"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, Truck, FileCode, ArrowRight, Box, ShieldCheck, Database, Cpu, Lock } from 'lucide-react'
import { TransactionDemo } from "@/components/demos/transaction-demo"
import { SupplyChainDemo } from "@/components/demos/supply-chain-demo"
import { SmartContractDemo } from "@/components/demos/smart-contract-demo"
import { ConsensusDemo } from "@/components/demos/consensus-demo"
import ImmutabilityDemo from "@/components/demos/immutability-demo"
import { cn } from "@/lib/utils"
import { useWeb3 } from "@/lib/web3-context"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

type DemoMode = "transaction" | "supply-chain" | "smart-contract" | "consensus" | "immutability" | "intro"

export function BlockchainSimulator() {
  const [mode, setMode] = useState<DemoMode>("intro")
  const [isRealMode, setIsRealMode] = useState(false)
  const { isConnected, connectWallet, account, error } = useWeb3()

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-card border-r border-border flex flex-col p-4 z-10">
        

        <nav className="space-y-2 flex-1">
          <NavButton
            active={mode === "intro"}
            onClick={() => setMode("intro")}
            icon={<Box className="h-4 w-4" />}
            label="Overview"
          />
          <div className="pt-4 pb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Core Concepts
          </div>
          <NavButton
            active={mode === "immutability"}
            onClick={() => setMode("immutability")}
            icon={<Lock className="h-4 w-4" />}
            label="Immutability & Hash"
          />
          <NavButton
            active={mode === "consensus"}
            onClick={() => setMode("consensus")}
            icon={<Cpu className="h-4 w-4" />}
            label="Consensus"
          />
          <div className="pt-4 pb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Applications
          </div>
          <NavButton
            active={mode === "transaction"}
            onClick={() => setMode("transaction")}
            icon={<Wallet className="h-4 w-4" />}
            label="Cryptocurrency"
          />
          <NavButton
            active={mode === "supply-chain"}
            onClick={() => setMode("supply-chain")}
            icon={<Truck className="h-4 w-4" />}
            label="Supply Chain"
          />
          <NavButton
            active={mode === "smart-contract"}
            onClick={() => setMode("smart-contract")}
            icon={<FileCode className="h-4 w-4" />}
            label="Smart Contracts"
          />
        </nav>

        {/* <div className="mt-auto space-y-4">
          <div className="p-4 bg-muted/30 rounded-xl border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Real Mode</h4>
              <div 
                className={cn(
                  "w-8 h-4 rounded-full relative cursor-pointer transition-colors",
                  isRealMode ? "bg-primary" : "bg-muted-foreground/30"
                )}
                onClick={() => setIsRealMode(!isRealMode)}
              >
                <div className={cn(
                  "absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform",
                  isRealMode ? "translate-x-4" : "translate-x-0"
                )} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Connect to local Hardhat node to execute real transactions.
            </p>
            
            {isRealMode && (
              <Button 
                variant={isConnected ? "outline" : "default"} 
                size="sm" 
                className="w-full text-xs h-8"
                onClick={connectWallet}
              >
                {isConnected 
                  ? `${account?.slice(0, 6)}...${account?.slice(-4)}`
                  : "Connect Wallet"
                }
              </Button>
            )}
          </div>
        </div> */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-20%,#3b82f615,transparent)]" />

        <div className="relative h-full overflow-y-auto p-6 md:p-12">
          {isRealMode && !isConnected && mode !== "intro" && (
            <Alert className="mb-6 bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription>
                Real Mode is active. Please connect your wallet and ensure your local Hardhat node is running.
              </AlertDescription>
            </Alert>
          )}

          <AnimatePresence mode="wait">
            {mode === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                {/* <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Blockchain <span className="text-primary">Demystified</span>
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    An interactive simulator to demonstrate the core concepts of blockchain technology:
                    decentralized transactions, immutable tracking, and automated agreements.
                  </p>
                </div> */}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Core Concepts
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <DemoCard
                        title="Immutability & Hash"
                        description="Understand how cryptographic hashing creates an unbreakable chain and the avalanche effect."
                        icon={<Lock className="h-8 w-8 text-green-400" />}
                        onClick={() => setMode("immutability")}
                        color="bg-green-500/10 border-green-500/20 hover:border-green-500/50"
                      />
                      <DemoCard
                        title="Consensus Mechanisms"
                        description="Explore how PoW, PoS, DPoS, and BFT achieve agreement across distributed networks."
                        icon={<Cpu className="h-8 w-8 text-cyan-400" />}
                        onClick={() => setMode("consensus")}
                        color="bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 mt-8">
                      Real-World Applications
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <DemoCard
                        title="Cryptocurrency"
                        description="Visualize how transactions are broadcast, verified by miners, and added to the immutable ledger."
                        icon={<Wallet className="h-8 w-8 text-blue-400" />}
                        onClick={() => setMode("transaction")}
                        color="bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50"
                      />
                      <DemoCard
                        title="Supply Chain"
                        description="Track a product's journey from origin to consumer, ensuring transparency and authenticity."
                        icon={<Truck className="h-8 w-8 text-orange-400" />}
                        onClick={() => setMode("supply-chain")}
                        color="bg-orange-500/10 border-orange-500/20 hover:border-orange-500/50"
                      />
                      <DemoCard
                        title="Smart Contracts"
                        description="Deploy self-executing code that triggers actions automatically when conditions are met."
                        icon={<FileCode className="h-8 w-8 text-purple-400" />}
                        onClick={() => setMode("smart-contract")}
                        color="bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {mode === "transaction" && (
              <motion.div
                key="transaction"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <TransactionDemo isRealMode={isRealMode} />
              </motion.div>
            )}

            {mode === "supply-chain" && (
              <motion.div
                key="supply-chain"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <SupplyChainDemo isRealMode={isRealMode} />
              </motion.div>
            )}

            {mode === "smart-contract" && (
              <motion.div
                key="smart-contract"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <SmartContractDemo isRealMode={isRealMode} />
              </motion.div>
            )}

            {mode === "consensus" && (
              <motion.div
                key="consensus"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ConsensusDemo />
              </motion.div>
            )}

            {mode === "immutability" && (
              <motion.div
                key="immutability"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ImmutabilityDemo />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function DemoCard({
  title,
  description,
  icon,
  onClick,
  color,
}: {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start text-left p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] group",
        color
      )}
    >
      <div className="mb-4 p-3 rounded-xl bg-background/50 backdrop-blur-sm border border-white/5 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
        {title}
        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </button>
  )
}
