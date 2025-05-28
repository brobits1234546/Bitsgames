// Get data from localStorage with type safety
export function getFromLocalStorage<T>(key: string): T | null {
  const data = localStorage.getItem(key);
  if (!data) return null;
  
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error parsing data from localStorage for key "${key}":`, error);
    return null;
  }
}

// Save data to localStorage
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage for key "${key}":`, error);
  }
}

// Initialize demo data if not already present
export function initializeDemoData(): void {
  // Initialize games if not present
  if (!localStorage.getItem('games')) {
    const games = [
      {
        id: '1',
        name: 'Combat Master',
        image: 'https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        description: 'Fast-paced first-person shooter with tactical gameplay and customizable loadouts.',
      },
      {
        id: '2',
        name: 'Half-Life',
        image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        description: 'Iconic first-person shooter that revolutionized storytelling in video games.',
      },
      {
        id: '3',
        name: 'Counter-Strike: Source',
        image: 'https://images.pexels.com/photos/7914464/pexels-photo-7914464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        description: 'Classic team-based action gameplay that defined competitive FPS gaming.',
      },
      {
        id: '4',
        name: 'Valorant',
        image: 'https://images.pexels.com/photos/6056774/pexels-photo-6056774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        description: 'Tactical shooter with unique character abilities and precise gunplay.',
      }
    ];
    localStorage.setItem('games', JSON.stringify(games));
  }
}