"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileCode, Play, Shield, AlertCircle, Check, ArrowRight, Coins, Home, Package, Vote, Users, Clock, DollarSign, Key, Lock, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useWeb3 } from "@/lib/web3-context"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SmartContractDemoProps {
  isRealMode?: boolean
}

type ContractType = "rental" | "escrow" | "voting"

export function SmartContractDemo({ isRealMode = false }: SmartContractDemoProps) {
  const [contractType, setContractType] = useState<ContractType>("rental")
  const [contractState, setContractState] = useState<"idle" | "checking" | "executed" | "failed">("idle")
  const [logs, setLogs] = useState<string[]>([])
  
  // Rental Contract State
  const [rentAmount, setRentAmount] = useState("1.5")
  const [depositAmount, setDepositAmount] = useState("0")
  
  // Escrow Contract State
  const [escrowAmount, setEscrowAmount] = useState("5.0")
  const [buyerDeposit, setBuyerDeposit] = useState("0")
  const [sellerDelivered, setSellerDelivered] = useState(false)
  const [buyerConfirmed, setBuyerConfirmed] = useState(false)
  const [escrowStage, setEscrowStage] = useState<"deposit" | "delivery" | "confirmation" | "complete">("deposit")
  const [escrowBalance, setEscrowBalance] = useState("0")
  
  // Voting Contract State
  const [proposals, setProposals] = useState([
    { id: 1, name: "Increase Block Size", votes: 0 },
    { id: 2, name: "Reduce Gas Fees", votes: 0 },
    { id: 3, name: "Upgrade Protocol", votes: 0 },
  ])
  const [hasVoted, setHasVoted] = useState(false)
  const [votingPower, setVotingPower] = useState("10")
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null)
  const [votingEnded, setVotingEnded] = useState(false)
  
  const { contract, isConnected } = useWeb3()

  // Rental Contract Execution
  const executeRentalContract = async () => {
    setContractState("checking")
    setLogs([])
    
    addLog(" Initiating Rental Agreement Contract...")
    await wait(800)
    
    addLog(` Checking payment: ${depositAmount} ETH vs required ${rentAmount} ETH`)
    await wait(800)

    const payment = parseFloat(depositAmount)
    const required = parseFloat(rentAmount)

    if (payment >= required) {
      addLog(" Condition MET: Payment verified.")
      await wait(500)
      addLog(" Generating digital access key...")
      await wait(700)
      addLog(" Transferring apartment ownership token to tenant...")
      await wait(700)
      addLog(" Releasing " + payment + " ETH to landlord's wallet...")
      await wait(700)
      addLog(" Recording transaction on blockchain...")
      await wait(500)
      addLog(" Contract execution COMPLETED successfully!")
      setContractState("executed")
    } else {
      addLog(` Condition FAILED: ${payment} ETH < ${required} ETH`)
      await wait(500)
      addLog(" Reverting transaction...")
      await wait(500)
      addLog(" Funds returned to sender.")
      addLog(" Contract execution failed.")
      setContractState("failed")
    }
  }

  // Escrow Contract Execution
  const depositToEscrow = async () => {
    setContractState("checking")
    setLogs([])
    
    addLog(" Initiating Escrow Contract...")
    await wait(600)
    
    const deposit = parseFloat(buyerDeposit)
    const required = parseFloat(escrowAmount)
    
    addLog(` Verifying deposit: ${deposit} ETH vs required ${required} ETH`)
    await wait(800)
    
    if (deposit >= required) {
      addLog(" Deposit accepted!")
      await wait(500)
      addLog(" Locking funds in escrow smart contract...")
      await wait(700)
      addLog(` ${deposit} ETH secured in escrow`)
      setEscrowBalance(deposit.toString())
      setEscrowStage("delivery")
      addLog(" Waiting for seller to deliver product...")
      setContractState("executed")
    } else {
      addLog(` Insufficient funds: ${deposit} ETH < ${required} ETH`)
      await wait(500)
      addLog(" Transaction rejected")
      setContractState("failed")
    }
  }

  const confirmDelivery = async () => {
    setContractState("checking")
    setLogs([])
    
    addLog(" Seller marking product as delivered...")
    await wait(700)
    addLog(" Delivery confirmed by seller")
    await wait(500)
    addLog(" Notifying buyer to confirm receipt...")
    setSellerDelivered(true)
    setEscrowStage("confirmation")
    setContractState("idle")
  }

  const confirmReceipt = async () => {
    setContractState("checking")
    setLogs([])
    
    addLog(" Buyer confirming receipt of product...")
    await wait(700)
    addLog(" Receipt confirmed by buyer")
    await wait(500)
    addLog(" Releasing funds from escrow...")
    await wait(700)
    addLog(` Transferring ${escrowBalance} ETH to seller...`)
    await wait(700)
    addLog(" Recording final transaction on blockchain...")
    await wait(500)
    addLog(" Escrow contract COMPLETED successfully!")
    setBuyerConfirmed(true)
    setEscrowStage("complete")
    setContractState("executed")
  }

  // Voting Contract Execution
  const castVote = async () => {
    if (selectedProposal === null) {
      addLog(" Please select a proposal first")
      return
    }
    
    setContractState("checking")
    setLogs([])
    
    const votes = parseInt(votingPower)
    const proposal = proposals.find(p => p.id === selectedProposal)
    
    addLog(" Initiating vote transaction...")
    await wait(600)
    addLog(` Voting for: ${proposal?.name}`)
    await wait(700)
    addLog(` Verifying voter eligibility...`)
    await wait(700)
    addLog(` Voter verified - ${votes} voting power`)
    await wait(500)
    addLog(` Adding ${votes} votes to proposal #${selectedProposal}`)
    await wait(700)
    
    setProposals(prev => prev.map(p => 
      p.id === selectedProposal 
        ? { ...p, votes: p.votes + votes }
        : p
    ))
    
    addLog(" Recording vote on blockchain...")
    await wait(500)
    addLog(" Marking voter address as 'voted'...")
    await wait(500)
    addLog(" Vote cast successfully!")
    setHasVoted(true)
    setContractState("executed")
  }

  const endVoting = async () => {
    setContractState("checking")
    setLogs([])
    
    addLog(" Ending voting period...")
    await wait(700)
    addLog(" Tallying final votes...")
    await wait(800)
    
    const winner = proposals.reduce((max, p) => p.votes > max.votes ? p : max, proposals[0])
    
    addLog(` Winner: ${winner.name} with ${winner.votes} votes`)
    await wait(500)
    addLog(" Locking voting contract...")
    await wait(500)
    addLog(" Recording final results on blockchain...")
    await wait(500)
    addLog(" Voting completed!")
    setVotingEnded(true)
    setContractState("executed")
  }

  const resetContract = () => {
    setContractState("idle")
    setLogs([])
    
    if (contractType === "rental") {
      setDepositAmount("0")
    } else if (contractType === "escrow") {
      setBuyerDeposit("0")
      setSellerDelivered(false)
      setBuyerConfirmed(false)
      setEscrowStage("deposit")
      setEscrowBalance("0")
    } else if (contractType === "voting") {
      setProposals([
        { id: 1, name: "Increase Block Size", votes: 0 },
        { id: 2, name: "Reduce Gas Fees", votes: 0 },
        { id: 3, name: "Upgrade Protocol", votes: 0 },
      ])
      setHasVoted(false)
      setSelectedProposal(null)
      setVotingEnded(false)
    }
  }

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Smart Contract Simulator
            {isRealMode && <Badge variant="secondary">Real Mode</Badge>}
          </h2>
          {/* <p className="text-muted-foreground">Automated "If-This-Then-That" logic on the blockchain.</p> */}
        </div>
        <Button variant="outline" size="sm" onClick={resetContract}>
          Reset Contract
        </Button>
      </div>

      <Tabs value={contractType} onValueChange={(v) => { setContractType(v as ContractType); resetContract(); }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rental" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Rental Agreement
          </TabsTrigger>
          <TabsTrigger value="escrow" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Escrow Service
          </TabsTrigger>
          <TabsTrigger value="voting" className="flex items-center gap-2">
            <Vote className="h-4 w-4" />
            Voting System
          </TabsTrigger>
        </TabsList>

        {/* RENTAL AGREEMENT CONTRACT */}
        <TabsContent value="rental" className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-500" />
              About Rental Agreement Contract
            </h3>
            <p className="text-sm text-muted-foreground">
              This smart contract automates apartment rentals. When a tenant sends the required payment, the contract automatically transfers the digital key and sends funds to the landlord. No middleman needed!
            </p>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Code Side */}
            <Card className="p-0 overflow-hidden border-primary/20 bg-[#1e1e1e] text-white font-mono text-sm shadow-2xl">
              <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-white/10">
                <FileCode className="h-4 w-4 text-blue-400" />
                <span>RentalAgreement.sol</span>
              </div>
              <div className="p-6 space-y-1 relative min-h-[400px]">
                <div className="text-gray-500">// Apartment Rental Smart Contract</div>
                <div className="text-purple-400">contract <span className="text-yellow-300">ApartmentRental</span> {'{'}</div>
                <div className="pl-4">
                  <span className="text-blue-400">address</span> <span className="text-purple-400">public</span> landlord;
                </div>
                <div className="pl-4">
                  <span className="text-blue-400">address</span> <span className="text-purple-400">public</span> tenant;
                </div>
                <div className="pl-4">
                  <span className="text-blue-400">uint256</span> <span className="text-purple-400">public</span> rentPrice = <span className="text-green-400">{rentAmount} ether</span>;
                </div>
                <div className="pl-4">
                  <span className="text-blue-400">bool</span> <span className="text-purple-400">public</span> keyTransferred = <span className="text-orange-400">false</span>;
                </div>
                <br />
                <div className="pl-4 text-gray-500">// Execute when tenant pays rent</div>
                <div className="pl-4">
                  <span className="text-purple-400">function</span> <span className="text-yellow-300">rentApartment</span>() <span className="text-purple-400">public payable</span> {'{'}
                </div>
                
                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    contractState === "checking" ? "bg-yellow-500/20" : ""
                  )}
                >
                  <span className="text-purple-400">require</span>(msg.value {'>='} rentPrice, <span className="text-orange-300">"Insufficient"</span>);
                </motion.div>

                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    contractState === "executed" ? "bg-green-500/20" : ""
                  )}
                >
                  tenant = msg.sender;
                </motion.div>

                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    contractState === "executed" ? "bg-green-500/20" : ""
                  )}
                >
                  keyTransferred = <span className="text-orange-400">true</span>;
                </motion.div>

                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    contractState === "executed" ? "bg-green-500/20" : ""
                  )}
                >
                  landlord.transfer(msg.value);
                </motion.div>

                <div className="pl-4">{'}'}</div>
                <div>{'}'}</div>

                <AnimatePresence>
                  {contractState === "executed" && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center"
                    >
                      <div className="bg-green-500/20 border border-green-500 text-green-400 px-6 py-4 rounded-xl flex flex-col items-center gap-2">
                        <Check className="h-8 w-8" />
                        <span className="font-bold text-lg">Contract Executed</span>
                      </div>
                    </motion.div>
                  )}
                  {contractState === "failed" && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center"
                    >
                      <div className="bg-red-500/20 border border-red-500 text-red-400 px-6 py-4 rounded-xl flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8" />
                        <span className="font-bold text-lg">Transaction Reverted</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* Interaction Side */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" /> Contract Parameters
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Required Rent Amount (ETH)</Label>
                    <Input 
                      type="number" 
                      value={rentAmount} 
                      onChange={(e) => setRentAmount(e.target.value)}
                      disabled={contractState === "checking"}
                    />
                    <p className="text-xs text-muted-foreground">Set by landlord</p>
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <Label className="block">Tenant Payment</Label>
                    <Input 
                      type="number" 
                      placeholder="Amount to send (ETH)..."
                      value={depositAmount}
                      onChange={(e) => {
                        setDepositAmount(e.target.value)
                        if (contractState !== "idle") setContractState("idle")
                      }}
                    />
                    <Button 
                      onClick={executeRentalContract}
                      disabled={contractState === "checking" || !depositAmount}
                      className="w-full"
                    >
                      {contractState === "checking" ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Key className="mr-2 h-4 w-4" />
                          Pay Rent & Get Key
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              <LogsCard logs={logs} />
            </div>
          </div>
        </TabsContent>

        {/* ESCROW SERVICE CONTRACT */}
        <TabsContent value="escrow" className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-500" />
              About Escrow Service Contract
            </h3>
            <p className="text-sm text-muted-foreground">
              This escrow smart contract holds funds safely until both buyer and seller fulfill their obligations. Buyer deposits funds, seller delivers product, buyer confirms receipt, then funds are released automatically.
            </p>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Code Side */}
            <Card className="p-0 overflow-hidden border-primary/20 bg-[#1e1e1e] text-white font-mono text-sm shadow-2xl">
              <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-white/10">
                <FileCode className="h-4 w-4 text-green-400" />
                <span>EscrowService.sol</span>
              </div>
              <div className="p-6 space-y-1 relative min-h-[400px]">
                <div className="text-gray-500">// Secure Escrow Smart Contract</div>
                <div className="text-purple-400">contract <span className="text-yellow-300">EscrowService</span> {'{'}</div>
                <div className="pl-4">
                  <span className="text-blue-400">address</span> <span className="text-purple-400">public</span> buyer;
                </div>
                <div className="pl-4">
                  <span className="text-blue-400">address</span> <span className="text-purple-400">public</span> seller;
                </div>
                <div className="pl-4">
                  <span className="text-blue-400">uint256</span> <span className="text-purple-400">public</span> amount = <span className="text-green-400">{escrowAmount} ether</span>;
                </div>
                <div className="pl-4">
                  <span className="text-blue-400">bool</span> public delivered = <span className={cn(sellerDelivered ? "text-orange-400" : "text-gray-500")}>{sellerDelivered ? "true" : "false"}</span>;
                </div>
                <div className="pl-4">
                  <span className="text-blue-400">bool</span> public confirmed = <span className={cn(buyerConfirmed ? "text-orange-400" : "text-gray-500")}>{buyerConfirmed ? "true" : "false"}</span>;
                </div>
                <br />
                <div className="pl-4 text-gray-500">// Step 1: Buyer deposits funds</div>
                <div className="pl-4">
                  <span className="text-purple-400">function</span> <span className="text-yellow-300">deposit</span>() <span className="text-purple-400">public payable</span> {'{'}
                </div>
                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    escrowStage === "deposit" && contractState === "checking" ? "bg-yellow-500/20" : ""
                  )}
                >
                  <span className="text-purple-400">require</span>(msg.value {'>='} amount);
                </motion.div>
                <div className="pl-8">buyer = msg.sender;</div>
                <div className="pl-4">{'}'}</div>
                <br />
                <div className="pl-4 text-gray-500">// Step 2: Seller confirms delivery</div>
                <div className="pl-4">
                  <span className="text-purple-400">function</span> <span className="text-yellow-300">confirmDelivery</span>() <span className="text-purple-400">public</span> {'{'}
                </div>
                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    escrowStage === "delivery" && contractState === "checking" ? "bg-yellow-500/20" : ""
                  )}
                >
                  delivered = <span className="text-orange-400">true</span>;
                </motion.div>
                <div className="pl-4">{'}'}</div>
                <br />
                <div className="pl-4 text-gray-500">// Step 3: Buyer confirms & releases funds</div>
                <div className="pl-4">
                  <span className="text-purple-400">function</span> <span className="text-yellow-300">confirmReceipt</span>() <span className="text-purple-400">public</span> {'{'}
                </div>
                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    escrowStage === "confirmation" && contractState === "checking" ? "bg-yellow-500/20" : "",
                    escrowStage === "complete" ? "bg-green-500/20" : ""
                  )}
                >
                  <span className="text-purple-400">require</span>(delivered == <span className="text-orange-400">true</span>);
                </motion.div>
                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    escrowStage === "complete" ? "bg-green-500/20" : ""
                  )}
                >
                  seller.transfer(<span className="text-purple-400">address</span>(<span className="text-orange-400">this</span>).balance);
                </motion.div>
                <div className="pl-4">{'}'}</div>
                <div>{'}'}</div>

                <AnimatePresence>
                  {escrowStage === "complete" && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center"
                    >
                      <div className="bg-green-500/20 border border-green-500 text-green-400 px-6 py-4 rounded-xl flex flex-col items-center gap-2">
                        <Check className="h-8 w-8" />
                        <span className="font-bold text-lg">Escrow Complete</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* Interaction Side */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" /> Escrow Process
                </h3>
                
                {/* Stage Indicator */}
                <div className="mb-6 flex items-center justify-between">
                  <div className={cn("flex flex-col items-center", escrowStage !== "deposit" && "opacity-50")}>
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", 
                      escrowStage !== "deposit" ? "bg-green-500 text-white" : "bg-primary text-primary-foreground")}>
                      1
                    </div>
                    <span className="text-xs mt-1">Deposit</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-border mx-2" />
                  <div className={cn("flex flex-col items-center", escrowStage !== "delivery" && escrowStage !== "deposit" && "opacity-50")}>
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center",
                      sellerDelivered ? "bg-green-500 text-white" : escrowStage === "delivery" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      2
                    </div>
                    <span className="text-xs mt-1">Delivery</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-border mx-2" />
                  <div className={cn("flex flex-col items-center", escrowStage === "deposit" || escrowStage === "delivery" ? "opacity-50" : "")}>
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center",
                      escrowStage === "complete" ? "bg-green-500 text-white" : escrowStage === "confirmation" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      3
                    </div>
                    <span className="text-xs mt-1">Release</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {escrowStage === "deposit" && (
                    <>
                      <div className="space-y-2">
                        <Label>Required Amount (ETH)</Label>
                        <Input 
                          type="number" 
                          value={escrowAmount} 
                          onChange={(e) => setEscrowAmount(e.target.value)}
                          disabled={contractState === "checking"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Buyer Deposit (ETH)</Label>
                        <Input 
                          type="number" 
                          placeholder="Amount to deposit..."
                          value={buyerDeposit}
                          onChange={(e) => setBuyerDeposit(e.target.value)}
                        />
                        <Button 
                          onClick={depositToEscrow}
                          disabled={contractState === "checking" || !buyerDeposit}
                          className="w-full"
                        >
                          {contractState === "checking" ? "Processing..." : "Deposit to Escrow"}
                        </Button>
                      </div>
                    </>
                  )}

                  {escrowStage === "delivery" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm mb-2">Escrow Balance:</div>
                        <div className="text-2xl font-bold text-green-500">{escrowBalance} ETH</div>
                      </div>
                      <Button 
                        onClick={confirmDelivery}
                        disabled={contractState === "checking"}
                        className="w-full"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Seller: Mark as Delivered
                      </Button>
                    </div>
                  )}

                  {escrowStage === "confirmation" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <Check className="h-5 w-5 text-green-500 mb-2" />
                        <div className="text-sm font-medium mb-1">Product Delivered</div>
                        <div className="text-xs text-muted-foreground">Waiting for buyer confirmation</div>
                      </div>
                      <Button 
                        onClick={confirmReceipt}
                        disabled={contractState === "checking"}
                        className="w-full"
                      >
                        {contractState === "checking" ? "Processing..." : "Buyer: Confirm Receipt"}
                      </Button>
                    </div>
                  )}

                  {escrowStage === "complete" && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                      <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="font-semibold text-green-500">Escrow Complete!</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {escrowBalance} ETH transferred to seller
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <LogsCard logs={logs} />
            </div>
          </div>
        </TabsContent>

        {/* VOTING SYSTEM CONTRACT */}
        <TabsContent value="voting" className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Vote className="h-5 w-5 text-purple-500" />
              About Voting System Contract
            </h3>
            <p className="text-sm text-muted-foreground">
              This decentralized voting contract allows transparent, tamper-proof governance. Each address can vote once, all votes are recorded on-chain, and results are automatically calculated. Perfect for DAOs and community decisions!
            </p>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Code Side */}
            <Card className="p-0 overflow-hidden border-primary/20 bg-[#1e1e1e] text-white font-mono text-sm shadow-2xl">
              <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-white/10">
                <FileCode className="h-4 w-4 text-purple-400" />
                <span>VotingSystem.sol</span>
              </div>
              <div className="p-6 space-y-1 relative min-h-[400px]">
                <div className="text-gray-500">// Decentralized Voting Contract</div>
                <div className="text-purple-400">contract <span className="text-yellow-300">VotingSystem</span> {'{'}</div>
                <div className="pl-4">
                  <span className="text-blue-400">mapping</span>(<span className="text-blue-400">uint</span> {'=>'} <span className="text-blue-400">uint</span>) public proposalVotes;
                </div>
                <div className="pl-4">
                  <span className="text-blue-400">mapping</span>(<span className="text-blue-400">address</span> {'=>'} <span className="text-blue-400">bool</span>) public hasVoted;
                </div>
                <div className="pl-4">
                  <span className="text-blue-400">bool</span> public votingActive = <span className={cn(votingEnded ? "text-gray-500" : "text-orange-400")}>{votingEnded ? "false" : "true"}</span>;
                </div>
                <br />
                <div className="pl-4 text-gray-500">// Cast vote for a proposal</div>
                <div className="pl-4">
                  <span className="text-purple-400">function</span> <span className="text-yellow-300">vote</span>(<span className="text-blue-400">uint</span> proposalId, <span className="text-blue-400">uint</span> power) <span className="text-purple-400">public</span> {'{'}
                </div>
                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    contractState === "checking" && !votingEnded ? "bg-yellow-500/20" : ""
                  )}
                >
                  <span className="text-purple-400">require</span>(votingActive, <span className="text-orange-300">"Voting ended"</span>);
                </motion.div>
                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    contractState === "checking" && !votingEnded ? "bg-yellow-500/20" : ""
                  )}
                >
                  <span className="text-purple-400">require</span>(!hasVoted[msg.sender], <span className="text-orange-300">"Already voted"</span>);
                </motion.div>
                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    hasVoted || contractState === "executed" ? "bg-green-500/20" : ""
                  )}
                >
                  proposalVotes[proposalId] += power;
                </motion.div>
                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    hasVoted || contractState === "executed" ? "bg-green-500/20" : ""
                  )}
                >
                  hasVoted[msg.sender] = <span className="text-orange-400">true</span>;
                </motion.div>
                <div className="pl-4">{'}'}</div>
                <br />
                <div className="pl-4 text-gray-500">// End voting period</div>
                <div className="pl-4">
                  <span className="text-purple-400">function</span> <span className="text-yellow-300">endVoting</span>() <span className="text-purple-400">public</span> {'{'}
                </div>
                <motion.div 
                  className={cn(
                    "pl-8 py-1 rounded transition-colors duration-300",
                    votingEnded ? "bg-red-500/20" : ""
                  )}
                >
                  votingActive = <span className="text-orange-400">false</span>;
                </motion.div>
                <div className="pl-4">{'}'}</div>
                <div>{'}'}</div>

                <AnimatePresence>
                  {votingEnded && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center"
                    >
                      <div className="bg-purple-500/20 border border-purple-500 text-purple-400 px-6 py-4 rounded-xl flex flex-col items-center gap-2">
                        <Check className="h-8 w-8" />
                        <span className="font-bold text-lg">Voting Ended</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* Interaction Side */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Cast Your Vote
                </h3>
                
                {!hasVoted && !votingEnded && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Your Voting Power</Label>
                      <Input 
                        type="number" 
                        value={votingPower} 
                        onChange={(e) => setVotingPower(e.target.value)}
                        disabled={contractState === "checking"}
                      />
                      <p className="text-xs text-muted-foreground">Based on your token holdings</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Select Proposal</Label>
                      <RadioGroup value={selectedProposal?.toString()} onValueChange={(v) => setSelectedProposal(parseInt(v))}>
                        {proposals.map(proposal => (
                          <div key={proposal.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value={proposal.id.toString()} id={`proposal-${proposal.id}`} />
                            <Label htmlFor={`proposal-${proposal.id}`} className="flex-1 cursor-pointer">
                              <div className="font-medium">{proposal.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3" />
                                {proposal.votes} votes
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <Button 
                      onClick={castVote}
                      disabled={contractState === "checking" || selectedProposal === null}
                      className="w-full"
                    >
                      {contractState === "checking" ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Casting Vote...
                        </>
                      ) : (
                        <>
                          <Vote className="mr-2 h-4 w-4" />
                          Cast Vote
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {hasVoted && !votingEnded && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                      <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="font-semibold text-green-500">Vote Cast Successfully!</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Your vote has been recorded on the blockchain
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Current Results</Label>
                      {proposals.map(proposal => (
                        <div key={proposal.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{proposal.name}</span>
                            <Badge variant="secondary">{proposal.votes} votes</Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(proposal.votes / Math.max(1, proposals.reduce((sum, p) => sum + p.votes, 0))) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={endVoting}
                      disabled={contractState === "checking"}
                      variant="destructive"
                      className="w-full"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      End Voting Period
                    </Button>
                  </div>
                )}

                {votingEnded && (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center">
                      <Lock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <div className="font-semibold text-purple-500">Voting Closed</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Results are final and recorded on-chain
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Final Results</Label>
                      {proposals
                        .sort((a, b) => b.votes - a.votes)
                        .map((proposal, idx) => (
                          <div key={proposal.id} className={cn(
                            "p-3 border rounded-lg",
                            idx === 0 && "border-yellow-500 bg-yellow-500/5"
                          )}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {idx === 0 && <span className="text-2xl">🏆</span>}
                                <span className="font-medium">{proposal.name}</span>
                              </div>
                              <Badge variant={idx === 0 ? "default" : "secondary"}>
                                {proposal.votes} votes
                              </Badge>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={cn(
                                  "h-2 rounded-full transition-all duration-500",
                                  idx === 0 ? "bg-yellow-500" : "bg-primary"
                                )}
                                style={{ width: `${(proposal.votes / Math.max(1, proposals.reduce((sum, p) => sum + p.votes, 0))) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </Card>

              <LogsCard logs={logs} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Reusable Logs Component
function LogsCard({ logs }: { logs: string[] }) {
  return (
    <Card className="p-4 min-h-[200px] bg-muted/30 font-mono text-xs">
      <h4 className="font-semibold mb-2 text-muted-foreground flex items-center gap-2">
        <FileCode className="h-4 w-4" />
        Execution Logs
      </h4>
      <div className="space-y-1 max-h-[300px] overflow-y-auto">
        {logs.map((log, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-muted-foreground"
          >
            <span className="text-primary">{">"}</span> {log}
          </motion.div>
        ))}
        {logs.length === 0 && (
          <span className="text-muted-foreground/50 italic">Waiting for interaction...</span>
        )}
      </div>
    </Card>
  )
}
