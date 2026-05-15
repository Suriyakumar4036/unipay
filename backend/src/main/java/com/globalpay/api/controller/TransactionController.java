package com.globalpay.api.controller;

import com.globalpay.api.entity.Transaction;
import com.globalpay.api.entity.User;
import com.globalpay.api.repository.TransactionRepository;
import com.globalpay.api.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionController(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions() {
        String globalId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByGlobalId(globalId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(transactionRepository.findBySenderIdOrReceiverIdOrderByTimestampDesc(user.getId(), user.getId()));
    }
}
