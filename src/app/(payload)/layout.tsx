/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './admin/importMap.js'
import './custom.scss'
import { MainContentWrapper } from '@/components/MainContentWrapper'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <>
    <a className="usa-skipnav" href="#main-content">
      Skip to main content
    </a>
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      <MainContentWrapper />
      {children}
    </RootLayout>
  </>
)

export default Layout
