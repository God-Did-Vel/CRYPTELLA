import { useState, useEffect } from 'react'
import api from '../utils/api'

// Naira rate + order limits; refreshed every minute
export const useRates = () => {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = () =>
      api.get('/rates')
        .then(({ data }) => active && setRates(data.data))
        .catch(() => {})
        .finally(() => active && setLoading(false))
    load()
    const id = setInterval(load, 60000)
    return () => { active = false; clearInterval(id) }
  }, [])

  return { rates, loading }
}
