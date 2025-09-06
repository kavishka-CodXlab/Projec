import { Intent, ConversationState, ChatMessage } from '../types';

export const intents: Intent[] = [
  {
    name: "greeting",
    training_phrases: [
      "Hi", "Hello", "Hey there", "Good morning", "Good evening"
    ],
    responses: [
      "Hi — I'm Ruby, your portfolio assistant 👋 How can I help today?",
      "Hello! I can help with projects, hiring, support, or general questions."
    ],
    quick_replies: [
      "Discuss a project",
      "Hiring / Job enquiry",
      "Report a bug / Tech support",
      "General question",
      "Send my resume / Portfolio"
    ]
  },
  {
    name: "project_inquiry",
    training_phrases: [
      "I want to discuss a project",
      "I need help with a website",
      "Looking for an AI app",
      "I want to build something"
    ],
    responses: [
      "Great — what kind of project are you thinking about?"
    ],
    slots: [
      { name: "project_type", prompt: "Please choose a type:", type: "string", options: ["Website", "Mobile app", "Backend/API", "AI/ML", "Other"], required: true },
      { name: "timeline", prompt: "What's the timeline?", type: "string", options: ["ASAP", "1–4 weeks", "1–3 months", "Flexible"], required: true },
      { name: "budget", prompt: "Do you have a budget range?", type: "string", options: ["<$1k", "$1k–$5k", ">$5k", "Prefer not to say"], required: true },
      { name: "summary", prompt: "Give a 1–2 sentence summary of the project.", type: "string", required: true },
      { name: "contact_email", prompt: "What's the best email to reach you?", type: "email", required: true }
    ],
    confirmation: "Thanks — here's what I'll send to Kavishka: {summary}. Shall I send it?",
    final_response: "Message sent ✅ Expect a reply within 1–2 business days."
  },
  {
    name: "hiring_inquiry",
    training_phrases: [
      "I want to hire",
      "Looking for an intern",
      "Job opportunity",
      "Hiring inquiry"
    ],
    responses: [
      "Awesome — which role is this about?"
    ],
    slots: [
      { name: "role", prompt: "Role title?", type: "string", required: true },
      { name: "cv_link", prompt: "Upload your CV or paste LinkedIn/GitHub link.", type: "url", required: true },
      { name: "availability", prompt: "When are you available to start?", type: "string", required: true },
      { name: "pitch", prompt: "One-line pitch or message to Kavishka.", type: "string", required: true },
      { name: "contact_email", prompt: "Best contact email?", type: "email", required: true }
    ],
    confirmation: "Thanks — ready to send your hiring message?",
    final_response: "Sent ✅ Kavishka will review and respond soon."
  },
  {
    name: "support_inquiry",
    training_phrases: [
      "I found a bug",
      "Something is broken",
      "I need tech support",
      "App crashed"
    ],
    responses: [
      "Sorry you hit a bug — let's fix this. Which device are you using?"
    ],
    slots: [
      { name: "device", prompt: "Device?", type: "string", options: ["Desktop", "Mobile", "Tablet"], required: true },
      { name: "page_url", prompt: "Which page / URL?", type: "url", required: true },
      { name: "steps", prompt: "Steps to reproduce?", type: "string", required: true },
      { name: "screenshot", prompt: "Attach a screenshot?", type: "file", required: false }
    ],
    confirmation: "Thanks — forward this to Kavishka?",
    final_response: "Bug report sent 🐞 You'll get a follow-up soon."
  },
  {
    name: "general_question",
    training_phrases: [
      "I have a question",
      "Can I ask something?",
      "General info",
      "I want to know more"
    ],
    responses: [
      "Sure — what would you like to ask?"
    ],
    slots: [
      { name: "question_text", prompt: "Please type your question.", type: "string", required: true },
      { name: "contact_email", prompt: "Where should I send the reply?", type: "email", required: true }
    ],
    confirmation: "Send this question to Kavishka?",
    final_response: "Your question has been sent 📩"
  },
  {
    name: "resume_submission",
    training_phrases: [
      "I want to send my resume",
      "Here's my CV",
      "Upload portfolio",
      "Send resume"
    ],
    responses: [
      "Upload your resume or paste a portfolio link."
    ],
    slots: [
      { name: "resume_link", prompt: "Upload or paste link.", type: "url", required: true },
      { name: "contact_email", prompt: "Best email for follow-up?", type: "email", required: true }
    ],
    confirmation: "Ready to send your resume?",
    final_response: "Resume sent 📑 Kavishka will review it soon."
  },
  {
    name: "fallback",
    training_phrases: [],
    responses: [
      "Sorry — I didn't understand that. Do you want to: Discuss a project, Hiring inquiry, Report a bug, General question, or Talk to human?"
    ]
  }
];

export class ConversationFlowService {
  private state: ConversationState;
  private addMessage?: (message: any) => void;

  constructor(addMessage?: (message: any) => void) {
    this.state = {
      currentIntent: null,
      collectedSlots: {},
      isWaitingForSlot: false,
      currentSlot: null,
      isConfirming: false,
      conversationHistory: []
    };
    this.addMessage = addMessage;
  }

