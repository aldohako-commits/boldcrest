'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        {/* Entering overlay — scales Y from bottom */}
        <motion.div
          className="fixed inset-0 z-[9999] origin-bottom bg-accent"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.65, 0, 0.35, 1],
          }}
          style={{ transformOrigin: 'top' }}
        />
        {/* Exiting overlay — scales Y from top */}
        <motion.div
          className="fixed inset-0 z-[9999] origin-top bg-accent"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.65, 0, 0.35, 1],
            delay: 0.1,
          }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
