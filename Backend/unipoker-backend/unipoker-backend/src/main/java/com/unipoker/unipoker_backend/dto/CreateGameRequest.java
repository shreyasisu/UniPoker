package com.unipoker.unipoker_backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateGameRequest {
    @NotBlank
    private String gameType;

    @NotBlank
    private String blinds;

    @Min(1)
    private int minBuyIn;

    @Min(1)
    private int maxBuyIn;

    @NotBlank
    private String startTime;

    @NotBlank
    private String address;

    private Double lat;
    private Double lng;
    private String notes;
}
