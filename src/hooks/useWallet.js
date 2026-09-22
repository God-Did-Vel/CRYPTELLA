import { useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export const useWallet = () => {
  const { isLoggedIn } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchWallet = useCallback(async () => {
    if (!isLoggedIn) { setLoading(false); return }
    try {
      const { data } = await api.get('/wallet')
      setWallet(data.data)
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn])

  useEffect(() => { fetchWallet() }, [fetchWallet])

  return { wallet, loading, refetch: fetchWallet }
}
