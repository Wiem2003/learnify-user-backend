package pi.integrated.ai.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pi.integrated.ai.dto.GrammarCorrectionRequest;
import pi.integrated.ai.dto.GrammarCorrectionResponse;
import pi.integrated.ai.service.GrammarCorrectionService;

@RestController
@RequestMapping("/api/ai/grammar")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GrammarCorrectionController {

    private final GrammarCorrectionService grammarCorrectionService;

    @PostMapping("/correct")
    public ResponseEntity<GrammarCorrectionResponse> correct(@RequestBody GrammarCorrectionRequest req) {
        GrammarCorrectionResponse response = grammarCorrectionService.correct(req.getMessage(), req.getMode());
        return ResponseEntity.ok(response);
    }
}
