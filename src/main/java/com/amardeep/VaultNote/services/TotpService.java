package com.amardeep.VaultNote.services;

import com.warrenstrange.googleauth.GoogleAuthenticatorKey;

public interface TotpService {
    GoogleAuthenticatorKey generateSecretKey();

    String getQRCodeUrl(GoogleAuthenticatorKey secretKey, String username);

    boolean verifyCode(String secretKey, int code);
}
