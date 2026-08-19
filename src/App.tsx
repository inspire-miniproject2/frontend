import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppShell } from './layouts/AppShell'
import { GuidePage } from './pages/GuidePage'
import { ComplaintApplicationProvider } from './features/complaint-application/ComplaintApplicationContext'
import { RequireRole } from './features/auth/RequireRole'
import { PublicOnly } from './features/auth/PublicOnly'
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
          <Route path="login" element={<PublicOnly><LoginPage /></PublicOnly>} />
          <Route path="signup" element={<PublicOnly><SignupPage /></PublicOnly>} />
          <Route element={<RequireRole allowedRoles={['CITIZEN']}><ComplaintApplicationProvider /></RequireRole>}>
            <Route path="complaints/new">
              <Route path="write" element={<ComplaintWritePage />} />
              <Route path="confirm" element={<ComplaintConfirmPage />} />
              <Route path="complete/:complaintId" element={<ComplaintCompletePage />} />
            </Route>
          </Route>
          <Route element={<RequireRole allowedRoles={['CITIZEN']}><Outlet /></RequireRole>}>
            <Route path="my/complaints" element={<MyComplaintsPage />} />
            <Route path="my/complaints/:complaintId" element={<ComplaintDetailPage />} />
          </Route>
          <Route path="public-responses" element={<PublicResponsesPage />} />
          <Route path="public-responses/:responseId" element={<PublicResponseDetailPage />} />
          <Route element={<RequireRole allowedRoles={['OFFICER', 'ADMIN']}><Outlet /></RequireRole>}>
            <Route path="officer/complaints" element={<OfficerComplaintsPage />} />
            <Route path="officer/complaints/:complaintId" element={<OfficerComplaintDetailPage />} />
          </Route>
          <Route element={<RequireRole allowedRoles={['ADMIN']}><Outlet /></RequireRole>}>
            <Route path="admin/statistics" element={<AdminStatisticsPage />} />
          </Route>
          <Route element={<RequireRole allowedRoles={['CITIZEN', 'OFFICER', 'ADMIN']}><Outlet /></RequireRole>}>
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="guide" element={<GuidePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
