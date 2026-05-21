import { useState, useCallback } from "react";

const initialCards = [
  { id: 1, question: "What is the powerhouse of the cell?", answer: "The mitochondria — it produces ATP through cellular respiration, supplying energy to the cell." },
  { id: 2, question: "What is Newton's Second Law of Motion?", answer: "Force equals mass times acceleration (F = ma). The acceleration of an object is directly proportional to the net force acting on it." },
  { id: 3, question: "What year did World War II end?", answer: "1945 — Germany surrendered on May 8 (V-E Day) and Japan surrendered on September 2 (V-J Day)." },
  { id: 4, question: "What is the Pythagorean Theorem?", answer: "In a right triangle: a² + b² = c², where c is the hypotenuse and a, b are the other two sides." },
  { id: 5, question: "Who wrote 'Pride and Prejudice'?", answer: "Jane Austen, published in 1813. The novel follows Elizabeth Bennet as she navigates love, class, and marriage." },
];

let nextId = 6;

const CardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function FlashcardApp() {
  const [cards, setCards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [view, setView] = useState("study"); // "study" | "manage"
  const [modal, setModal] = useState(null); // null | { mode: "add" | "edit", card? }
  const [form, setForm] = useState({ question: "", answer: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [animDir, setAnimDir] = useState(null);

  const currentCard = cards[currentIndex];

  const navigate = useCallback((dir) => {
    setAnimDir(dir);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(i => dir === "next"
        ? (i + 1) % cards.length
        : (i - 1 + cards.length) % cards.length
      );
      setAnimDir(null);
    }, 180);
  }, [cards.length]);

  const openAdd = () => {
    setForm({ question: "", answer: "" });
    setModal({ mode: "add" });
  };

  const openEdit = (card) => {
    setForm({ question: card.question, answer: card.answer });
    setModal({ mode: "edit", card });
  };

  const closeModal = () => setModal(null);

  const saveCard = () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    if (modal.mode === "add") {
      setCards(c => [...c, { id: nextId++, question: form.question.trim(), answer: form.answer.trim() }]);
      setCurrentIndex(cards.length);
    } else {
      setCards(c => c.map(card => card.id === modal.card.id
        ? { ...card, question: form.question.trim(), answer: form.answer.trim() }
        : card
      ));
    }
    setIsFlipped(false);
    closeModal();
  };

  const deleteCard = (id) => {
    const idx = cards.findIndex(c => c.id === id);
    setCards(c => c.filter(card => card.id !== id));
    setCurrentIndex(i => Math.min(i, cards.length - 2));
    setIsFlipped(false);
    setDeleteConfirm(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0e0e10",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#f0ece4",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #0e0e10; }

        .app-font { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Playfair Display', Georgia, serif; }

        .card-container {
          perspective: 1200px;
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 300px;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
          cursor: pointer;
        }

        .card-inner.flipped { transform: rotateY(180deg); }

        .card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px 40px;
          text-align: center;
        }

        .card-front {
          background: linear-gradient(145deg, #1a1a1f, #141418);
          border: 1px solid #2e2e38;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .card-back {
          background: linear-gradient(145deg, #1a1e24, #141820);
          border: 1px solid #1e3040;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(80,160,255,0.06);
          transform: rotateY(180deg);
        }

        .slide-out-left { animation: slideOutLeft 0.18s ease forwards; }
        .slide-out-right { animation: slideOutRight 0.18s ease forwards; }

        @keyframes slideOutLeft {
          to { transform: translateX(-30px); opacity: 0; }
        }
        @keyframes slideOutRight {
          to { transform: translateX(30px); opacity: 0; }
        }

        .nav-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid #2e2e38;
          background: #1a1a1f;
          color: #f0ece4;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .nav-btn:hover:not(:disabled) {
          background: #25252c;
          border-color: #4a4a58;
          transform: scale(1.06);
        }
        .nav-btn:disabled { opacity: 0.25; cursor: not-allowed; }

        .show-btn {
          margin-top: 20px;
          padding: 10px 28px;
          border-radius: 100px;
          border: 1px solid #c4a96e;
          background: transparent;
          color: #c4a96e;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .show-btn:hover {
          background: #c4a96e;
          color: #0e0e10;
        }

        .tab-btn {
          padding: 8px 22px;
          border-radius: 100px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.03em;
        }
        .tab-active {
          background: #f0ece4;
          color: #0e0e10;
        }
        .tab-inactive {
          background: transparent;
          color: #7a7a8c;
          border: 1px solid #2e2e38;
        }
        .tab-inactive:hover { color: #f0ece4; border-color: #4a4a58; }

        .manage-card {
          background: #141418;
          border: 1px solid #2e2e38;
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          transition: border-color 0.2s;
        }
        .manage-card:hover { border-color: #3e3e50; }

        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #2e2e38;
          background: transparent;
          color: #7a7a8c;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .icon-btn:hover { background: #1e1e28; color: #f0ece4; border-color: #4a4a58; }
        .icon-btn.danger:hover { background: #2a1018; color: #e06060; border-color: #6a2030; }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 10px;
          border: 1px dashed #3e3e50;
          background: transparent;
          color: #7a7a8c;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          justify-content: center;
        }
        .add-btn:hover { border-color: #c4a96e; color: #c4a96e; background: rgba(196,169,110,0.04); }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 24px;
          backdrop-filter: blur(4px);
        }

        .modal-box {
          background: #17171c;
          border: 1px solid #2e2e38;
          border-radius: 16px;
          padding: 32px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
        }

        .modal-input {
          width: 100%;
          background: #0e0e10;
          border: 1px solid #2e2e38;
          border-radius: 10px;
          padding: 12px 16px;
          color: #f0ece4;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
          min-height: 70px;
        }
        .modal-input:focus { border-color: #c4a96e; }
        .modal-input::placeholder { color: #4a4a58; }

        .save-btn {
          padding: 11px 28px;
          border-radius: 10px;
          border: none;
          background: #c4a96e;
          color: #0e0e10;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .save-btn:hover { background: #d4b97e; transform: translateY(-1px); }
        .save-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .cancel-btn {
          padding: 11px 22px;
          border-radius: 10px;
          border: 1px solid #2e2e38;
          background: transparent;
          color: #7a7a8c;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cancel-btn:hover { border-color: #4a4a58; color: #f0ece4; }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2e2e38;
          transition: all 0.2s;
        }
        .dot.active { background: #c4a96e; transform: scale(1.3); }

        .label-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #5a5a70;
          margin-bottom: 8px;
        }

        .confirm-box {
          background: #17171c;
          border: 1px solid #6a2030;
          border-radius: 14px;
          padding: 28px;
          width: 100%;
          max-width: 380px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
          text-align: center;
        }

        .delete-btn {
          padding: 11px 24px;
          border-radius: 10px;
          border: none;
          background: #c04040;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .delete-btn:hover { background: #d05050; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2e2e38; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <header style={{
        padding: "28px 32px 20px",
        borderBottom: "1px solid #1e1e28",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38,
            borderRadius: 10,
            background: "linear-gradient(135deg, #c4a96e, #8a6e3a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#0e0e10",
          }}>
            <CardIcon />
          </div>
          <div>
            <h1 className="display-font" style={{ fontSize: 20, fontWeight: 600, color: "#f0ece4", lineHeight: 1.1 }}>
              Flashcards
            </h1>
            <p className="app-font" style={{ fontSize: 11, color: "#5a5a70", letterSpacing: "0.05em" }}>
              {cards.length} {cards.length === 1 ? "card" : "cards"} in deck
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className={`tab-btn ${view === "study" ? "tab-active" : "tab-inactive"}`} onClick={() => setView("study")}>
            Study
          </button>
          <button className={`tab-btn ${view === "manage" ? "tab-active" : "tab-inactive"}`} onClick={() => setView("manage")}>
            Manage
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: "40px 24px 60px", maxWidth: 720, width: "100%", margin: "0 auto" }}>

        {/* STUDY VIEW */}
        {view === "study" && (
          <div>
            {cards.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p className="display-font" style={{ fontSize: 22, color: "#3e3e50", marginBottom: 12 }}>No cards yet</p>
                <p className="app-font" style={{ fontSize: 14, color: "#4a4a58", marginBottom: 24 }}>Add some flashcards to get started.</p>
                <button className="save-btn" onClick={() => { setView("manage"); openAdd(); }}>
                  Add a Card
                </button>
              </div>
            ) : (
              <>
                {/* Progress */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <p className="app-font" style={{ fontSize: 12, color: "#5a5a70", letterSpacing: "0.08em", marginBottom: 14 }}>
                    CARD <span style={{ color: "#c4a96e" }}>{currentIndex + 1}</span> OF {cards.length}
                  </p>
                  <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
                    {cards.map((_, i) => (
                      <div
                        key={i}
                        className={`dot ${i === currentIndex ? "active" : ""}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => { setCurrentIndex(i); setIsFlipped(false); }}
                      />
                    ))}
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`card-container ${animDir === "next" ? "slide-out-left" : animDir === "prev" ? "slide-out-right" : ""}`}
                  style={{ marginBottom: 28 }}
                >
                  <div
                    className={`card-inner ${isFlipped ? "flipped" : ""}`}
                    onClick={() => setIsFlipped(f => !f)}
                  >
                    {/* Front */}
                    <div className="card-face card-front">
                      <p className="label-text">Question</p>
                      <p className="display-font" style={{
                        fontSize: currentCard.question.length > 80 ? 17 : 21,
                        lineHeight: 1.55,
                        color: "#f0ece4",
                        maxWidth: 480,
                      }}>
                        {currentCard.question}
                      </p>
                      {!isFlipped && (
                        <button
                          className="show-btn"
                          onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                        >
                          Show Answer
                        </button>
                      )}
                    </div>

                    {/* Back */}
                    <div className="card-face card-back">
                      <p className="label-text" style={{ color: "#4a90d9" }}>Answer</p>
                      <p className="app-font" style={{
                        fontSize: currentCard.answer.length > 100 ? 14 : 16,
                        lineHeight: 1.7,
                        color: "#d0e8f0",
                        maxWidth: 480,
                      }}>
                        {currentCard.answer}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="app-font" style={{ textAlign: "center", fontSize: 11, color: "#3e3e50", marginBottom: 28, letterSpacing: "0.05em" }}>
                  CLICK CARD TO FLIP
                </p>

                {/* Navigation */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                  <button className="nav-btn" onClick={() => navigate("prev")} disabled={cards.length <= 1}>
                    <ChevronLeft />
                  </button>
                  <button
                    className="app-font"
                    style={{
                      padding: "10px 24px",
                      borderRadius: 100,
                      border: "1px solid #2e2e38",
                      background: "transparent",
                      color: "#7a7a8c",
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      letterSpacing: "0.04em",
                    }}
                    onClick={() => { setIsFlipped(false); setCurrentIndex(Math.floor(Math.random() * cards.length)); }}
                  >
                    Shuffle
                  </button>
                  <button className="nav-btn" onClick={() => navigate("next")} disabled={cards.length <= 1}>
                    <ChevronRight />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* MANAGE VIEW */}
        {view === "manage" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 className="display-font" style={{ fontSize: 22, fontStyle: "italic", color: "#a09080" }}>
                All Cards
              </h2>
              <button
                className="save-btn"
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px" }}
                onClick={openAdd}
              >
                <PlusIcon /> New Card
              </button>
            </div>

            {cards.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <p className="app-font" style={{ color: "#4a4a58", marginBottom: 20 }}>No flashcards yet. Create your first one!</p>
                <button className="add-btn" style={{ maxWidth: 240, margin: "0 auto" }} onClick={openAdd}>
                  <PlusIcon /> Add First Card
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {cards.map((card, i) => (
                  <div key={card.id} className="manage-card">
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: "#1e1e28", border: "1px solid #2e2e38",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span className="app-font" style={{ fontSize: 11, color: "#5a5a70" }}>{i + 1}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="display-font" style={{
                        fontSize: 14, color: "#f0ece4", marginBottom: 4,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {card.question}
                      </p>
                      <p className="app-font" style={{
                        fontSize: 12, color: "#5a5a70", lineHeight: 1.4,
                        overflow: "hidden", display: "-webkit-box",
                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      }}>
                        {card.answer}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="icon-btn"
                        title="Study this card"
                        onClick={() => { setCurrentIndex(i); setIsFlipped(false); setView("study"); }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </button>
                      <button className="icon-btn" title="Edit" onClick={() => openEdit(card)}>
                        <EditIcon />
                      </button>
                      <button className="icon-btn danger" title="Delete" onClick={() => setDeleteConfirm(card.id)}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}

                <button className="add-btn" onClick={openAdd} style={{ marginTop: 4 }}>
                  <PlusIcon /> Add Another Card
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 className="display-font" style={{ fontSize: 20, fontWeight: 600 }}>
                {modal.mode === "add" ? "Add New Card" : "Edit Card"}
              </h2>
              <button className="icon-btn" onClick={closeModal}><CloseIcon /></button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p className="label-text">Question</p>
              <textarea
                className="modal-input"
                placeholder="Enter your question..."
                value={form.question}
                onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                rows={3}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <p className="label-text">Answer</p>
              <textarea
                className="modal-input"
                placeholder="Enter the answer..."
                value={form.answer}
                onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                rows={4}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button
                className="save-btn"
                onClick={saveCard}
                disabled={!form.question.trim() || !form.answer.trim()}
              >
                {modal.mode === "add" ? "Add Card" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "#2a1018", border: "1px solid #6a2030",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              color: "#e06060",
            }}>
              <TrashIcon />
            </div>
            <h3 className="display-font" style={{ fontSize: 18, marginBottom: 8 }}>Delete Card?</h3>
            <p className="app-font" style={{ fontSize: 13, color: "#7a7a8c", marginBottom: 24, lineHeight: 1.6 }}>
              This flashcard will be permanently removed from your deck.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="cancel-btn" onClick={() => setDeleteConfirm(null)}>Keep it</button>
              <button className="delete-btn" onClick={() => deleteCard(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
