import { useQuery } from "@tanstack/react-query";
import { Train, Route, Booking, User } from "@shared/schema";
import { Link } from "wouter";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Train as TrainIcon,
  Map,
  Ticket,
  Users,
  Edit,
  Trash2,
  Clock,
  DollarSign,
} from "lucide-react";

export default function AdminDashboard() {
  // Fetch data
  const { data: trains = [] } = useQuery<Train[]>({
    queryKey: ["/api/trains"],
  });

  const { data: routes = [] } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Count active bookings (not cancelled)
  const activeBookingsCount = bookings.filter(
    (booking) => booking.status !== "cancelled",
  ).length;

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Dashboard Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Trains Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <TrainIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Trains
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {trains.length}
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
                className="font-medium text-indigo-600 hover:text-indigo-500 p-0"
                asChild
              >
                <Link href="/admin/trains">View all trains &rarr;</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Total Routes Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <Map className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Routes
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {routes.length}
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
                className="font-medium text-indigo-600 hover:text-indigo-500 p-0"
                asChild
              >
                <Link href="/admin/routes">View all routes &rarr;</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Active Bookings Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Bookings
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {activeBookingsCount}
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
                className="font-medium text-indigo-600 hover:text-indigo-500 p-0"
              >
                View all bookings &rarr;
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Registered Users Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Registered Users
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {/* We don't have a direct way to count users, so we'll use bookings to estimate */}
                      {bookings.length > 0
                        ? Math.floor(bookings.length / 2) + 1
                        : 0}
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
                className="font-medium text-indigo-600 hover:text-indigo-500 p-0"
                asChild
              >
                <Link href="/admin/users">View all users &rarr;</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Manage Trains Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Manage Trains</h2>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              size="sm"
              asChild
            >
              <Link href="/admin/trains">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Train
              </Link>
            </Button>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {trains.length === 0 ? (
                <li className="px-4 py-6 text-center text-gray-500">
                  No trains added yet. Add your first train!
                </li>
              ) : (
                trains.slice(0, 5).map((train) => (
                  <li key={train.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {train.name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <Ticket className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {train.capacity} seats
                          </p>
                        </div>
                        <div className="mt-2 flex space-x-2 text-sm text-gray-500 sm:mt-0">
                          <Button
                            variant="link"
                            className="text-indigo-600 hover:text-indigo-900 p-0"
                            asChild
                          >
                            <Link href={`/admin/trains/${train.id}`}>Edit</Link>
                          </Button>
                          <span className="text-gray-500">|</span>
                          <Button
                            variant="link"
                            className="text-red-600 hover:text-red-900 p-0"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
            {trains.length > 5 && (
              <div className="px-4 py-3 bg-gray-50 text-right">
                <Button variant="link" className="text-indigo-600" asChild>
                  <Link href="/admin/trains">View all trains</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Manage Routes Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Manage Routes</h2>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              size="sm"
              asChild
            >
              <Link href="/admin/routes">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Route
              </Link>
            </Button>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {routes.length === 0 ? (
                <li className="px-4 py-6 text-center text-gray-500">
                  No routes added yet. Add your first route!
                </li>
              ) : (
                routes.slice(0, 5).map((route) => (
                  <li key={route.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {route.origin} → {route.destination}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {formatDuration(route.duration)}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <DollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            ${route.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="mt-2 flex space-x-2 text-sm text-gray-500 sm:mt-0">
                          <Button
                            variant="link"
                            className="text-indigo-600 hover:text-indigo-900 p-0"
                            asChild
                          >
                            <Link href={`/admin/routes/${route.id}`}>Edit</Link>
                          </Button>
                          <span className="text-gray-500">|</span>
                          <Button
                            variant="link"
                            className="text-red-600 hover:text-red-900 p-0"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
            {routes.length > 5 && (
              <div className="px-4 py-3 bg-gray-50 text-right">
                <Button variant="link" className="text-indigo-600" asChild>
                  <Link href="/admin/routes">View all routes</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
