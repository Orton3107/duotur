import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { TopBar } from './components/TopBar'
import { BottomNav } from './components/BottomNav'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { LoginPage } from './pages/LoginPage'
import { LessonPage } from './pages/LessonPage'
import { useProgressStore } from './store/useProgressStore'
import { useAuthStore } from './store/useAuthStore'

function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-[#131f24]">
      <TopBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  const regenHeartsIfDue = useProgressStore((s) => s.regenHeartsIfDue)
  const initAuth = useAuthStore((s) => s.init)

  useEffect(() => {
    initAuth()
    regenHeartsIfDue()
    const id = setInterval(regenHeartsIfDue, 60_000)
    return () => clearInterval(id)
  }, [initAuth, regenHeartsIfDue])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/lesson/:moduleId/:lessonIndex" element={<LessonPage />} />
      </Routes>
    </BrowserRouter>
  )
}
