package com.dhbw.tutorsystem.security.authentication.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import com.dhbw.tutorsystem.user.User;

import lombok.Getter;
import lombok.Setter;

public class RequestPasswordResetRequest {

    @NotBlank
    @Getter
    @Setter
    private String email;

    @NotBlank
    @Pattern(regexp = User.passwordRegex)
    @Getter
    @Setter
    private String newPassword;

}