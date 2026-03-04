package org.example.yallatn.model;

public enum Role {
    /** Étudiant / apprenant (peut noter les enseignants, suivre les cours, etc.). */
    USER,
    /** Enseignant (peut postuler aux offres, être noté par les étudiants). */
    TEACHER,
    /** Administrateur. */
    ADMIN
}
