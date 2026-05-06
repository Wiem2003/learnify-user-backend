package pi.integrated.club.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pi.integrated.club.dto.ClubDto;
import pi.integrated.club.dto.JoinRequestDto;
import pi.integrated.club.entity.Club;
import pi.integrated.club.entity.ClubMember;
import pi.integrated.club.entity.ClubRequest;
import pi.integrated.club.service.ClubService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClubController {

    private final ClubService clubService;

    // ─── Club CRUD ────────────────────────────────────────────────────────────

    @GetMapping
    public List<Club> getAllClubs() {
        return clubService.getAllClubs();
    }

    @GetMapping("/{id}")
    public Club getClub(@PathVariable Long id) {
        return clubService.getClub(id);
    }

    @PostMapping
    public Club createClub(@RequestBody ClubDto dto) {
        return clubService.createClub(dto);
    }

    @PutMapping("/{id}")
    public Club updateClub(@PathVariable Long id, @RequestBody ClubDto dto) {
        return clubService.updateClub(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Join Request ─────────────────────────────────────────────────────────

    /** User requests to join a club */
    @PostMapping("/{id}/request")
    public ResponseEntity<?> requestJoin(@PathVariable Long id, @RequestBody JoinRequestDto dto) {
        try {
            ClubRequest req = clubService.requestJoin(id, dto);
            return ResponseEntity.ok(req);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Admin: manage requests ───────────────────────────────────────────────

    @GetMapping("/requests")
    public List<ClubRequest> getAllRequests() {
        return clubService.getAllRequests();
    }

    @GetMapping("/requests/pending")
    public List<ClubRequest> getPendingRequests() {
        return clubService.getPendingRequests();
    }

    @GetMapping("/requests/user/{userId}")
    public List<ClubRequest> getRequestsByUser(@PathVariable Long userId) {
        return clubService.getRequestsByUser(userId);
    }

    @PutMapping("/requests/{id}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(clubService.acceptRequest(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/requests/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        try {
            return ResponseEntity.ok(clubService.rejectRequest(id, reason));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Members & Access Control ─────────────────────────────────────────────

    @GetMapping("/{id}/members")
    public List<ClubMember> getMembers(@PathVariable Long id) {
        return clubService.getMembers(id);
    }

    /** Check if a user is an accepted member (used by chat-service) */
    @GetMapping("/{clubId}/access/{userId}")
    public ResponseEntity<Map<String, Boolean>> checkAccess(@PathVariable Long clubId,
            @PathVariable Long userId) {
        boolean isMember = clubService.isMember(clubId, userId);
        return ResponseEntity.ok(Map.of("access", isMember));
    }
}
