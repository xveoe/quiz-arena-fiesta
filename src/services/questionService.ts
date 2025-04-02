
import { toast } from "sonner";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const API_KEY = "AIzaSyB6QkAt9qP5iMZWktV9x4Veoq66zvtXSVk";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export const categories = [
  { id: "general", name: "معلومات عامة" },
  { id: "history", name: "تاريخ" },
  { id: "science", name: "علوم" },
  { id: "geography", name: "جغرافيا" },
  { id: "sports", name: "رياضة" },
  { id: "arabculture", name: "ثقافة عربية" },
  { id: "inventions", name: "اختراعات" },
  { id: "literature", name: "أدب" }
];

export async function generateQuestions(category: string, count: number = 10): Promise<Question[]> {
  const prompt = `
    Create ${count} multiple choice questions in Arabic about ${category}. 
    Generate the response in the following JSON format only:
    [
      {
        "question": "السؤال هنا",
        "options": ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
        "correctAnswer": "الإجابة الصحيحة هنا"
      }
    ]
    Make sure the correct answer is one of the options.
    The response should be valid JSON only, with no extra text.
  `;

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the text from the response
    const text = data.candidates[0].content.parts[0].text;
    
    // Find the JSON part in the response (in case there's additional text)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON response");
    }
    
    // Parse the JSON
    const questions = JSON.parse(jsonMatch[0]);
    return questions;
  } catch (error) {
    console.error("Failed to generate questions:", error);
    toast.error("فشل في توليد الأسئلة، يرجى المحاولة مرة أخرى");
    return [];
  }
}
