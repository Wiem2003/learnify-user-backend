package org.example.yallatn.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.example.yallatn.annotation.RequireRole;
import org.example.yallatn.model.Rating;
import org.example.yallatn.model.User;
import org.example.yallatn.service.RatingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    @RequireRole({"USER"})
    public ResponseEntity<Rating> createRating(
            @RequestBody Map<String, Object> request,
            HttpServletRequest httpRequest) {
        
        User currentUser = (User) httpRequest.getAttribute("currentUser");
        Long teacherId = Long.valueOf(request.get("teacherId").toString());
        Integer note = Integer.valueOf(request.get("note").toString());
        String commentaire = request.get("commentaire") != null 
                ? request.get("commentaire").toString() 
                : null;

        Rating rating = ratingService.createRating(teacherId, currentUser.getId(), note, commentaire);
        return ResponseEntity.status(HttpStatus.CREATED).body(rating);
    }

    @GetMapping
    @RequireRole({"ADMIN"})
    public ResponseEntity<List<Rating>> getAllRatings() {
        return ResponseEntity.ok(ratingService.getAllRatings());
    }

    @GetMapping("/teacher/{teacherId}")
    @RequireRole({"USER", "ADMIN"})
    public ResponseEntity<List<Rating>> getRatingsByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(ratingService.getRatingsByTeacher(teacherId));
    }

    @GetMapping("/teacher/{teacherId}/average")
    @RequireRole({"USER", "ADMIN"})
    public ResponseEntity<Map<String, Double>> getAverageRating(@PathVariable Long teacherId) {
        Double average = ratingService.getAverageRatingForTeacher(teacherId);
        return ResponseEntity.ok(Map.of("average", average));
    }

    @GetMapping("/my-ratings")
    @RequireRole({"USER"})
    public ResponseEntity<List<Rating>> getMyRatings(HttpServletRequest httpRequest) {
        User currentUser = (User) httpRequest.getAttribute("currentUser");
        return ResponseEntity.ok(ratingService.getRatingsByStudent(currentUser.getId()));
    }

    @GetMapping("/{id}")
    @RequireRole({"USER", "ADMIN"})
    public ResponseEntity<Rating> getRatingById(@PathVariable Long id) {
        return ResponseEntity.ok(ratingService.getRatingById(id));
    }

    @PutMapping("/{id}")
    @RequireRole({"USER"})
    public ResponseEntity<Rating> updateRating(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        
        Integer note = request.containsKey("note") 
                ? Integer.valueOf(request.get("note").toString()) 
                : null;
        String commentaire = request.containsKey("commentaire") 
                ? request.get("commentaire").toString() 
                : null;

        return ResponseEntity.ok(ratingService.updateRating(id, note, commentaire));
    }

    @DeleteMapping("/{id}")
    @RequireRole({"USER", "ADMIN"})
    public ResponseEntity<Map<String, String>> deleteRating(@PathVariable Long id) {
        ratingService.deleteRating(id);
        return ResponseEntity.ok(Map.of("message", "Rating deleted successfully"));
    }
}
