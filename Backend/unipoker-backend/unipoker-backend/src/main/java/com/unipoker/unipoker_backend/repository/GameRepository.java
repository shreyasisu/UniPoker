package com.unipoker.unipoker_backend.repository;

import com.unipoker.unipoker_backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {
    Optional<Game> findByHostId(Long hostUserId);
}
