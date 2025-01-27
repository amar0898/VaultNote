package com.amardeep.VaultNote.services;

import com.amardeep.VaultNote.models.AuditLog;
import com.amardeep.VaultNote.models.Note;

import java.util.List;

public interface AuditLogService {

    void logNoteCreation(String username, Note note);
    void logNoteUpdate(String username, Note note);
    void logNoteDeletion(String username, Long noteId);

    List<AuditLog> getAllAuditLogs();

    List<AuditLog> getAuditLogsForNoteId(Long id);
}
