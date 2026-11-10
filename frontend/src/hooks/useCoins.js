import { useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

export const useCoins = (refreshInterval = 30000) => {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCoins = useCallback(async () => {
    try {
      const { data } = await api.get('/coins')
      if (Array.isArray(data?.data)) {
        setCoins(data.data)
        setError(null)
      } else {
        setError('Failed to fetch coin prices')
      }
    } catch (err) {
      setError('Failed to fetch coin prices')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCoins()
    const interval = setInterval(fetchCoins, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchCoins, refreshInterval])

  return { coins: Array.isArray(coins) ? coins : [], loading, error, refetch: fetchCoins }
}
