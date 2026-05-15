package com.globalpay.api.security;

import com.globalpay.api.entity.User;
import com.globalpay.api.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String globalIdOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByGlobalId(globalIdOrEmail)
                .orElseGet(() -> userRepository.findByEmail(globalIdOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID/Email: " + globalIdOrEmail)));

        return new org.springframework.security.core.userdetails.User(user.getGlobalId(), user.getPassword(), new ArrayList<>());
    }
}
