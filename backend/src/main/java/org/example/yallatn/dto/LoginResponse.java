package org.example.yallatn.dto;

public class LoginResponse {

    private String message;
    private String sessionId;
    private UserDTO user;

    public LoginResponse() {
    }

    public LoginResponse(String message, String sessionId, UserDTO user) {
        this.message = message;
        this.sessionId = sessionId;
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}
