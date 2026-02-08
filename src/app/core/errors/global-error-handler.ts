import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: any): void {
        const message = error.message ? error.message : error.toString();
        console.error('VisualVault Exception:', {
            message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        // In a real production app, we would send this to a logging service like Sentry
        // For now, we'll just log it to the console with a specific prefix for debugging
    }
}
