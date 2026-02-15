package learnifyapp.userandpreevaluation.usermanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import learnifyapp.userandpreevaluation.usermanagement.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;



@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String avatarUrl;


}
