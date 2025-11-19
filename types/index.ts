import { MessageParam } from '@anthropic-ai/sdk/resources/messages';

export interface ChatRequest {
  messages: MessageParam[];
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}
