import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE'

export function useRealtime<T>(
  table: string,
  callback: (payload: {
    event: RealtimeEvent
    new: T
    old: T
  }) => void,
  filter?: string
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const newChannel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter,
        },
        callback
      )
      .subscribe()

    setChannel(newChannel)

    return () => {
      channel?.unsubscribe()
    }
  }, [table, callback, filter])

  return channel
} 