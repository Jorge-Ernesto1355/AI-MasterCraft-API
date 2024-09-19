export const isValidId = (id: string): boolean => {
  if (!id) return false;

  // Regex for UUID versions 1-5 and nil UUID
  const uuidRegex = 
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  // Regex for MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;

  // Check for nil UUID
  if (id === '00000000-0000-0000-0000-000000000000') return true;

  // Test for MongoDB ObjectId
  if (objectIdRegex.test(id)) return true;

  // Test for UUID
  if (uuidRegex.test(id)) {
    const version = parseInt(id.charAt(14), 16);
    const variant = (parseInt(id.charAt(19), 16) & 0xc) >> 2;
    
    return (version >= 1 && version <= 5) && (variant === 2);
  }

  return false;
};