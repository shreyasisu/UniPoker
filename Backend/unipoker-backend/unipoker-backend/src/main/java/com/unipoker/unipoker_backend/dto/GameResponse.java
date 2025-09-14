package com.unipoker.unipoker_backend.dto;

import com.unipoker.unipoker_backend.model.Game;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameResponse {
    private Long id;
    private String gameType;
    private String blinds;
    private int minBuyIn;
    private int maxBuyIn;
    private String startTime;
    private Double lat;
    private Double lng;
    private String notes;

    // Hide private address in the response
    public static GameResponse from(Game game) {
        GameResponse res = new GameResponse();
        res.setId(game.getId());
        res.setGameType(game.getGameType());
        res.setBlinds(game.getBlinds());
        res.setMinBuyIn(game.getMinBuyIn());
        res.setMaxBuyIn(game.getMaxBuyIn());
        res.setStartTime(game.getStartTime());
        res.setLat(game.getLat());
        res.setLng(game.getLng());
        res.setNotes(game.getNotes());
        return res;
    }
}
