import initialData from '../api/pumps.json';

// Initialize localStorage with initial data if not already set
if (!localStorage.getItem('pumps')) {
  localStorage.setItem('pumps', JSON.stringify(initialData));
}

// API functions to interact with localStorage for pump data
export function getAllPumps() {
  return JSON.parse(localStorage.getItem('pumps') || '[]');
}

export function getPumpById(id) {
  const pumps = getAllPumps();
  return pumps.find(p => p.id === id);
}

export function updatePump(id, updatedData) {
  const pumps = getAllPumps();
  const index = pumps.findIndex(p => p.id === id);
  if (index !== -1) {
    pumps[index] = { ...pumps[index], ...updatedData };
    localStorage.setItem('pumps', JSON.stringify(pumps));
  }
}

export function createPump(pump) {
  const pumps = getAllPumps();

  const maxId = pumps.reduce((max, p) => {
    const idNum = parseInt(p.id, 10);
    return isNaN(idNum) ? max : Math.max(max, idNum);
  }, 0);

  pump.id = (maxId + 1).toString();
  pumps.push(pump);
  localStorage.setItem('pumps', JSON.stringify(pumps));
}


export function deletePumpById(id) {
  const pumps = getAllPumps();
  const updatedPumps = pumps.filter(p => p.id !== id);
  localStorage.setItem('pumps', JSON.stringify(updatedPumps));
}