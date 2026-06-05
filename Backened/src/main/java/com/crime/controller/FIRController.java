package com.crime.controller;

import com.crime.model.FIR;
import com.crime.service.FIRService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/fir")
@CrossOrigin(origins = "http://localhost:3000") // optional (if not using global CORS)
public class FIRController {

    @Autowired
    private FIRService service;

    // =========================
    // ✅ ADD FIR
    // =========================
    @PostMapping("/add")
    public ResponseEntity<FIR> addFIR(@RequestBody FIR fir) {

        if (fir.getTitle() == null || fir.getTitle().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        FIR saved = service.addFIR(fir);
        return ResponseEntity.ok(saved);
    }

    // =========================
    // 📁 UPLOAD FILE (EVIDENCE)
    // =========================
    @PostMapping("/upload/{id}")
    public ResponseEntity<FIR> uploadFile(
            @PathVariable int id,
            @RequestParam("file") MultipartFile file) {

        try {
            FIR fir = service.getById(id);

            // Folder
            String uploadDir = "uploads/";

            // Unique filename
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path path = Paths.get(uploadDir + fileName);

            // Create folder if not exists
            Files.createDirectories(path.getParent());

            // Save file
            Files.copy(file.getInputStream(), path);

            // Save file path in DB
            fir.setFilePath(uploadDir + fileName);

            FIR updated = service.addFIR(fir);

            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // =========================
    // 📥 GET ALL FIR (ADMIN)
    // =========================
    @GetMapping("/all")
    public ResponseEntity<List<FIR>> getAllFIR() {
        return ResponseEntity.ok(service.getAllFIR());
    }

    // =========================
    // 👮 GET FIR BY OFFICER
    // =========================
    @GetMapping("/officer/{id}")
    public ResponseEntity<List<FIR>> getByOfficer(@PathVariable int id) {
        return ResponseEntity.ok(service.getByOfficer(id));
    }

    // =========================
    // 🔍 GET FIR BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<FIR> getById(@PathVariable int id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // =========================
    // ❌ DELETE FIR
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFIR(@PathVariable int id) {
        service.deleteFIR(id);
        return ResponseEntity.ok("FIR deleted successfully");
    }

    // =========================
    // 🔄 UPDATE STATUS
    // =========================
    @PutMapping("/status/{id}")
    public ResponseEntity<FIR> updateStatus(
            @PathVariable int id,
            @RequestParam String status) {

        FIR updated = service.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    // =========================
    // 👤 ASSIGN OFFICER
    // =========================
    @PutMapping("/assign/{id}")
    public ResponseEntity<FIR> assignOfficer(
            @PathVariable int id,
            @RequestParam int officerId) {

        FIR updated = service.assignOfficer(id, officerId);
        return ResponseEntity.ok(updated);
    }
}