  // Intent recognition using simple keyword matching
  recognizeIntent(message: string): string {
    const lowerMessage = message.toLowerCase().trim();
    
    // Check for exact quick reply matches first
    if (lowerMessage === 'discuss a project' || lowerMessage.includes('discuss a project')) {
      return 'project_inquiry';
    }
    if (lowerMessage === 'hiring / job enquiry' || lowerMessage.includes('hiring') || lowerMessage.includes('job enquiry')) {
      return 'hiring_inquiry';
    }
    if (lowerMessage === 'report a bug / tech support' || lowerMessage.includes('report a bug') || lowerMessage.includes('tech support')) {
      return 'support_inquiry';
    }
    if (lowerMessage === 'general question' || lowerMessage.includes('general question')) {
      return 'general_question';
    }
    if (lowerMessage === 'send my resume / portfolio' || lowerMessage.includes('send my resume') || lowerMessage.includes('portfolio')) {
      return 'resume_submission';
    }
    
    // Check for partial matches
    if (lowerMessage.includes('project') && !lowerMessage.includes('discuss')) {
      return 'project_inquiry';
    }
    
    // Check training phrases
    for (const intent of intents) {
      for (const phrase of intent.training_phrases) {
        if (lowerMessage.includes(phrase.toLowerCase())) {
          return intent.name;
        }
      }
    }
    
    return 'fallback';
  }

  // Get response for an intent
  getIntentResponse(intentName: string): string {
    const intent = intents.find(i => i.name === intentName);
    if (!intent) return "I'm not sure how to help with that.";
    
    const randomResponse = intent.responses[Math.floor(Math.random() * intent.responses.length)];
    return randomResponse;
  }

  // Get quick replies for an intent
  getQuickReplies(intentName: string): string[] {
    const intent = intents.find(i => i.name === intentName);
    return intent?.quick_replies || [];
  }

  // Start a new conversation flow
  startConversation(intentName: string): { response: string; quickReplies?: string[] } {
    this.state.currentIntent = intentName;
    this.state.collectedSlots = {};
    this.state.isWaitingForSlot = false;
    this.state.currentSlot = null;
    this.state.isConfirming = false;

    const intent = intents.find(i => i.name === intentName);
    if (!intent) {
      return { response: "I'm not sure how to help with that." };
    }

    const response = this.getIntentResponse(intentName);
    const quickReplies = this.getQuickReplies(intentName);

    // If intent has slots, start collecting them
    if (intent.slots && intent.slots.length > 0) {
      this.state.isWaitingForSlot = true;
      this.state.currentSlot = intent.slots[0].name;
    }

    return { response, quickReplies };
  }

  // Process user input during conversation
  processUserInput(message: string): { response: string; quickReplies?: string[]; isComplete?: boolean } {
    console.log('Processing message:', message);
    console.log('Current state:', this.state);
    
    // If we're in confirmation mode
    if (this.state.isConfirming) {
      if (message.toLowerCase().includes('yes') || message.toLowerCase().includes('send')) {
        return this.completeConversation();
      } else {
        this.state.isConfirming = false;
        return { response: "No problem! What would you like to do instead?" };
      }
    }

    // If we're collecting slots
    if (this.state.isWaitingForSlot && this.state.currentSlot) {
      return this.collectSlot(message);
    }

    // If we're not in a conversation, try to recognize intent
    const intentName = this.recognizeIntent(message);
    console.log('Recognized intent:', intentName);
    
    // If we recognized a valid intent (not fallback), start the conversation
    if (intentName !== 'fallback') {
      return this.startConversation(intentName);
    }
    
    // If it's a fallback, show the fallback response with quick replies
    const fallbackIntent = intents.find(i => i.name === 'fallback');
    if (fallbackIntent) {
      return { 
        response: fallbackIntent.responses[0],
        quickReplies: [
          "Discuss a project",
          "Hiring / Job enquiry", 
          "Report a bug / Tech support",
          "General question",
          "Send my resume / Portfolio"
        ]
      };
    }
    
    return { response: "I'm not sure how to help with that. Please try one of the options above." };
  }

  // Collect slot data
  private collectSlot(message: string): { response: string; quickReplies?: string[]; isComplete?: boolean } {
    const intent = intents.find(i => i.name === this.state.currentIntent);
    if (!intent || !intent.slots) {
      return { response: "Something went wrong. Let me start over." };
    }

    const currentSlot = intent.slots.find(s => s.name === this.state.currentSlot);
    if (!currentSlot) {
      return { response: "Something went wrong. Let me start over." };
    }

    // Validate the input based on slot type
    if (this.validateSlotInput(message, currentSlot)) {
      this.state.collectedSlots[this.state.currentSlot] = message;
      
      // Find next slot to collect
      const nextSlot = intent.slots.find(s => !this.state.collectedSlots[s.name] && s.required);
      
      if (nextSlot) {
        this.state.currentSlot = nextSlot.name;
        return { response: nextSlot.prompt, quickReplies: nextSlot.options };
      } else {
        // All slots collected, show confirmation
        return this.showConfirmation();
      }
    } else {
      return { response: `Please provide a valid ${currentSlot.type}. ${currentSlot.prompt}` };
    }
  }

