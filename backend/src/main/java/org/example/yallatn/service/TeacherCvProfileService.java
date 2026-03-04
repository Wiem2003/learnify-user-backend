package org.example.yallatn.service;

import org.example.yallatn.model.TeacherCvProfile;
import org.example.yallatn.repository.TeacherCvProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public class TeacherCvProfileService {

    private final TeacherCvProfileRepository profileRepository;
    private final FileStorageService fileStorageService;
    private final CvTextExtractionService cvTextExtractionService;

    public TeacherCvProfileService(TeacherCvProfileRepository profileRepository,
                                  FileStorageService fileStorageService,
                                  CvTextExtractionService cvTextExtractionService) {
        this.profileRepository = profileRepository;
        this.fileStorageService = fileStorageService;
        this.cvTextExtractionService = cvTextExtractionService;
    }

    @Transactional
    public void uploadCv(Long teacherId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("CV file is required");
        }
        String cvPath = fileStorageService.storeFile(file, "teacher-cv");
        String extractedText = cvTextExtractionService.extractText(file);

        TeacherCvProfile profile = profileRepository.findByUserId(teacherId).orElseGet(() -> {
            TeacherCvProfile p = new TeacherCvProfile();
            p.setUserId(teacherId);
            return p;
        });
        profile.setCvPath(cvPath);
        profile.setCvExtractedText(extractedText != null ? extractedText : "");
        profileRepository.saveAndFlush(profile);
    }

    public Optional<String> getCvExtractedText(Long teacherId) {
        return profileRepository.findByUserId(teacherId)
                .map(TeacherCvProfile::getCvExtractedText)
                .filter(t -> t != null && !t.isBlank());
    }

    public boolean hasProfileCv(Long teacherId) {
        return profileRepository.findByUserId(teacherId)
                .map(p -> p.getCvExtractedText() != null && !p.getCvExtractedText().isBlank())
                .orElse(false);
    }
}
