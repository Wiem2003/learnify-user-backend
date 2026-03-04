package org.example.yallatn.model;

public enum JobStatus {
    OPEN,
    /** Offre dont la date limite est dépassée (passée automatiquement par le scheduler). */
    EXPIRED,
    CLOSED
}
