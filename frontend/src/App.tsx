
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Courses from './pages/Courses'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 md:flex">
        <Sidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
