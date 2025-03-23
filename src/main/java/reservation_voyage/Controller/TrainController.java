package reservation_voyage.Controller;

import reservation_voyage.DAO.TrainDAO;
import reservation_voyage.Metier.Train;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/trains")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TrainController {

    private TrainDAO trainDao = new TrainDAO();

    @POST
    @RolesAllowed("ADMIN")
    public Response addTrain(Train train) {
        if (train == null || train.getName() == null || train.getCapacity() <= 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid train data.")
                    .build();
        }
        trainDao.saveTrain(train);
        return Response.status(Response.Status.CREATED).build();
    }

    @GET
    public List<Train> getAllTrains() {
        return trainDao.getAllTrains();
    }
}