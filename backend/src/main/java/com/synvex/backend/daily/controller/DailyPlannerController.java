package com.synvex.backend.daily.controller;

import com.synvex.backend.daily.dto.DailyPlannerRequestDTO;
import com.synvex.backend.daily.dto.DailyPlannerResponseDTO;
import com.synvex.backend.ai.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/daily")
public class DailyPlannerController {

    private final GeminiService geminiService;

    public DailyPlannerController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/plan")
    public ResponseEntity<DailyPlannerResponseDTO> generatePlan(@Valid @RequestBody DailyPlannerRequestDTO request) {
        String prompt = "Goal:\n" + request.getGoal() + "\n\n" +
                "Date:\n" + request.getDate() + "\n\n" +
                "Available Hours:\n" + request.getAvailableHours() + "\n\n" +
                "Preferred Work Style:\n" + request.getWorkStyle();

        DailyPlannerResponseDTO response = geminiService.generateDailyPlan(prompt);
        return ResponseEntity.ok(response);
    }
}
