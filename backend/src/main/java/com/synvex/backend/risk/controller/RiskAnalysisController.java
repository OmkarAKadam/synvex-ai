package com.synvex.backend.risk.controller;

import com.synvex.backend.ai.service.GeminiService;
import com.synvex.backend.risk.dto.RiskAnalysisRequestDTO;
import com.synvex.backend.risk.dto.RiskAnalysisResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/risk")
public class RiskAnalysisController {

    private final GeminiService geminiService;

    public RiskAnalysisController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<RiskAnalysisResponseDTO> analyzeRisk(@Valid @RequestBody RiskAnalysisRequestDTO request) {
        String prompt = "Goal:\n" + request.getGoal() + "\n\n" +
                "Deadline:\n" + request.getDeadline() + "\n\n" +
                "Current Progress:\n" + request.getProgressPercentage() + "%\n\n" +
                "Available Hours Per Day:\n" + request.getAvailableHours() + "\n\n" +
                "Analyze the risk of achieving this goal before the deadline.\n" +
                "Identify the biggest risks.\n" +
                "Suggest practical mitigation strategies.\n" +
                "Return the response as clear, well-structured plain text.";

        RiskAnalysisResponseDTO response = geminiService.generateRiskAnalysis(prompt);
        return ResponseEntity.ok(response);
    }
}
