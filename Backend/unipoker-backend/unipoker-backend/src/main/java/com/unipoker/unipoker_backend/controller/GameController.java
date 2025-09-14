package com.unipoker.unipoker_backend.controller;

import com.unipoker.unipoker_backend.dto.CreateGameRequest;
import com.unipoker.unipoker_backend.dto.GameResponse;
import com.unipoker.unipoker_backend.service.GameService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/games")
public class GameController {
    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    @PostMapping
    public GameResponse create(@Valid @RequestBody CreateGameRequest request) {
        return service.createGame(request);
    }

    @GetMapping
    public List<GameResponse> list() {
        return service.listGames();
    }
}
