package com.crime.controller;

import com.crime.model.User;
import com.crime.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")   // 🔥 DIFFERENT BASE PATH
@CrossOrigin
public class UserController {

    @Autowired
    private UserService service;

    // 🔥 GET ALL POLICE USERS
    @GetMapping("/police")
    public List<User> getPoliceUsers() {
        return service.getPoliceUsers();
    }
}