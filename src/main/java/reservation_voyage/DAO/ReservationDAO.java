package reservation_voyage.DAO;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.PersistenceContext;
import reservation_voyage.JpaUtil;
import reservation_voyage.Metier.Reservation;

public class ReservationDAO {

    @PersistenceContext
    private EntityManager em;

    public void saveReservation(Reservation reservation) {
        EntityManager em = JpaUtil.getEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();
            em.persist(reservation);
            tx.commit();
            System.out.println("Train saved successfully!");
        } catch (Exception e) {
            tx.rollback();
            System.err.println("Error saving train: " + e.getMessage());
            e.printStackTrace();
        } finally {
            em.close();
        }

    }

    public Reservation getReservation(Long id) {
        return em.find(Reservation.class, id);
    }

    public List<Reservation> getReservationsByTrain(Long trainId) {
        return em.createQuery("SELECT r FROM Reservation r WHERE r.train.id = :trainId", Reservation.class)
                .setParameter("trainId", trainId)
                .getResultList();
    }
}