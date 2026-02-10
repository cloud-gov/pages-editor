import React from 'react';

const css = `
  .graphic-icon {
    height: 19px;
  }
  .cls-1 {
    fill: #2d2e2f;
  }

  .cls-2 {
    fill: #c2c2be;
  }

  .cls-3 {
    fill: #0fadd0;
  }

  .cls-4 {
    fill: #fff;
  }

  .cls-5 {
    fill: #333;
  }
`
export const Icon = () => {
  return (
    <svg id="Layer_1" className="graphic-icon" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 465">
      <style type="text/css">{css}</style>
      <polygon className="cls-3" points="2.4 156 215 309 215 2.9 2.4 156"/>
      <polygon className="cls-1" points="215 2.9 215 309 427.6 156 215 2.9"/>
      <polygon className="cls-5" points="215 462.1 427.6 309 405.5 293 215 430.1 215 462.1"/>
      <g>
        <polygon className="cls-2" points="405.5 217 405.5 171.9 215 309.2 215 354.1 405.5 217 405.5 217"/>
        <polygon className="cls-2" points="215 386.1 215 370.2 215 430.1 405.5 293 405.5 248.9 215 386.1"/>
        <polygon className="cls-5" points="405.5 217 405.5 217 215 354.1 215 386.1 405.5 248.9 427.6 233 405.5 217"/>
      </g>
      <g>
        <polygon className="cls-3" points="215 309 28.5 174.7 215 309.2 215 430.1 28.4 295.7 28.4 174.7 2.4 156 2.4 309 215 462.1 215 309"/>
        <polygon className="cls-4" points="28.4 174.7 28.4 174.7 28.5 174.7 28.4 174.7"/>
        <polygon className="cls-4" points="215 430.1 215 309.2 28.5 174.7 28.4 174.7 28.4 295.7 215 430.1"/>
      </g>
      <polygon className="cls-4" points="215 178.1 271.1 208.6 249.7 159.2 305.7 128.6 236.4 128.6 215 79.2 193.6 128.6 124.3 128.6 180.3 159.2 158.9 208.6 215 178.1"/>
    </svg>
  )
}
