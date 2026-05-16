package com.globalpay.api.controller;

import com.globalpay.api.entity.Card;
import com.globalpay.api.entity.User;
import com.globalpay.api.repository.CardRepository;
import com.globalpay.api.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
        
        // If no cards exist, generate a default one for the user (simulation)
        if (cards.isEmpty()) {
            Card defaultCard = generateVirtualCard(user, "DEBIT", "VISA");
            cardRepository.save(defaultCard);
            cards = List.of(defaultCard);
        }
        
        return ResponseEntity.ok(cards);
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
        
        return new Card(user, type, formattedNumber, user.getName().toUpperCase(), expiry, cvv, network, "ACTIVE");
    }
}
