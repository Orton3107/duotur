import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { TopBar } from './components/TopBar'
import { BottomNav } from './components/BottomNav'
import { ModulesMenuPage } from './pages/ModulesMenuPage'
import { ModulePathPage } from './pages/ModulePathPage'
import { ProfilePage } from './pages/ProfilePage'
import { LoginPage } from './pages/LoginPage'
import { LessonPage } from './pages/LessonPage'
import { ReviewPage } from './pages/ReviewPage'
import { useProgressStore } from './store/useProgressStore'
import { useAuthStore } from './store/useAuthStore'

function AppLayout() {
  return (
    <div className="fixed inset-0 flex justify-center bg-white dark:bg-[#131f24]">
      <div className="flex h-full w-full max-w-lg flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
          <Outlet />
        </main>
        <BottomNav />
      </div>
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
          <Route path="/" element={<ModulesMenuPage />} />
          <Route path="/module/:moduleId" element={<ModulePathPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/module/:moduleId/lesson/:lessonIndex" element={<LessonPage />} />
        <Route path="/module/:moduleId/review/:lessonIndex" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  )
}
