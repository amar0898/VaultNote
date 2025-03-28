package com.amardeep.VaultNote.controllers;
import com.amardeep.VaultNote.dtos.FavouriteRequest;
import com.amardeep.VaultNote.dtos.PinRequest;
import com.amardeep.VaultNote.models.Note;
import com.amardeep.VaultNote.security.response.MessageResponse;
import com.amardeep.VaultNote.services.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
//@CrossOrigin(origins = "http://vault-note.s3-website-us-east-1.amazonaws.com", maxAge = 3600, allowCredentials="true")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @PostMapping
    public Note createNote(@RequestBody String content,
                           @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        System.out.println("USER DETAILS: " + username);
        return noteService.createNoteForUser(username, content);
    }

    @GetMapping
    public List<Note> getUserNotes(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        System.out.println("USER DETAILS: " + username);
        return noteService.getNotesForUser(username);
    }

    @PutMapping("/{noteId}")
    public Note updateNote(@PathVariable Long noteId,
                           @RequestBody String content,
                           @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        return noteService.updateNoteForUser(noteId, content, username);
    }

    @DeleteMapping("/{noteId}")
    public void deleteNote(@PathVariable Long noteId,
                           @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        noteService.deleteNoteForUser(noteId, username);
    }

    @PutMapping("/{noteId}/pin")
    public ResponseEntity<?> togglePin(@PathVariable Long noteId, @RequestBody PinRequest pinRequest) {
       noteService.togglePin(noteId, pinRequest.isPinned());
        return ResponseEntity.ok(new MessageResponse("Note pin status updated"));
    }

    @PutMapping("/{noteId}/favourite")
    public ResponseEntity<?> toggleFavourite(@PathVariable Long noteId, @RequestBody FavouriteRequest favouriteRequest) {
        noteService.toggleFavourite(noteId, favouriteRequest.isFavourite());
        return ResponseEntity.ok(new MessageResponse("Note favourite status updated"));
    }
}
