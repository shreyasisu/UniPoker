package com.unipoker.unipoker_backend.service;

import com.unipoker.unipoker_backend.model.User;
import com.unipoker.unipoker_backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String email, String rawPassword) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (!email.endsWith("@illinois.edu")) {
            throw new IllegalArgumentException("Only @illinois.edu emails are allowed");
        }

        String hash = passwordEncoder.encode(rawPassword);
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(hash);
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String rawPassword) {
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPasswordHash()));
    }
}
