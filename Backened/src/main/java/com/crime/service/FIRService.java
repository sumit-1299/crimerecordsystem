package com.crime.service;

import com.crime.model.FIR;
import com.crime.model.FIRStatus;
import com.crime.model.FIRPriority;
import com.crime.repository.FIRRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FIRService {

    @Autowired
    private FIRRepository repo;

    public FIR addFIR(FIR fir) {

        if (fir.getPriority() == null) {
            fir.setPriority(FIRPriority.MEDIUM);
        }

        if (fir.getStatus() == null) {
            fir.setStatus(FIRStatus.PENDING);
        }

        if (fir.getCreatedAt() == null) {
            fir.setCreatedAt(LocalDateTime.now());
        }

        return repo.save(fir);
    }

    public FIR save(FIR fir) {
        return repo.save(fir);
    }

    public List<FIR> getAllFIR() {
        return repo.findAll();
    }

    public FIR getById(int id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("FIR not found"));
    }

    public void deleteFIR(int id) {
        repo.deleteById(id);
    }

    public FIR updateStatus(int id, String status) {

        FIR fir = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("FIR not found"));

        if (fir.getOfficerId() == 0) {
            throw new RuntimeException("Assign FIR first");
        }

        FIRStatus newStatus = FIRStatus.valueOf(status.toUpperCase());
        fir.setStatus(newStatus);

        if (newStatus == FIRStatus.IN_PROGRESS && fir.getStartedAt() == null) {
            fir.setStartedAt(LocalDateTime.now());
        }

        if (newStatus == FIRStatus.CLOSED && fir.getClosedAt() == null) {
            fir.setClosedAt(LocalDateTime.now());
        }

        return repo.save(fir);
    }

    public List<FIR> getByOfficer(int officerId) {
        return repo.findByOfficerId(officerId);
    }

    public FIR assignOfficer(int id, int officerId) {

        FIR fir = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("FIR not found"));

        fir.setOfficerId(officerId);

        if (fir.getAssignedAt() == null) {
            fir.setAssignedAt(LocalDateTime.now());
        }

        return repo.save(fir);
    }
}