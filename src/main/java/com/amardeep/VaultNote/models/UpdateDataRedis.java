package com.amardeep.VaultNote.models;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateDataRedis {

    private String verificationCode;
    private String currentUsername;
    private String newUsername;
    private String newPassword;
}
