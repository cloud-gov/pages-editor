'use client'

import React, { useEffect, useState } from 'react'
import { Site } from '@/payload-types'
interface StartHereCardProps {
  title: string
  description?: string
  href: string
  linkLabel: string
  type: 'collection' | 'user' | 'document'
}
const StartHereCards: React.FC<StartHereCardProps> = ({
  type,
  title,
  description,
  href,
  linkLabel,
}) => {
  return (
    <div className="start-here-card">
      <div className="start-here-card__icon">
        {type === 'collection' && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"
              fill="black"
            />
          </svg>
        )}
        {type === 'user' && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 9V7h-2v2h-2v2h2v2h2v-2h2V9zM8 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 1c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm4.51-8.95C13.43 5.11 14 6.49 14 8s-.57 2.89-1.49 3.95C14.47 11.7 16 10.04 16 8s-1.53-3.7-3.49-3.95zm4.02 9.78C17.42 14.66 18 15.7 18 17v3h2v-3c0-1.45-1.59-2.51-3.47-3.17z"
              fill="black"
            />
          </svg>
        )}
        {type === 'document' && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
              fill="black"
            />
          </svg>
        )}
      </div>
      <div className="start-here-card__content">
        <div className="start-here-card__text-container">
          <h2 className="start-here-card__title">{title}</h2>
          <p className="start-here-card__description">{description}</p>
        </div>
        <a href={href} className="start-here-card__button">
          {linkLabel}
        </a>
      </div>
    </div>
  )
}
interface StartHereProps {
  sites: Site[]
  selectedSiteId?: string
  role?: string | undefined | null
}

const StartHere: React.FC<StartHereProps> = ({ sites, selectedSiteId, role }) => {
  // this is duplicated state but it helps refresh this component when needed
  const [shouldDisplay, setShouldDisplay] = useState(false)

  // Check localStorage on component mount
  useEffect(() => {
    const displayStartHere = localStorage.getItem('displayStartHere')
    // If not set in localStorage, default to true (show the component)
    setShouldDisplay(displayStartHere !== 'false')
  }, [])

  const handleClose = () => {
    localStorage.setItem('displayStartHere', 'false')
    setShouldDisplay(false)
  }

  if (!shouldDisplay) return null

  return (
    <div className="usa-summary-box" role="region" aria-labelledby="site-selection">
      <div className="usa-summary-box__header">
        <div className="display-flex flex-column flex-align-end">
          <button
            type="button"
            className="usa-button usa-button--unstyled text-no-underline"
            aria-label="Close this window"
            data-close-modal
            onClick={handleClose}
          >
            ✗
          </button>
        </div>
        <div className="display-flex flex-start">
          <h2 className="usa-summary-box__heading" id="site-selection">
            Start Here
          </h2>
        </div>
        <p>
          Here is some helpful text that will explain what to do first! And it's dismissable! and
          hopefully updates once you've done these things!
        </p>
      </div>
      <div className="usa-summary-box__body">
        <div className="margin-y-4">
          <div className="grid-row grid-gap-2">
            {role === 'manager' && (
              <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-4">
                <StartHereCards
                  title="Invite your team"
                  description="Add your team members to collaborate on this site. You can assign different roles and permissions to control access."
                  href="/admin/collections/users"
                  linkLabel="Invite a user"
                  type="user"
                />
              </div>
            )}
            <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-4">
              <StartHereCards
                title="Define your first collection"
                description="Collection types are templates for content. Create one to get started adding content!"
                href="/admin/collections/collection-types"
                linkLabel="Create a collection"
                type="collection"
              />
            </div>
            <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-4">
              <StartHereCards
                title="Draft some starter content"
                description="Create some initial content for your site to get started."
                href="/admin/collections/collection-entries"
                linkLabel="Start drafting content"
                type="document"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartHere
