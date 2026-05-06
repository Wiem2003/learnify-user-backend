package pi.integrated.course.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import pi.integrated.course.config.RabbitMQConfig;
import pi.integrated.course.entity.Course;
import pi.integrated.course.repository.CourseRepository;

/**
 * Listens to course.enrollment.queue published by payment-service.
 * Increments the studentsCount on the enrolled course.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CourseEnrollmentConsumer {

    private final CourseRepository courseRepository;

    @RabbitListener(queues = RabbitMQConfig.COURSE_ENROLL_QUEUE)
    @Transactional
    public void onCourseEnrolled(CourseEnrollmentEvent event) {
        log.info("Received course.enrolled event for user {} course {}", event.getUserId(), event.getCourseId());
        try {
            courseRepository.findById(event.getCourseId()).ifPresentOrElse(course -> {
                int current = course.getStudentsCount() != null ? course.getStudentsCount() : 0;
                course.setStudentsCount(current + 1);
                courseRepository.save(course);
                log.info("Incremented studentsCount for course {} to {}", event.getCourseId(), current + 1);
            }, () -> log.warn("Course {} not found — enrollment event ignored", event.getCourseId()));
        } catch (Exception e) {
            log.error("Failed to process course enrollment event: {}", e.getMessage());
        }
    }
}
