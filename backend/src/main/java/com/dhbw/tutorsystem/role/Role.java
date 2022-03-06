package com.dhbw.tutorsystem.role;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.*;

@Entity
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private ERole name;

    public Role() {

    }

    public Role(ERole name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }

    public static List<String> getRolesString(Set<Role> roles) {
        return roles.stream().map(role -> role.getName().name()).collect(Collectors.toList());
    }
}
