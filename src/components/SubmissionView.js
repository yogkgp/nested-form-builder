import React from "react";
import { buildLabel } from "../utils/helpers";

// Renders a single question row in the preview 
function PreviewQuestion(props) {
  var q = props.q;
  var label = props.label;

  var typeLabel = "";
  if (q.type === "short") {
    typeLabel = "Short Answer";
  } else {
    typeLabel = "True / False" + (q.answer ? " → " + q.answer : "");
  }

  return (
    <div style={{ marginBottom: 12 }}>
      {/* ── Question row ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "baseline",
          flexWrap: "wrap",
        }}
      >
        <span className="preview-label">{label}</span>
        <span className="preview-text">
          {q.text ? (
            q.text
          ) : (
            <em style={{ opacity: 0.45 }}>No question text entered</em>
          )}
        </span>
        <span className="preview-badge">{typeLabel}</span>
      </div>

      {/* ── Render children recursively ── */}
      {q.children.length > 0 && (
        <div
          style={{
            marginLeft: 28,
            marginTop: 8,
            borderLeft: "2px solid var(--border)",
            paddingLeft: 12,
          }}
        >
          {q.children.map(function (child, index) {
            return (
              <PreviewQuestion
                key={child.id}
                q={child}
                label={buildLabel(label, index)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// Full Submission View
function SubmissionView(props) {
  var questions = props.questions;
  var onBack = props.onBack;

  return (
    <div className="submission-view">
      <h2 className="section-title">📋 Submitted Form Preview</h2>

      <div className="preview-list">
        {questions.length === 0 ? (
          <p style={{ opacity: 0.5, fontStyle: "italic" }}>
            No questions were added before submitting.
          </p>
        ) : (
          questions.map(function (q, index) {
            return (
              <PreviewQuestion key={q.id} q={q} label={"Q" + (index + 1)} />
            );
          })
        )}
      </div>

      <button className="btn-back" onClick={onBack}>
        ← Back to Edit
      </button>
    </div>
  );
}

export default SubmissionView;
