package com.amardeep.VaultNote.controllers;

import com.amardeep.VaultNote.models.AppRole;
import com.amardeep.VaultNote.models.Role;
import com.amardeep.VaultNote.models.User;
import com.amardeep.VaultNote.repositories.RoleRepository;
import com.amardeep.VaultNote.repositories.UserRepository;
import com.amardeep.VaultNote.security.jwt.JwtUtils;
import com.amardeep.VaultNote.security.request.LoginRequest;
import com.amardeep.VaultNote.security.request.SignUpRequest;
import com.amardeep.VaultNote.security.response.LoginResponse;
import com.amardeep.VaultNote.security.response.MessageResponse;
import com.amardeep.VaultNote.security.response.UserInfoResponse;
import com.amardeep.VaultNote.security.services.UserDetailsImpl;
import com.amardeep.VaultNote.services.TotpService;
import com.amardeep.VaultNote.services.UserService;
import com.amardeep.VaultNote.util.AuthUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Path;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials="true")
public class AuthController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UserService userService;

    @Autowired
    AuthUtil authUtil;

    @Autowired
    TotpService totpService;

    @Autowired
    private ServletContext servletContext;

    @Value("${file.upload-dir}")
    private String upload_Dir;

    @PostMapping("/public/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException exception) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Bad credentials");
            map.put("status", false);
            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
        }

//      set the authentication
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

        // Collect roles from the UserDetails
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Prepare the response body, now including the JWT token directly in the body
        LoginResponse response = new LoginResponse(userDetails.getUsername(), roles, jwtToken);

        // Return the response entity with the JWT token included in the response body
        return ResponseEntity.ok(response);
    }

    @PostMapping("/public/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByUserName(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("This username is already taken. Please try with different username!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("This email is already taken. Please try with different email!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Role role;

        if (strRoles == null || strRoles.isEmpty()) {
            role = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        } else {
            String roleStr = strRoles.iterator().next();
            if (roleStr.equals("admin")) {
                role = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            } else {
                role = roleRepository.findByRoleName(AppRole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            }

            user.setAccountNonLocked(true);
            user.setAccountNonExpired(true);
            user.setCredentialsNonExpired(true);
            user.setEnabled(true);
            user.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
            user.setAccountExpiryDate(LocalDate.now().plusYears(1));
            user.setTwoFactorEnabled(false);
            user.setSignUpMethod("email");
        }
        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.isAccountNonLocked(),
                user.isAccountNonExpired(),
                user.isCredentialsNonExpired(),
                user.isEnabled(),
                user.getCredentialsExpiryDate(),
                user.getAccountExpiryDate(),
                user.isTwoFactorEnabled(),
                roles
        );

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/username")
    public String currentUserName(@AuthenticationPrincipal UserDetails userDetails) {
        return (userDetails != null) ? userDetails.getUsername() : "";
    }

    @PostMapping("/public/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email){
        try{
            userService.generatePasswordResetToken(email);
            return ResponseEntity.ok(new MessageResponse("Password reset email sent successfully!"));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
                    //body(new MessageResponse("Error sending password reset email"));
        }
    }

    @PostMapping("/public/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword){
     try{
       userService.resetPassword(token,newPassword);
       return ResponseEntity.ok(new MessageResponse("Password is reset successfully!"));
     } catch (Exception e){
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error resetting password"));
     }
    }

    @PostMapping("/enable-2fa")
    public ResponseEntity<String> enable2FA(){
       Long userId = authUtil.loggedInUserId();
        GoogleAuthenticatorKey secret = userService.generate2FASecret(userId);
        String QRCodeURL = totpService.getQRCodeUrl(secret,userService.getUserById(userId).getUserName());
        return ResponseEntity.ok(QRCodeURL);
    }

    @PostMapping("/disable-2fa")
    public ResponseEntity<String> disable2FA(){
        Long userId = authUtil.loggedInUserId();
       userService.disable2FA(userId);
        return ResponseEntity.ok("2FA is disabled");
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<String> verify2FA(@RequestParam int code){
        Long userId = authUtil.loggedInUserId();
        boolean isValid = userService.validate2FACode(userId, code);
        if(isValid){
            userService.enable2FA(userId);
            return ResponseEntity.ok("2FA verified");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid 2FA");
    }

    @GetMapping("/user/2fa-status")
    public ResponseEntity<?> get2FAStatus(){
        User user = authUtil.loggedInUser();
        if(user!=null){
            return ResponseEntity.ok().body(Map.of("is2faEnabled",user.isTwoFactorEnabled()));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    @PostMapping("/public/verify-2fa-login")
    public ResponseEntity<String> verify2FALogin(@RequestParam int code, @RequestParam String jwtToken){
        String username = jwtUtils.getUserNameFromJwtToken(jwtToken);
        User user = userService.findByUsername(username);
        boolean isValid = userService.validate2FACode(user.getUserId(), code);
        if(isValid){
            return ResponseEntity.ok("2FA verified");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid 2FA code");
    }

    @PostMapping("/{userId}/upload-profile-photo")
    public ResponseEntity<?> uploadProfilePhoto(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        try {
            User user = userService.uploadProfilePhotoUser(userId, file);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{userId}/get-profile-photo")
    public ResponseEntity<byte[]> getProfilePhotoByUserId(@PathVariable Long userId) {
        User user = userService.getProfilePhotoByUserId(userId);
        byte[] imageFile = user.getProfilePhotoData();

        return ResponseEntity.ok().contentType(MediaType.valueOf(user.getProfilePhotoType())).body(imageFile);

    }

    @PostMapping("/send-verification-code")
    public ResponseEntity<?> sendVerificationCode(@RequestParam MultiValueMap<String, String> formData) throws JsonProcessingException {

        boolean message = userService.sendVerificationCode(formData);
        if(message){
            return ResponseEntity.ok("Verification code sent to your email.");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send verification code to your email");
    }

    @PostMapping("/verify-verification-code")
    public ResponseEntity<?> verifyCode(@RequestBody MultiValueMap<String, String> formData) {
        boolean message = userService.verifyCode(formData);
        if(message){
            return ResponseEntity.ok("Your credentials updated successfully. Please log in again.");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Invalid verification code. Please try again.");
    }


}
