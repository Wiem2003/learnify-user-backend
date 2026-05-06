package pi.integrated.club.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pi.integrated.club.dto.ClubDto;
import pi.integrated.club.dto.JoinRequestDto;
import pi.integrated.club.entity.Club;
import pi.integrated.club.entity.ClubMember;
import pi.integrated.club.entity.ClubRequest;
import pi.integrated.club.repository.ClubMemberRepository;
import pi.integrated.club.repository.ClubRepository;
import pi.integrated.club.repository.ClubRequestRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ClubService unit tests")
class ClubServiceTest {

    @Mock ClubRepository clubRepo;
    @Mock ClubRequestRepository requestRepo;
    @Mock ClubMemberRepository memberRepo;
    @Mock EmailService emailService;

    @InjectMocks ClubService clubService;

    // ── helpers ──────────────────────────────────────────────────────────────

    private Club buildClub(Long id, int capacity, int currentMembers, String level) {
        return Club.builder()
                .id(id)
                .name("Test Club")
                .description("desc")
                .category("Speaking Club")
                .schedule("Monday 18:00")
                .requiredLevel(level)
                .capacity(capacity)
                .currentMembers(currentMembers)
                .build();
    }

    private ClubDto buildDto() {
        ClubDto dto = new ClubDto();
        dto.setName("New Club");
        dto.setDescription("desc");
        dto.setCategory("Debate Club");
        dto.setSchedule("Friday 19:00");
        dto.setRequiredLevel("B1");
        dto.setCapacity(30);
        dto.setImage("img.jpg");
        dto.setTutorId(5L);
        dto.setTutorName("John Doe");
        dto.setCreatedBy(1L);
        return dto;
    }

    private JoinRequestDto buildJoinDto(String level) {
        JoinRequestDto dto = new JoinRequestDto();
        dto.setUserId(10L);
        dto.setUserEmail("user@test.com");
        dto.setUserLevel(level);
        return dto;
    }

    // ── CRUD ─────────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getAllClubs")
    class GetAllClubs {

        @Test
        @DisplayName("returns list from repository")
        void returnsAllClubs() {
            // Arrange
            List<Club> clubs = List.of(buildClub(1L, 20, 0, "A1"), buildClub(2L, 15, 5, "B1"));
            when(clubRepo.findAll()).thenReturn(clubs);

            // Act
            List<Club> result = clubService.getAllClubs();

            // Assert
            assertThat(result).hasSize(2);
            verify(clubRepo).findAll();
        }
    }

    @Nested
    @DisplayName("getClub")
    class GetClub {

