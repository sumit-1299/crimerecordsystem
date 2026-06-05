package com.crime;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.crime.model.FIR;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.crime.repository")
public class CrimerecordsystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrimerecordsystemApplication.class, args);
    }
  
}
