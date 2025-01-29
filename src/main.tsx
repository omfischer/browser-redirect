import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <head>
      <meta property="og:image" content="https://example.com/image.jpg" />
      <meta property="og:title" content="Your Title" />
      <meta property="og:description" content="Your Description" />
    </head>
    <App />
  </StrictMode>,
)
