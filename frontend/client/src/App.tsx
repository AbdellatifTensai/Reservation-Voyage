import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import UserDashboard from "@/pages/user-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import FindTickets from "@/pages/find-tickets";
import MyBookings from "@/pages/my-bookings";
import ManageRoutes from "@/pages/manage-routes";
import ManageUsers from "@/pages/manage-users";
import ManageTrains from "@/pages/manage-trains";
import PaymentConfirmation from "@/pages/payment-confirmation";
import { BackendProvider } from "@/hooks/use-backend";
import { BackendSelector } from "@/components/backend-selector";

function Router() {
  return (
    <Switch>
      {/* Auth route */}
      <Route path="/auth" component={AuthPage} />
      
      {/* User routes */}
      <ProtectedRoute path="/" component={UserDashboard} />
      <ProtectedRoute path="/find-tickets" component={FindTickets} />
      <ProtectedRoute path="/my-bookings" component={MyBookings} />
      <ProtectedRoute path="/payment/:trainId/:routeId/:departureDate" component={PaymentConfirmation} />
      
      {/* Admin routes */}
      <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly />
      <ProtectedRoute path="/admin/routes" component={ManageRoutes} adminOnly />
      <ProtectedRoute path="/admin/users" component={ManageUsers} adminOnly />
      <ProtectedRoute path="/admin/trains" component={ManageTrains} adminOnly />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <BackendProvider>
      <div className="relative min-h-screen">
        <Router />
        <div className="fixed bottom-4 right-4 z-50">
          <BackendSelector />
        </div>
        <Toaster />
      </div>
    </BackendProvider>
  );
}

export default App;
