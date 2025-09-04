import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useApp } from '../context/AppContext';


interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const { chatbotOpen, setChatbotOpen } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm here to help you. Feel free to ask me anything!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
      return "I've worked on several exciting projects including an e-commerce platform, task management app, and weather analytics dashboard. You can check them out in the Projects section!";
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
      return "I specialize in JavaScript, TypeScript, React, Node.js, Python, and Java. I'm also experienced with databases like SQL and MongoDB. Check out my Skills section for more details!";
    } else if (lowerMessage.includes('education') || lowerMessage.includes('study')) {
      return "I'm currently pursuing a Bachelor of Science in Computer Science at the University of Bedfordshire. It's been an amazing journey learning about modern technology!";
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
      return "You can reach me at tkavishka101@gmail.com or through any of my social media links. I'm always happy to connect and discuss new opportunities!";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! Nice to meet you! I'm excited to share my portfolio with you. What would you like to know about my work or experience?";
    } else if (lowerMessage.includes('experience')) {
      return "As a Computer Science student, I've gained experience through various projects and coursework. I'm passionate about full-stack development and always eager to learn new technologies!";
    } else {
      return "That's a great question! While I can help with general information about my portfolio, skills, projects, and education, you might want to reach out directly for more specific inquiries. Is there anything specific about my work you'd like to know?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
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
              <div
                key={message.id}
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
                onClick={handleSendMessage}
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