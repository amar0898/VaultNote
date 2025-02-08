package com.amardeep.VaultNote.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    String from;

    public void sendPasswordResetEmail(String to, String resetUrl) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(to);
        simpleMailMessage.setFrom(from);
        simpleMailMessage.setSubject("VaultNote - Password Reset Request");
        simpleMailMessage.setText("Click on the link to reset your password " + resetUrl);
        mailSender.send(simpleMailMessage);
    }

}
