package com.unipoker.unipoker_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    private String passwordHash;  // store hashed password

    @OneToOne(optional = true)
    @JoinColumn(name = "game_id", referencedColumnName = "id", unique = true)
    private Game hostedGame;


    //may not need bc of getter and setter
    public Game getHostedGame() {
        return hostedGame;
    }

    public void setHostedGame(Game hostedGame) {
        this.hostedGame = hostedGame;
    }
}
