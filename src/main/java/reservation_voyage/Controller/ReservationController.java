package reservation_voyage.Controller;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import reservation_voyage.DAO.ReservationDAO;
import reservation_voyage.Metier.Reservation;

@Path("/reservations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReservationController {

    private ReservationDAO reservationDAO = new ReservationDAO();

    @POST
    public Response createReservation(Reservation reservation) {
        reservationDAO.saveReservation(reservation);
        return Response.status(Response.Status.CREATED).build();
    }
}