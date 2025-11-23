import { ROLES } from "../constans/roles";

export interface Chat {
  id: number;
  title: string;
  created_at: number;
  updated_at: number;
}

export interface Message {
  id: number;
  role: ROLES;
  text: string;
  created_at: number;
}

export interface AnswerPayload {
  chatId: number;
  question: string;
  user_answer: string;
}

export interface EvaluationResponse {
  id: number;
  created_at: number;
  question: string;
  model_answer: string;
  evaluation: {
    semantic_similarity: number;
    llm_evaluation: {
      score: string;
      semantic_similarity: number;
      similarity_comment: string;
      strengths: string[];
      issues: string[];
      missing_points: string[];
      final_comment: string;
    };
  };
}
