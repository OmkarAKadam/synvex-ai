package com.synvex.backend.analytics.controller;

import com.synvex.backend.ai.service.GeminiService;
import com.synvex.backend.analytics.dto.AnalyticsRequestDTO;
import com.synvex.backend.analytics.dto.AnalyticsResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final GeminiService geminiService;

    public AnalyticsController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalyticsResponseDTO> analyzeProductivity(@Valid @RequestBody AnalyticsRequestDTO request) {
        String prompt = "Goal:\n" + request.getGoal() + "\n\n" +
                "Deadline:\n" + request.getDeadline() + "\n\n" +
                "Current Progress:\n" + request.getProgressPercentage() + "%\n\n" +
                "Completed Tasks:\n" + request.getCompletedTasks() + "\n\n" +
                "Pending Tasks:\n" + request.getPendingTasks() + "\n\n" +
                "Available Hours Per Day:\n" + request.getAvailableHours() + "\n\n" +
                "Analyze the user's productivity based on the provided information.\n" +
                "Identify strengths in their progress.\n" +
                "Identify weaknesses or areas of concern.\n" +
                "Provide practical recommendations to improve consistency and productivity.\n" +
                "Return the response as clear, well-structured plain text.";

        AnalyticsResponseDTO response = geminiService.generateAnalytics(prompt);
        return ResponseEntity.ok(response);
    }
}