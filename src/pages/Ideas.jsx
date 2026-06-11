import { useState, useEffect } from 'react';
import { Lightbulb, Plus, Trash2 } from 'lucide-react';
import './Ideas.css';

const Ideas = () => {
  const [ideas, setIdeas] = useState(() => {
    const saved = localStorage.getItem('plantDocIdeas');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('plantDocIdeas', JSON.stringify(ideas));
  }, [ideas]);

  const handleAddIdea = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const idea = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      date: new Date().toLocaleDateString()
    };

    setIdeas([idea, ...ideas]);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const deleteIdea = (id) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  return (
    <div className="ideas-container animate-fade-in">
      <div className="ideas-header">
        <h1 className="ideas-title">My <span className="text-gradient">Ideas & Notes</span></h1>
        <p className="ideas-subtitle">Save your personal observations, plant care tips, and reminders here.</p>
      </div>

      {!isAdding ? (
        <button className="btn btn-primary add-btn" onClick={() => setIsAdding(true)}>
          <Plus className="btn-icon" /> Add New Idea
        </button>
      ) : (
        <form className="add-idea-form glass-panel animate-fade-in" onSubmit={handleAddIdea}>
          <h2>New Observation</h2>
          <input 
            type="text" 
            placeholder="Title (e.g., Pruning Tomato Plants)" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <textarea 
            placeholder="Write your notes here..." 
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows="4"
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Idea</button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="ideas-grid">
        {ideas.length === 0 && !isAdding && (
          <div className="empty-state">
            <Lightbulb className="empty-icon" />
            <p>You haven't added any ideas yet.</p>
          </div>
        )}
        {ideas.map(idea => (
          <div key={idea.id} className="idea-card glass-panel">
            <div className="idea-card-header">
              <h3>{idea.title}</h3>
              <button className="delete-btn" onClick={() => deleteIdea(idea.id)}>
                <Trash2 size={18} />
              </button>
            </div>
            <p className="idea-date">{idea.date}</p>
            <p className="idea-content">{idea.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ideas;
