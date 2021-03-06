package com.dhbw.tutorsystem.security.authentication.payload;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

import com.dhbw.tutorsystem.security.authentication.annotation.ValidEmail;
import com.dhbw.tutorsystem.security.authentication.annotation.ValidPassword;

public class RegisterRequest {

    @ValidEmail
    @Getter
    private String email;

    public void setEmail(String email) {
        this.email = email.trim();
    }

    @ValidPassword
    @Getter
    @Setter
    private String password;

    @NotBlank
    @Getter
    @Setter
    private String firstName;

    @NotBlank
    @Getter
    @Setter
    private String lastName;

    @Getter
    @Setter
    private Integer specialisationCourseId;

}
