"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Factory, Truck, Store, User, CheckCircle2, QrCode, Search, Package } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useWeb3 } from "@/lib/web3-context"
import { Badge } from "@/components/ui/badge"

type SupplyStage = {
  id: string
  title: string
  icon: React.ReactNode
  status: "completed" | "active" | "pending"
  timestamp?: string
  location?: string
  hash?: string
}

interface SupplyChainDemoProps {
  isRealMode?: boolean
}

export function SupplyChainDemo({ isRealMode = false }: SupplyChainDemoProps) {
  const [activeStep, setActiveStep] = useState(0)
  const { contract, isConnected } = useWeb3()
  const [isUpdating, setIsUpdating] = useState(false)

  const [stages, setStages] = useState<SupplyStage[]>([
    {
      id: "manufacture",
      title: "Manufacturing",
      icon: <Factory className="h-5 w-5" />,
      status: "active",
      location: "Shenzhen, CN",
    },
    {
      id: "shipping",
      title: "Logistics",
      icon: <Truck className="h-5 w-5" />,
      status: "pending",
      location: "Pacific Ocean",
    },
    {
      id: "warehouse",
      title: "Distribution",
      icon: <Package className="h-5 w-5" />,
      status: "pending",
      location: "Los Angeles, US",
    },
    {
      id: "retail",
      title: "Retailer",
      icon: <Store className="h-5 w-5" />,
      status: "pending",
      location: "New York, US",
    },
    {
      id: "consumer",
      title: "Consumer",
      icon: <User className="h-5 w-5" />,
      status: "pending",
      location: "Manhattan, NY",
    },
  ])

  const advanceStage = async () => {
    if (activeStep >= stages.length - 1) return

    if (isRealMode) {
      if (!isConnected || !contract) {
        alert("Please connect wallet")
        return
      }
      
      setIsUpdating(true)
      try {
        // Call smart contract to update item status
        const nextStage = stages[activeStep + 1]
        const tx = await contract.updateItem(1, nextStage.location, nextStage.title)
        await tx.wait()
        
        // Update UI after confirmation
        setStages((prev) =>
          prev.map((stage, idx) => {
            if (idx === activeStep) {
              return {
                ...stage,
                status: "completed",
                timestamp: new Date().toLocaleString(),
                hash: tx.hash.substring(0, 14) + "...",
              }
            }
            if (idx === activeStep + 1) {
              return { ...stage, status: "active" }
            }
            return stage
          })
        )
        setActiveStep((prev) => prev + 1)
      } catch (err: any) {
        console.error(err)
        alert("Failed to update chain: " + err.message)
      } finally {
        setIsUpdating(false)
      }
      return
    }

    setStages((prev) =>
      prev.map((stage, idx) => {
        if (idx === activeStep) {
          return {
            ...stage,
            status: "completed",
            timestamp: new Date().toLocaleString(),
            hash: `0x${Math.random().toString(16).substring(2, 14)}...`,
          }
        }
        if (idx === activeStep + 1) {
          return { ...stage, status: "active" }
        }
        return stage
      })
    )
    setActiveStep((prev) => prev + 1)
  }

  const resetDemo = () => {
    setActiveStep(0)
    setStages((prev) =>
      prev.map((stage, idx) => ({
        ...stage,
        status: idx === 0 ? "active" : "pending",
        timestamp: undefined,
        hash: undefined,
      }))
    )
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Supply Chain Tracking
            {isRealMode && <Badge variant="secondary">Real Mode</Badge>}
          </h2>
          <p className="text-muted-foreground">Trace product authenticity from origin to consumer.</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetDemo} disabled={isUpdating}>
          Reset Simulation
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 flex-1">
        {/* Map/Visual Area */}
        <div className="lg:col-span-8 relative bg-muted/20 rounded-xl border overflow-hidden min-h-[300px]">
          <div className="absolute inset-0 bg-[url('https://blob.v0.app/9dJ1d.txt')] opacity-5" /> {/* Placeholder for map texture */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-3xl px-12">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0" />
              <motion.div 
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0"
                initial={{ width: "0%" }}
                animate={{ width: `${(activeStep / (stages.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />

              <div className="relative z-10 flex justify-between">
                {stages.map((stage, idx) => (
                  <div key={stage.id} className="flex flex-col items-center gap-4">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: idx === activeStep ? 1.2 : 1,
                        backgroundColor:
                          stage.status === "completed" || stage.status === "active"
                            ? "var(--primary)"
                            : "var(--muted)",
                      }}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground shadow-lg transition-colors duration-300",
                        stage.status === "pending" && "bg-muted text-muted-foreground"
                      )}
                    >
                      {stage.status === "completed" ? <CheckCircle2 className="h-6 w-6" /> : stage.icon}
                    </motion.div>
                    <div className="text-center">
                      <p
                        className={cn(
                          "font-semibold text-sm",
                          idx === activeStep ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {stage.title}
                      </p>
                      {stage.status !== "pending" && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-muted-foreground mt-1"
                        >
                          {stage.location}
                        </motion.p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls & Ledger */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card className="p-6 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Product #88291</h3>
                  <p className="text-xs text-muted-foreground">Luxury Handbag - Limited Edition</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Status:</span>
                  <span className="font-medium text-primary">
                    {stages[activeStep].status === "completed" ? "Delivered" : stages[activeStep].title}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Verification:</span>
                  <span className="text-green-500 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified on Chain
                  </span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={advanceStage}
                disabled={activeStep >= stages.length - 1 || isUpdating || (isRealMode && !isConnected)}
              >
                {isUpdating ? "Confirming on Blockchain..." : activeStep >= stages.length - 1 ? "Journey Complete" : "Log Next Step to Blockchain"}
              </Button>
            </div>
          </Card>

          <Card className="flex-1 p-4 overflow-hidden flex flex-col">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Search className="h-4 w-4" /> Blockchain Records
            </h4>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {stages
                .filter((s) => s.status === "completed")
                .map((stage) => (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded bg-muted/50 border text-xs space-y-1"
                  >
                    <div className="flex justify-between font-medium">
                      <span>{stage.title}</span>
                      <span className="text-muted-foreground">{stage.timestamp?.split(",")[1]}</span>
                    </div>
                    <div className="font-mono text-muted-foreground truncate">Tx: {stage.hash}</div>
                    <div className="text-muted-foreground">Loc: {stage.location}</div>
                  </motion.div>
                ))}
                {stages.filter((s) => s.status === "completed").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-xs">
                    No records on chain yet.
                  </div>
                )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
