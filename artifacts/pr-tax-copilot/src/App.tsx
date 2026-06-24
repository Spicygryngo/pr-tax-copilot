import { Route, Switch } from "wouter";
import { AppLayout } from "./components/AppLayout";

import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import {
  Act60Page,
  ForBusinessOwnersPage,
  ForContractorsPage,
  ForEmployeesPage,
} from "./pages/AudiencePages";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import AdvisorPage from "./pages/AdvisorPage";
import DocumentsPage from "./pages/DocumentsPage";
import DocumentDetailPage from "./pages/DocumentDetailPage";
import ChecklistPage from "./pages/ChecklistPage";
import CalendarPage from "./pages/CalendarPage";
import EstimatePage from "./pages/EstimatePage";
import Act60AppPage from "./pages/Act60AppPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import BillingPage from "./pages/BillingPage";

function App() {
  return (
    <Switch>
      {/* Marketing */}
      <Route path="/" component={HomePage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/act-60" component={Act60Page} />
      <Route path="/for-employees" component={ForEmployeesPage} />
      <Route path="/for-contractors" component={ForContractorsPage} />
      <Route path="/for-business-owners" component={ForBusinessOwnersPage} />

      {/* Auth */}
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/onboarding" component={OnboardingPage} />

      {/* App (protected) */}
      <Route path="/dashboard">
        <AppLayout><DashboardPage /></AppLayout>
      </Route>
      <Route path="/advisor">
        <AppLayout><AdvisorPage /></AppLayout>
      </Route>
      <Route path="/documents">
        <AppLayout><DocumentsPage /></AppLayout>
      </Route>
      <Route path="/documents/:id">
        <AppLayout><DocumentDetailPage /></AppLayout>
      </Route>
      <Route path="/checklist">
        <AppLayout><ChecklistPage /></AppLayout>
      </Route>
      <Route path="/calendar">
        <AppLayout><CalendarPage /></AppLayout>
      </Route>
      <Route path="/estimate">
        <AppLayout><EstimatePage /></AppLayout>
      </Route>
      <Route path="/act60">
        <AppLayout><Act60AppPage /></AppLayout>
      </Route>
      <Route path="/reports">
        <AppLayout><ReportsPage /></AppLayout>
      </Route>
      <Route path="/settings">
        <AppLayout><SettingsPage /></AppLayout>
      </Route>
      <Route path="/billing">
        <AppLayout><BillingPage /></AppLayout>
      </Route>

      {/* 404 */}
      <Route>
        <div className="grid min-h-screen place-items-center text-sm text-ink-muted">
          Page not found.{" "}
          <a href="/" className="ml-1 text-accent hover:underline">Home</a>
        </div>
      </Route>
    </Switch>
  );
}

export default App;
