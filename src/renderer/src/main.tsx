import './assets/main.css'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AppProvider } from './components/Settings/context/appContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppProvider>
    <App />
  </AppProvider>

)
