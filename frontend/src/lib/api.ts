import axios from "axios";
import { CVData } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

export interface ChatPayload {
  user_id: string;
  message: string;
  session_id?: string;
  history: { role: string; content: string }[];
}

export async function sendMessage(payload: ChatPayload) {
  const { data } = await api.post("/chat", payload);
  return data as { reply: string; session_id: string; sources: string[] };
}

export async function ingestCV(cvData: CVData) {
  const { data } = await api.post("/ingest", {
    user_id: cvData.user_id,
    data: cvData,
  });
  return data;
}