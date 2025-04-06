import { DashboardLayout } from "@/components/dashboard-layout";
import { TrainList } from "@/components/train-list";

export default function FindTickets() {
  return (
    <DashboardLayout title="Find Tickets">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Search for your next journey</h2>
        <p className="text-gray-600 mb-4">
          Enter your departure and destination cities to find available trains and book your tickets.
        </p>
      </div>
      
      <TrainList showSearchFilters={true} showBookButton={true} />
    </DashboardLayout>
  );
}
