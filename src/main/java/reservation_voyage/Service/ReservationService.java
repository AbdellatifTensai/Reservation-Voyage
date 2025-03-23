package reservation_voyage.Service;

import reservation_voyage.DAO.ReservationDAO;
import reservation_voyage.Metier.Reservation;

import java.util.List;

public class ReservationService {

    private ReservationDAO reservationDao;

    public ReservationService(ReservationDAO reservationDao) {
        this.reservationDao = reservationDao;
    }

    public void createReservation(Reservation reservation) {
        reservationDao.saveReservation(reservation);
    }

    public List<Reservation> getReservationsByTrain(Long trainId) {
        return reservationDao.getReservationsByTrain(trainId);
    }
}

