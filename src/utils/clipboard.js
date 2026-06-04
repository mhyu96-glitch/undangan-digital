/**
 * Copy text to clipboard with fallback for older browsers
 * @param {string} text - Text to copy to clipboard
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  try {
    // Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return success;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

/**
 * Read text from clipboard
 * @returns {Promise<string|null>} - Clipboard text or null if failed
 */
export const readFromClipboard = async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return await navigator.clipboard.readText();
    }
    return null;
  } catch (err) {
    console.error('Failed to read clipboard: ', err);
    return null;
  }
};