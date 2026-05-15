package com.globalpay.api.service;

import com.globalpay.api.dto.AuthResponse;
import com.globalpay.api.dto.LoginRequest;
import com.globalpay.api.dto.SignupRequest;
import com.globalpay.api.entity.User;
import com.globalpay.api.entity.Wallet;
import com.globalpay.api.repository.UserRepository;
import com.globalpay.api.repository.WalletRepository;
import com.globalpay.api.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, WalletRepository walletRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        // Generate global ID (e.g. name + random number @globalpay)
        String baseGlobalId = signUpRequest.getName().toLowerCase().replaceAll("\\s+", "") + "@globalpay";
        String globalId = baseGlobalId;
        int count = 1;
        while(userRepository.existsByGlobalId(globalId)) {
            globalId = baseGlobalId.split("@")[0] + count + "@globalpay";
            count++;
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setGlobalId(globalId);
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        User savedUser = userRepository.save(user);

        // Create default wallets with some initial simulated balance for portfolio demonstration
        walletRepository.save(new Wallet(savedUser, "USD", new BigDecimal("1000.00")));
        walletRepository.save(new Wallet(savedUser, "EUR", new BigDecimal("500.00")));
        walletRepository.save(new Wallet(savedUser, "INR", new BigDecimal("50000.00")));
        walletRepository.save(new Wallet(savedUser, "GBP", new BigDecimal("400.00")));
        walletRepository.save(new Wallet(savedUser, "JPY", new BigDecimal("150000.00")));
        walletRepository.save(new Wallet(savedUser, "AUD", new BigDecimal("1500.00")));

        String jwt = tokenProvider.generateToken(savedUser.getGlobalId());
        return new AuthResponse(jwt, savedUser.getGlobalId(), savedUser.getName());
    }

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getGlobalId(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        User user = userRepository.findByGlobalId(loginRequest.getGlobalId())
                .orElseGet(() -> userRepository.findByEmail(loginRequest.getGlobalId())
                .orElseThrow(() -> new RuntimeException("User not found")));

        String jwt = tokenProvider.generateToken(user.getGlobalId());

        return new AuthResponse(jwt, user.getGlobalId(), user.getName());
    }
}
