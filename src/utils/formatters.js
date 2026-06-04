/**
 * Utility functions for formatting data
 */

/**
 * Format date to Indonesian locale
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Makassar'
  };
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('id-ID', { ...defaultOptions, ...options }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format time to Indonesian locale
 * @param {Date|string} date - Date/time to format
 * @returns {string} - Formatted time string
 */
export const formatTime = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Makassar'
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Time';
  }
};

/**
 * Format number to Indonesian currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `Rp ${amount.toLocaleString('id-ID')}`;
  }
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format Indonesian phone number
  if (digits.startsWith('62')) {
    return `+${digits}`;
  } else if (digits.startsWith('0')) {
    return `+62${digits.slice(1)}`;
  }
  
  return digits;
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};