package com.amardeep.VaultNote.services.impl;

import com.amardeep.VaultNote.config.RedisConfig;
import com.amardeep.VaultNote.dtos.UserDTO;
import com.amardeep.VaultNote.models.*;
import com.amardeep.VaultNote.repositories.PasswordResetTokenRepository;
import com.amardeep.VaultNote.repositories.RoleRepository;
import com.amardeep.VaultNote.repositories.UserRepository;
import com.amardeep.VaultNote.security.jwt.JwtUtils;
import com.amardeep.VaultNote.services.TotpService;
import com.amardeep.VaultNote.services.UserService;
import com.amardeep.VaultNote.util.EmailService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Value("http://vault-note.s3-website.ca-central-1.amazonaws.com")
    String frontendUrl;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TotpService totpService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private StringRedisTemplate redisTemplate;

    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${spring.mail.username}")
    String from;

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

    @Override
    public Optional<User> findByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user;
    }


    @Override
    public User registerUser(User user) {
        if(user.getPassword()!=null && !user.getPassword().isEmpty()){
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    @Override
    public GoogleAuthenticatorKey generate2FASecret(Long userId){
      User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
      GoogleAuthenticatorKey key = totpService.generateSecretKey();
      user.setTwoFactorSecret(key.getKey());
      userRepository.save(user);
      return key;
    }

    @Override
    public boolean validate2FACode(Long userId, int code){
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        return totpService.verifyCode(user.getTwoFactorSecret(), code);
    }

    @Override
    public void enable2FA(Long userId){
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        user.setTwoFactorEnabled(true);
        userRepository.save(user);
    }

    @Override
    public void disable2FA(Long userId){
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        user.setTwoFactorEnabled(false);
        userRepository.save(user);
    }

    @Override
    public User uploadProfilePhotoUser(Long userId, MultipartFile file) {
            User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
            user.setProfilePhotoName(file.getOriginalFilename());
            user.setProfilePhotoType(file.getContentType());
        try {
            user.setProfilePhotoData(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return userRepository.save(user);
    }

    @Override
    public User getProfilePhotoByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        return user;
    }

    @Override
    public boolean sendVerificationCode(MultiValueMap<String, String> formData) throws JsonProcessingException {

        String currentUsername = formData.getFirst("currentUsername");
        String newUsername = formData.getFirst("newUsername");
        String newPassword = formData.getFirst("newPassword");

        // Validate JWT token and retrieve the user from token
        //String username = jwtUtils.getUserNameFromJwtToken(token);
        User user = userRepository.findByUserName(currentUsername).orElseThrow(()->new RuntimeException("User not found"));
        if (user == null) {
            return false;
        }

        // Generate a unique 6-digit verification code
        String code = String.format("%06d", new Random().nextInt(1000000));

        UpdateDataRedis updateDataRedis = new UpdateDataRedis();
        updateDataRedis.setVerificationCode(code);
        updateDataRedis.setCurrentUsername(currentUsername);
        updateDataRedis.setNewUsername(newUsername);
        updateDataRedis.setNewPassword(newPassword);

        String updateDataJson = mapper.writeValueAsString(updateDataRedis);

        // Save the code in Redis with a TTL of 3 minutes.
        // Key format: verificationCode:{userId}
        String key = "verificationCode:" + user.getUserId();
        redisTemplate.opsForValue().set(key, updateDataJson, Duration.ofMinutes(3));

        // Prepare and send the verification send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setFrom(from);
        message.setSubject("VaultNote - Verification Code for Updating Profile Credentials");
        message.setText("Hello " + user.getUserName() + ",\n\n"
                + "Your verification code is: " + code + "\n"
                + "This code will expire in 3 minutes.\n\n"
                + "If you did not request a profile credentials update, please ignore this email.\n\n"
                + "Regards,\nVaultNote Team");

        try {
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    @Override
    public boolean verifyCode(MultiValueMap<String, String> formData) {
        String codeInput = formData.getFirst("code");
        String currentUsername = formData.getFirst("currentUsername");
        if (codeInput.trim().isEmpty()) {
            return false;
        }

        User user = userRepository.findByUserName(currentUsername).orElseThrow(()->new RuntimeException("User not found"));
        if (user == null) {
            return false;
        }

        String key = "verificationCode:" + user.getUserId();
        String storedJson = redisTemplate.opsForValue().get(key);
        if (storedJson == null) {
            return false;
        }

        UpdateDataRedis updateDataRedis;
        try {
            updateDataRedis = mapper.readValue(storedJson, UpdateDataRedis.class);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        if (!updateDataRedis.getVerificationCode().equals(codeInput)) {
            return false;
        }

        if (updateDataRedis.getNewUsername() != null && !updateDataRedis.getNewUsername().isEmpty()
                && !updateDataRedis.getNewUsername().equals(user.getUserName())) {
            user.setUserName(updateDataRedis.getNewUsername());
        }

        if (updateDataRedis.getNewPassword() != null && !updateDataRedis.getNewPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(updateDataRedis.getNewPassword());
            user.setPassword(encodedPassword);
        }

        userRepository.save(user);

        redisTemplate.delete(key);

        // Optionally, you might want to invalidate the user session or JWT here
        return true;
    }
}
