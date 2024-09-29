'use client'

import { Toaster } from 'react-hot-toast'

export const ToasterContext = () => {

  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        success: {
          duration: 3500,
          style: {
            background: '#F3FDE8',
            fontSize: '13px',
            fontWeight: 'bold',
            fontFamily: 'sans-serif'
          },
        },
        error: {
          duration: 3500,
          style: {
            background: '#F8C4B4',
            fontSize: '13px',
            fontWeight: 'bold',
            fontFamily: 'sans-serif'
          },
        },
      }}
    />
  )
}