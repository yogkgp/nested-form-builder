import React from "react";
import { buildLabel } from "../utils/helpers";

// Single Question (renders itself + its children recursively)
function Question(props) {
  var q = props.q;
  var label = props.label;
  var onUpdate = props.onUpdate;
  var onDelete = props.onDelete;
  var onAddChild = props.onAddChild;
  var depth = props.depth || 0;

  // Child questions are shown only when type is True/False AND answer is "true"
  var showAddChild = q.type === "trueFalse" && q.answer === "true";

  //  Handlers
  function handleTextChange(e) {
    onUpdate(q.id, { text: e.target.value });
  }

  function handleTypeChange(e) {
    // Reset answer and children when type changes
    onUpdate(q.id, {
      type: e.target.value,
      answer: null,
      children: [],
    });
  }

  function handleAnswerChange(e) {
    var newAnswer = e.target.value || null;
    // If switching away from "true", remove all children
    onUpdate(q.id, {
      answer: newAnswer,
      children: newAnswer === "true" ? q.children : [],
    });
  }

  function handleDelete() {
    onDelete(q.id);
  }

  function handleAddChild() {
    onAddChild(q.id);
  }

  // Styles 
  var cardStyle = {
    marginLeft: depth * 28,
    borderLeft: depth > 0 ? "3px solid var(--accent)" : "none",
    paddingLeft: depth > 0 ? 14 : 18,
  };

  return (
    <div className="question-card" style={cardStyle}>
      {/* ── Header row ── */}
      <div className="question-header">
        {/* Auto-numbered label */}
        <span className="question-label">{label}</span>

        {/* Question text input */}
        <input
          className="question-input"
          type="text"
          placeholder="Type your question here…"
          value={q.text}
          onChange={handleTextChange}
        />

        {/* Question type dropdown */}
        <select
          className="question-select"
          value={q.type}
          onChange={handleTypeChange}
        >
          <option value="short">Short Answer</option>
          <option value="trueFalse">True / False</option>
        </select>

        {/* Answer dropdown — only visible for True/False questions */}
        {q.type === "trueFalse" && (
          <select
            className="question-select answer-select"
            value={q.answer || ""}
            onChange={handleAnswerChange}
          >
            <option value="">— Select Answer —</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        )}

        {/* Delete button */}
        <button
          className="btn-delete"
          onClick={handleDelete}
          title="Delete this question"
        >
          ✕
        </button>
      </div>

      {/* ── Add child button (only when True/False → True) ── */}
      {showAddChild && (
        <button className="btn-add-child" onClick={handleAddChild}>
          + Add Sub-Question
        </button>
      )}

      {/* ── Render child questions recursively ── */}
      {q.children.map(function (child, index) {
        return (
          <Question
            key={child.id}
            q={child}
            label={buildLabel(label, index)}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onAddChild={onAddChild}
            depth={depth + 1}
          />
        );
      })}
    </div>
  );
}

export default Question;
