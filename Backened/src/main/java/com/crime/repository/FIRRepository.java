package com.crime.repository;

import com.crime.model.FIR;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface FIRRepository extends JpaRepository<FIR, Integer> {

    // ✅ GET FIR BY POLICE OFFICER
    List<FIR> findByOfficerId(int officerId);

    // ✅ ADMIN ASSIGN FIR TO POLICE
    @Modifying
    @Transactional
    @Query("UPDATE FIR f SET f.officerId = :officerId WHERE f.id = :id")
    void assignOfficer(int id, int officerId);
}