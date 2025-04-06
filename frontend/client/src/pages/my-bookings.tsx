import { DashboardLayout } from "@/components/dashboard-layout";
import { BookingList } from "@/components/booking-list";

export default function MyBookings() {
  return (
    <DashboardLayout title="My Bookings">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Bookings</h2>
        <p className="text-gray-600 mb-4">
          View and manage all your train bookings. You can cancel bookings if your plans change.
        </p>
      </div>
      
      <BookingList />
    </DashboardLayout>
  );
}
