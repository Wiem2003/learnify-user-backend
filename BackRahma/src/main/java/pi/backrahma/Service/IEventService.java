package pi.backrahma.Service;
import pi.backrahma.entity.Event;
import pi.backrahma.entity.Participant;

import java.util.List;

public interface IEventService {

    List<Event> getAllEvents();

    Event getEventById(Long id);

    Event addEvent(Event event);

    Event updateEvent(Long id, Event event);

    void deleteEvent(Long id);

    // Réservation d'un participant
    Event reserveEvent(Long eventId, Participant participant);
}