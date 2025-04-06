import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Edit, Check, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Route, insertRouteSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const routeFormSchema = insertRouteSchema.extend({
  departureTime: z.string().min(1, "Departure time is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
  price: z.string().min(1, "Price is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Price must be a positive number" }
  ),
  duration: z.number().optional(),
});

type RouteFormValues = z.infer<typeof routeFormSchema>;

export default function ManageRoutes() {
  const { toast } = useToast();
  const [editingRouteId, setEditingRouteId] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch routes
  const { data: routes, isLoading } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  // Add route mutation
  const addRouteMutation = useMutation({
    mutationFn: async (routeData: RouteFormValues) => {
      console.log("Sending route data:", {
        ...routeData,
        price: parseFloat(routeData.price),
        duration: 120
      });
      
      const res = await apiRequest("POST", "/api/routes", {
        ...routeData,
        price: parseFloat(routeData.price),
        duration: 120 // Add default duration
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      toast({
        title: "Success",
        description: "Route added successfully",
      });
      setIsAddDialogOpen(false);
      addForm.reset(); // Reset form after successful submission
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update route mutation
  const updateRouteMutation = useMutation({
    mutationFn: async ({ id, routeData }: { id: number; routeData: RouteFormValues }) => {
      const res = await apiRequest("PATCH", `/api/routes/${id}`, {
        ...routeData,
        price: parseFloat(routeData.price),
        duration: 120 // Add default duration
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      toast({
        title: "Success",
        description: "Route updated successfully",
      });
      setEditingRouteId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete route mutation
  const deleteRouteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/routes/${id}`);
      // Status 204 No Content doesn't have a response body to parse
      if (res.status === 204) {
        return { success: true };
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      toast({
        title: "Success",
        description: "Route deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form for adding route
  const addForm = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      origin: "",
      destination: "",
      departureTime: "",
      arrivalTime: "",
      price: "",
    },
  });

  // Form for editing route
  const editForm = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      origin: "",
      destination: "",
      departureTime: "",
      arrivalTime: "",
      price: "",
    },
  });

  // Set form values when editing route
  const handleEditRoute = (route: Route) => {
    setEditingRouteId(route.id);
    editForm.reset({
      origin: route.origin,
      destination: route.destination,
      departureTime: route.departureTime,
      arrivalTime: route.arrivalTime,
      price: route.price.toString(),
    });
  };

  // Handle add form submission
  const onAddSubmit = (data: RouteFormValues) => {
    console.log("Form submitted with data:", data);
    
    // No need to transform data here, let the mutation function handle it
    addRouteMutation.mutate(data);
  };

  // Handle edit form submission
  const onEditSubmit = (data: RouteFormValues) => {
    if (editingRouteId) {
      console.log("Editing route with data:", data);
      updateRouteMutation.mutate({ id: editingRouteId, routeData: data });
    }
  };

  // Handle delete route
  const handleDeleteRoute = (id: number) => {
    if (confirm("Are you sure you want to delete this route?")) {
      deleteRouteMutation.mutate(id);
    }
  };

  return (
    <DashboardLayout title="Manage Routes">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Routes</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Route
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading routes...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes && routes.length > 0 ? (
                  routes.map((route) => (
                    <TableRow key={route.id}>
                      {editingRouteId === route.id ? (
                        <TableCell colSpan={5}>
                          <Form {...editForm}>
                            <form
                              onSubmit={editForm.handleSubmit(onEditSubmit)}
                              className="grid grid-cols-5 gap-2"
                            >
                              <FormField
                                control={editForm.control}
                                name="origin"
                                render={({ field }) => (
                                  <FormControl>
                                    <Input {...field} placeholder="Origin" />
                                  </FormControl>
                                )}
                              />
                              <FormField
                                control={editForm.control}
                                name="destination"
                                render={({ field }) => (
                                  <FormControl>
                                    <Input {...field} placeholder="Destination" />
                                  </FormControl>
                                )}
                              />
                              <FormField
                                control={editForm.control}
                                name="departureTime"
                                render={({ field }) => (
                                  <FormControl>
                                    <Input {...field} placeholder="Departure Time" />
                                  </FormControl>
                                )}
                              />
                              <FormField
                                control={editForm.control}
                                name="arrivalTime"
                                render={({ field }) => (
                                  <FormControl>
                                    <Input {...field} placeholder="Arrival Time" />
                                  </FormControl>
                                )}
                              />
                              <FormField
                                control={editForm.control}
                                name="price"
                                render={({ field }) => (
                                  <FormControl>
                                    <Input {...field} placeholder="Price" />
                                  </FormControl>
                                )}
                              />
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    type="submit"
                                    size="icon"
                                    variant="ghost"
                                    disabled={updateRouteMutation.isPending}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setEditingRouteId(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </form>
                          </Form>
                        </TableCell>
                      ) : (
                        <>
                          <TableCell>{route.origin}</TableCell>
                          <TableCell>{route.destination}</TableCell>
                          <TableCell>{route.departureTime}</TableCell>
                          <TableCell>{route.arrivalTime}</TableCell>
                          <TableCell>${route.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEditRoute(route)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeleteRoute(route.id)}
                                disabled={deleteRouteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No routes found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Route Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Route</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. New York" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Boston" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="departureTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Time</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 09:00 AM" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="arrivalTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arrival Time</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 11:30 AM" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 49.99" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={addRouteMutation.isPending}
                >
                  {addRouteMutation.isPending ? "Adding..." : "Add Route"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}