package com.trainease.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TrainDTO {
    private Long id;
    private String name;
    private String type;
    private Integer capacity;
}
