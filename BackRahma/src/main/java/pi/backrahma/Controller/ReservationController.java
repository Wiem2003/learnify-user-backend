package pi.backrahma.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pi.backrahma.Service.ReservationService;
import pi.backrahma.dto.ReservationRequest;
import pi.backrahma.dto.ReservationResponse;
import pi.backrahma.exception.ReservationException;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        try {
            ReservationResponse response = reservationService.createReservation(
                    request.getEventId(), 
                    request.getParticipantId()
            );
            return ResponseEntity.ok(response);
        } catch (ReservationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<ReservationResponse>> getReservationsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(reservationService.getReservationsByEvent(eventId));
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<ReservationResponse>> getReservationsByParticipant(@PathVariable Long participantId) {
        return ResponseEntity.ok(reservationService.getReservationsByParticipant(participantId));
    }

    @GetMapping("/{reservationId}/ticket")
    public ResponseEntity<byte[]> downloadTicket(@PathVariable Long reservationId) {
        try {
            byte[] pdfBytes = reservationService.generateTicketPDF(reservationId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "ticket-" + reservationId + ".pdf");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{reservationId}/qrcode")
    public ResponseEntity<byte[]> getQRCode(@PathVariable Long reservationId) {
        try {
            byte[] qrCodeBytes = reservationService.generateQRCodeImage(reservationId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            
            return new ResponseEntity<>(qrCodeBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/ticket/{ticketCode}")
    public ResponseEntity<byte[]> downloadTicketByCode(@PathVariable String ticketCode) {
        try {
            byte[] pdfBytes = reservationService.generateTicketPDFByCode(ticketCode);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "ticket-" + ticketCode + ".pdf");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<String> cancelReservation(@PathVariable Long reservationId) {
        try {
            reservationService.cancelReservation(reservationId);
            return ResponseEntity.ok("Réservation annulée avec succès");
        } catch (ReservationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Validation de ticket (Scan QR Code)
    @GetMapping("/validate/{ticketCode}")
    public ResponseEntity<pi.backrahma.dto.TicketValidationResponse> validateTicket(@PathVariable String ticketCode) {
        pi.backrahma.dto.TicketValidationResponse response = reservationService.validateTicket(ticketCode);
        return ResponseEntity.ok(response);
    }

    // Marquer le ticket comme utilisé
    @PostMapping("/validate/{ticketCode}/use")
    public ResponseEntity<String> markTicketAsUsed(@PathVariable String ticketCode) {
        try {
            reservationService.markTicketAsUsed(ticketCode);
            return ResponseEntity.ok("Ticket marqué comme utilisé");
        } catch (ReservationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
