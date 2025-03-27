package com.amardeep.VaultNote.services.impl;
import com.amardeep.VaultNote.models.AuditLog;
import com.amardeep.VaultNote.models.Note;
import com.amardeep.VaultNote.repositories.NoteRepository;
import com.amardeep.VaultNote.services.AuditLogKafkaProducer;
import com.amardeep.VaultNote.services.AuditLogService;
import com.amardeep.VaultNote.services.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NoteServiceImpl implements NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private AuditLogKafkaProducer auditLogKafkaProducer;

    @Override
    public Note createNoteForUser(String username, String content) {
        Note note = new Note();
        note.setContent(content);
        note.setOwnerUsername(username);
        Note savedNote = noteRepository.save(note);

        AuditLog auditLog = new AuditLog();
        auditLog.setAction("CREATE");
        auditLog.setUsername(username);
        auditLog.setNoteId(savedNote.getId());
        auditLog.setNoteContent(content);
        auditLog.setTimestamp(LocalDateTime.now());
        auditLogKafkaProducer.sendAuditLog(auditLog);

        return savedNote;
    }

    @Override
    public Note updateNoteForUser(Long noteId, String content, String username) {
        Note note = noteRepository.findById(noteId).orElseThrow(()
                -> new RuntimeException("Note not found"));
        note.setContent(content);
        Note updatedNote = noteRepository.save(note);

        AuditLog auditLog = new AuditLog();
        auditLog.setAction("UPDATE");
        auditLog.setUsername(username);
        auditLog.setNoteId(updatedNote.getId());
        auditLog.setNoteContent(content);
        auditLog.setTimestamp(LocalDateTime.now());
        auditLogKafkaProducer.sendAuditLog(auditLog);

        return updatedNote;
    }

    @Override
    public void deleteNoteForUser(Long noteId, String username) {
        Note note = noteRepository.findById(noteId).orElseThrow(()->new RuntimeException("Note not found"));

        AuditLog auditLog = new AuditLog();
        auditLog.setAction("DELETE");
        auditLog.setUsername(username);
        auditLog.setNoteId(noteId);
        auditLog.setTimestamp(LocalDateTime.now());
        auditLogKafkaProducer.sendAuditLog(auditLog);

        noteRepository.delete(note);
    }

    @Override
    public List<Note> getNotesForUser(String username) {
        List<Note> personalNotes = noteRepository
                .findByOwnerUsername(username);
        return personalNotes;
    }
}
