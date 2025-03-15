package reservation_voyage;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Persistence;

public class Main {

    public static void main(String[] args) {
        EntityManager em = Persistence.createEntityManagerFactory("ReservationVoyage").createEntityManager();
    }

}
