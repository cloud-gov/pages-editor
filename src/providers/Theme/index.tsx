'use client'

import React, { createContext, useContext } from 'react'

import type { Theme, ThemeContextType } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: 'light',
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Theme is now handled by Payload's admin.theme config
  return <ThemeContext.Provider value={initialContext}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)
