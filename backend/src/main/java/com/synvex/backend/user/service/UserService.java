package com.synvex.backend.user.service;

import com.synvex.backend.auth.dto.ChangePasswordRequestDTO;
import com.synvex.backend.auth.dto.ForgotPasswordRequestDTO;
import com.synvex.backend.user.dto.UserDTO;
import com.synvex.backend.user.dto.UserProfileResponseDTO;
import com.synvex.backend.user.dto.UserProfileUpdateDTO;
import com.synvex.backend.user.entity.User;
import com.synvex.backend.user.entity.WorkStyle;
import com.synvex.backend.user.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User createUser(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists.");
        }

        User user = User.builder()
                .name(userDTO.getName())
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .workStyle(WorkStyle.FLEXIBLE)
                .build();
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public UserProfileResponseDTO getCurrentUser(String email) {
        User user = getUserByEmail(email);
        return mapToUserProfileResponseDTO(user);
    }

    @Transactional
    public User updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + id));

        userRepository.findByEmail(userDTO.getEmail()).ifPresent(existingUser -> {
            if (!existingUser.getId().equals(id)) {
                throw new RuntimeException("Email already exists.");
            }
        });

        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setOccupation(userDTO.getOccupation());
        user.setAvailableHours(userDTO.getAvailableHours());
        user.setWorkStyle(userDTO.getWorkStyle());

        return userRepository.save(user);
    }

    @Transactional
    public UserProfileResponseDTO updateCurrentUser(String email, UserProfileUpdateDTO userProfileUpdateDTO) {
        User user = getUserByEmail(email);

        userRepository.findByEmail(userProfileUpdateDTO.getEmail()).ifPresent(existingUser -> {
            if (!existingUser.getId().equals(user.getId())) {
                throw new RuntimeException("Email already exists.");
            }
        });

        user.setName(userProfileUpdateDTO.getName());
        user.setEmail(userProfileUpdateDTO.getEmail());
        user.setOccupation(userProfileUpdateDTO.getOccupation());
        user.setAvailableHours(userProfileUpdateDTO.getAvailableHours());
        if (userProfileUpdateDTO.getWorkStyle() != null) {
            user.setWorkStyle(userProfileUpdateDTO.getWorkStyle());
        }

        User updatedUser = userRepository.save(user);
        return mapToUserProfileResponseDTO(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NoSuchElementException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public void deleteCurrentUser(String email) {
        User user = getUserByEmail(email);
        userRepository.delete(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequestDTO changePasswordRequestDTO) {
        User user = getUserByEmail(email);

        if (!passwordEncoder.matches(changePasswordRequestDTO.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect.");
        }

        if (!changePasswordRequestDTO.getNewPassword().equals(changePasswordRequestDTO.getConfirmPassword())) {
            throw new RuntimeException("New password and confirmation password do not match.");
        }

        if (passwordEncoder.matches(changePasswordRequestDTO.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("New password must be different from the current password.");
        }

        user.setPassword(passwordEncoder.encode(changePasswordRequestDTO.getNewPassword()));
        userRepository.save(user);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found with email: " + email));
    }

    private UserProfileResponseDTO mapToUserProfileResponseDTO(User user) {
        return UserProfileResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .occupation(user.getOccupation())
                .availableHours(user.getAvailableHours())
                .workStyle(user.getWorkStyle())
                .build();
    }

    @Transactional
    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
            userRepository.save(user);
        });
    }

    @Transactional
    public void resetPassword(String token, String newPassword, String confirmPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token."));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired.");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("Passwords do not match.");
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException("New password must be different from the current password.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}
