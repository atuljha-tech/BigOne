"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="content"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