  // Validate slot input
  private validateSlotInput(input: string, slot: any): boolean {
    switch (slot.type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      case 'url':
        try {
          new URL(input);
          return true;
        } catch {
          return false;
        }
      case 'string':
        return input.trim().length > 0;
      default:
        return true;
    }
  }

  // Show confirmation before sending
  private showConfirmation(): { response: string; quickReplies?: string[] } {
    const intent = intents.find(i => i.name === this.state.currentIntent);
    if (!intent || !intent.confirmation) {
      return { response: "Something went wrong. Let me start over." };
    }

    this.state.isConfirming = true;
    this.state.isWaitingForSlot = false;

    // Replace placeholders in confirmation message
    let confirmation = intent.confirmation;
    Object.keys(this.state.collectedSlots).forEach(key => {
      confirmation = confirmation.replace(`{${key}}`, this.state.collectedSlots[key]);
    });

    return { 
      response: confirmation, 
      quickReplies: ["Yes, send it", "No, let me change something"] 
    };
  }

  // Complete the conversation
  private completeConversation(): { response: string; isComplete: boolean } {
    const intent = intents.find(i => i.name === this.state.currentIntent);
    if (!intent || !intent.final_response) {
      return { response: "Something went wrong. Let me start over.", isComplete: true };
    }

    // Here you would typically send the data to your backend
    this.sendToBackend();

    // Reset conversation state
    this.resetConversation();

    return { response: intent.final_response, isComplete: true };
  }

  // Send data to backend (placeholder)
  private sendToBackend(): void {
    // This would integrate with your contact form or API
    const message = this.formatMessageForBackend();
    console.log('Sending to backend:', message);
    
    // Here you would typically send to your contact API
    // For now, we'll just log it
    this.logContactMessage(message);
  }

  private formatMessageForBackend(): any {
    const { currentIntent, collectedSlots } = this.state;
    
    switch (currentIntent) {
      case 'project_inquiry':
        return {
          type: 'Project Inquiry',
          name: 'Chatbot User',
          email: collectedSlots.contact_email,
          message: `Project Type: ${collectedSlots.project_type}\nTimeline: ${collectedSlots.timeline}\nBudget: ${collectedSlots.budget}\n\nProject Summary: ${collectedSlots.summary}`,
          timestamp: new Date()
        };
      
      case 'hiring_inquiry':
        return {
          type: 'Hiring Inquiry',
          name: 'Chatbot User',
          email: collectedSlots.contact_email,
          message: `Role: ${collectedSlots.role}\nCV/Link: ${collectedSlots.cv_link}\nAvailability: ${collectedSlots.availability}\n\nPitch: ${collectedSlots.pitch}`,
          timestamp: new Date()
        };
      
      case 'support_inquiry':
        return {
          type: 'Support Inquiry',
          name: 'Chatbot User',
          email: 'support@example.com',
          message: `Device: ${collectedSlots.device}\nPage URL: ${collectedSlots.page_url}\nSteps to Reproduce: ${collectedSlots.steps}\nScreenshot: ${collectedSlots.screenshot || 'None provided'}`,
          timestamp: new Date()
        };
      
      case 'general_question':
        return {
          type: 'General Question',
          name: 'Chatbot User',
          email: collectedSlots.contact_email,
          message: collectedSlots.question_text,
          timestamp: new Date()
        };
      
      case 'resume_submission':
        return {
          type: 'Resume Submission',
          name: 'Chatbot User',
          email: collectedSlots.contact_email,
          message: `Resume/Portfolio Link: ${collectedSlots.resume_link}`,
          timestamp: new Date()
        };
      
      default:
        return {
          type: 'Unknown',
          name: 'Chatbot User',
          email: 'unknown@example.com',
          message: 'Unknown inquiry type',
          timestamp: new Date()
        };
    }
  }

  private logContactMessage(message: any): void {
    if (this.addMessage) {
      // Use the context's addMessage function
      this.addMessage({
        name: 'Chatbot User',
        email: message.email || 'chatbot@example.com',
        message: `${message.type}\n\n${message.message}`,
        timestamp: new Date(),
        isRead: false
      });
    } else {
      // Fallback to localStorage
      const existingMessages = JSON.parse(localStorage.getItem('chatbotMessages') || '[]');
      existingMessages.push({
        ...message,
        id: Date.now().toString(),
        isRead: false
      });
      localStorage.setItem('chatbotMessages', JSON.stringify(existingMessages));
    }
  }

  // Reset conversation state
  private resetConversation(): void {
    this.state = {
      currentIntent: null,
      collectedSlots: {},
      isWaitingForSlot: false,
      currentSlot: null,
      isConfirming: false,
      conversationHistory: []
    };
  }

  // Get current conversation state
  getState(): ConversationState {
    return { ...this.state };
  }

  // Reset conversation
  reset(): void {
    this.resetConversation();
  }
}
