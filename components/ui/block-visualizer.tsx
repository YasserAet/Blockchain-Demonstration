"use client"

import { motion } from "framer-motion"
import { Box, LinkIcon } from 'lucide-react'
import { cn } from "@/lib/utils"

export type Block = {
  id: number
  hash: string
  previousHash: string
  transactions: number
  timestamp: number
  nonce: number
}

export function BlockVisualizer({ block, isLatest }: { block: Block; isLatest: boolean }) {
  return (
    <div className="flex items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "w-48 p-4 rounded-xl border-2 bg-card shadow-xl relative group transition-all hover:-translate-y-1",
          isLatest ? "border-primary shadow-primary/20" : "border-border"
        )}
      >
        <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-bold text-muted-foreground border rounded-full">
          Block #{block.id}
        </div>
        
        <div className="space-y-3 text-xs font-mono mt-2">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Hash</span>
            <span className="text-primary truncate block">{block.hash}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Prev Hash</span>
            <span className="text-muted-foreground truncate block">{block.previousHash}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
            <div>
              <span className="text-muted-foreground block text-[10px]">Txns</span>
              <span className="font-bold">{block.transactions}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Nonce</span>
              <span className="font-bold">{block.nonce}</span>
            </div>
          </div>
        </div>

        {isLatest && (
          <div className="absolute -right-1 -top-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
        )}
      </motion.div>

      <div className="w-8 h-0.5 bg-border mx-2 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-1 rounded-full border border-border">
          <LinkIcon className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
