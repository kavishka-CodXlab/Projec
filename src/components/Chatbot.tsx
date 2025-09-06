import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { ConversationFlowService } from '../services/conversationFlow';

const Chatbot: React.FC = () => {
  const { chatbotOpen, setChatbotOpen, addMessage } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi — I'm Ruby, your portfolio assistant 👋 How can I help today?",
      isBot: true,
      timestamp: new Date(),
      quickReplies: [
        "Discuss a project",
        "Hiring / Job enquiry", 
        "Report a bug / Tech support",
        "General question",
        "Send my resume / Portfolio"
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
  }, [messages]);

  const handleQuickReply = (reply: string) => {
    // Don't set input value, just send the message directly
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

      // If conversation is complete, reset after a delay
      if (response.isComplete) {
        setTimeout(() => {
          conversationFlow.reset();
          setMessages([
            {
              id: '1',
              text: "Hi — I'm Ruby, your portfolio assistant 👋 How can I help today?",
              isBot: true,
              timestamp: new Date(),
              quickReplies: [
                "Discuss a project",
                "Hiring / Job enquiry", 
                "Report a bug / Tech support",
                "General question",
                "Send my resume / Portfolio"
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
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setChatbotOpen(!chatbotOpen)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            chatbotOpen
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-110'
          }`}
        >
          {chatbotOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white animate-pulse" />
          )}
        </button>
      </div>

      {/* Chatbot Window */}
      {chatbotOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 z-40 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Ruby</h3>
              <p className="text-blue-100 text-xs">Online now</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.isBot
                        ? 'bg-slate-800 text-gray-300'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.isBot && (
                        <Bot className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      {!message.isBot && (
                        <User className="w-4 h-4 text-blue-100 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Quick Replies */}
                {message.quickReplies && message.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-start">
                    {message.quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium border border-blue-600/30 hover:bg-blue-600/30 transition-colors duration-200"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 px-4 py-2 rounded-2xl flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-blue-400" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send"
                aria-label="Send"
                type="button"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;