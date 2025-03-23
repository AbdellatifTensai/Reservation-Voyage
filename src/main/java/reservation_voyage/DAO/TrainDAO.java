package reservation_voyage.DAO;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import reservation_voyage.JpaUtil;
import reservation_voyage.Metier.Train;

import java.util.List;

public class TrainDAO {

    public void saveTrain(Train train) {
        EntityManager em = JpaUtil.getEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();
            em.persist(train);
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

    public List<Train> getAllTrains() {
        EntityManager em = JpaUtil.getEntityManager();
        try {
            return em.createQuery("SELECT t FROM Train t", Train.class).getResultList();
        } finally {
            em.close();
        }
    }
}
