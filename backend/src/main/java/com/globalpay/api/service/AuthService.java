package com.globalpay.api.service;

import com.globalpay.api.dto.AuthResponse;
import com.globalpay.api.dto.LoginRequest;
import com.globalpay.api.dto.SignupRequest;
import com.globalpay.api.entity.User;
import com.globalpay.api.entity.Wallet;
import com.globalpay.api.repository.UserRepository;
import com.globalpay.api.repository.WalletRepository;
import com.globalpay.api.security.JwtTokenProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    private static final String CLIENT_ID = "953022266513-o8p9mhfdnh0p36pkuv4f77rgib58fet6.apps.googleusercontent.com";

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

        String globalId = generateGlobalId(signUpRequest.getName());

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setGlobalId(globalId);
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        User savedUser = userRepository.save(user);
        initializeWallets(savedUser);

        String jwt = tokenProvider.generateToken(savedUser.getGlobalId());
        return new AuthResponse(jwt, savedUser.getGlobalId(), savedUser.getName());
    }

    public AuthResponse googleLogin(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");

                User user = userRepository.findByEmail(email).orElseGet(() -> {
                    // Create new user if not exists
                    User newUser = new User();
                    newUser.setName(name);
                    newUser.setEmail(email);
                    newUser.setGlobalId(generateGlobalId(name));
                    newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Random password
                    User saved = userRepository.save(newUser);
                    initializeWallets(saved);
                    return saved;
                });

                String jwt = tokenProvider.generateToken(user.getGlobalId());
                return new AuthResponse(jwt, user.getGlobalId(), user.getName());
            } else {
                throw new RuntimeException("Invalid ID token.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google Authentication failed: " + e.getMessage());
        }
    }

    private String generateGlobalId(String name) {
        String baseGlobalId = name.toLowerCase().replaceAll("\\s+", "") + "@globalpay";
        String globalId = baseGlobalId;
        int count = 1;
        while(userRepository.existsByGlobalId(globalId)) {
            globalId = baseGlobalId.split("@")[0] + count + "@globalpay";
            count++;
        }
        return globalId;
    }

    private void initializeWallets(User user) {
        walletRepository.save(new Wallet(user, "USD", new BigDecimal("1000.00")));
        walletRepository.save(new Wallet(user, "EUR", new BigDecimal("500.00")));
        walletRepository.save(new Wallet(user, "INR", new BigDecimal("50000.00")));
        walletRepository.save(new Wallet(user, "GBP", new BigDecimal("400.00")));
        walletRepository.save(new Wallet(user, "JPY", new BigDecimal("150000.00")));
        walletRepository.save(new Wallet(user, "AUD", new BigDecimal("1500.00")));
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
