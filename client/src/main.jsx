import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#222a3d',
            color: '#dae2fd',
            border: '1px solid #3c4a42',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
