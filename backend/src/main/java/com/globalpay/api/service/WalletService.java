package com.globalpay.api.service;

import com.globalpay.api.dto.WalletResponse;
import com.globalpay.api.entity.User;
import com.globalpay.api.entity.Wallet;
import com.globalpay.api.repository.UserRepository;
import com.globalpay.api.repository.WalletRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;

    public WalletService(WalletRepository walletRepository, UserRepository userRepository) {
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
    }

    public List<WalletResponse> getCurrentUserWallets() {
        String globalId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByGlobalId(globalId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Wallet> wallets = walletRepository.findByUserId(user.getId());
        
        return wallets.stream()
                .map(w -> new WalletResponse(w.getCurrency(), w.getBalance()))
                .collect(Collectors.toList());
    }
}
