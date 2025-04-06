import { useState } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, CreditCard } from "lucide-react";

export default function PaymentConfirmation() {
  const [isMatch, params] = useRoute("/payment/:trainId/:routeId/:departureDate");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  // Book a ticket
  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!isMatch || !params) return;
      
      const departureDate = new Date(params.departureDate);
      departureDate.setHours(8, 0, 0, 0); // Set to 8:00 AM

      const bookingData = {
        trainId: parseInt(params.trainId),
        routeId: parseInt(params.routeId),
        departureTime: departureDate.toISOString(),
        status: "confirmed"
      };

      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setIsPaymentComplete(true);
      setTimeout(() => {
        navigate("/my-bookings");
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  if (!isMatch) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Invalid payment request</CardDescription>
          </CardHeader>
          <CardContent>
            <p>The payment request is invalid or has expired.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/")} variant="default">
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Process booking after payment
      bookMutation.mutate();
    }, 1500);
  };

  if (isPaymentComplete) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <CardTitle>Payment Successful!</CardTitle>
            <CardDescription>Your ticket has been booked successfully.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p>You will be redirected to your bookings page shortly.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/my-bookings">View My Bookings</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-6 w-6" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Enter your credit card information to complete your booking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nameOnCard">Name on Card</Label>
              <Input
                id="nameOnCard"
                placeholder="John Doe"
                value={cardDetails.nameOnCard}
                onChange={(e) => setCardDetails({ ...cardDetails, nameOnCard: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                required
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                  required
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  required
                  maxLength={3}
                  type="password"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Payment"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <span>Secure Payment</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}