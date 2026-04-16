package pi.integrated.club.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pi.integrated.club.dto.ClubDto;
import pi.integrated.club.dto.JoinRequestDto;
import pi.integrated.club.entity.Club;
import pi.integrated.club.entity.ClubMember;
import pi.integrated.club.entity.ClubRequest;
import pi.integrated.club.repository.ClubMemberRepository;
import pi.integrated.club.repository.ClubRepository;
import pi.integrated.club.repository.ClubRequestRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepo;
    private final ClubRequestRepository requestRepo;
    private final ClubMemberRepository memberRepo;
    private final EmailService emailService;

    private static final List<String> LEVELS = Arrays.asList("A1", "A2", "B1", "B2", "C1", "C2");

    // ─── Club CRUD ────────────────────────────────────────────────────────────

    public List<Club> getAllClubs() {
        return clubRepo.findAll();
    }

    public Club getClub(Long id) {
        return clubRepo.findById(id).orElseThrow(() -> new RuntimeException("Club not found"));
    }

    public Club createClub(ClubDto dto) {
        Club club = Club.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .schedule(dto.getSchedule())
                .requiredLevel(dto.getRequiredLevel())
                .capacity(dto.getCapacity())
                .currentMembers(0)
                .image(dto.getImage())
                .tutorId(dto.getTutorId())
                .tutorName(dto.getTutorName())
                .createdBy(dto.getCreatedBy())
                .build();
        return clubRepo.save(club);
    }

    public Club updateClub(Long id, ClubDto dto) {
        Club club = getClub(id);
        club.setName(dto.getName());
        club.setDescription(dto.getDescription());
        club.setCategory(dto.getCategory());
        club.setSchedule(dto.getSchedule());
        club.setRequiredLevel(dto.getRequiredLevel());
        club.setCapacity(dto.getCapacity());
        if (dto.getImage() != null) club.setImage(dto.getImage());
        if (dto.getTutorId() != null) club.setTutorId(dto.getTutorId());
        if (dto.getTutorName() != null) club.setTutorName(dto.getTutorName());
        return clubRepo.save(club);
    }

    public void deleteClub(Long id) {
        clubRepo.deleteById(id);
    }

    // ─── Join Request ─────────────────────────────────────────────────────────

    @Transactional
    public ClubRequest requestJoin(Long clubId, JoinRequestDto dto) {
        Club club = getClub(clubId);

        requestRepo.findByClubIdAndUserId(clubId, dto.getUserId()).ifPresent(r -> {
            throw new RuntimeException("You already have a request for this club: " + r.getStatus());
        });

        if (memberRepo.existsByClubIdAndUserId(clubId, dto.getUserId())) {
            throw new RuntimeException("You are already a member of this club");
        }

        if (club.getCurrentMembers() >= club.getCapacity()) {
            emailService.sendRejectionEmail(dto.getUserEmail(), club.getName(), "The club is full");
            throw new RuntimeException("Club is full");
        }

        int userLevelIdx = LEVELS.indexOf(dto.getUserLevel().toUpperCase());
        int requiredLevelIdx = club.getRequiredLevel() != null
                ? LEVELS.indexOf(club.getRequiredLevel().toUpperCase()) : 0;

        if (userLevelIdx < 0 || userLevelIdx < requiredLevelIdx) {
            String reason = "Your level (" + dto.getUserLevel() + ") does not meet the required level ("
                    + club.getRequiredLevel() + ")";
            emailService.sendRejectionEmail(dto.getUserEmail(), club.getName(), reason);
            throw new RuntimeException(reason);
        }

        ClubRequest request = ClubRequest.builder()
                .club(club)
                .userId(dto.getUserId())
                .userEmail(dto.getUserEmail())
                .userLevel(dto.getUserLevel())
                .status(ClubRequest.RequestStatus.PENDING)
                .requestedAt(LocalDateTime.now())
                .build();

        return requestRepo.save(request);
    }

    public List<ClubRequest> getPendingRequests() {
        return requestRepo.findByStatus(ClubRequest.RequestStatus.PENDING);
    }

    public List<ClubRequest> getAllRequests() {
        return requestRepo.findAll();
    }

    public List<ClubRequest> getRequestsByUser(Long userId) {
        return requestRepo.findByUserId(userId);
    }

    @Transactional
    public ClubRequest acceptRequest(Long requestId) {
        ClubRequest req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        Long clubId = req.getClub().getId();
        Club club = clubRepo.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        if (club.getCurrentMembers() >= club.getCapacity()) {
            throw new RuntimeException("Club is now full");
        }

        req.setStatus(ClubRequest.RequestStatus.ACCEPTED);
        requestRepo.save(req);

        memberRepo.save(ClubMember.builder()
                .club(club)
                .userId(req.getUserId())
                .userEmail(req.getUserEmail())
                .joinedAt(LocalDateTime.now())
                .build());

        clubRepo.incrementMembers(clubId);

        emailService.sendAcceptanceEmail(req.getUserEmail(), club.getName());
        return req;
    }

    @Transactional
    public ClubRequest rejectRequest(Long requestId, String reason) {
        ClubRequest req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus(ClubRequest.RequestStatus.REJECTED);
        req.setRejectionReason(reason);
        requestRepo.save(req);

        String clubName = req.getClub().getName();
        emailService.sendRejectionEmail(req.getUserEmail(), clubName,
                reason != null ? reason : "Request rejected by admin");
        return req;
    }

    public boolean isMember(Long clubId, Long userId) {
        if (memberRepo.existsByClubIdAndUserId(clubId, userId)) return true;
        // Tutors have direct access to their own club
        return clubRepo.findById(clubId)
                .map(club -> userId.equals(club.getTutorId()))
                .orElse(false);
    }

    public List<ClubMember> getMembers(Long clubId) {
        return memberRepo.findByClubId(clubId);
    }
}
