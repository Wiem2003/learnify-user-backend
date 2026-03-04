package org.example.yallatn.controller;

import org.example.yallatn.annotation.RequireRole;
import org.example.yallatn.dto.ApplicationDTO;
import org.example.yallatn.dto.ApplicationRequest;
import org.example.yallatn.dto.UpdateApplicationRequest;
import org.example.yallatn.model.ApplicationStatus;
import org.example.yallatn.model.User;
import org.example.yallatn.service.ApplicationService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @RequireRole({"TEACHER"})
    public ResponseEntity<ApplicationDTO> createApplication(
            @Valid @RequestPart("application") ApplicationRequest request,
            @RequestPart(value = "cv", required = false) MultipartFile cv,
            @RequestPart(value = "certificat", required = false) MultipartFile certificat,
            HttpServletRequest httpRequest) {
        
        User currentUser = (User) httpRequest.getAttribute("currentUser");
        ApplicationDTO created = applicationService.createApplication(
                request.getJobId(),
                currentUser.getId(),
                request.getMotivation(),
                cv,
                certificat
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @RequireRole({"ADMIN"})
    public ResponseEntity<List<ApplicationDTO>> getAllApplications(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer minScore,
            @RequestParam(required = false) String sortBy) {
        return ResponseEntity.ok(applicationService.getAllApplications(keyword, minScore, sortBy));
    }

    @GetMapping("/job/{jobId}")
    @RequireRole({"ADMIN"})
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByJob(
            @PathVariable Long jobId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer minScore,
            @RequestParam(required = false) String sortBy) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId, keyword, minScore, sortBy));
    }

    @GetMapping("/my-applications")
    @RequireRole({"TEACHER"})
    public ResponseEntity<List<ApplicationDTO>> getMyApplications(HttpServletRequest httpRequest) {
        User currentUser = (User) httpRequest.getAttribute("currentUser");
        return ResponseEntity.ok(applicationService.getApplicationsByTeacher(currentUser.getId()));
    }

    @PostMapping("/{id}/update")
    @RequireRole({"TEACHER"})
    public ResponseEntity<ApplicationDTO> updateApplication(
            @PathVariable("id") Long id,
            @Valid @RequestPart("application") UpdateApplicationRequest request,
            @RequestPart(value = "cv", required = false) MultipartFile cv,
            @RequestPart(value = "certificat", required = false) MultipartFile certificat,
            HttpServletRequest httpRequest) {
        User currentUser = (User) httpRequest.getAttribute("currentUser");
        ApplicationDTO updated = applicationService.updateApplication(
                id,
                currentUser.getId(),
                request.getMotivation(),
                cv,
                certificat
        );
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/status")
    @RequireRole({"ADMIN"})
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> request) {
        ApplicationStatus status = ApplicationStatus.valueOf(request.get("status"));
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }

    /** Affichage du CV d'une candidature (admin) — inline pour affichage dans le navigateur. */
    @GetMapping(value = "/{id}/cv/file", produces = "application/pdf")
    @RequireRole({"ADMIN"})
    public ResponseEntity<Resource> getApplicationCv(@PathVariable("id") Long id) {
        Resource resource = applicationService.getApplicationFile(id, "cv");
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/pdf"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"cv.pdf\"")
                .body(resource);
    }

    /** Affichage du certificat d'une candidature (admin) — inline (PDF, JPG ou PNG). */
    @GetMapping(value = "/{id}/certificat/file", produces = {
            "application/pdf", "image/jpeg", "image/png", "image/jpg" })
    @RequireRole({"ADMIN"})
    public ResponseEntity<Resource> getApplicationCertificat(@PathVariable("id") Long id) {
        Resource resource = applicationService.getApplicationFile(id, "certificat");
        MediaType mediaType = contentTypeFromFilename(resource.getFilename());
        String filename = resource.getFilename();
        if (filename == null || filename.isBlank()) filename = "certificat";
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
    }

    private static MediaType contentTypeFromFilename(String filename) {
        if (filename == null || filename.isBlank()) return MediaType.APPLICATION_PDF;
        String ext = filename.contains(".") ? filename.substring(filename.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT) : "";
        return switch (ext) {
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            case "png" -> MediaType.IMAGE_PNG;
            default -> MediaType.APPLICATION_PDF;
        };
    }

    @GetMapping("/{id}")
    @RequireRole({"ADMIN", "TEACHER"})
    public ResponseEntity<ApplicationDTO> getApplicationById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @DeleteMapping("/{id}")
    @RequireRole({"ADMIN", "TEACHER"})
    public ResponseEntity<Map<String, String>> deleteApplication(@PathVariable("id") Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.ok(Map.of("message", "Application deleted successfully"));
    }
}
