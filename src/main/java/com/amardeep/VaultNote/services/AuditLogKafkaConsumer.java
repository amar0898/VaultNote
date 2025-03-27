package com.amardeep.VaultNote.services;

import com.amardeep.VaultNote.models.AuditLog;
import com.amardeep.VaultNote.repositories.AuditLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class AuditLogKafkaConsumer {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "Vault_Note_Audit_Logs_Topic", groupId = "audit-log-group")
    public void consume(String message) {
        try {
            AuditLog auditLogDto = objectMapper.readValue(message, AuditLog.class);
            AuditLog auditLog = new AuditLog();
            auditLog.setAction(auditLogDto.getAction());
            auditLog.setUsername(auditLogDto.getUsername());
            auditLog.setNoteId(auditLogDto.getNoteId());
            auditLog.setNoteContent(auditLogDto.getNoteContent());
            auditLog.setTimestamp(auditLogDto.getTimestamp());
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
