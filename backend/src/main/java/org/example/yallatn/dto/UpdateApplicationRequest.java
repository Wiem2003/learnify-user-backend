package org.example.yallatn.dto;

public class UpdateApplicationRequest {
    private String motivation;

    public UpdateApplicationRequest() {
    }

    public UpdateApplicationRequest(String motivation) {
        this.motivation = motivation;
    }

    public String getMotivation() {
        return motivation;
    }

    public void setMotivation(String motivation) {
        this.motivation = motivation;
    }
}
