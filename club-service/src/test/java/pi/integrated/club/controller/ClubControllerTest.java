package pi.integrated.club.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import pi.integrated.club.dto.ClubDto;
import pi.integrated.club.dto.JoinRequestDto;
import pi.integrated.club.entity.Club;
import pi.integrated.club.entity.ClubRequest;
import pi.integrated.club.service.ClubService;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClubController.class)
@DisplayName("ClubController MockMvc tests")
class ClubControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean  ClubService clubService;

    // ── helpers ───────────────────────────────────────────────────────────────

    private Club sampleClub() {
        return Club.builder()
                .id(1L).name("Speaking Club").category("Speaking Club")
                .description("desc").schedule("Monday 18:00")
                .requiredLevel("A1").capacity(20).currentMembers(3)
                .build();
    }

    private ClubDto sampleDto() {
        ClubDto dto = new ClubDto();
        dto.setName("Speaking Club");
        dto.setDescription("desc");
        dto.setCategory("Speaking Club");
        dto.setSchedule("Monday 18:00");
        dto.setRequiredLevel("A1");
        dto.setCapacity(20);
        return dto;
    }

    // ── GET /api/clubs ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/clubs")
    class GetAll {

        @Test
        @DisplayName("returns 200 with list of clubs")
        void returns200WithClubs() throws Exception {
            when(clubService.getAllClubs()).thenReturn(List.of(sampleClub()));

            mockMvc.perform(get("/api/clubs"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(1))
                    .andExpect(jsonPath("$[0].name").value("Speaking Club"));
        }
    }

    // ── GET /api/clubs/{id} ───────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/clubs/{id}")
    class GetOne {

        @Test
        @DisplayName("returns 200 with club when found")
        void returns200WhenFound() throws Exception {
            when(clubService.getClub(1L)).thenReturn(sampleClub());

            mockMvc.perform(get("/api/clubs/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.name").value("Speaking Club"));
        }

        @Test
        @DisplayName("propagates RuntimeException as 500 when service throws")
        void returns500WhenNotFound() {
            when(clubService.getClub(99L)).thenThrow(new RuntimeException("Club not found"));

            // MockMvc wraps unhandled RuntimeExceptions in a NestedServletException.
            // We assert the underlying cause is our RuntimeException.
            assertThatThrownBy(() ->
                    mockMvc.perform(get("/api/clubs/99"))
            ).hasRootCauseInstanceOf(RuntimeException.class)
             .hasRootCauseMessage("Club not found");
        }
    }

    // ── POST /api/clubs ───────────────────────────────────────────────────────

    @Nested
    @DisplayName("POST /api/clubs")
    class Create {

        @Test
        @DisplayName("returns 200 with created club")
        void returns200WithCreatedClub() throws Exception {
            when(clubService.createClub(any(ClubDto.class))).thenReturn(sampleClub());

            mockMvc.perform(post("/api/clubs")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(sampleDto())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1));
        }
    }

    // ── PUT /api/clubs/{id} ───────────────────────────────────────────────────

    @Nested
    @DisplayName("PUT /api/clubs/{id}")
    class Update {

        @Test
        @DisplayName("returns 200 with updated club")
        void returns200WithUpdatedClub() throws Exception {
            Club updated = sampleClub();
            updated.setName("Updated Club");
            when(clubService.updateClub(eq(1L), any(ClubDto.class))).thenReturn(updated);

            mockMvc.perform(put("/api/clubs/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(sampleDto())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.name").value("Updated Club"));
        }
    }

    // ── DELETE /api/clubs/{id} ────────────────────────────────────────────────

    @Nested
    @DisplayName("DELETE /api/clubs/{id}")
    class Delete {

        @Test
        @DisplayName("returns 204 No Content")
        void returns204() throws Exception {
            doNothing().when(clubService).deleteClub(1L);

            mockMvc.perform(delete("/api/clubs/1"))
                    .andExpect(status().isNoContent());
        }
    }

    // ── POST /api/clubs/{id}/request ──────────────────────────────────────────

    @Nested
    @DisplayName("POST /api/clubs/{id}/request")
    class JoinRequest {

        @Test
        @DisplayName("returns 200 with PENDING request on success")
        void returns200OnSuccess() throws Exception {
            Club club = sampleClub();
            ClubRequest req = ClubRequest.builder()
                    .id(1L).club(club).userId(10L)
                    .userEmail("user@test.com").userLevel("B1")
                    .status(ClubRequest.RequestStatus.PENDING)
                    .requestedAt(LocalDateTime.now())
                    .build();

            when(clubService.requestJoin(eq(1L), any(JoinRequestDto.class))).thenReturn(req);

            JoinRequestDto dto = new JoinRequestDto();
            dto.setUserId(10L);
            dto.setUserEmail("user@test.com");
            dto.setUserLevel("B1");

            mockMvc.perform(post("/api/clubs/1/request")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("PENDING"));
        }

        @Test
        @DisplayName("returns 400 with error message when service throws")
        void returns400WhenServiceThrows() throws Exception {
            when(clubService.requestJoin(eq(1L), any(JoinRequestDto.class)))
                    .thenThrow(new RuntimeException("Club is full"));

            JoinRequestDto dto = new JoinRequestDto();
            dto.setUserId(10L);
            dto.setUserEmail("user@test.com");
            dto.setUserLevel("A1");

            mockMvc.perform(post("/api/clubs/1/request")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("Club is full"));
        }
    }

    // ── GET /api/clubs/{clubId}/access/{userId} ───────────────────────────────

    @Nested
    @DisplayName("GET /api/clubs/{clubId}/access/{userId}")
    class CheckAccess {

        @Test
        @DisplayName("returns access=true when user is member")
        void returnsTrueWhenMember() throws Exception {
            when(clubService.isMember(1L, 10L)).thenReturn(true);

            mockMvc.perform(get("/api/clubs/1/access/10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.access").value(true));
        }

        @Test
        @DisplayName("returns access=false when user is not member")
        void returnsFalseWhenNotMember() throws Exception {
            when(clubService.isMember(1L, 99L)).thenReturn(false);

            mockMvc.perform(get("/api/clubs/1/access/99"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.access").value(false));
        }
    }

    // ── PUT /api/clubs/requests/{id}/accept ───────────────────────────────────

    @Nested
    @DisplayName("PUT /api/clubs/requests/{id}/accept")
    class AcceptRequest {

        @Test
        @DisplayName("returns 200 with accepted request")
        void returns200OnAccept() throws Exception {
            Club club = sampleClub();
            ClubRequest req = ClubRequest.builder()
                    .id(1L).club(club).userId(10L)
                    .status(ClubRequest.RequestStatus.ACCEPTED)
                    .build();
            when(clubService.acceptRequest(1L)).thenReturn(req);

            mockMvc.perform(put("/api/clubs/requests/1/accept"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("ACCEPTED"));
        }

        @Test
        @DisplayName("returns 400 when service throws")
        void returns400WhenFull() throws Exception {
            when(clubService.acceptRequest(1L)).thenThrow(new RuntimeException("Club is now full"));

            mockMvc.perform(put("/api/clubs/requests/1/accept"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("Club is now full"));
        }
    }
}
