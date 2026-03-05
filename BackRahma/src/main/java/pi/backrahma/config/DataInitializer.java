package pi.backrahma.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import pi.backrahma.Repository.EventRepository;
import pi.backrahma.Repository.OrganizerRepository;
import pi.backrahma.Repository.ParticipantRepository;
import pi.backrahma.entity.*;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private OrganizerRepository organizerRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (participantRepository.count() > 0) {
            System.out.println("✅ Data already initialized. Skipping...");
            return;
        }

        System.out.println("🔄 Initializing database with test data...");

        // Create test participant
        Participant participant = new Participant();
        participant.setFullName("Guest User");
        participant.setEmail("guest@example.com");
        participant.setAttended(false);
        participantRepository.save(participant);
        System.out.println("✅ Created test participant: " + participant.getFullName());

        // Create test organizer
        Organizer organizer = new Organizer();
        organizer.setName("John Doe");
        organizer.setEmail("john.doe@example.com");
        organizer.setPhone("+1234567890");
        organizerRepository.save(organizer);
        System.out.println("✅ Created test organizer: " + organizer.getName());

        // Create test events
        createEvent("Business English Workshop", EventCategory.BUSINESS_ENGLISH, 
                   "Improve your business English skills", "Conference Room A", 
                   organizer, 100, 15);
        
        createEvent("Tech Conference 2026", EventCategory.CONFERENCE, 
                   "Annual technology conference", "Main Hall", 
                   organizer, 200, 45);
        
        createEvent("Cultural Exchange Event", EventCategory.CULTURAL_EVENT, 
                   "Experience different cultures", "Cultural Center", 
                   organizer, 150, 30);
        
        createEvent("Professional Training Session", EventCategory.TRAINING, 
                   "Advanced professional training", "Training Room", 
                   organizer, 80, 20);
        
        createEvent("Workshop: AI & Machine Learning", EventCategory.WORKSHOP, 
                   "Learn about AI and ML", "Tech Lab", 
                   organizer, 50, 10);

        System.out.println("✅ Database initialization completed!");
        System.out.println("📊 Total participants: " + participantRepository.count());
        System.out.println("📊 Total organizers: " + organizerRepository.count());
        System.out.println("📊 Total events: " + eventRepository.count());
    }

    private void createEvent(String name, EventCategory category, String description, 
                           String location, Organizer organizer, int placesLimit, int daysFromNow) {
        Event event = new Event();
        event.setName(name);
        event.setCategory(category);
        event.setStatus(EventStatus.Upcoming);
        event.setDate(LocalDate.now().plusDays(daysFromNow));
        event.setPlacesLimit(placesLimit);
        event.setReservedPlaces(0);
        event.setDescription(description);
        event.setLocation(location);
        event.setOrganizerFirstName(organizer.getName().split(" ")[0]);
        event.setOrganizerLastName(organizer.getName().split(" ")[1]);
        event.setOrganizer(organizer);
        eventRepository.save(event);
        System.out.println("✅ Created event: " + name);
    }
}
