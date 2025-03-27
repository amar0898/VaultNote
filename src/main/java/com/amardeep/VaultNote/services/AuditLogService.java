package com.amardeep.VaultNote.services;

import com.amardeep.VaultNote.models.AuditLog;
import com.amardeep.VaultNote.models.Note;

import java.util.List;

public interface AuditLogService {

    List<AuditLog> getAllAuditLogs();

    List<AuditLog> getAuditLogsForNoteId(Long id);
}
