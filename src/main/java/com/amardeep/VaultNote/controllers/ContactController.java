package com.amardeep.VaultNote.controllers;

import com.amardeep.VaultNote.dtos.ContactRequestDTO;
import com.amardeep.VaultNote.security.response.MessageResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    String to;

    @PostMapping
    public ResponseEntity<?> sendContactMessage(@Valid @RequestBody ContactRequestDTO contactRequest) {

        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(to);
        simpleMailMessage.setFrom(contactRequest.getEmail());
        simpleMailMessage.setSubject("New Message Received from - " + contactRequest.getName());
        simpleMailMessage.setText(contactRequest.getMessage());
        mailSender.send(simpleMailMessage);

        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Your message has been sent successfully. We will get back to you soon!"));
    }
}
