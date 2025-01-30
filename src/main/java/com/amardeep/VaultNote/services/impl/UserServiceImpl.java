package com.amardeep.VaultNote.services.impl;

import com.amardeep.VaultNote.dtos.UserDTO;
import com.amardeep.VaultNote.models.AppRole;
import com.amardeep.VaultNote.models.PasswordResetToken;
import com.amardeep.VaultNote.models.Role;
import com.amardeep.VaultNote.models.User;
import com.amardeep.VaultNote.repositories.PasswordResetTokenRepository;
import com.amardeep.VaultNote.repositories.RoleRepository;
import com.amardeep.VaultNote.repositories.UserRepository;
import com.amardeep.VaultNote.services.UserService;
import com.amardeep.VaultNote.util.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Value("${frontend.url}")
    String frontendUrl;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailService emailService;

    @Override
    public void updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        AppRole appRole = AppRole.valueOf(roleName);
        Role role = roleRepository.findByRoleName(appRole)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRole(role);
        userRepository.save(user);
    }


    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    @Override
    public UserDTO getUserById(Long id) {
//        return userRepository.findById(id).orElseThrow();
        User user = userRepository.findById(id).orElseThrow();
        return convertToDto(user);
    }

    private UserDTO convertToDto(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.isAccountNonLocked(),
                user.isAccountNonExpired(),
                user.isCredentialsNonExpired(),
                user.isEnabled(),
                user.getCredentialsExpiryDate(),
                user.getAccountExpiryDate(),
                user.getTwoFactorSecret(),
                user.isTwoFactorEnabled(),
                user.getSignUpMethod(),
                user.getRole(),
                user.getCreatedDate(),
                user.getUpdatedDate()
        );
    }

    @Override
    public User findByUsername(String username) {
        Optional<User> user = userRepository.findByUserName(username);
        return user.orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    @Override
    public void updateAccountLockStatus(Long userId, boolean locked) {
          User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"));
          user.setAccountNonLocked(!locked);
          userRepository.save(user);
    }

    @Override
    public void updateAccountExpiryStatus(Long userId, boolean expired) {
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"));
        user.setAccountNonExpired(!expired);
        userRepository.save(user);
    }

    @Override
    public void updateAccountEnabledStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"));
        user.setEnabled(enabled);
        userRepository.save(user);
    }

    @Override
    public void updateAccountCredentialsExpiryStatus(Long userId, boolean expired) {
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"));
        user.setCredentialsNonExpired(!expired);
        userRepository.save(user);
    }

    @Override
    public void updateAccountPassword(Long userId, String password) {
        try {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
        }
        catch (Exception e){
            throw new RuntimeException("Failed to update account password");
        }
    }

    @Override
    public void generatePasswordResetToken(String email){
       User user = userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("User not found"));
       String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plus(24, ChronoUnit.HOURS);
        PasswordResetToken passwordResetToken = new PasswordResetToken(token, expiryDate,user);
        passwordResetTokenRepository.save(passwordResetToken);
        String resetPasswordUrl = frontendUrl + "/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(),resetPasswordUrl);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token).orElseThrow(()-> new RuntimeException("Invalid password reset token"));

        if(passwordResetToken.isUsed())
            throw new RuntimeException("Password reset token is already been used");

        if(passwordResetToken.getExpiryDate().isBefore(Instant.now()))
            throw new RuntimeException("Password reset token has already been expired");

        User user = passwordResetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetToken.setUsed(true);
        passwordResetTokenRepository.save(passwordResetToken);
    }


}
