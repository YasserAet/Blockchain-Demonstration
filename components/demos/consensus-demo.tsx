"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cpu, Users, Vote, Shield, Zap, Crown, CheckCircle2, XCircle, Clock, Server } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type ConsensusType = "pow" | "pos" | "dpos" | "bft"

type Validator = {
  id: number
  name: string
  stake?: number
  votes?: number
  isValidator: boolean
  isHonest: boolean
  computing: boolean
}

type Block = {
  id: number
  validator: string
  timestamp: number
  status: "pending" | "validated" | "rejected"
  votes?: number
  hash?: string
}

export function ConsensusDemo() {
  const [consensusType, setConsensusType] = useState<ConsensusType>("pow")
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null)
  const [validatedBlocks, setValidatedBlocks] = useState<Block[]>([])
  const [round, setRound] = useState(1)

  // Proof of Work State
  const [difficulty, setDifficulty] = useState(4)
  const [nonce, setNonce] = useState(0)
  const [hashAttempts, setHashAttempts] = useState(0)

  // Proof of Stake State
  const [posValidators, setPosValidators] = useState<Validator[]>([
    { id: 1, name: "Validator A", stake: 100, isValidator: true, isHonest: true, computing: false },
    { id: 2, name: "Validator B", stake: 50, isValidator: true, isHonest: true, computing: false },
    { id: 3, name: "Validator C", stake: 30, isValidator: true, isHonest: true, computing: false },
    { id: 4, name: "Validator D", stake: 20, isValidator: true, isHonest: true, computing: false },
  ])

  // Delegated Proof of Stake State
  const [dposValidators, setDposValidators] = useState<Validator[]>([
    { id: 1, name: "Delegate A", votes: 1000, isValidator: true, isHonest: true, computing: false },
    { id: 2, name: "Delegate B", votes: 800, isValidator: true, isHonest: true, computing: false },
    { id: 3, name: "Delegate C", votes: 600, isValidator: true, isHonest: true, computing: false },
    { id: 4, name: "Candidate D", votes: 400, isValidator: false, isHonest: true, computing: false },
    { id: 5, name: "Candidate E", votes: 200, isValidator: false, isHonest: true, computing: false },
  ])

  // Byzantine Fault Tolerance State
  const [bftNodes, setBftNodes] = useState<Validator[]>([
    { id: 1, name: "Node 1", isValidator: true, isHonest: true, computing: false },
    { id: 2, name: "Node 2", isValidator: true, isHonest: true, computing: false },
    { id: 3, name: "Node 3", isValidator: true, isHonest: true, computing: false },
    { id: 4, name: "Node 4", isValidator: true, isHonest: true, computing: false },
    { id: 5, name: "Node 5", isValidator: true, isHonest: false, computing: false }, // Byzantine node
    { id: 6, name: "Node 6", isValidator: true, isHonest: true, computing: false },
    { id: 7, name: "Node 7", isValidator: true, isHonest: true, computing: false },
  ])
  const [bftVotes, setBftVotes] = useState<{ [key: number]: boolean }>({})

  // Proof of Work Mining Simulation
  const startPoWMining = async () => {
    setIsAnimating(true)
    setHashAttempts(0)
    setNonce(0)
    
    const targetPrefix = "0".repeat(difficulty)
    let attempts = 0
    let currentNonce = 0
    let found = false

    setCurrentBlock({
      id: validatedBlocks.length + 1,
      validator: "Miner",
      timestamp: Date.now(),
      status: "pending",
    })

    // Simulate mining process
    while (!found && attempts < 100000) {
      attempts++
      currentNonce++
      setHashAttempts(attempts)
      setNonce(currentNonce)

      // Simulate hash calculation (in real blockchain this would be actual SHA-256)
      const simulatedHash = Math.random().toString(36).substring(2, 15)
      
      // Check if hash meets difficulty (simplified simulation)
      if (Math.random() < (1 / Math.pow(16, difficulty))) {
        found = true
        const validHash = targetPrefix + simulatedHash
        
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setCurrentBlock(prev => prev ? { ...prev, status: "validated", hash: validHash } : null)
        
        setTimeout(() => {
          setValidatedBlocks(prev => [...prev, {
            id: prev.length + 1,
            validator: "Miner",
            timestamp: Date.now(),
            status: "validated",
            hash: validHash,
          }])
          setCurrentBlock(null)
          setIsAnimating(false)
        }, 1000)
      }
      
      // Add small delay for visualization
      if (attempts % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    }
  }

  // Proof of Stake Validation
  const startPoSValidation = async () => {
    setIsAnimating(true)
    
    // Calculate total stake
    const totalStake = posValidators.reduce((sum, v) => sum + (v.stake || 0), 0)
    
    // Select validator based on stake (weighted random)
    const random = Math.random() * totalStake
    let cumulative = 0
    let selectedValidator = posValidators[0]
    
    for (const validator of posValidators) {
      cumulative += validator.stake || 0
      if (random <= cumulative) {
        selectedValidator = validator
        break
      }
    }

    // Highlight selected validator
    setPosValidators(prev => prev.map(v => ({
      ...v,
      computing: v.id === selectedValidator.id
    })))

    setCurrentBlock({
      id: validatedBlocks.length + 1,
      validator: selectedValidator.name,
      timestamp: Date.now(),
      status: "pending",
    })

    await new Promise(resolve => setTimeout(resolve, 1500))

    // Validator proposes block
    const hash = "0x" + Math.random().toString(16).substring(2, 15)
    setCurrentBlock(prev => prev ? { ...prev, status: "validated", hash } : null)

    await new Promise(resolve => setTimeout(resolve, 1000))

    setValidatedBlocks(prev => [...prev, {
      id: prev.length + 1,
      validator: selectedValidator.name,
      timestamp: Date.now(),
      status: "validated",
      hash,
    }])

    setPosValidators(prev => prev.map(v => ({ ...v, computing: false })))
    setCurrentBlock(null)
    setIsAnimating(false)
  }

  // Delegated Proof of Stake
  const startDPoSValidation = async () => {
    setIsAnimating(true)
    
    // Only top validators can produce blocks
    const activeValidators = dposValidators.filter(v => v.isValidator)
    const selectedValidator = activeValidators[round % activeValidators.length]

    setDposValidators(prev => prev.map(v => ({
      ...v,
      computing: v.id === selectedValidator.id
    })))

    setCurrentBlock({
      id: validatedBlocks.length + 1,
      validator: selectedValidator.name,
      timestamp: Date.now(),
      status: "pending",
    })

    await new Promise(resolve => setTimeout(resolve, 1500))

    const hash = "0x" + Math.random().toString(16).substring(2, 15)
    setCurrentBlock(prev => prev ? { ...prev, status: "validated", hash } : null)

    await new Promise(resolve => setTimeout(resolve, 1000))

    setValidatedBlocks(prev => [...prev, {
      id: prev.length + 1,
      validator: selectedValidator.name,
      timestamp: Date.now(),
      status: "validated",
      hash,
    }])

    setDposValidators(prev => prev.map(v => ({ ...v, computing: false })))
    setCurrentBlock(null)
    setRound(prev => prev + 1)
    setIsAnimating(false)
  }

  // Byzantine Fault Tolerance
  const startBFTConsensus = async () => {
    setIsAnimating(true)
    setBftVotes({})
    
    setCurrentBlock({
      id: validatedBlocks.length + 1,
      validator: "BFT Network",
      timestamp: Date.now(),
      status: "pending",
      votes: 0,
    })

    // Simulate voting rounds
    setBftNodes(prev => prev.map(v => ({ ...v, computing: true })))
    
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Each node votes
    const votes: { [key: number]: boolean } = {}
    let yesVotes = 0
    
    for (const node of bftNodes) {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Honest nodes vote yes, Byzantine nodes might vote no
      const vote = node.isHonest ? true : Math.random() > 0.5
      votes[node.id] = vote
      if (vote) yesVotes++
      
      setBftVotes({ ...votes })
      setCurrentBlock(prev => prev ? { ...prev, votes: yesVotes } : null)
    }

    // Consensus requires 2/3+ majority (Byzantine Fault Tolerance)
    const requiredVotes = Math.ceil((bftNodes.length * 2) / 3)
    const consensusReached = yesVotes >= requiredVotes

    await new Promise(resolve => setTimeout(resolve, 500))

    if (consensusReached) {
      const hash = "0x" + Math.random().toString(16).substring(2, 15)
      setCurrentBlock(prev => prev ? { ...prev, status: "validated", hash } : null)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setValidatedBlocks(prev => [...prev, {
        id: prev.length + 1,
        validator: "BFT Network",
        timestamp: Date.now(),
        status: "validated",
        hash,
        votes: yesVotes,
      }])
    } else {
      setCurrentBlock(prev => prev ? { ...prev, status: "rejected" } : null)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setBftNodes(prev => prev.map(v => ({ ...v, computing: false })))
    setCurrentBlock(null)
    setIsAnimating(false)
  }

  const reset = () => {
    setValidatedBlocks([])
    setCurrentBlock(null)
    setHashAttempts(0)
    setNonce(0)
    setRound(1)
    setBftVotes({})
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Consensus Mechanisms</h2>
        <Button variant="outline" onClick={reset} size="sm">
          Reset Demo
        </Button>
      </div>

      <Tabs value={consensusType} onValueChange={(v) => setConsensusType(v as ConsensusType)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pow" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            PoW
          </TabsTrigger>
          <TabsTrigger value="pos" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            PoS
          </TabsTrigger>
          <TabsTrigger value="dpos" className="flex items-center gap-2">
            <Vote className="h-4 w-4" />
            DPoS
          </TabsTrigger>
          <TabsTrigger value="bft" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            BFT
          </TabsTrigger>
        </TabsList>

        {/* Proof of Work */}
        <TabsContent value="pow" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Proof of Work (PoW)</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Examples:</span> Bitcoin, Ethereum (pre-merge)
                    </div>
                    <div>
                      <span className="font-semibold">Security:</span> 51% attack protection
                    </div>
                    <div>
                      <span className="font-semibold">Speed:</span> ~10 min (Bitcoin)
                    </div>
                    <div>
                      <span className="font-semibold">Energy:</span> Very High
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-sm font-medium">Mining Difficulty</Label>
                    <p className="text-xs text-muted-foreground">Number of leading zeros required in hash</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDifficulty(Math.max(2, difficulty - 1))}
                      disabled={difficulty <= 2}
                    >
                      -
                    </Button>
                    <Badge variant="secondary" className="min-w-[60px] justify-center">{difficulty}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDifficulty(Math.min(6, difficulty + 1))}
                      disabled={difficulty >= 6}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {hashAttempts > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-muted p-4 rounded-lg mb-4 font-mono text-sm"
                  >
                    <div className="flex justify-between mb-2">
                      <span>Hash Attempts:</span>
                      <span className="font-bold">{hashAttempts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nonce:</span>
                      <span className="font-bold">{nonce}</span>
                    </div>
                  </motion.div>
                )}

                <Button
                  onClick={startPoWMining}
                  disabled={isAnimating}
                  className="w-full"
                  size="lg"
                >
                  {isAnimating ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Mining Block...
                    </>
                  ) : (
                    <>
                      <Cpu className="mr-2 h-4 w-4" />
                      Start Mining
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Proof of Stake */}
        <TabsContent value="pos" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Zap className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Proof of Stake (PoS)</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Examples:</span> Ethereum 2.0, Cardano
                    </div>
                    <div>
                      <span className="font-semibold">Security:</span> Economic incentives
                    </div>
                    <div>
                      <span className="font-semibold">Speed:</span> ~12 seconds (Ethereum)
                    </div>
                    <div>
                      <span className="font-semibold">Energy:</span> Very Low
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Validators (Stake determines selection probability)</h4>
                <div className="space-y-2 mb-4">
                  {posValidators.map((validator) => (
                    <motion.div
                      key={validator.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all",
                        validator.computing
                          ? "border-green-500 bg-green-500/10"
                          : "border-border bg-card"
                      )}
                      animate={validator.computing ? { scale: [1, 1.02, 1] } : {}}
                      transition={{ repeat: validator.computing ? Infinity : 0, duration: 1 }}
                    >
                      <div className="flex items-center gap-3">
                        <Server className={cn("h-5 w-5", validator.computing && "text-green-500")} />
                        <span className="font-medium">{validator.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Stake:</span>{" "}
                          <span className="font-bold">{validator.stake} ETH</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {((validator.stake! / 200) * 100).toFixed(1)}% chance
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={startPoSValidation}
                  disabled={isAnimating}
                  className="w-full"
                  size="lg"
                >
                  {isAnimating ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Validating Block...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Select Validator & Create Block
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Delegated Proof of Stake */}
        <TabsContent value="dpos" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Vote className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Delegated Proof of Stake (DPoS)</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Examples:</span> EOS, TRON
                    </div>
                    <div>
                      <span className="font-semibold">Security:</span> Reputation-based
                    </div>
                    <div>
                      <span className="font-semibold">Speed:</span> ~1-3 seconds
                    </div>
                    <div>
                      <span className="font-semibold">Energy:</span> Very Low
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Delegates & Candidates (Top 3 are active validators)</h4>
                <div className="space-y-2 mb-4">
                  {dposValidators.map((validator, idx) => (
                    <motion.div
                      key={validator.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all",
                        validator.computing
                          ? "border-blue-500 bg-blue-500/10"
                          : validator.isValidator
                          ? "border-green-500/50 bg-green-500/5"
                          : "border-border bg-card"
                      )}
                      animate={validator.computing ? { scale: [1, 1.02, 1] } : {}}
                      transition={{ repeat: validator.computing ? Infinity : 0, duration: 1 }}
                    >
                      <div className="flex items-center gap-3">
                        {validator.isValidator ? (
                          <Crown className={cn("h-5 w-5 text-yellow-500", validator.computing && "text-blue-500")} />
                        ) : (
                          <Users className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className="font-medium">{validator.name}</span>
                        {validator.isValidator && (
                          <Badge variant="secondary" className="text-xs">Active Delegate</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Votes:</span>{" "}
                          <span className="font-bold">{validator.votes}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-muted/50 p-3 rounded-lg mb-4 text-sm">
                  <div className="flex justify-between">
                    <span>Current Round:</span>
                    <span className="font-bold">#{round}</span>
                  </div>
                </div>

                <Button
                  onClick={startDPoSValidation}
                  disabled={isAnimating}
                  className="w-full"
                  size="lg"
                >
                  {isAnimating ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Producing Block...
                    </>
                  ) : (
                    <>
                      <Vote className="mr-2 h-4 w-4" />
                      Next Delegate's Turn
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Byzantine Fault Tolerance */}
        <TabsContent value="bft" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Byzantine Fault Tolerance (BFT)</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Examples:</span> Hyperledger Fabric, Cosmos
                    </div>
                    <div>
                      <span className="font-semibold">Security:</span> Byzantine Fault Tolerant
                    </div>
                    <div>
                      <span className="font-semibold">Speed:</span> ~1-6 seconds
                    </div>
                    <div>
                      <span className="font-semibold">Energy:</span> Low
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Network Nodes (Red = Byzantine/Malicious)</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {bftNodes.map((node) => {
                    const voted = bftVotes[node.id] !== undefined
                    const voteYes = bftVotes[node.id] === true
                    
                    return (
                      <motion.div
                        key={node.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-all",
                          !node.isHonest
                            ? "border-red-500 bg-red-500/10"
                            : node.computing
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-border bg-card"
                        )}
                        animate={node.computing && !voted ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ repeat: node.computing && !voted ? Infinity : 0, duration: 1 }}
                      >
                        <div className="flex items-center gap-2">
                          <Server className={cn(
                            "h-4 w-4",
                            !node.isHonest ? "text-red-500" : node.computing ? "text-purple-500" : "text-muted-foreground"
                          )} />
                          <span className="text-sm font-medium">{node.name}</span>
                        </div>
                        {voted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            {voteYes ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                {currentBlock && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-muted p-4 rounded-lg mb-4"
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span>Votes Collected:</span>
                      <span className="font-bold">{currentBlock.votes || 0} / {bftNodes.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Required for Consensus:</span>
                      <span className="font-bold">{Math.ceil((bftNodes.length * 2) / 3)} (2/3 majority)</span>
                    </div>
                  </motion.div>
                )}

                <Button
                  onClick={startBFTConsensus}
                  disabled={isAnimating}
                  className="w-full"
                  size="lg"
                >
                  {isAnimating ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Reaching Consensus...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Start Consensus Round
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Validated Blocks History */}
      {validatedBlocks.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Validated Blocks
          </h3>
          <div className="space-y-2">
            {validatedBlocks.slice(0, 5).reverse().map((block) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Block #{block.id}</Badge>
                  <span className="text-sm text-muted-foreground">by {block.validator}</span>
                  {block.votes && (
                    <span className="text-sm text-muted-foreground">
                      ({block.votes} votes)
                    </span>
                  )}
                </div>
                <code className="text-xs font-mono text-muted-foreground">{block.hash}</code>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Current Block Animation */}
      <AnimatePresence>
        {currentBlock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Card className={cn(
              "p-4 shadow-2xl border-2",
              currentBlock.status === "pending" && "border-yellow-500",
              currentBlock.status === "validated" && "border-green-500",
              currentBlock.status === "rejected" && "border-red-500"
            )}>
              <div className="flex items-center gap-3">
                {currentBlock.status === "pending" && (
                  <Clock className="h-5 w-5 text-yellow-500 animate-spin" />
                )}
                {currentBlock.status === "validated" && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {currentBlock.status === "rejected" && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <div className="font-semibold">Block #{currentBlock.id}</div>
                  <div className="text-sm text-muted-foreground">
                    {currentBlock.status === "pending" && "Processing..."}
                    {currentBlock.status === "validated" && "Validated!"}
                    {currentBlock.status === "rejected" && "Rejected"}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
