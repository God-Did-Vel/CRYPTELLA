import { useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

// Naira rate + order limits; refreshed every minute
export const useRates = () => {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    return api
      .get('/rates')
      .then(({ data }) => {
        if (data?.data) {
          setRates(data.data)
        }
        return data?.data
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 60000)
    return () => clearInterval(id)
  }, [load])

  return { rates, loading, refetch: load }
}
