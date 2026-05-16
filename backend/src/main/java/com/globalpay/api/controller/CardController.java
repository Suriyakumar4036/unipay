package com.globalpay.api.controller;

import com.globalpay.api.entity.Card;
import com.globalpay.api.entity.User;
import com.globalpay.api.repository.CardRepository;
import com.globalpay.api.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/cards")
public class CardController {

    private final CardRepository cardRepository;
    private final UserRepository userRepository;

    public CardController(CardRepository cardRepository, UserRepository userRepository) {
        this.cardRepository = cardRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Card>> getCards() {
        String globalId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByGlobalId(globalId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Card> cards = cardRepository.findByUserId(user.getId());
        return ResponseEntity.ok(cards);
    }

    @PostMapping("/provision")
    public ResponseEntity<Card> provisionCard(@RequestBody Map<String, String> request) {
        String globalId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByGlobalId(globalId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Card card = new Card();
        card.setUser(user);
        card.setCardNumber(request.get("cardNumber"));
        card.setCvv(request.get("cvv"));
        card.setExpiryDate(request.get("expiryDate"));
        card.setNetwork(request.get("network"));
        card.setPin(request.get("pin"));
        card.setCardType("DEBIT"); // Default for provisioned cards
        card.setCardholderName(user.getName().toUpperCase());
        card.setStatus("ACTIVE");

        return ResponseEntity.ok(cardRepository.save(card));
    }

    @PostMapping("/verify-pin")
    public ResponseEntity<Map<String, Boolean>> verifyPin(@RequestBody Map<String, String> request) {
        String cardId = request.get("cardId");
        String pin = request.get("pin");
        
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        
        boolean isValid = card.getPin().equals(pin);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    @PostMapping("/issue")
    public ResponseEntity<Card> issueCard(@RequestParam String type, @RequestParam String network) {
        String globalId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByGlobalId(globalId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Card newCard = generateVirtualCard(user, type, network);
        return ResponseEntity.ok(cardRepository.save(newCard));
    }

    private Card generateVirtualCard(User user, String type, String network) {
        Random random = new Random();
        StringBuilder cardNumber = new StringBuilder();
        if (network.equals("VISA")) cardNumber.append("4");
        else cardNumber.append("5");
        
        for (int i = 0; i < 15; i++) {
            cardNumber.append(random.nextInt(10));
        }
        
        String formattedNumber = cardNumber.toString().replaceAll("(.{4})", "$1 ").trim();
        String expiry = String.format("%02d/%02d", random.nextInt(12) + 1, random.nextInt(5) + 26);
        String cvv = String.format("%03d", random.nextInt(1000));
        
        // For auto-generated cards, we'll set a default PIN 1234
        return new Card(user, type, formattedNumber, user.getName().toUpperCase(), expiry, cvv, network, "1234", "ACTIVE");
    }
}
