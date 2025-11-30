import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { ConversationFlowService } from '../services/conversationFlow';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot: React.FC = () => {
  const { chatbotOpen, setChatbotOpen, addMessage } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "System Online. I'm Ruby, your AI assistant. 🤖 How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
      quickReplies: [
        "Discuss a project",
        "Hiring / Job enquiry",
        "Report a bug",
        "View Resume"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationFlow] = useState(() => new ConversationFlowService(addMessage));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, chatbotOpen]);

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue;
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = conversationFlow.processUserInput(text);

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isBot: true,
        timestamp: new Date(),
        quickReplies: response.quickReplies
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      if (response.isComplete) {
        setTimeout(() => {
          conversationFlow.reset();
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              text: "Session reset. Ready for new queries.",
              isBot: true,
              timestamp: new Date(),
              quickReplies: [
                "Discuss a project",
                "Hiring / Job enquiry",
                "Report a bug",
                "View Resume"
              ]
            }
          ]);
        }, 3000);
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {/* Chatbot Toggle Button - Holographic Orb */}
        <motion.div
          className="fixed bottom-6 right-6 z-[100]"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button
            onClick={() => setChatbotOpen(!chatbotOpen)}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${chatbotOpen
              ? 'bg-red-500/20 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
              : 'bg-black/40 border border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.4)] backdrop-blur-md'
              }`}
          >
            {/* Orb Core */}
            <div className={`absolute inset-0 rounded-full opacity-50 ${chatbotOpen ? 'bg-red-500 blur-md' : 'bg-cyan-400 blur-md animate-pulse'}`}></div>

            {/* Icon */}
            <div className="relative z-10">
              {chatbotOpen ? (
                <X className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              ) : (
                <Bot className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              )}
            </div>

            {/* Orbiting Ring */}
            {!chatbotOpen && (
              <div className="absolute inset-[-4px] rounded-full border border-cyan-400/30 border-t-transparent animate-spin duration-3000"></div>
            )}
          </button>
        </motion.div>

        {/* Chatbot Window */}
        {chatbotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-[350px] h-[500px] max-h-[70vh] md:max-h-[80vh] bg-dark/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[90] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-4 border-b border-white/10 bg-white/5 overflow-hidden flex justify-between items-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-dark flex items-center justify-center">
                    <Bot className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
                    RUBY <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">AI</span>
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-gray-400 text-xs">Systems Online</p>
                  </div>
                </div>
              </div>

              {/* Mobile Close Button */}
              <button
                onClick={() => setChatbotOpen(false)}
                className="md:hidden relative z-10 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Decorative background glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.isBot ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] ${message.isBot ? 'mr-auto' : 'ml-auto'}`}>
                    <div
                      className={`p-3.5 rounded-2xl relative ${message.isBot
                        ? 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                        }`}
                    >
                      {/* Bot Icon for Bot Messages */}
                      {message.isBot && (
                        <div className="absolute -top-6 -left-2 w-6 h-6 bg-dark border border-white/10 rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-cyan-400" />
                        </div>
                      )}

                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <span className="text-[10px] opacity-50 mt-1 block text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Quick Replies */}
                    {message.quickReplies && message.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.quickReplies.map((reply, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleQuickReply(reply)}
                            className="px-3 py-1.5 bg-cyan-400/10 text-cyan-400 rounded-lg text-xs font-medium border border-cyan-400/20 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 flex items-center gap-1.5 group"
                          >
                            <Sparkles className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            {reply}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md pb-safe">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300 pr-12"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 p-2 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-cyan-400/20 transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-gray-600 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" /> Powered by Innovative AI
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;