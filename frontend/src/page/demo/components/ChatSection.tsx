import { useState, useRef, useEffect, useCallback } from 'react';
import '../../home/components/Background.css';

// ── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  responseId?: string;
  reply?: string;
}

// ── Constants ────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE ?? import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
const LANG = 'th';
const USER_ID = 'demo-user';
const TIME_FORMATTER = new Intl.DateTimeFormat('th-TH', {
  hour: '2-digit',
  minute: '2-digit',
});

const ERROR_MESSAGES = {
  network: 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
  generic: 'ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
} as const;

// ── Helpers ──────────────────────────────────────────────────────────────────
const createMessage = (
  role: Message['role'],
  content: string,
  id?: string,
): Message => ({
  id: id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  role,
  content,
  timestamp: new Date(),
});

const formatTime = (date: Date) => TIME_FORMATTER.format(date);


// ── Sub-components ───────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div style={{ background: '#1a1a2e', borderRadius: 16, padding: '10px 16px' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 150, 300].map((delay) => (
          <div
            key={delay}
            className="animate-bounce"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#6b7280',
              animationDelay: `${delay}ms`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: '75%',
          borderRadius: 18,
          padding: '10px 16px',
          background: isUser
            ? 'linear-gradient(135deg,#7c3aed,#3b82f6)'
            : '#1a1a2e',
          color: '#f3f4f6',
        }}
      >
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{message.content}</p>
        <p
          style={{
            fontSize: 11,
            marginTop: 4,
            marginBottom: 0,
            color: isUser ? 'rgba(255,255,255,0.55)' : '#6b7280',
          }}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

// ── Send Icon ────────────────────────────────────────────────────────────────
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M17 10L3 3l3.5 7L3 17l14-7z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// ── Main Component ───────────────────────────────────────────────────────────
const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const previousResponseIdRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      setMessages((prev) => [...prev, createMessage('user', trimmed)]);
      setInputMessage('');
      setIsLoading(true);

      try {
        const res = await fetch(`${API_BASE}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: USER_ID,
            message: trimmed,
            questionId: '',
            lang: LANG,
            previousResponseId: previousResponseIdRef.current,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ChatResponse = await res.json();
        if (data.responseId) previousResponseIdRef.current = data.responseId;
        setMessages((prev) => [
          ...prev,
          createMessage('assistant', data.reply ?? ERROR_MESSAGES.generic, data.responseId),
        ]);
      } catch (err) {
        console.error('Chat error:', err);
        setMessages((prev) => [...prev, createMessage('assistant', ERROR_MESSAGES.network)]);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [isLoading],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(inputMessage);
    },
    [inputMessage, sendMessage],
  );

  const isFirstMessage = messages.length === 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#000',
        position: 'relative',
      }}
    >
      {/* ── Messages / Empty State ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {isFirstMessage ? (
          /* ── Empty / Welcome State ── */
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 28,
              userSelect: 'none',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 120,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div className="BigCircle" style={{ width: 120, height: 120 }} />
              <div className="SmallCircle" style={{ width: 90, height: 90 }} />
            </div>
            <h1
              style={{
                color: '#fff',
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                fontWeight: 600,
                textAlign: 'center',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              How can Cura help you today?
            </h1>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ── Input Bar ── */}
      <div style={{ padding: '0 24px 24px' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12,
            padding: '4px 4px 4px 20px',
            gap: 8,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your command here..."
            disabled={isLoading}
            autoComplete="off"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f3f4f6',
              fontSize: 15,
              padding: '10px 0',
              caretColor: '#7c3aed',
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: 'none',
              background:
                isLoading || !inputMessage.trim()
                  ? 'transparent'
                  : 'linear-gradient(135deg,#7c3aed,#3b82f6)',
              color: isLoading || !inputMessage.trim() ? '#4b5563' : '#fff',
              cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.25s, color 0.25s',
            }}
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSection;
