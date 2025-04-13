// utils/imageUrl.ts
export const getImageUrl = (path: string | null) => {
    if (!path) return '';
    
    // If the path already includes the full URL, return as is
    if (path.startsWith('http')) return path;
    
    // For paths starting with /uploads, use the API base URL
    if (path.startsWith('/uploads')) {
      return `${import.meta.env.VITE_API_URL || ''}${path}`;
    }
    
    // Default case
    return path;
  };