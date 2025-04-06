import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Train, type InsertTrain } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

// Create a schema for train form validation
const trainFormSchema = z.object({
  name: z.string().min(3, "Train name must be at least 3 characters"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  type: z.string().min(1, "Train type is required")
});

type TrainFormValues = z.infer<typeof trainFormSchema>;

export default function ManageTrains() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [trainToEdit, setTrainToEdit] = useState<Train | null>(null);
  const [trainToDelete, setTrainToDelete] = useState<Train | null>(null);

  // Fetch trains
  const { data: trains, isLoading } = useQuery<Train[]>({
    queryKey: ["/api/trains"],
  });

  // Add train mutation
  const addTrainMutation = useMutation({
    mutationFn: async (trainData: TrainFormValues) => {
      const res = await apiRequest("POST", "/api/trains", trainData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trains"] });
      toast({
        title: "Success",
        description: "Train added successfully",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update train mutation
  const updateTrainMutation = useMutation({
    mutationFn: async ({ id, trainData }: { id: number; trainData: TrainFormValues }) => {
      const res = await apiRequest("PUT", `/api/trains/${id}`, trainData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trains"] });
      toast({
        title: "Success",
        description: "Train updated successfully",
      });
      setIsEditDialogOpen(false);
      setTrainToEdit(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete train mutation
  const deleteTrainMutation = useMutation({
    mutationFn: async (trainId: number) => {
      const res = await apiRequest("DELETE", `/api/trains/${trainId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trains"] });
      toast({
        title: "Success",
        description: "Train deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setTrainToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form for adding train
  const addForm = useForm<TrainFormValues>({
    resolver: zodResolver(trainFormSchema),
    defaultValues: {
      name: "",
      capacity: 100,
      type: "",
    },
  });

  // Form for editing train
  const editForm = useForm<TrainFormValues>({
    resolver: zodResolver(trainFormSchema),
    defaultValues: {
      name: "",
      capacity: 100,
      type: "",
    },
  });

  // Handle add form submission
  const onAddSubmit = (data: TrainFormValues) => {
    addTrainMutation.mutate(data);
  };

  // Handle edit form submission
  const onEditSubmit = (data: TrainFormValues) => {
    if (trainToEdit) {
      updateTrainMutation.mutate({
        id: trainToEdit.id,
        trainData: data,
      });
    }
  };

  // Handle edit train
  const handleEditTrain = (train: Train) => {
    setTrainToEdit(train);
    editForm.reset({
      name: train.name,
      capacity: train.capacity,
      type: train.type,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete train
  const handleDeleteTrain = (train: Train) => {
    setTrainToDelete(train);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete train
  const confirmDeleteTrain = () => {
    if (trainToDelete) {
      deleteTrainMutation.mutate(trainToDelete.id);
    }
  };

  return (
    <DashboardLayout title="Manage Trains">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Trains</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Train
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trains && trains.length > 0 ? (
                  trains.map((train) => (
                    <TableRow key={train.id}>
                      <TableCell>{train.name}</TableCell>
                      <TableCell>{train.type}</TableCell>
                      <TableCell>{train.capacity}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTrain(train)}
                          disabled={updateTrainMutation.isPending}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTrain(train)}
                          disabled={deleteTrainMutation.isPending}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No trains found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Train Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Train</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Train Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Express 101" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Train Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Express, Local, Bullet" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="e.g. 200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={addTrainMutation.isPending}
                >
                  {addTrainMutation.isPending ? "Adding..." : "Add Train"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Train Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Train</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Train Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Express 101" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Train Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Express, Local, Bullet" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="e.g. 200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={updateTrainMutation.isPending}
                >
                  {updateTrainMutation.isPending ? "Updating..." : "Update Train"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the train 
              <strong> {trainToDelete?.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setTrainToDelete(null)}
              disabled={deleteTrainMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTrain}
              disabled={deleteTrainMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteTrainMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}