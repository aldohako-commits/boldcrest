'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Check if already visited this session
    if (sessionStorage.getItem('boldcrest-loaded')) {
      setVisible(false)
      return
    }

    const timer = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('boldcrest-loaded', '1')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo icon */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-16 w-16 items-center justify-center rounded-[10px] bg-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-9 w-9"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 8.5V15.5L12 22L22 15.5V8.5L12 2Z"
                fill="#0a0a0a"
              />
              <motion.path
                d="M8 12L10.5 14.5L16 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </motion.div>

          {/* Loading bar */}
          <div className="mt-8 h-[2px] w-16 overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
