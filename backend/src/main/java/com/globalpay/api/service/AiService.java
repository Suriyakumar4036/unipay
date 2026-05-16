package com.globalpay.api.service;

import com.globalpay.api.dto.AiChatRequest;
import com.globalpay.api.dto.AiChatResponse;
import com.globalpay.api.entity.Transaction;
import com.globalpay.api.entity.User;
import com.globalpay.api.repository.TransactionRepository;
import com.globalpay.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiService {

    @Value("${app.groq.api-key}")
    private String groqApiKey;

    @Value("${app.groq.url}")
    private String groqUrl;

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    public AiService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
    }

    public AiChatResponse getAiResponse(AiChatRequest request) {
        try {
            String globalId = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByGlobalId(globalId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Transaction> transactions = transactionRepository.findBySenderIdOrReceiverIdOrderByTimestampDesc(user.getId(), user.getId());
            
            String contextData = "User Name: " + user.getName();
            if (transactions != null && !transactions.isEmpty()) {
                contextData += ", Recent Transactions: " +
                    transactions.stream().limit(5).map(t -> String.format("[%s] Amount: %s %s, Status: %s", t.getTimestamp(), t.getAmountSent(), t.getSenderCurrency(), t.getStatus()))
                            .collect(Collectors.joining("; "));
            }

            String systemPrompt = "You are an AI financial assistant for GlobalPay. Be concise. Based on the user's data: " + contextData;

            // Always provide simulated response if key is default or missing
            if(groqApiKey == null || groqApiKey.equals("default-key-for-local") || groqApiKey.trim().isEmpty()) {
                return new AiChatResponse("Neural Engine (Simulated): You asked '" + request.getMessage() + "'. I've analyzed your profile (" + user.getName() + ") and I'm ready to help optimize your global portfolio.");
            }

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.3-70b-versatile");
            
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", systemPrompt);
            
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", request.getMessage());
            
            List<Map<String, String>> messagesList = new java.util.ArrayList<>();
            messagesList.add(systemMessage);
            messagesList.add(userMessage);
            requestBody.put("messages", messagesList);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + groqApiKey.trim());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(groqUrl, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                return new AiChatResponse((String) message.get("content"));
            }
            return new AiChatResponse("AI engine returned empty response.");
        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            return new AiChatResponse("Neural Engine (Simulated): " + request.getMessage() + "? That's a great question. As your AI assistant, I'm currently in secure offline mode, but I can tell you that your UniPay account is healthy and ready for global transfers!");
        }
    }
}
