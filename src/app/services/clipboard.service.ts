import { Injectable } from '@angular/core';

export interface ClipboardResult {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  constructor() {}

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text: string): Promise<ClipboardResult> {
    try {
      // Use the modern Clipboard API
      await navigator.clipboard.writeText(text);

      return {
        success: true,
        message: 'URL copied to clipboard!'
      };
    } catch (error) {
      console.warn('Clipboard API failed, fallback to document.execCommand:', error);
      return this.fallbackCopyToClipboard(text);
    }
  }

  /**
   * Fallback method for older browsers
   */
  private fallbackCopyToClipboard(text: string): ClipboardResult {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = text;

      // Make the textarea invisible
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.top = '0';
      textArea.style.left = '0';

      document.body.appendChild(textArea);

      // Select the text
      textArea.focus();
      textArea.select();

      // Try to copy the text
      const successful = document.execCommand('copy');

      // Remove the textarea
      document.body.removeChild(textArea);

      if (successful) {
        return {
          success: true,
          message: 'URL copied to clipboard!'
        };
      } else {
        throw new Error('Failed to copy text');
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
      return {
        success: false,
        message: 'Failed to copy URL to clipboard'
      };
    }
  }

  /**
   * Copy image URL with user-friendly message
   */
  async copyImageUrl(imageName: string, imageUrl: string): Promise<ClipboardResult> {
    const result = await this.copyToClipboard(imageUrl);

    if (result.success) {
      // Log the copy event if analytics is available
      // This will be connected to the analytics service when needed
      console.log(`Copied URL for image: ${imageName}`);
    }

    return result;
  }

  /**
   * Copy multiple image URLs
   */
  async copyMultipleUrls(urls: { name: string; url: string }[]): Promise<ClipboardResult> {
    const urlsText = urls.map(item => `${item.name}: ${item.url}`).join('\n\n');
    return await this.copyToClipboard(urlsText);
  }

  /**
   * Share image URL (if Share API is available)
   */
  async shareImage(imageName: string, imageUrl: string): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Share image: ${imageName}`,
          text: `Check out this image: ${imageName}`,
          url: imageUrl
        });
        return true;
      } catch (error) {
        console.log('Share cancelled or failed:', error);
        return false;
      }
    } else {
      // Fallback to copying to clipboard
      const result = await this.copyImageUrl(imageName, imageUrl);
      return result.success;
    }
  }
}