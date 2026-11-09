import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Background3D from './Background3D'
import Home from './Home'
import Login from './Login'

function App() {
  return (
    <BrowserRouter>
      <Background3D />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
