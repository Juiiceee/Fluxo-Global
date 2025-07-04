'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useAccount, useDisconnect } from 'wagmi'

export function WalletConnect() {
  const { ready, authenticated, login, logout } = usePrivy()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || authenticated

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Wallet Connection</h2>
      
      {!authenticated ? (
        <button
          disabled={disableLogin}
          onClick={login}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">Status:</p>
            <p className="font-medium text-green-600">
              {isConnected ? 'Connected' : 'Authenticated'}
            </p>
            {address && (
              <>
                <p className="text-sm text-gray-600 mt-2">Address:</p>
                <p className="font-mono text-sm break-all">{address}</p>
              </>
            )}
          </div>
          
          <div className="flex space-x-2">
            {isConnected && (
              <button
                onClick={() => disconnect()}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Disconnect
              </button>
            )}
            <button
              onClick={logout}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 