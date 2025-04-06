package com.trainease.dto;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BookingDTO {
    private Long id;
    private Long userId;
    private Long routeId;
    private LocalDateTime bookingDate;
    private int seats;
    private Double totalPrice;
    private String paymentStatus;
    private String bookingStatus;
}
