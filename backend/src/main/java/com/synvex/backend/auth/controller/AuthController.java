package com.synvex.backend.auth.controller;

import com.synvex.backend.auth.dto.AuthRequestDTO;
import com.synvex.backend.auth.dto.AuthResponseDTO;
import com.synvex.backend.auth.dto.ChangePasswordRequestDTO;
import com.synvex.backend.auth.dto.ForgotPasswordRequestDTO;
import com.synvex.backend.auth.dto.ResetPasswordRequestDTO;
import com.synvex.backend.auth.service.JwtService;
import com.synvex.backend.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO authRequestDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequestDTO.getEmail(),
                        authRequestDTO.getPassword()
                )
        );

        String token = jwtService.generateToken(authRequestDTO.getEmail());

        AuthResponseDTO response = AuthResponseDTO.builder()
                .token(token)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequestDTO changePasswordRequestDTO
    ) {
        userService.changePassword(authentication.getName(), changePasswordRequestDTO);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO request) {
        userService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "If an account exists, a password reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO request) {
        userService.resetPassword(request.getToken(), request.getNewPassword(), request.getConfirmPassword());
        return ResponseEntity.noContent().build();
    }
}
