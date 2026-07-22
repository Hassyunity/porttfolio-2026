import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Volume2, VolumeX } from 'lucide-react';
import '../assets/styles/ChatWidget.css';
import { knowledgeBase, findTopic, FALLBACK_ANSWER, type KnowledgeTopic } from '../data/hassyKnowledge';
import { speak, stopSpeaking, isSpeechSupported } from '../lib/speech';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Bonjour 👋 Je suis Altea, l'assistant de Hassy. Envie d'en savoir plus sur son parcours ? Posez votre question, ou choisissez un sujet ci-dessous." }
  ]);
  const [askedTopicIds, setAskedTopicIds] = useState<Set<string>>(new Set());
  const [input, setInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Lit à voix haute (voix féminine) le dernier message d'Altea, si activé
  useEffect(() => {
    if (!voiceEnabled) return;
    const last = messages[messages.length - 1];
    if (last?.role === 'assistant') {
      speak(last.content);
    }
  }, [messages, voiceEnabled]);

  // Coupe la voix si le chat se ferme, ou au démontage du composant
  useEffect(() => {
    if (!isOpen) stopSpeaking();
  }, [isOpen]);

  useEffect(() => () => stopSpeaking(), []);

  const toggleVoice = () => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      if (!next) stopSpeaking();
      return next;
    });
  };

  // Bulle de salutation qui apparaît automatiquement, puis se referme si ignorée
  useEffect(() => {
    const showTimer = window.setTimeout(() => setShowGreeting(true), 1500);
    const hideTimer = window.setTimeout(() => setShowGreeting(false), 10000);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    setShowGreeting(false);
  };

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
            <span className="chat-title">// altea_chat</span>
            <div className="chat-header-actions">
              {isSpeechSupported() && (
                <button
                  className="chat-voice-toggle"
                  onClick={toggleVoice}
                  aria-pressed={voiceEnabled}
                  aria-label={voiceEnabled ? 'Désactiver la lecture audio' : 'Écouter les réponses à voix haute'}
                  title={voiceEnabled ? 'Désactiver la voix' : 'Écouter les réponses'}
                >
                  {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              )}
              <button className="chat-close" onClick={() => setIsOpen(false)} aria-label="Fermer le chat">
                <X size={18} />
              </button>
            </div>
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

      {!isOpen && showGreeting && (
        <div className="chat-greeting" onClick={toggleChat} role="button" tabIndex={0}>
          <button
            className="chat-greeting-close"
            onClick={(e) => { e.stopPropagation(); setShowGreeting(false); }}
            aria-label="Ignorer"
          >
            <X size={12} />
          </button>
          <div className="chat-greeting-body">
            <span className="chat-greeting-avatar">
              <img src="/back.jpg" alt="" />
            </span>
            <p>👋 Salut, je suis <strong>Altea</strong> ! Une question sur le parcours de Hassy ?</p>
          </div>
        </div>
      )}

      <button
        className={`chat-toggle ${isOpen ? 'chat-toggle-open' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat avec Altea'}
      >
        {isOpen ? <X size={24} /> : <img src="/back.jpg" alt="" className="chat-toggle-avatar" />}
      </button>
    </div>
  );
};

export default ChatWidget;
