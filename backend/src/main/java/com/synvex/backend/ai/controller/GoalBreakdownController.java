package com.synvex.backend.ai.controller;

import com.synvex.backend.ai.dto.GoalBreakdownRequestDTO;
import com.synvex.backend.ai.dto.GoalBreakdownResponseDTO;
import com.synvex.backend.ai.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class GoalBreakdownController {

    private final GeminiService geminiService;

    public GoalBreakdownController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/goal-breakdown")
    public ResponseEntity<GoalBreakdownResponseDTO> breakdownGoal(@Valid @RequestBody GoalBreakdownRequestDTO request) {
        String prompt = "Goal:\n" + request.getGoal() + "\n\n" +
                "Deadline:\n" + request.getDeadline() + "\n\n" +
                "Available Hours Per Day:\n" + request.getAvailableHours() + "\n\n" +
                "Preferred Work Style:\n" + request.getWorkStyle();

        GoalBreakdownResponseDTO response = geminiService.generateContent(prompt);
        return ResponseEntity.ok(response);
    }
}
