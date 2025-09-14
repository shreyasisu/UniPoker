package com.unipoker.unipoker_backend.service;

import com.unipoker.unipoker_backend.dto.CreateGameRequest;
import com.unipoker.unipoker_backend.dto.GameResponse;
import com.unipoker.unipoker_backend.model.Game;
import com.unipoker.unipoker_backend.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameService {
    private final GameRepository repo;

    public GameService(GameRepository repo) {
        this.repo = repo;
    }

    public GameResponse createGame(CreateGameRequest req) {
        Game game = new Game();
        game.setGameType(req.getGameType());
        game.setBlinds(req.getBlinds());
        game.setMinBuyIn(req.getMinBuyIn());
        game.setMaxBuyIn(req.getMaxBuyIn());
        game.setStartTime(req.getStartTime());
        game.setAddress(req.getAddress());
        game.setLat(req.getLat());
        game.setLng(req.getLng());
        game.setNotes(req.getNotes());

        Game saved = repo.save(game);
        return GameResponse.from(saved);
    }

    public List<GameResponse> listGames() {
        return repo.findAll().stream()
                .map(GameResponse::from)
                .collect(Collectors.toList());
    }
}
