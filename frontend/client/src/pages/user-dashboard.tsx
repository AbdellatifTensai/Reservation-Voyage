import { useQuery } from "@tanstack/react-query";
import { Booking } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { DashboardLayout } from "@/components/dashboard-layout";
import { BookingList } from "@/components/booking-list";
import { 
  Card, 
  CardContent, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Ticket, User } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();
  
  // Fetch bookings to show count
  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });
  
  // Count active bookings (not cancelled)
  const activeBookingsCount = bookings.filter(
    booking => booking.status !== "cancelled"
  ).length;

  if (!user) return null;

  return (
    <DashboardLayout title="User Dashboard">
      {/* Dashboard Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Find Tickets Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Find Tickets
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      Search and book new tickets
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Button
                variant="link"
                className="font-medium text-blue-600 hover:text-blue-500 p-0"
                asChild
              >
                <Link href="/find-tickets">Find tickets &rarr;</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* My Bookings Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    My Bookings
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {activeBookingsCount} active bookings
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Button
                variant="link"
                className="font-medium text-blue-600 hover:text-blue-500 p-0"
                asChild
              >
                <Link href="/my-bookings">View all bookings &rarr;</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    My Profile
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      View and edit account details
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Button
                variant="link"
                className="font-medium text-blue-600 hover:text-blue-500 p-0"
              >
                Update profile &rarr;
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Bookings */}
      <div className="mt-10">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h2>
        <BookingList />
      </div>
      
      {/* Available Trains Section */}
      <div className="mt-10">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Available Trains</h2>
        <Link href="/find-tickets">
          <a className="inline-block mb-4 text-blue-600 hover:text-blue-800">
            View all available trains →
          </a>
        </Link>
      </div>
    </DashboardLayout>
  );
}
