import Anthropic from "@anthropic-ai/sdk";
import { MINIMAX_CONFIG } from "../constants/config";
import { ChatRequest, ChatResponse } from "../types";

class ChatService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      baseURL: MINIMAX_CONFIG.BASE_URL,
      apiKey: MINIMAX_CONFIG.API_KEY,
      dangerouslyAllowBrowser: true, // React Native ortamı için gerekli
    });
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      if (!MINIMAX_CONFIG.API_KEY) {
        return {
          success: false,
          error: "API Key yapılandırılmamış. Lütfen config.ts dosyasına MiniMax API Key'inizi ekleyin.",
        };
      }

      const message = await this.client.messages.create({
        model: MINIMAX_CONFIG.MODEL,
        max_tokens: MINIMAX_CONFIG.MAX_TOKENS,
        messages: request.messages,
      });

      // Extract text from the response
      const textContent = message.content.find((block) => block.type === "text");
      
      if (!textContent || textContent.type !== "text") {
        return {
          success: false,
          error: "Geçerli bir yanıt alınamadı.",
        };
      }

      return {
        success: true,
        message: textContent.text,
      };
    } catch (error) {
      console.error("Chat service error:", error);
      
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: "Beklenmeyen bir hata oluştu.",
      };
    }
  }
}

export const chatService = new ChatService();
