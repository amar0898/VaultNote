package com.amardeep.VaultNote.controllers;

import com.amardeep.VaultNote.dtos.UserDTO;
import com.amardeep.VaultNote.models.Role;
import com.amardeep.VaultNote.models.User;
import com.amardeep.VaultNote.repositories.RoleRepository;
import com.amardeep.VaultNote.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    UserService userService;
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/getusers")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/roles")
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @PutMapping("/update-role")
    public ResponseEntity<String> updateUserRole(@RequestParam Long userId,
                                                 @RequestParam String roleName) {
        userService.updateUserRole(userId, roleName);
        return ResponseEntity.ok("User role updated");
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }

    @PutMapping("/update-lock-status")
    public ResponseEntity<String> updateAccountLockStatus(@RequestParam Long userId, @RequestParam boolean locked) {
        userService.updateAccountLockStatus(userId, locked);
        return ResponseEntity.ok("Account lock status updated");
    }

    @PutMapping("/update-expiry-status")
    public ResponseEntity<String> updateAccountExpiryStatus(@RequestParam Long userId, @RequestParam boolean expired) {
        userService.updateAccountExpiryStatus(userId,expired);
        return ResponseEntity.ok("Account expiry status updated");
    }

    @PutMapping("/update-enabled-status")
    public ResponseEntity<String> updateAccountEnabledStatus(@RequestParam Long userId, @RequestParam boolean enabled) {
        userService.updateAccountEnabledStatus(userId,enabled);
        return ResponseEntity.ok("Account enabled status updated");
    }

    @PutMapping("/update-credentials-expiry-status")
    public ResponseEntity<String> updateAccountCredentialsExpiryStatus(@RequestParam Long userId, @RequestParam boolean expired) {
        userService.updateAccountCredentialsExpiryStatus(userId,expired);
        return ResponseEntity.ok("Account credentials expiry status updated");
    }

    @PutMapping("/update-password")
    public ResponseEntity<String> updateAccountPassword(@RequestParam Long userId, @RequestParam String password) {
        try{
            userService.updateAccountPassword(userId,password);
            return ResponseEntity.ok("Account password updated");
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}
