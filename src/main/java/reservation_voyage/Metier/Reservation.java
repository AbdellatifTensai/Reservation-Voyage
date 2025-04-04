package reservation_voyage.Metier;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String passengerName;
    private String seatNumber;

    @ManyToOne
    @JoinColumn(name = "train_id", nullable = false)
    private Train train;
}