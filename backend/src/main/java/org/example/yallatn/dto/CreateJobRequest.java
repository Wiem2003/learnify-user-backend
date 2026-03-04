package org.example.yallatn.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

/**
 * Requête de création d'offre avec option de publication programmée.
 * opensAt : si présent et dans le futur, l'offre est créée en CLOSED et passera en OPEN à cette date.
 */
public class CreateJobRequest {

    @NotBlank(message = "Title is required")
    private String titre;
    @NotNull(message = "Number of places is required")
    @Min(value = 1, message = "Number of places must be at least 1")
    private Integer nbPlaces;
    private String description;
    private String requirements;
    @NotNull(message = "Deadline is required")
    private LocalDateTime deadline;
    /** Date/heure à laquelle l'offre doit devenir ouverte (optionnel). Si dans le futur, l'offre reste en attente. */
    private LocalDateTime opensAt;

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    public Integer getNbPlaces() { return nbPlaces; }
    public void setNbPlaces(Integer nbPlaces) { this.nbPlaces = nbPlaces; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }
    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
    public LocalDateTime getOpensAt() { return opensAt; }
    public void setOpensAt(LocalDateTime opensAt) { this.opensAt = opensAt; }
}
