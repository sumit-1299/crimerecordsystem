package com.crime.controller;

import com.crime.model.User;
import com.crime.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService service;

    // REGISTER
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        User savedUser = service.register(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("username", savedUser.getUsername());
        response.put("role", savedUser.getRole());

        return response;
    }

    // LOGIN
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {

        User loggedInUser = service.login(user.getUsername(), user.getPassword());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("id", loggedInUser.getId());        // 🔥 ADD THIS
        response.put("username", loggedInUser.getUsername());
        response.put("role", loggedInUser.getRole());
        return response;
    }
}