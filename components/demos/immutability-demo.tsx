"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Hash, AlertTriangle, Lock, Unlock, Edit3, RotateCcw, Zap, Link as LinkIcon, Shield, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type BlockData = {
  id: number
  data: string
  previousHash: string
  hash: string
  timestamp: number
  isValid: boolean
  isTampered: boolean
}

// Simple SHA-256 simulation (not cryptographically secure, just for demonstration)
const simpleHash = (input: string): string => {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  // Convert to hex and pad to look like a real hash
  const hexHash = Math.abs(hash).toString(16).padStart(16, '0')
  // Add some randomness based on input to make it look more realistic
  const suffix = input.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).padStart(8, '0')
  return `0x${hexHash}${suffix}`.substring(0, 18) + '...' + suffix.substring(suffix.length - 4)
}

// Calculate hash for a block
const calculateBlockHash = (block: BlockData): string => {
  const dataToHash = `${block.id}${block.timestamp}${block.data}${block.previousHash}`
  return simpleHash(dataToHash)
}

export default function ImmutabilityDemo() {
  // Genesis block
  const genesisBlock: BlockData = {
    id: 0,
    data: "Bloc Genesis - Le Début de la Chaîne",
    previousHash: "0x0000000000000000",
    timestamp: Date.now(),
    hash: "",
    isValid: true,
    isTampered: false,
  }
  genesisBlock.hash = calculateBlockHash(genesisBlock)

  const [blocks, setBlocks] = useState<BlockData[]>([genesisBlock])
  const [newBlockData, setNewBlockData] = useState("")
  const [editingBlock, setEditingBlock] = useState<number | null>(null)
  const [editedData, setEditedData] = useState("")
  const [hashInput, setHashInput] = useState("")
  const [hashOutput, setHashOutput] = useState("")
  const [compareInput1, setCompareInput1] = useState("")
  const [compareInput2, setCompareInput2] = useState("")
  const [compareHash1, setCompareHash1] = useState("")
  const [compareHash2, setCompareHash2] = useState("")

  const reset = () => {
    const newGenesis: BlockData = {
      id: 0,
      data: "Genesis Block - The Beginning of the Chain",
      previousHash: "0x0000000000000000",
      timestamp: Date.now(),
      hash: "",
      isValid: true,
      isTampered: false,
    }
    newGenesis.hash = calculateBlockHash(newGenesis)
    setBlocks([newGenesis])
    setNewBlockData("")
    setEditingBlock(null)
    setEditedData("")
    setHashInput("")
    setHashOutput("")
    setCompareInput1("")
    setCompareInput2("")
    setCompareHash1("")
    setCompareHash2("")
  }

  const addBlock = () => {
    if (!newBlockData.trim()) return

    const lastBlock = blocks[blocks.length - 1]
    const newBlock: BlockData = {
      id: blocks.length,
      data: newBlockData,
      previousHash: lastBlock.hash,
      timestamp: Date.now(),
      hash: "",
      isValid: true,
      isTampered: false,
    }

    newBlock.hash = calculateBlockHash(newBlock)
    
    // Validate the entire chain including the new block
    const updatedBlocks = validateChainBlocks([...blocks, newBlock])
    setBlocks(updatedBlocks)
    setNewBlockData("")
  }

  const tamperBlock = (blockId: number) => {
    setEditingBlock(blockId)
    setEditedData(blocks[blockId].data)
  }

  const saveEdit = () => {
    if (editingBlock === null) return

    setBlocks(prevBlocks => {
      const newBlocks = prevBlocks.map(block => {
        if (block.id === editingBlock) {
          const tamperedBlock = { ...block, data: editedData, isTampered: true }
          // Recalculate hash with new data but keep old previousHash
          const newHash = calculateBlockHash({ ...tamperedBlock })
          return { ...tamperedBlock, hash: newHash }
        }
        return block
      })
      
      // Validate the entire chain after tampering
      return validateChainBlocks(newBlocks)
    })

    setEditingBlock(null)
    setEditedData("")
  }

  const rehashFromBlock = (startBlockId: number) => {
    setBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks]
      
      for (let i = startBlockId; i < newBlocks.length; i++) {
        const block = newBlocks[i]
        const previousHash = i > 0 ? newBlocks[i - 1].hash : "0x0000000000000000"
        
        newBlocks[i] = {
          ...block,
          previousHash,
          hash: calculateBlockHash({ ...block, previousHash }),
          isTampered: false,
          isValid: true,
        }
      }
      
      return newBlocks
    })
  }

  const validateChainBlocks = (blockArray: BlockData[]): BlockData[] => {
    return blockArray.map((block, index) => {
      if (index === 0) return { ...block, isValid: true }

      const expectedHash = calculateBlockHash(block)
      const previousBlock = blockArray[index - 1]
      
      // Check if the previous hash stored in this block matches the actual hash of the previous block
      const previousHashMatches = block.previousHash === previousBlock.hash
      
      // Check if the current block's hash is correct for its data
      const hashMatches = block.hash === expectedHash
      
      // Block is only valid if:
      // 1. Its previousHash matches the actual previous block's hash
      // 2. Its own hash is correct
      // 3. The previous block is also valid (chain validity cascades)
      const isValid = previousHashMatches && hashMatches && previousBlock.isValid

      return {
        ...block,
        isValid,
      }
    })
  }

  const validateChain = () => {
    setBlocks(prevBlocks => validateChainBlocks(prevBlocks))
  }



  const calculateHash = () => {
    if (!hashInput.trim()) return
    setHashOutput(simpleHash(hashInput))
  }

  const chainIsValid = blocks.every(block => block.isValid)
  const hasTamperedBlocks = blocks.some(block => block.isTampered)

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blockchain Immutability & Hashing</h2>
        
        </div>
        <Button variant="outline" onClick={reset} size="sm">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <Tabs defaultValue="hashing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hashing" className="gap-1">
            <Hash className="h-4 w-4" />
            <span className="hidden sm:inline">Hashing</span>
          </TabsTrigger>
          <TabsTrigger value="tampering" className="gap-1">
            <Edit3 className="h-4 w-4" />
            <span className="hidden sm:inline">Tampering</span>
          </TabsTrigger>
          <TabsTrigger value="avalanche" className="gap-1">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Avalanche</span>
          </TabsTrigger>
        </TabsList>

        {/* Step 1: Understanding Hashing */}
        <TabsContent value="hashing" className="space-y-4 mt-6">
          <Card className="p-4">
            <Label className="mb-3 block font-semibold">Enter text to hash:</Label>
            <div className="flex gap-2">
              <Input
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Type anything..."
                onKeyPress={(e) => e.key === 'Enter' && calculateHash()}
              />
              <Button onClick={calculateHash} disabled={!hashInput.trim()}>
                <Hash className="mr-2 h-4 w-4" />
                Hash
              </Button>
            </div>
          </Card>

          {hashOutput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Card className="p-4">
                <Label className="text-sm mb-2 block">Hash Output:</Label>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all border-2 border-blue-500/20">
                  {hashOutput}
                </div>
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="p-3 text-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs font-semibold">Deterministic</p>
                </Card>
                <Card className="p-3 text-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs font-semibold">Fast</p>
                </Card>
                <Card className="p-3 text-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs font-semibold">One-Way</p>
                </Card>
                <Card className="p-3 text-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs font-semibold">Avalanche Effect</p>
                </Card>
              </div>
            </motion.div>
          )}
        </TabsContent>

        {/* Step 2: Tampering Detection */}
        <TabsContent value="tampering" className="space-y-4 mt-6">
          {/* Add New Block */}
          <Card className="p-4">
            <Label className="mb-2 block font-semibold">Add Block</Label>
            <div className="flex gap-2">
              <Input
                value={newBlockData}
                onChange={(e) => setNewBlockData(e.target.value)}
                placeholder="Enter block data..."
                onKeyPress={(e) => e.key === 'Enter' && addBlock()}
              />
              <Button onClick={addBlock} disabled={!newBlockData.trim()}>
                <LinkIcon className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </Card>

          {blocks.length > 0 && (
            <>
              {/* Chain Status */}
              <Card className={cn(
                "p-4 border-2 transition-all",
                chainIsValid ? "border-green-500 bg-green-500/5" : "border-red-500 bg-red-500/5"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {chainIsValid ? (
                      <>
                        <Lock className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-semibold text-green-500">Chain is Valid ✓</div>
                          <div className="text-sm text-muted-foreground">No tampering detected</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-5 w-5 text-red-500" />
                        <div>
                          <div className="font-semibold text-red-500">Chain is Broken!</div>
                          <div className="text-sm text-muted-foreground">Tampering detected - chain integrity compromised</div>
                        </div>
                      </>
                    )}
                  </div>
                  {hasTamperedBlocks && (
                    <Badge variant="destructive" className="animate-pulse">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      {blocks.filter(b => b.isTampered).length} Block(s) Tampered
                    </Badge>
                  )}
                </div>
              </Card>

              {/* Blockchain Visualization with Tampering Controls */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Click "Tamper" to modify any block's data
                </h3>
                
                <div className="space-y-4">
                  {blocks.map((block, index) => (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={cn(
                        "p-4 border-2 transition-all",
                        !block.isValid && "border-red-500 bg-red-500/5",
                        block.isTampered && "border-orange-500 bg-orange-500/5",
                        editingBlock === block.id && "border-blue-500 bg-blue-500/5",
                        block.isValid && !block.isTampered && editingBlock !== block.id && "border-green-500/30"
                      )}>
                        <div className="space-y-3">
                          {/* Block Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant={block.id === 0 ? "secondary" : "default"}>
                                {block.id === 0 ? "Genesis Block" : `Block #${block.id}`}
                              </Badge>
                              {!block.isValid && (
                                <Badge variant="destructive">
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  Invalid
                                </Badge>
                              )}
                              {block.isTampered && (
                                <Badge variant="outline" className="border-orange-500 text-orange-500">
                                  <Edit3 className="mr-1 h-3 w-3" />
                                  Tampered
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {editingBlock === block.id ? (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => {
                                    setEditingBlock(null)
                                    setEditedData("")
                                  }}>
                                    Cancel
                                  </Button>
                                  <Button size="sm" onClick={saveEdit}>
                                    Save Edit
                                  </Button>
                                </>
                              ) : (
                                <>
                                  {block.id !== 0 && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => tamperBlock(block.id)}
                                    >
                                      <Edit3 className="mr-1 h-3 w-3" />
                                      Tamper
                                    </Button>
                                  )}
                                  {(block.isTampered || !block.isValid) && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => rehashFromBlock(block.id)}
                                      className="border-green-500 text-green-500 hover:bg-green-500/10"
                                    >
                                      <Zap className="mr-1 h-3 w-3" />
                                      Rehash Chain
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Block Data */}
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Block Data</Label>
                            {editingBlock === block.id ? (
                              <Textarea
                                value={editedData}
                                onChange={(e) => setEditedData(e.target.value)}
                                className="font-mono text-sm min-h-[60px]"
                                placeholder="Edit the block data..."
                              />
                            ) : (
                              <div className="font-mono text-sm p-3 bg-muted rounded border">
                                {block.data}
                              </div>
                            )}
                          </div>

                          {/* Previous Hash */}
                          {block.id > 0 && (
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                                <LinkIcon className="h-3 w-3" />
                                Previous Block Hash
                              </Label>
                              <div className={cn(
                                "font-mono text-xs p-2 rounded flex items-center gap-2 break-all",
                                block.previousHash !== blocks[block.id - 1].hash
                                  ? "bg-red-500/10 text-red-500 border border-red-500"
                                  : "bg-green-500/10 text-green-700 border border-green-500/20"
                              )}>
                                <Hash className="h-3 w-3 flex-shrink-0" />
                                {block.previousHash}
                                {block.previousHash !== blocks[block.id - 1].hash && (
                                  <AlertTriangle className="h-3 w-3 ml-auto flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          )}

                          {/* Current Hash */}
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              Block Hash
                            </Label>
                            <div className={cn(
                              "font-mono text-xs p-2 rounded flex items-center gap-2 break-all",
                              block.hash !== calculateBlockHash(block) && !editingBlock
                                ? "bg-red-500/10 text-red-500 border border-red-500"
                                : "bg-blue-500/10 text-blue-700 border border-blue-500/20"
                            )}>
                              {block.hash}
                              {block.hash !== calculateBlockHash(block) && !editingBlock && (
                                <AlertTriangle className="h-3 w-3 ml-auto flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Connection Line */}
                      {index < blocks.length - 1 && (
                        <div className="flex items-center justify-center py-2">
                          <motion.div
                            className={cn(
                              "w-0.5 h-8 rounded",
                              blocks[index + 1].isValid ? "bg-green-500" : "bg-red-500"
                            )}
                            initial={{ height: 0 }}
                            animate={{ height: 32 }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>


            </>
          )}
        </TabsContent>

        {/* Step 5: Avalanche Effect */}
        <TabsContent value="avalanche" className="space-y-4 mt-6">
          <Card className="p-4">
            <Label className="mb-3 block font-semibold">Compare Hashes</Label>
            <div className="space-y-3">
              <div>
                <Label className="text-sm mb-1 block">Text 1:</Label>
                <Input
                  value={compareInput1}
                  onChange={(e) => setCompareInput1(e.target.value)}
                  placeholder="Enter text..."
                />
              </div>
              <div>
                <Label className="text-sm mb-1 block">Text 2:</Label>
                <Input
                  value={compareInput2}
                  onChange={(e) => setCompareInput2(e.target.value)}
                  placeholder="Change one character..."
                />
              </div>

              <Button 
                onClick={() => {
                  setCompareHash1(simpleHash(compareInput1))
                  setCompareHash2(simpleHash(compareInput2))
                }} 
                disabled={!compareInput1 || !compareInput2}
                className="w-full"
              >
                <Zap className="mr-2 h-4 w-4" />
                Compare
              </Button>
            </div>
          </Card>

          {compareHash1 && compareHash2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Card className="p-4">
                <Label className="text-xs mb-1 block">Hash 1:</Label>
                <code className="font-mono text-xs bg-muted p-3 rounded block break-all">
                  {compareHash1}
                </code>
              </Card>

              <Card className="p-4">
                <Label className="text-xs mb-1 block">Hash 2:</Label>
                <code className="font-mono text-xs bg-muted p-3 rounded block break-all">
                  {compareHash2}
                </code>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
