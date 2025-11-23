export interface GenerationResponse {
  data: {
    task_id: string;
    status: 'CREATED' | 'PENDING' | 'COMPLETED' | 'FAILED';
    generated?: string[];
    has_nsfw?: boolean[];
  };
}

const API_KEY = process.env.EXPO_PUBLIC_FREEPIC_API_KEY || '';
const BASE_URL = 'https://api.freepik.com/v1/ai/mystic';

export const freepikService = {
  async generateImage(prompt: string): Promise<GenerationResponse> {
    const options = {
      method: 'POST',
      headers: {
        'x-freepik-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        structure_strength: 50,
        adherence: 50,
        hdr: 50,
        resolution: '2k',
        aspect_ratio: 'square_1_1',
        model: 'realism',
        creative_detailing: 33,
        engine: 'automatic',
        fixed_generation: false,
        filter_nsfw: true,
      }),
    };

    try {
      const response = await fetch(BASE_URL, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error initiating generation:', error);
      throw error;
    }
  },

  async checkStatus(taskId: string): Promise<GenerationResponse> {
    const options = {
      method: 'GET',
      headers: {
        'x-freepik-api-key': API_KEY,
      },
    };

    try {
      const response = await fetch(`${BASE_URL}/${taskId}`, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking status:', error);
      throw error;
    }
  },
};
