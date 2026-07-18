import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import '@flaticon/flaticon-uicons/css/thin/rounded.css';
import '../assets/styles/ChatWidget.css';
import { knowledgeBase, findTopic, FALLBACK_ANSWER, type KnowledgeTopic } from '../data/hassyKnowledge';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Salut 👋 Envie d'en savoir plus sur Hassy ? Posez votre question, ou choisissez un sujet ci-dessous." }
  ]);
  const [askedTopicIds, setAskedTopicIds] = useState<Set<string>>(new Set());
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const remainingTopics = knowledgeBase.filter((topic) => !askedTopicIds.has(topic.id));

  const askTopic = (topic: KnowledgeTopic) => {
    setMessages((prev) => [...prev, { role: 'user', content: topic.label }, { role: 'assistant', content: topic.answer }]);
    setAskedTopicIds((prev) => new Set(prev).add(topic.id));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const topic = findTopic(trimmed);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: trimmed },
      { role: 'assistant', content: topic ? topic.answer : FALLBACK_ANSWER },
    ]);
    if (topic) {
      setAskedTopicIds((prev) => new Set(prev).add(topic.id));
    }
    setInput('');
  };

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <span className="chat-title">// interview_bot</span>
            <button className="chat-close" onClick={() => setIsOpen(false)} aria-label="Fermer le chat">
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble chat-bubble-${m.role}`}>
                {m.content}
              </div>
            ))}

            {remainingTopics.length > 0 && (
              <div className="chat-quick-replies">
                {remainingTopics.map((topic) => (
                  <button key={topic.id} className="chat-chip" onClick={() => askTopic(topic)}>
                    {topic.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-row" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ou posez votre question..."
            />
            <button type="submit" disabled={!input.trim()} aria-label="Envoyer">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        className="chat-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
      >
        {isOpen ? <X size={24} /> : <i className="fi fi-tr-user-robot chat-toggle-icon" aria-hidden="true" />}
      </button>
    </div>
  );
};

export default ChatWidget;
