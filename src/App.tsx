import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layouts/AppShell'
import { GuidePage } from './pages/GuidePage'
import { ComplaintApplicationProvider } from './features/complaint-application/ComplaintApplicationContext'
import { RequireRole } from './features/auth/RequireRole'
import { AdminStatisticsPage } from './pages/admin-statistics/AdminStatisticsPage'
import { LoginPage } from './pages/auth/LoginPage'
import { SignupPage } from './pages/auth/SignupPage'
import { ComplaintCompletePage } from './pages/complaint-application/ComplaintCompletePage'
import { ComplaintConfirmPage } from './pages/complaint-application/ComplaintConfirmPage'
import { ComplaintWritePage } from './pages/complaint-application/ComplaintWritePage'
import { NotFoundPage } from './pages/errors/NotFoundPage'
import { ComplaintDetailPage } from './pages/my-complaints/ComplaintDetailPage'
import { MyComplaintsPage } from './pages/my-complaints/MyComplaintsPage'
import { NotificationsPage } from './pages/my-complaints/NotificationsPage'
import { OfficerComplaintDetailPage } from './pages/officer-complaints/OfficerComplaintDetailPage'
import { OfficerComplaintsPage } from './pages/officer-complaints/OfficerComplaintsPage'
import { PublicResponseDetailPage } from './pages/public-responses/PublicResponseDetailPage'
import { PublicResponsesPage } from './pages/public-responses/PublicResponsesPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="public-responses" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route element={<RequireRole allowedRoles={['CITIZEN', 'ADMIN']}><ComplaintApplicationProvider /></RequireRole>}>
            <Route path="complaints/new">
              <Route path="write" element={<ComplaintWritePage />} />
              <Route path="confirm" element={<ComplaintConfirmPage />} />
              <Route path="complete/:complaintId" element={<ComplaintCompletePage />} />
            </Route>
          </Route>
          <Route path="my/complaints" element={<MyComplaintsPage />} />
          <Route path="my/complaints/:complaintId" element={<ComplaintDetailPage />} />
          <Route path="public-responses" element={<PublicResponsesPage />} />
          <Route path="public-responses/:responseId" element={<PublicResponseDetailPage />} />
          <Route path="officer/complaints" element={<OfficerComplaintsPage />} />
          <Route path="officer/complaints/:complaintId" element={<OfficerComplaintDetailPage />} />
          <Route path="admin/statistics" element={<AdminStatisticsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="guide" element={<GuidePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
