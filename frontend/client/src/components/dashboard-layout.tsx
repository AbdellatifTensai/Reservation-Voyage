import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  LayoutDashboard,
  Search,
  Ticket,
  User,
  Users2,
  MapPin,
  LogOut,
  Menu,
  X,
  Train,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
};

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  if (!user) return null;

  const isAdmin = user.isAdmin;
  const userInitials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const navItems: NavItem[] = [
    {
      href: isAdmin ? "/admin" : "/",
      label: t("nav.dashboard"),
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/find-tickets",
      label: t("nav.findTickets"),
      icon: <Search className="h-5 w-5" />,
      adminOnly: false,
    },
    {
      href: "/my-bookings",
      label: t("nav.myBookings"),
      icon: <Ticket className="h-5 w-5" />,
      adminOnly: false,
    },
    {
      href: "/admin/trains",
      label: t("nav.manageTrains"),
      icon: <Train className="h-5 w-5" />,
      adminOnly: true,
    },
    {
      href: "/admin/routes",
      label: t("nav.manageRoutes"),
      icon: <MapPin className="h-5 w-5" />,
      adminOnly: true,
    },
    {
      href: "/admin/users",
      label: t("nav.manageUsers"),
      icon: <Users2 className="h-5 w-5" />,
      adminOnly: true,
    },
  ];

  // Filter out admin-only items if the user is not an admin
  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={cn("bg-white shadow", isAdmin && "bg-indigo-700")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 
                  className={cn(
                    "text-xl font-bold", 
                    isAdmin ? "text-white" : "text-blue-600"
                  )}
                >
                  {isAdmin ? t("app.adminName") : t("app.name")}
                </h1>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {filteredNavItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={cn(
                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                        location === item.href
                          ? isAdmin
                            ? "border-white text-white"
                            : "border-blue-500 text-gray-900"
                          : isAdmin
                          ? "border-transparent text-indigo-200 hover:border-indigo-300 hover:text-white"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      )}
                    >
                      {item.label}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span 
                    className={cn(
                      "text-sm font-medium mr-2",
                      isAdmin ? "text-white" : "text-gray-700"
                    )}
                  >
                    {user.fullName}
                  </span>
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      isAdmin 
                        ? "bg-indigo-800 border border-indigo-500" 
                        : "bg-gray-200"
                    )}
                  >
                    <span 
                      className={cn(
                        "text-xs font-medium",
                        isAdmin ? "text-white" : "text-gray-700"
                      )}
                    >
                      {userInitials}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <LanguageSwitcher />
                <Button
                  variant="ghost"
                  className={cn(
                    "ml-2 text-sm",
                    isAdmin ? "text-indigo-200 hover:text-white" : "text-gray-700 hover:text-gray-900"
                  )}
                  onClick={() => {
                    logoutMutation.mutate(undefined, {
                      onSuccess: () => {
                        // Navigate to auth page after successful logout
                        setTimeout(() => navigate("/auth"), 100);
                      }
                    });
                  }}
                >
                  {t("nav.logout")}
                </Button>
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "inline-flex items-center justify-center rounded-md p-2",
                  isAdmin 
                    ? "text-indigo-200 hover:text-white hover:bg-indigo-800" 
                    : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                )}
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {filteredNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                      location === item.href
                        ? isAdmin
                          ? "border-white text-white bg-indigo-800"
                          : "border-blue-500 text-blue-700 bg-blue-50"
                        : isAdmin
                        ? "border-transparent text-indigo-200 hover:bg-indigo-800 hover:text-white"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </div>
                  </a>
                </Link>
              ))}
              <button
                className={cn(
                  "w-full flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium",
                  isAdmin
                    ? "text-indigo-200 hover:bg-indigo-800 hover:text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                )}
                onClick={() => {
                  logoutMutation.mutate(undefined, {
                    onSuccess: () => {
                      setMobileMenuOpen(false);
                      // Navigate to auth page after successful logout
                      setTimeout(() => navigate("/auth"), 100);
                    }
                  });
                }}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">{t("nav.logout")}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