        @Test
        @DisplayName("returns club when found")
        void returnsClubWhenFound() {
            // Arrange
            Club club = buildClub(1L, 20, 0, "A1");
            when(clubRepo.findById(1L)).thenReturn(Optional.of(club));

            // Act
            Club result = clubService.getClub(1L);

            // Assert
            assertThat(result.getId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("throws RuntimeException when not found")
        void throwsWhenNotFound() {
            // Arrange
            when(clubRepo.findById(99L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> clubService.getClub(99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Club not found");
        }
    }

    @Nested
    @DisplayName("createClub")
    class CreateClub {

        @Test
        @DisplayName("maps dto fields and saves")
        void mapsAndSaves() {
            // Arrange
            ClubDto dto = buildDto();
            Club saved = buildClub(1L, 30, 0, "B1");
            saved.setName("New Club");
            when(clubRepo.save(any(Club.class))).thenReturn(saved);

            // Act
            Club result = clubService.createClub(dto);

            // Assert
            assertThat(result).isNotNull();
            verify(clubRepo).save(argThat(c ->
                    c.getName().equals("New Club") &&
                    c.getCurrentMembers() == 0 &&
                    c.getCapacity() == 30
            ));
        }
    }

    @Nested
    @DisplayName("updateClub")
    class UpdateClub {

        @Test
        @DisplayName("updates mutable fields and saves")
        void updatesFields() {
            // Arrange
            Club existing = buildClub(1L, 20, 3, "A1");
            when(clubRepo.findById(1L)).thenReturn(Optional.of(existing));
            when(clubRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

            ClubDto dto = buildDto();
            dto.setName("Updated");
            dto.setCapacity(50);

            // Act
            Club result = clubService.updateClub(1L, dto);

            // Assert
            assertThat(result.getName()).isEqualTo("Updated");
            assertThat(result.getCapacity()).isEqualTo(50);
        }

        @Test
        @DisplayName("does not overwrite image when dto image is null")
        void doesNotOverwriteImageWhenNull() {
            // Arrange
            Club existing = buildClub(1L, 20, 0, "A1");
            existing.setImage("original.jpg");
            when(clubRepo.findById(1L)).thenReturn(Optional.of(existing));
            when(clubRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

            ClubDto dto = buildDto();
            dto.setImage(null);

            // Act
            Club result = clubService.updateClub(1L, dto);

            // Assert
            assertThat(result.getImage()).isEqualTo("original.jpg");
        }
    }

    @Nested
    @DisplayName("deleteClub")
    class DeleteClub {

        @Test
        @DisplayName("delegates to repository")
        void delegatesToRepo() {
            // Act
            clubService.deleteClub(1L);

            // Assert
            verify(clubRepo).deleteById(1L);
        }
    }

    // ── Join Request ─────────────────────────────────────────────────────────

    @Nested
    @DisplayName("requestJoin")
    class RequestJoin {

        @Test
        @DisplayName("creates PENDING request when all conditions pass")
        void createsRequestSuccessfully() {
            // Arrange
            Club club = buildClub(1L, 20, 5, "A1");
            when(clubRepo.findById(1L)).thenReturn(Optional.of(club));
            when(requestRepo.findByClubIdAndUserId(1L, 10L)).thenReturn(Optional.empty());
            when(memberRepo.existsByClubIdAndUserId(1L, 10L)).thenReturn(false);

            ClubRequest saved = ClubRequest.builder()
                    .id(1L).club(club).userId(10L)
                    .userEmail("user@test.com").userLevel("B1")
                    .status(ClubRequest.RequestStatus.PENDING)
                    .requestedAt(LocalDateTime.now())
                    .build();
            when(requestRepo.save(any())).thenReturn(saved);

            // Act
            ClubRequest result = clubService.requestJoin(1L, buildJoinDto("B1"));

            // Assert
            assertThat(result.getStatus()).isEqualTo(ClubRequest.RequestStatus.PENDING);
            verify(requestRepo).save(any(ClubRequest.class));
        }

        @Test
        @DisplayName("throws when user already has a request")
        void throwsWhenDuplicateRequest() {
            // Arrange
            Club club = buildClub(1L, 20, 0, "A1");
            when(clubRepo.findById(1L)).thenReturn(Optional.of(club));
            ClubRequest existing = ClubRequest.builder()
                    .status(ClubRequest.RequestStatus.PENDING).build();
            when(requestRepo.findByClubIdAndUserId(1L, 10L)).thenReturn(Optional.of(existing));

            // Act & Assert
            assertThatThrownBy(() -> clubService.requestJoin(1L, buildJoinDto("A1")))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("already have a request");
        }

        @Test
        @DisplayName("throws when user is already a member")
        void throwsWhenAlreadyMember() {
            // Arrange
            Club club = buildClub(1L, 20, 0, "A1");
            when(clubRepo.findById(1L)).thenReturn(Optional.of(club));
            when(requestRepo.findByClubIdAndUserId(1L, 10L)).thenReturn(Optional.empty());
            when(memberRepo.existsByClubIdAndUserId(1L, 10L)).thenReturn(true);

            // Act & Assert
            assertThatThrownBy(() -> clubService.requestJoin(1L, buildJoinDto("A1")))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("already a member");
        }

        @Test
        @DisplayName("throws and sends rejection email when club is full")
        void throwsWhenClubFull() {
            // Arrange
            Club club = buildClub(1L, 10, 10, "A1"); // full
            when(clubRepo.findById(1L)).thenReturn(Optional.of(club));
            when(requestRepo.findByClubIdAndUserId(1L, 10L)).thenReturn(Optional.empty());
            when(memberRepo.existsByClubIdAndUserId(1L, 10L)).thenReturn(false);

            // Act & Assert
            assertThatThrownBy(() -> clubService.requestJoin(1L, buildJoinDto("A1")))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("full");

            verify(emailService).sendRejectionEmail(eq("user@test.com"), eq("Test Club"), anyString());
        }

        @Test
        @DisplayName("throws and sends rejection email when user level is too low")
        void throwsWhenLevelTooLow() {
            // Arrange
            Club club = buildClub(1L, 20, 0, "C1"); // requires C1
            when(clubRepo.findById(1L)).thenReturn(Optional.of(club));
            when(requestRepo.findByClubIdAndUserId(1L, 10L)).thenReturn(Optional.empty());
            when(memberRepo.existsByClubIdAndUserId(1L, 10L)).thenReturn(false);

            // Act & Assert
            assertThatThrownBy(() -> clubService.requestJoin(1L, buildJoinDto("A1"))) // A1 < C1
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("does not meet the required level");

            verify(emailService).sendRejectionEmail(eq("user@test.com"), eq("Test Club"), anyString());
        }

        @Test
        @DisplayName("accepts when user level exactly meets requirement")
        void acceptsWhenLevelMeetsRequirement() {
            // Arrange
            Club club = buildClub(1L, 20, 0, "B1");
            when(clubRepo.findById(1L)).thenReturn(Optional.of(club));
            when(requestRepo.findByClubIdAndUserId(1L, 10L)).thenReturn(Optional.empty());
            when(memberRepo.existsByClubIdAndUserId(1L, 10L)).thenReturn(false);
            when(requestRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

            // Act
            ClubRequest result = clubService.requestJoin(1L, buildJoinDto("B1")); // exact match

            // Assert
            assertThat(result.getStatus()).isEqualTo(ClubRequest.RequestStatus.PENDING);
        }
    }

    // ── Accept / Reject ───────────────────────────────────────────────────────

    @Nested
    @DisplayName("acceptRequest")
    class AcceptRequest {

        @Test
        @DisplayName("sets status ACCEPTED, creates member, increments count, sends email")
        void acceptsSuccessfully() {
            // Arrange
            Club club = buildClub(1L, 20, 5, "A1");
            ClubRequest req = ClubRequest.builder()
                    .id(1L).club(club).userId(10L)
                    .userEmail("user@test.com")
                    .status(ClubRequest.RequestStatus.PENDING)
                    .build();

            when(requestRepo.findById(1L)).thenReturn(Optional.of(req));
            when(clubRepo.findById(1L)).thenReturn(Optional.of(club));
            when(requestRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
            when(memberRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

            // Act
            ClubRequest result = clubService.acceptRequest(1L);

            // Assert
            assertThat(result.getStatus()).isEqualTo(ClubRequest.RequestStatus.ACCEPTED);
            verify(memberRepo).save(any(ClubMember.class));
            verify(clubRepo).incrementMembers(1L);
            verify(emailService).sendAcceptanceEmail("user@test.com", "Test Club");
        }

        @Test
        @DisplayName("throws when request not found")
        void throwsWhenRequestNotFound() {
            when(requestRepo.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> clubService.acceptRequest(99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Request not found");
        }

        @Test
        @DisplayName("throws when club is now full")
        void throwsWhenClubFull() {
            Club club = buildClub(1L, 10, 10, "A1"); // full
            ClubRequest req = ClubRequest.builder()
                    .id(1L).club(club).userId(10L)
                    .status(ClubRequest.RequestStatus.PENDING).build();

            when(requestRepo.findById(1L)).thenReturn(Optional.of(req));
            when(clubRepo.findById(1L)).thenReturn(Optional.of(club));

            assertThatThrownBy(() -> clubService.acceptRequest(1L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("full");
        }
    }

    @Nested
    @DisplayName("rejectRequest")
    class RejectRequest {

        @Test
        @DisplayName("sets status REJECTED with reason and sends email")
        void rejectsWithReason() {
            // Arrange
            Club club = buildClub(1L, 20, 0, "A1");
            ClubRequest req = ClubRequest.builder()
                    .id(1L).club(club).userId(10L)
                    .userEmail("user@test.com")
                    .status(ClubRequest.RequestStatus.PENDING)
                    .build();

            when(requestRepo.findById(1L)).thenReturn(Optional.of(req));
            when(requestRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

            // Act
            ClubRequest result = clubService.rejectRequest(1L, "Level too low");

            // Assert
            assertThat(result.getStatus()).isEqualTo(ClubRequest.RequestStatus.REJECTED);
            assertThat(result.getRejectionReason()).isEqualTo("Level too low");
            verify(emailService).sendRejectionEmail("user@test.com", "Test Club", "Level too low");
        }

        @Test
        @DisplayName("uses default reason when null is passed")
        void usesDefaultReasonWhenNull() {
            // Arrange
            Club club = buildClub(1L, 20, 0, "A1");
            ClubRequest req = ClubRequest.builder()
                    .id(1L).club(club).userId(10L)
                    .userEmail("user@test.com")
                    .status(ClubRequest.RequestStatus.PENDING)
                    .build();

            when(requestRepo.findById(1L)).thenReturn(Optional.of(req));
            when(requestRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

            // Act
            clubService.rejectRequest(1L, null);

            // Assert
            verify(emailService).sendRejectionEmail(
                    eq("user@test.com"), eq("Test Club"), eq("Request rejected by admin"));
        }
    }

    // ── isMember ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("isMember")
    class IsMember {

        @Test
        @DisplayName("returns true when user is in member table")
        void trueWhenMember() {
            when(memberRepo.existsByClubIdAndUserId(1L, 10L)).thenReturn(true);
            assertThat(clubService.isMember(1L, 10L)).isTrue();
        }

        @Test
        @DisplayName("returns true when user is the tutor of the club")
        void trueWhenTutor() {
            Club club = buildClub(1L, 20, 0, "A1");
            club.setTutorId(10L);
            when(memberRepo.existsByClubIdAndUserId(1L, 10L)).thenReturn(false);
            when(clubRepo.findById(1L)).thenReturn(Optional.of(club));

            assertThat(clubService.isMember(1L, 10L)).isTrue();
        }

        @Test
        @DisplayName("returns false when user is neither member nor tutor")
        void falseWhenNeitherMemberNorTutor() {
            Club club = buildClub(1L, 20, 0, "A1");
            club.setTutorId(99L);
            when(memberRepo.existsByClubIdAndUserId(1L, 10L)).thenReturn(false);
            when(clubRepo.findById(1L)).thenReturn(Optional.of(club));

            assertThat(clubService.isMember(1L, 10L)).isFalse();
        }
    }
}
