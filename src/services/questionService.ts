
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

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

const fallbackQuestions: Record<string, Question[]> = {
  general: [
    {
      question: "ما هي عاصمة المملكة العربية السعودية؟",
      options: ["الرياض", "جدة", "مكة", "المدينة"],
      correctAnswer: "الرياض"
    },
    {
      question: "ما هو أطول نهر في العالم؟",
      options: ["النيل", "الأمازون", "المسيسيبي", "اليانغتسي"],
      correctAnswer: "النيل"
    },
    {
      question: "من هو مخترع المصباح الكهربائي؟",
      options: ["توماس إديسون", "نيكولا تسلا", "ألبرت أينشتاين", "غراهام بيل"],
      correctAnswer: "توماس إديسون"
    },
  ],
  history: [
    {
      question: "متى بدأت الحرب العالمية الأولى؟",
      options: ["1914", "1918", "1939", "1945"],
      correctAnswer: "1914"
    },
  ],
};

// Cache for pre-generated questions
const questionCache: Record<string, Question[]> = {};

function parseQuestions(text: string): Question[] {
  const questions: Question[] = [];
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  
  for (const line of lines) {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length >= 6) {
      questions.push({
        question: parts[0],
        options: parts.slice(1, 5),
        correctAnswer: parts[5],
      });
    }
  }
  return questions;
}

export async function generateQuestions(categoryId: string, count: number): Promise<Question[]> {
  // Check if we have cached questions for this category
  if (questionCache[categoryId] && questionCache[categoryId].length >= count) {
    console.log(`Using cached questions for ${categoryId}`);
    return questionCache[categoryId].slice(0, count);
  }

  const categoryObj = categories.find((cat) => cat.id === categoryId);
  const category = categoryObj ? categoryObj.name : "معلومات عامة";

  const prompt = `قم بإنشاء ${count} أسئلة اختيار من متعدد باللغة العربية في فئة ${category}. لكل سؤال، قدم 4 خيارات مختلفة وإجابة صحيحة واحدة مع التنسيق التالي:
السؤال؟ | خيار1 | خيار2 | خيار3 | خيار4 | الإجابة الصحيحة`;

  const apiKey = "AIzaSyAO2VNgxFr3Yk0y0eCADWd1FCzmz1rGXB0"; 
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    const parsedQuestions = parseQuestions(text);

    if (parsedQuestions.length === 0) throw new Error("لم يتم توليد أي أسئلة");

    // Cache the generated questions
    questionCache[categoryId] = parsedQuestions;
    
    return parsedQuestions;
  } catch (error) {
    console.error("خطأ أثناء توليد الأسئلة:", error);
    toast.error("حدث خطأ أثناء توليد الأسئلة، سيتم استخدام أسئلة افتراضية.");
    return fallbackQuestions[categoryId] || fallbackQuestions["general"];
  }
}

// Function to pre-generate questions for each category
export async function preGenerateQuestions() {
  console.log("Pre-generating questions for all categories...");
  
  for (const category of categories) {
    try {
      if (!questionCache[category.id]) {
        // Generate 10 questions for each category in the background
        generateQuestions(category.id, 10)
          .then(questions => {
            questionCache[category.id] = questions;
            console.log(`Pre-generated ${questions.length} questions for ${category.name}`);
          })
          .catch(error => {
            console.error(`Failed to pre-generate questions for ${category.name}:`, error);
          });
      }
    } catch (error) {
      console.error(`Error pre-generating questions for ${category.name}:`, error);
    }
  }
}
