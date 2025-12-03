"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { ethers } from "ethers"
// We import the config optionally - in a real app this might be dynamic
import contractConfig from "./contract-config.json"

type Web3ContextType = {
  account: string | null
  provider: any | null
  contract: any | null
  isConnected: boolean
  chainId: string | null
  connectWallet: () => Promise<void>
  error: string | null
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  contract: null,
  isConnected: false,
  chainId: null,
  connectWallet: async () => {},
  error: null,
})

export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<any | null>(null)
  const [contract, setContract] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)

  const connectWallet = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setError("Please install MetaMask to use Real Mode")
      return
    }

    try {
      const browserProvider = new ethers.BrowserProvider((window as any).ethereum)
      const accounts = await browserProvider.send("eth_requestAccounts", [])
      const network = await browserProvider.getNetwork()
      
      setAccount(accounts[0])
      setProvider(browserProvider)
      setChainId(network.chainId.toString())
      setError(null)

      // Initialize contract if config exists
      if (contractConfig && contractConfig.address) {
        const signer = await browserProvider.getSigner()
        const demoContract = new ethers.Contract(
          contractConfig.address,
          contractConfig.abi,
          signer
        )
        setContract(demoContract)
      }
    } catch (err: any) {
      console.error("Failed to connect:", err)
      setError(err.message || "Failed to connect wallet")
    }
  }

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethereum = (window as any).ethereum
      
      // Check if the ethereum object has the 'on' method before using it
      if (typeof ethereum.on === "function") {
        const handleAccountsChanged = (accounts: string[]) => {
          setAccount(accounts[0] || null)
        }
        
        const handleChainChanged = () => {
          window.location.reload()
        }
        
        ethereum.on("accountsChanged", handleAccountsChanged)
        ethereum.on("chainChanged", handleChainChanged)
        
        return () => {
          if (typeof ethereum.removeListener === "function") {
            ethereum.removeListener("accountsChanged", handleAccountsChanged)
            ethereum.removeListener("chainChanged", handleChainChanged)
          }
        }
      }
    }
  }, [])

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        contract,
        isConnected: !!account,
        chainId,
        connectWallet,
        error,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
