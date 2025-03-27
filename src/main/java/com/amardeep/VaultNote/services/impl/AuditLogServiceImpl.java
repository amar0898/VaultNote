package com.amardeep.VaultNote.services.impl;

import com.amardeep.VaultNote.models.AuditLog;
import com.amardeep.VaultNote.models.Note;
import com.amardeep.VaultNote.repositories.AuditLogRepository;
import com.amardeep.VaultNote.services.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    @Autowired
    AuditLogRepository auditLogRepository;

    @Override
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    @Override
    public List<AuditLog> getAuditLogsForNoteId(Long id) {
        return auditLogRepository.findByNoteId(id);
    }
}
