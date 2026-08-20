import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing Gemini API Key:', apiKey ? 'Key found' : 'No key');

const ai = new GoogleGenAI({ apiKey });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: ['Xin chào Gemini! Hãy phản hồi ngắn "OK" nếu kết nối thành công.']
    });
    console.log('Gemini Response:', response.text);
  } catch (err) {
    console.error('Gemini Error:', err.message);
  }
}

test();
