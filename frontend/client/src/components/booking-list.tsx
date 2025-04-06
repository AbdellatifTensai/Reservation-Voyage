import { useQuery, useMutation } from "@tanstack/react-query";
import { Booking, Train, Route } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export function BookingList() {
  const { toast } = useToast();
  
  // Fetch bookings
  const { 
    data: bookings = [], 
    isLoading: isLoadingBookings 
  } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Fetch trains
  const { 
    data: trains = [], 
    isLoading: isLoadingTrains 
  } = useQuery<Train[]>({
    queryKey: ["/api/trains"],
  });

  // Fetch routes
  const { 
    data: routes = [], 
    isLoading: isLoadingRoutes 
  } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const res = await apiRequest("POST", `/api/bookings/${bookingId}/cancel`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to cancel booking",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isLoading = isLoadingBookings || isLoadingTrains || isLoadingRoutes || cancelMutation.isPending;

  if (isLoading && !bookings.length) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md py-8 px-4 text-center">
        <p className="text-gray-500">You don't have any bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {bookings.map((booking) => {
          const train = trains.find(t => t.id === booking.trainId) || { name: "Unknown Train" };
          const route = routes.find(r => r.id === booking.routeId) || { 
            origin: "Unknown",
            destination: "Unknown",
            duration: 0
          };
          
          const bookingDate = new Date(booking.bookingDate);
          const departureDate = new Date(booking.departureTime);
          
          return (
            <li key={booking.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`
                      bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs font-medium
                      ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                    <p className="ml-4 text-sm font-medium text-blue-600 truncate">
                      Booking #{booking.id}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {format(departureDate, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {train.name}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {route.origin} → {route.destination}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    {booking.status !== 'cancelled' && (
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800"
                        disabled={cancelMutation.isPending}
                        onClick={() => cancelMutation.mutate(booking.id)}
                      >
                        {cancelMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Cancel booking"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
