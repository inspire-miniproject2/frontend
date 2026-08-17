import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'krds-react/dist/index.css'
import './styles/global.css'
import './styles/app.css'
import { App } from './App'
import { enableMocking } from './mocks/enableMocking'

async function bootstrap() {
  await enableMocking()
  createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
}

void bootstrap()
