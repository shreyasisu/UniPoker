package com.unipoker.unipoker_backend.repository;

import com.unipoker.unipoker_backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
}
