/**
 * Theme utility functions and constants for consistent styling throughout the application
 */

// Core color palette based on CSS variables
export const colors = {
  primary: {
    light: 'var(--primary-light)',
    DEFAULT: 'var(--primary)',
    dark: 'var(--primary-dark)',
  },
  secondary: {
    light: 'var(--secondary-light)',
    DEFAULT: 'var(--secondary)',
    dark: 'var(--secondary-dark)',
  },
  background: 'var(--background)',
  foreground: 'var(--foreground)',
};

// Common button styles using our theme
export const buttonStyles = {
  primary: `bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded`,
  secondary: `bg-white border border-secondary text-secondary hover:bg-secondary-50 font-medium py-2 px-4 rounded`,
  danger: `bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded`,
  link: `text-primary hover:text-primary-dark underline font-medium`,
};

// Text styles
export const textStyles = {
  heading1: 'text-3xl font-bold text-foreground',
  heading2: 'text-2xl font-bold text-foreground',
  heading3: 'text-xl font-bold text-foreground',
  body: 'text-base text-foreground',
  bodyLight: 'text-base text-secondary-dark',
  small: 'text-sm text-secondary',
};

// Common layout styles
export const layoutStyles = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  card: 'bg-white shadow rounded-lg p-6',
  section: 'py-8',
};

// Utility function to combine classnames
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};
