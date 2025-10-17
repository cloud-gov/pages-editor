import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { HomePage as HomePageType } from '@/payload-types'

export default async function HomePage() {
  const payload = await getPayload({ config })
  
  // Fetch the home page global data
  const homePageData = await payload.findGlobal({
    slug: 'home-page',
  }) as HomePageType

  // Render content blocks
  const renderContentBlocks = () => {
    if (!homePageData?.content) return null

    return homePageData.content.map((block, index) => {
      switch (block.blockType) {
        case 'hero':
          return (
            <section 
              key={index} 
              className="hero-section bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20"
              style={block.bgImage && typeof block.bgImage === 'object' && 'url' in block.bgImage ? {
                backgroundImage: `url(${block.bgImage.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {}}
            >
              <div className="container mx-auto px-4">
                <div className="max-w-4xl">
                  <h1 className="text-5xl font-bold mb-6">
                    {block.title || 'Welcome to Our Site'}
                  </h1>
                  <h2 className="text-2xl mb-4 text-blue-100">
                    {block.subtitle || 'A modern, accessible website'}
                  </h2>
                  <p className="text-lg mb-8 text-blue-100">
                    {block.description || 'This is a description of what your site offers.'}
                  </p>
                  {block.ctaButton && (
                    <a
                      href={block.ctaButton.url || '#'}
                      className={`inline-block px-8 py-3 rounded-lg font-semibold transition-colors ${
                        block.ctaButton.style === 'primary'
                          ? 'bg-white text-blue-600 hover:bg-blue-50'
                          : block.ctaButton.style === 'secondary'
                          ? 'bg-blue-500 text-white hover:bg-blue-400'
                          : 'border-2 border-white text-white hover:bg-white hover:text-blue-600'
                      }`}
                    >
                      {block.ctaButton.text || 'Get Started'}
                    </a>
                  )}
                </div>
              </div>
            </section>
          )

        case 'cardGrid':
          return (
            <section key={index} className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    {block.title || 'Featured Content'}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {block.description || 'Discover our latest updates and important information.'}
                  </p>
                </div>
                
                {block.cards && block.cards.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {block.cards.map((card, cardIndex) => (
                      <div key={cardIndex} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        {card.image && (
                          <div className="h-48 bg-gray-200">
                            {/* Note: You'll need to implement image rendering based on your media setup */}
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-500">Image Placeholder</span>
                            </div>
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {card.title}
                          </h3>
                          {card.description && (
                            <p className="text-gray-600 mb-4">
                              {card.description}
                            </p>
                          )}
                          {card.link && card.link.url && (
                            <a
                              href={card.link.url}
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {card.link.text || 'Learn More'}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )

        case 'textBlock':
          return (
            <section key={index} className="py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  {block.title && (
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      {block.title}
                    </h2>
                  )}
                  {block.content && (
                    <div className="prose prose-lg max-w-none">
                      {/* Note: You'll need to implement rich text rendering */}
                      <div dangerouslySetInnerHTML={{ __html: JSON.stringify(block.content) }} />
                    </div>
                  )}
                </div>
              </div>
            </section>
          )

        default:
          return null
      }
    })
  }

  return (
    <div className="min-h-screen">
      {renderContentBlocks()}
    </div>
  )
}
