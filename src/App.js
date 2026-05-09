import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Question from "./components/Question";
import SubmissionView from "./components/SubmissionView";
import EmptyState from "./components/EmptyState";

import {
  makeQuestion,
  updateIn,
  deleteIn,
  addChildIn,
  reorder,
  saveToStorage,
  loadFromStorage,
} from "./utils/helpers";

function App() {
  var [questions, setQuestions] = useState(function () {
    return loadFromStorage();
  });

  var [submitted, setSubmitted] = useState(false);

  var persist = useCallback(function (newQuestions) {
    setQuestions(newQuestions);
    saveToStorage(newQuestions);
  }, []);

  // Add a new parent question
  function handleAddParent() {
    persist(questions.concat(makeQuestion()));
  }

  var handleUpdate = useCallback(
    function (id, patch) {
      var updated = updateIn(questions, id, function (q) {
        return Object.assign({}, q, patch);
      });
      persist(updated);
    },
    [questions, persist],
  );

  // Delete any question
  var handleDelete = useCallback(
    function (id) {
      persist(deleteIn(questions, id));
    },
    [questions, persist],
  );

  // Add a child question 
  var handleAddChild = useCallback(
    function (parentId) {
      persist(addChildIn(questions, parentId));
    },
    [questions, persist],
  );

  // Drag-and-drop: reorder parent questions only 
  function handleDragEnd(result) {
    if (!result.destination) return; 
    var reordered = reorder(
      questions,
      result.source.index,
      result.destination.index,
    );
    persist(reordered);
  }

  //  Submit form 
  function handleSubmit() {
    setSubmitted(true);
  }

  // Go back to editing 
  function handleBack() {
    setSubmitted(false);
  }

  //  Render: Submission Preview
  if (submitted) {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Nested Form Builder</h1>
          <p className="app-subtitle">
            Infollion — Software Developer Intern Task 5
          </p>
        </header>
        <main className="app-body">
          <SubmissionView questions={questions} onBack={handleBack} />
        </main>
      </div>
    );
  }

  //  Render: Form Builder 
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Nested Form Builder</h1>
        <p className="app-subtitle">
          Infollion — Software Developer Intern Task 5
        </p>
      </header>

      <main className="app-body">
        {/* Drag-and-drop context wraps the parent question list */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="parent-questions">
            {function (provided) {
              return (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {questions.map(function (q, index) {
                    return (
                      <Draggable key={q.id} draggableId={q.id} index={index}>
                        {function (prov, snapshot) {
                          return (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              className={
                                "draggable-wrapper" +
                                (snapshot.isDragging ? " dragging" : "")
                              }
                            >
                              {/* Drag handle icon */}
                              <span
                                className="drag-handle"
                                {...prov.dragHandleProps}
                                title="Drag to reorder"
                              >
                                ⠿
                              </span>

                              {/* The question card (recursive) */}
                              <Question
                                q={q}
                                label={"Q" + (index + 1)}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                                onAddChild={handleAddChild}
                                depth={0}
                              />
                            </div>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>

        {/* Show empty state when no questions exist */}
        {questions.length === 0 && <EmptyState />}

        {/* Action buttons */}
        <div className="action-bar">
          <button className="btn-add" onClick={handleAddParent}>
            + Add Question
          </button>
          <button className="btn-submit" onClick={handleSubmit}>
            Submit Form →
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
