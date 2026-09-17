import React, { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// Renders a LaTeX string as typeset math via KaTeX.
// NOTE: do NOT name this component `Math` — it would shadow the global Math object.
// If the string isn't LaTeX (e.g. a fallback card ID like "7"), it just prints it.
export default function Tex({ tex, className = '' }) {
  //rendering KaTeX is expensive, wrap it in useMemo to rerun only when text changes, not on every reredner
  const html = useMemo(() => {
    if (tex == null) return ''
    try {
      //renderToString converts latex into html string
      return katex.renderToString(String(tex), {
        throwOnError: false,
        //renders inline math
        displayMode: false,
        output: 'html',
      })
    } catch {
      return String(tex)
    }
  }, [tex])
  //gives back html string, need to inject it iwht dangerouslySetInnerHTML
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
