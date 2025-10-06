package com.unipoker.unipoker_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String gameType;
    private String blinds;
    private int minBuyIn;
    private int maxBuyIn;
    private String startTime;   // ISO string for MVP
    private String address;     // private, only revealed after approval
    private Double lat;
    private Double lng;
    private String notes;

    private Long hostId;


}
