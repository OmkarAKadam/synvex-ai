package com.synvex.backend.replanning.controller;

import com.synvex.backend.ai.service.GeminiService;
import com.synvex.backend.replanning.dto.ReplanningRequestDTO;
import com.synvex.backend.replanning.dto.ReplanningResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/replanning")
public class ReplanningController {

    private final GeminiService geminiService;

    public ReplanningController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ReplanningResponseDTO> generateReplanning(@Valid @RequestBody ReplanningRequestDTO request) {
        String prompt = "Goal:\n" + request.getGoal() + "\n\n" +
                "Deadline:\n" + request.getDeadline() + "\n\n" +
                "Current Progress:\n" + request.getProgressPercentage() + "%\n\n" +
                "Available Hours Per Day:\n" + request.getAvailableHours() + "\n\n" +
                "Missed Tasks:\n" + request.getMissedTasks() + "\n\n" +
                "Create a revised execution plan based on the user's current progress and missed tasks.\n" +
                "Adjust priorities where necessary.\n" +
                "Suggest how to recover lost progress.\n" +
                "Keep the plan realistic and actionable.\n" +
                "Return the response as clear, well-structured plain text.";

        ReplanningResponseDTO response = geminiService.generateReplanning(prompt);
        return ResponseEntity.ok(response);
    }
}