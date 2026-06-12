package com.br.GymSync.exceptions.custom;

public class CnpjAlreadyExistsException extends RuntimeException {
    public CnpjAlreadyExistsException(String message) {
        super(message);
    }
}
