package com.br.GymSync.exceptions.custom;

public class ActiveSubscriptionRequiredException extends RuntimeException {
    public ActiveSubscriptionRequiredException(String message) {
        super(message);
    }
}
