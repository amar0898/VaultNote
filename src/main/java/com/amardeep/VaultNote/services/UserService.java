package com.amardeep.VaultNote.services;

import com.amardeep.VaultNote.dtos.UserDTO;
import com.amardeep.VaultNote.models.User;

import java.util.List;

public interface UserService {
    void updateUserRole(Long userId, String roleName);

    List<User> getAllUsers();

    UserDTO getUserById(Long id);

    User findByUsername(String username);
}