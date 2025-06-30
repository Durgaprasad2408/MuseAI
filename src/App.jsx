import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Playground from './pages/Playground'
import StoryStarter from './pages/StoryStarter'
import Narrator from './pages/Narrator'
import Vault from './pages/Vault'
import Auth from './pages/Auth'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/starter" element={<StoryStarter />} />
            <Route path="/narrator" element={<Narrator />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App