package pi.integrated.quiz.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import pi.integrated.quiz.config.RabbitMQConfig;
import pi.integrated.quiz.model.Quiz;
import pi.integrated.quiz.model.QuizStatus;
import pi.integrated.quiz.repository.QuizRepository;

import java.util.List;

/**
 * Listens to course.enrollment.queue published by payment-service.
 * Publishes (activates) all DRAFT quizzes for the enrolled course.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CourseEnrollmentConsumer {

    private final QuizRepository quizRepository;

    @RabbitListener(queues = RabbitMQConfig.COURSE_ENROLL_QUEUE)
    public void onCourseEnrolled(CourseEnrollmentEvent event) {
        log.info("Received course.enrolled event for user {} course {}", event.getUserId(), event.getCourseId());
        try {
            List<Quiz> draftQuizzes = quizRepository.findByCourseId(event.getCourseId())
                    .stream()
                    .filter(q -> q.getStatus() == QuizStatus.DRAFT)
                    .toList();

            if (draftQuizzes.isEmpty()) {
                log.info("No DRAFT quizzes found for course {} — nothing to activate", event.getCourseId());
                return;
            }

            draftQuizzes.forEach(q -> q.setStatus(QuizStatus.PUBLISHED));
            quizRepository.saveAll(draftQuizzes);
            log.info("Activated {} quiz(zes) for course {} after enrollment of user {}",
                    draftQuizzes.size(), event.getCourseId(), event.getUserId());
        } catch (Exception e) {
            log.error("Failed to process course enrollment event in quiz-service: {}", e.getMessage());
        }
    }
}
