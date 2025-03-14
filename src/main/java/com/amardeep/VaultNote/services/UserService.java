package com.amardeep.VaultNote.services;

import com.amardeep.VaultNote.dtos.UserDTO;
import com.amardeep.VaultNote.models.User;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface UserService {
    void updateUserRole(Long userId, String roleName);

    List<User> getAllUsers();

    UserDTO getUserById(Long id);

    User findByUsername(String username);

    void updateAccountLockStatus(Long userId, boolean locked);

    void updateAccountExpiryStatus(Long userId, boolean expired);

    void updateAccountEnabledStatus(Long userId, boolean enabled);

    void updateAccountCredentialsExpiryStatus(Long userId, boolean expired);

    void updateAccountPassword(Long userId, String password);

    void generatePasswordResetToken(String email);

    void resetPassword(String token, String newPassword);

    Optional<User> findByEmail(String email);

    User registerUser(User newUser);

    GoogleAuthenticatorKey generate2FASecret(Long userId);

    boolean validate2FACode(Long userId, int code);

    void enable2FA(Long userId);

    void disable2FA(Long userId);

    User uploadProfilePhotoUser(Long userId, MultipartFile file);

    User getProfilePhotoByUserId(Long userId);
}