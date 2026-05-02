package learnifyapp.userandpreevaluation;

import learnifyapp.userandpreevaluation.usermanagement.entity.User;
import learnifyapp.userandpreevaluation.usermanagement.enums.Role;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserEntityTest {

    @Test
    void testUserEntity() {

        User user = new User();

        user.setId(1L);
        user.setFirstName("Wiem");
        user.setLastName("Test");
        user.setEmail("wiem@gmail.com");
        user.setPassword("123456");
        user.setRole(Role.ADMIN);
        user.setAvatarUrl("img.png");
        user.setAbout("hello");
        user.setAppPinHash("9999");

        assertEquals(1L, user.getId());
        assertEquals("Wiem", user.getFirstName());
        assertEquals("Test", user.getLastName());
        assertEquals("wiem@gmail.com", user.getEmail());
        assertEquals("123456", user.getPassword());
        assertEquals(Role.ADMIN, user.getRole());
        assertEquals("img.png", user.getAvatarUrl());
        assertEquals("hello", user.getAbout());
        assertEquals("9999", user.getAppPinHash());
    }
}