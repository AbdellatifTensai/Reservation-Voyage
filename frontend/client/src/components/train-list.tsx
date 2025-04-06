import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Train, Route } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Clock, Map, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface TrainListProps {
  showSearchFilters?: boolean;
  showBookButton?: boolean;
}

export function TrainList({ 
  showSearchFilters = true,
  showBookButton = true 
}: TrainListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [searchDate, setSearchDate] = useState(format(new Date(), "yyyy-MM-dd"));

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

  // Book a ticket
  const bookMutation = useMutation({
    mutationFn: async ({ trainId, routeId }: { trainId: number; routeId: number }) => {
      const departureDate = new Date(searchDate);
      departureDate.setHours(8, 0, 0, 0); // Set to 8:00 AM

      const bookingData = {
        trainId,
        routeId,
        departureTime: departureDate.toISOString(),
        status: "confirmed"
      };

      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Booking successful",
        description: "Your ticket has been booked successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isLoading = isLoadingTrains || isLoadingRoutes || bookMutation.isPending;

  // Filter routes based on search criteria
  const filteredRoutes = routes.filter(route => {
    if (searchOrigin && !route.origin.toLowerCase().includes(searchOrigin.toLowerCase())) {
      return false;
    }
    if (searchDestination && !route.destination.toLowerCase().includes(searchDestination.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get available seats (mock function since we don't have a real inventory system)
  const getAvailableSeats = (trainId: number) => {
    const train = trains.find(t => t.id === trainId);
    if (!train) return 0;
    
    // Return a random number of seats between 1 and the train's capacity
    return Math.max(1, Math.floor(Math.random() * train.capacity));
  };

  if (isLoadingTrains || isLoadingRoutes) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      {showSearchFilters && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Input
                placeholder="From"
                value={searchOrigin}
                onChange={(e) => setSearchOrigin(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="To"
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="flex-1"
              />
              <Input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="default" 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredRoutes.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No routes found. Please try a different search.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredRoutes.map((route) => {
              // For this demo, we're associating each route with the first train
              const train = trains[0] || { id: 0, name: "Unknown", capacity: 0, type: "Unknown" };
              const availableSeats = getAvailableSeats(train.id);
              
              return (
                <li key={route.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 truncate">{train.name}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          {route.origin} → {route.destination} • {formatDuration(route.duration)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-semibold text-gray-900">${route.price.toFixed(2)}</p>
                        <p className="mt-1 text-xs text-green-600">{availableSeats} seats available</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-500">Depart</span>
                          <span className="font-medium">8:00 AM</span>
                        </div>
                        <div className="mx-2 border-t border-gray-300 w-20"></div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-500">Arrive</span>
                          <span className="font-medium">
                            {/* Calculate arrival time based on 8:00 AM departure and duration */}
                            {format(
                              new Date(
                                new Date().setHours(8, 0, 0, 0) + route.duration * 60000
                              ),
                              "h:mm a"
                            )}
                          </span>
                        </div>
                      </div>
                      {showBookButton && user && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => navigate(`/payment/${train.id}/${route.id}/${searchDate}`)}
                        >
                          Book Now
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
