/**
 * Maps recipe names to appropriate food images
 * Returns the image path from /food pictures/ directory
 */
export function getRecipeImage(recipeName: string): string {
  const name = recipeName.toLowerCase();

  // Define keyword mappings to images
  const imageMap: Record<string, string> = {
    'caesar': '/food pictures/caesar-salad.png',
    'lemon chicken': '/food pictures/lemon-chicken.png',
    'chicken': '/food pictures/chicken.png',
    'fish': '/food pictures/fish.png',
    'salmon': '/food pictures/fish.png',
    'tuna': '/food pictures/fish.png',
    'cod': '/food pictures/fish.png',
    'soup': '/food pictures/hearty-soup.png',
    'broth': '/food pictures/hearty-soup.png',
    'stew': '/food pictures/hearty-soup.png',
    'pasta': '/food pictures/pasta.png',
    'spaghetti': '/food pictures/spaghetti-meatballs.png',
    'meatball': '/food pictures/spaghetti-meatballs.png',
    'pork': '/food pictures/porkchop.png',
    'porkchop': '/food pictures/porkchop.png',
    'salad': '/food pictures/salad.png',
    'steak': '/food pictures/steak.png',
    'beef': '/food pictures/steak.png',
    'white sauce': '/food pictures/pasta-white-sauce.png',
    'alfredo': '/food pictures/pasta-white-sauce.png',
    'cream': '/food pictures/pasta-white-sauce.png',
  };

  // Check for specific matches first (more specific patterns)
  if (name.includes('lemon') && name.includes('chicken')) {
    return '/food pictures/lemon-chicken.png';
  }

  if (name.includes('caesar')) {
    return '/food pictures/caesar-salad.png';
  }

  if ((name.includes('white') || name.includes('cream') || name.includes('alfredo')) && name.includes('pasta')) {
    return '/food pictures/pasta-white-sauce.png';
  }

  if (name.includes('spaghetti') || name.includes('meatball')) {
    return '/food pictures/spaghetti-meatballs.png';
  }

  // Check for general matches
  for (const [keyword, imagePath] of Object.entries(imageMap)) {
    if (name.includes(keyword)) {
      return imagePath;
    }
  }

  // Default fallback - choose based on first letter for variety
  const defaultImages = [
    '/food pictures/salad.png',
    '/food pictures/pasta.png',
    '/food pictures/chicken.png',
    '/food pictures/steak.png',
  ];

  const index = name.charCodeAt(0) % defaultImages.length;
  return defaultImages[index] ?? '/food pictures/salad.png';
}
