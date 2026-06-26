package com.synvex.backend.ai.client;

import com.synvex.backend.ai.config.GeminiConfig;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class GeminiClient {

    private final RestTemplate restTemplate;
    private final GeminiConfig geminiConfig;

    public GeminiClient(RestTemplate restTemplate, GeminiConfig geminiConfig) {
        this.restTemplate = restTemplate;
        this.geminiConfig = geminiConfig;
    }

    public String generateContent(String prompt) {
        String url = String.format("%s?key=%s", geminiConfig.getApiUrl(), geminiConfig.getApiKey());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textMap = Map.of("text", prompt);
        Map<String, Object> partsMap = Map.of("parts", List.of(textMap));
        Map<String, Object> requestBody = Map.of("contents", List.of(partsMap));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
        );

        return response.getBody();
    }
}
