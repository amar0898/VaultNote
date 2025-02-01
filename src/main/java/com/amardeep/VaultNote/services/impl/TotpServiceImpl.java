package com.amardeep.VaultNote.services.impl;

import com.amardeep.VaultNote.services.TotpService;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.springframework.stereotype.Service;

@Service
public class TotpServiceImpl implements TotpService {

    private final GoogleAuthenticator googleAuth;

    public TotpServiceImpl(GoogleAuthenticator googleAuth) {
        this.googleAuth = googleAuth;
    }

    public TotpServiceImpl() {
        this.googleAuth = new GoogleAuthenticator();
    }

    @Override
    public GoogleAuthenticatorKey generateSecretKey(){
       return googleAuth.createCredentials();
    }

    @Override
    public String getQRCodeUrl(GoogleAuthenticatorKey secretKey, String username){
        return GoogleAuthenticatorQRGenerator.getOtpAuthURL("VaultNote", username, secretKey);
    }

    @Override
    public boolean verifyCode(String secretKey, int code){
        return googleAuth.authorize(secretKey,code);
    }
}
