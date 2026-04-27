package com.evaccin.service.sms;

/**
 * SmsException - Custom exception for SMS-related errors
 */
public class SmsException extends Exception {
    private final String errorCode;
    private final boolean retryable;

    public SmsException(String message) {
        super(message);
        this.errorCode = "UNKNOWN";
        this.retryable = false;
    }

    public SmsException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.retryable = isRetryableErrorCode(errorCode);
    }

    public SmsException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "UNKNOWN";
        this.retryable = false;
    }

    public SmsException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.retryable = isRetryableErrorCode(errorCode);
    }

    public String getErrorCode() {
        return errorCode;
    }

    public boolean isRetryable() {
        return retryable;
    }

    private static boolean isRetryableErrorCode(String errorCode) {
        return errorCode.equals("RATE_LIMIT") ||
               errorCode.equals("TIMEOUT") ||
               errorCode.equals("SERVICE_UNAVAILABLE") ||
               errorCode.equals("TEMPORARY_FAILURE");
    }
}
