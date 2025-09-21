// In-memory storage for deployment environments where file system is read-only
// This is a temporary solution until you migrate to a proper database

let memoryStore = {
  users: [],
  tokens: [],
  chatbots: [],
  messages: []
};

export const getMemoryData = (collection) => {
  return memoryStore[collection] || [];
};

export const setMemoryData = (collection, data) => {
  memoryStore[collection] = data;
  return data;
};

export const addMemoryData = (collection, item) => {
  if (!memoryStore[collection]) {
    memoryStore[collection] = [];
  }
  memoryStore[collection].push(item);
  return item;
};

export const findMemoryData = (collection, predicate) => {
  const data = memoryStore[collection] || [];
  return data.find(predicate);
};

export const filterMemoryData = (collection, predicate) => {
  const data = memoryStore[collection] || [];
  return data.filter(predicate);
};

// Reset memory store (useful for testing)
export const resetMemoryStore = () => {
  memoryStore = {
    users: [],
    tokens: [],
    chatbots: [],
    messages: []
  };
};
