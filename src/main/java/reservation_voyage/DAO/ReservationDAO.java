package reservation_voyage.DAO;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import reservation_voyage.JpaUtil;
import reservation_voyage.Metier.Reservation;

public class ReservationDAO {

    public void saveReservation(Reservation reservation) {
        EntityManager em = JpaUtil.getEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();
            em.persist(reservation);
            tx.commit();
        } catch (Exception e) {
            tx.rollback();
            System.err.println("Error saving train: " + e.getMessage());
            e.printStackTrace();
        } finally {
            em.close();
        }

    }

    public Reservation getReservation(Long id) {
        EntityManager em = JpaUtil.getEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();
            Reservation reservation = em.find(Reservation.class, id);
            tx.commit();
            return reservation;
        } catch (Exception e) {
            tx.rollback();
            System.err.println("Error saving train: " + e.getMessage());
            e.printStackTrace();
        } finally {
            em.close();
        }

        return null;
    }

    public List<Reservation> getReservationsByTrain(Long trainId) {
        EntityManager em = JpaUtil.getEntityManager();
        return em.createQuery("SELECT r FROM Reservation r WHERE r.train.id = :trainId", Reservation.class)
                .setParameter("trainId", trainId)
                .getResultList();
    }
}