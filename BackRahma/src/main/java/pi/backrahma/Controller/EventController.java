package pi.backrahma.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import pi.backrahma.Repository.EventRepository;
import pi.backrahma.dto.EventStatistics;
import pi.backrahma.entity.Event;
import pi.backrahma.entity.EventCategory;
import pi.backrahma.entity.EventStatus;
import pi.backrahma.entity.Participant;
import pi.backrahma.Service.EventServiceImp;
import pi.backrahma.Service.IEventService;

import jakarta.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class EventController {

    private static final Logger logger = LoggerFactory.getLogger(EventController.class);

    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventServiceImp eventService;

    public EventController(EventServiceImp eventService) {
        this.eventService = eventService;
    }

    // 📋 Tous les événements
    @GetMapping
    public List<Event> getAll() {
        return eventService.getAllEvents();
    }

    // 📚 Catégories disponibles
    @GetMapping("/categories")
    public List<String> getCategories() {
        return java.util.Arrays.stream(EventCategory.values())
                .map(Enum::name)
                .toList();
    }

    // 📌 Un événement spécifique
    @GetMapping("/{id}")
    public Event getOne(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    // ➕ Ajouter un événement (JSON ou multipart/form-data)
    @PostMapping
    public ResponseEntity<?> createEvent(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Integer placesLimit,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String organizerFirstName,
            @RequestParam(required = false) String organizerLastName,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestBody(required = false) Event jsonBody) {
        
        logger.debug("createEvent called; name={}, photoPresent={}, jsonBody={}", 
                name, photo != null, jsonBody);
        
        try {
            Event event;
            
            // Si JSON body est fourni
            if (jsonBody != null) {
                event = jsonBody;
                if (event.getReservedPlaces() == 0) {
                    event.setReservedPlaces(0);
                }
            } 
            // Si form-data est fourni
            else if (name != null && !name.isEmpty()) {
                event = new Event();
                event.setName(name);
                event.setCategory(EventCategory.valueOf(category.toUpperCase()));
                event.setStatus(EventStatus.valueOf(
                        status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase()));
                event.setDate(LocalDate.parse(date));
                event.setDescription(description);
                event.setLocation(location);
                event.setOrganizerFirstName(organizerFirstName);
                event.setOrganizerLastName(organizerLastName);
                event.setPlacesLimit(placesLimit);
                event.setReservedPlaces(0);
            } else {
                return ResponseEntity.badRequest().body("No event data provided");
            }

            if (photo != null && !photo.isEmpty()) {
                // Utiliser un chemin absolu pour éviter les problèmes avec Tomcat
                String uploadDir = System.getProperty("user.dir") + "/BackRahma/uploads/";
                File uploadFolder = new File(uploadDir);
                if (!uploadFolder.exists()) {
                    uploadFolder.mkdirs();
                }

                // Nettoyer le nom de fichier pour éviter les caractères spéciaux
                String originalFilename = photo.getOriginalFilename();
                String cleanFilename = originalFilename.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
                String timestamp = String.valueOf(System.currentTimeMillis());
                String filename = timestamp + "_" + cleanFilename;
                
                File destinationFile = new File(uploadDir + filename);
                photo.transferTo(destinationFile);

                event.setPhotoUrl("/uploads/" + filename);
            } else {
                // Photo par défaut si aucune photo n'est fournie
                event.setPhotoUrl("/uploads/default-event.jpg");
            }

            // ✅ sauvegarde via repository injecté
            eventRepository.save(event);

            return ResponseEntity.ok(event);

        } catch (Exception e) {
            logger.error("Error creating event", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create event: " + e.getMessage());
        }
    }

    // ✏️ Modifier un événement (accept JSON or multipart/form-data)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Integer placesLimit,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String organizerFirstName,
            @RequestParam(required = false) String organizerLastName,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestBody(required = false) Event jsonBody) {
        
        logger.debug("updateEvent id={}, name={}, photoPresent={}, jsonBody={}", 
                id, name, photo != null, jsonBody);
        
        try {
            Event event = eventService.getEventById(id);
            if (event == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Si JSON body est fourni
            if (jsonBody != null) {
                event.setName(jsonBody.getName());
                event.setCategory(jsonBody.getCategory());
                event.setStatus(jsonBody.getStatus());
                event.setDate(jsonBody.getDate());
                event.setDescription(jsonBody.getDescription());
                event.setLocation(jsonBody.getLocation());
                event.setOrganizerFirstName(jsonBody.getOrganizerFirstName());
                event.setOrganizerLastName(jsonBody.getOrganizerLastName());
                event.setPlacesLimit(jsonBody.getPlacesLimit());
            } 
            // Si form-data est fourni
            else if (name != null && !name.isEmpty()) {
                event.setName(name);
                event.setCategory(EventCategory.valueOf(category.toUpperCase()));
                event.setStatus(EventStatus.valueOf(
                        status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase()));
                event.setDate(LocalDate.parse(date));
                event.setDescription(description);
                event.setLocation(location);
                event.setOrganizerFirstName(organizerFirstName);
                event.setOrganizerLastName(organizerLastName);
                event.setPlacesLimit(placesLimit);
            }

            if (photo != null && !photo.isEmpty()) {
                // Utiliser un chemin absolu pour éviter les problèmes avec Tomcat
                String uploadDir = System.getProperty("user.dir") + "/BackRahma/uploads/";
                File uploadFolder = new File(uploadDir);
                if (!uploadFolder.exists()) {
                    uploadFolder.mkdirs();
                }

                // Nettoyer le nom de fichier pour éviter les caractères spéciaux
                String originalFilename = photo.getOriginalFilename();
                String cleanFilename = originalFilename.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
                String timestamp = String.valueOf(System.currentTimeMillis());
                String filename = timestamp + "_" + cleanFilename;
                
                File destinationFile = new File(uploadDir + filename);
                photo.transferTo(destinationFile);
                
                event.setPhotoUrl("/uploads/" + filename);
            }

            eventRepository.save(event);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update event");
        }
    }

    // ❌ Supprimer un événement
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }

    // 🎟 Réserver un événement
    @PostMapping("/{id}/reserve")
    public Event reserve(@PathVariable Long id, @RequestBody(required = false) Participant participant) {
        if (participant == null) {
            participant = new Participant();
            participant.setFullName("Anonymous");
        }
        return eventService.reserveEvent(id, participant);
    }

    // 🔍 Recherche et filtrage avec pagination
    @GetMapping("/search")
    public ResponseEntity<Page<Event>> searchAndFilter(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) EventCategory category,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Event> events = eventService.searchAndFilterEvents(keyword, category, status, page, size);
        return ResponseEntity.ok(events);
    }

    // 📊 Statistiques (Admin)
    @GetMapping("/statistics")
    public ResponseEntity<EventStatistics> getStatistics() {
        EventStatistics stats = eventService.getStatistics();
        return ResponseEntity.ok(stats);
    }

    // 🔄 Changer le status d'un événement (Admin)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Event> updateStatus(@PathVariable Long id, @RequestParam EventStatus status) {
        Event event = eventService.getEventById(id);
        event.setStatus(status);
        eventRepository.save(event);
        return ResponseEntity.ok(event);
    }
}
