package com.dhbw.tutorsystem;

import com.dhbw.tutorsystem.role.RoleRepository;
import com.dhbw.tutorsystem.user.UserRepository;
import com.dhbw.tutorsystem.user.director.DirectorRepository;
import com.dhbw.tutorsystem.user.student.StudentRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class TutorsystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(TutorsystemApplication.class, args);
	}

	@Bean
	public CommandLineRunner init(
			RoleRepository roleRepository,
			UserRepository userRepository,
			PasswordEncoder encoder,
			DirectorRepository directorRepository,
			StudentRepository studentRepository) {
		return (args) -> {
			new DevDataManager(roleRepository, userRepository, encoder, directorRepository, studentRepository)
					.initDatabaseForDevelopment();
		};
	}

}
