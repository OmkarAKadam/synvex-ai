package com.synvex.backend.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.synvex.backend.ai.client.GeminiClient;
import com.synvex.backend.ai.dto.GoalBreakdownResponseDTO;
import com.synvex.backend.daily.dto.DailyPlannerResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final GeminiClient geminiClient;
    private final ObjectMapper objectMapper;

    public GeminiService(GeminiClient geminiClient, ObjectMapper objectMapper) {
        this.geminiClient = geminiClient;
        this.objectMapper = objectMapper;
    }

    public GoalBreakdownResponseDTO generateContent(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            throw new IllegalArgumentException("Prompt must not be null or blank");
        }

        String rawResponse = geminiClient.generateContent(prompt);
        String extractedText = parseGeminiResponse(rawResponse);

        return GoalBreakdownResponseDTO.builder()
                .plan(extractedText)
                .build();
    }

    public DailyPlannerResponseDTO generateDailyPlan(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            throw new IllegalArgumentException("Prompt must not be null or blank");
        }

        String rawResponse = geminiClient.generateContent(prompt);
        String extractedText = parseGeminiResponse(rawResponse);

        return DailyPlannerResponseDTO.builder()
                .plan(extractedText)
                .build();
    }

    private String parseGeminiResponse(String rawResponse) {
        try {
            JsonNode rootNode = objectMapper.readTree(rawResponse);
            JsonNode textNode = rootNode.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text");

            if (textNode.isMissingNode() || textNode.isNull() || !textNode.isTextual()) {
                throw new RuntimeException("Invalid response received from Gemini API.");
            }

            return textNode.asText();
        } catch (Exception e) {
            throw new RuntimeException("Invalid response received from Gemini API.");
        }
    }
}
