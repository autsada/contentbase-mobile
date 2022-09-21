import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io('ws://172.20.10.2:4000')

export function useListenToAddress() {
  const [connected, setConnected] = useState(socket.connected)
  const [updatedInfo, setUpdatedInfo] = useState()

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true)
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('notification', (data) => {
      console.log('data -->', data)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('pong')
    }
  }, [])

  return { updatedInfo }
}
