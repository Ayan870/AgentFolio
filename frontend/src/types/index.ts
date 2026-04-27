export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: Date;
}

export interface ChatSession {
  sessionId: string;
  userId: string;
  messages: Message[];
}

export interface CVData {
  user_id: string;
  name: string;
  bio: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  contact: Record<string, string>;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  url: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}