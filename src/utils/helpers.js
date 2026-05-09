// Unique ID Generator
let _counter = 0;

export function generateId() {
  _counter += 1;
  return "q_" + _counter + "_" + Date.now();
}

// Create a blank question object 
export function makeQuestion() {
  return {
    id: generateId(),
    text: "",
    type: "short", 
    answer: null, 
    children: [],
  };
}

// Build the display label
export function buildLabel(parentLabel, index) {
  if (!parentLabel) {
    return "Q" + (index + 1);
  }
  return parentLabel + "." + (index + 1);
}

// Recursively update a question anywhere in the tree 
// updater: (question) => newQuestion
export function updateIn(questions, targetId, updater) {
  return questions.map(function (q) {
    if (q.id === targetId) {
      return updater(q);
    }
    return Object.assign({}, q, {
      children: updateIn(q.children, targetId, updater),
    });
  });
}

// Recursively delete a question
export function deleteIn(questions, targetId) {
  return questions
    .filter(function (q) {
      return q.id !== targetId;
    })
    .map(function (q) {
      return Object.assign({}, q, {
        children: deleteIn(q.children, targetId),
      });
    });
}

//  Recursively add a child question under a given parent
export function addChildIn(questions, parentId) {
  return questions.map(function (q) {
    if (q.id === parentId) {
      return Object.assign({}, q, {
        children: q.children.concat(makeQuestion()),
      });
    }
    return Object.assign({}, q, {
      children: addChildIn(q.children, parentId),
    });
  });
}

//  Reorder an array (for drag-and-drop)
export function reorder(list, startIndex, endIndex) {
  var result = Array.from(list);
  var removed = result.splice(startIndex, 1)[0];
  result.splice(endIndex, 0, removed);
  return result;
}

// Local Storage helpers
var STORAGE_KEY = "nested_form_v1";

export function saveToStorage(questions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
}

export function loadFromStorage() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    return [];
  } catch (e) {
    console.warn("Could not load from localStorage:", e);
    return [];
  }
}
