package org.example.yallatn.controller;

import org.example.yallatn.annotation.RequireRole;
import org.example.yallatn.model.Role;
import org.example.yallatn.model.User;
import org.example.yallatn.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @RequireRole({"ADMIN"})
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/teachers")
    @RequireRole({"USER", "ADMIN"})
    public ResponseEntity<List<User>> getAllTeachers() {
        return ResponseEntity.ok(userService.findByRole(Role.TEACHER));
    }

    @GetMapping("/{id}")
    @RequireRole({"USER", "TEACHER", "ADMIN"})
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PutMapping("/{id}")
    @RequireRole({"ADMIN"})
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    @RequireRole({"ADMIN"})
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
