
import { toast } from "sonner";

// تعريف واجهة السؤال
export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

// تعريف التصنيفات
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

// مجموعة من الأسئلة الافتراضية لكل فئة كنسخة احتياطية
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
    }
  ],
  history: [
    {
      question: "متى بدأت الحرب العالمية الأولى؟",
      options: ["1914", "1918", "1939", "1945"],
      correctAnswer: "1914"
    }
  ],
  // أضف المزيد من الأسئلة لبقية التصنيفات إذا رغبت
};

// Cache for pre-generated questions
const questionCache: Record<string, Question[]> = {};

//
// دالة لتحليل النص الذي يُرجع من نموذج Gemini وتحويله إلى مصفوفة من الأسئلة.
// يعتمد التحليل هنا على أن الرد يحتوي على أسئلة مفصولة بخطوط جديدة والصيغة هي:
// السؤال؟ | الخيار1 | الخيار2 | الخيار3 | الخيار4 | الإجابة الصحيحة
//
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

//
// دالة توليد الأسئلة باستخدام Gemini 2.0 Flash عبر REST API.
// المعاملات: 
// - categoryId: معرف الفئة (مثلاً "general")
// - count: عدد الأسئلة المطلوب توليدها
//
export async function generateQuestions(categoryId: string, count: number): Promise<Question[]> {
  // Check if we have cached questions for this category
  if (questionCache[categoryId] && questionCache[categoryId].length >= count) {
    console.log(`Using cached questions for ${categoryId}`);
    return questionCache[categoryId].slice(0, count);
  }

  const categoryObj = categories.find((cat) => cat.id === categoryId);
  const category = categoryObj ? categoryObj.name : "معلومات عامة";

  // نص التوجيه (prompt) الذي سيتم إرساله إلى النموذج
  const prompt = `أنشئ ${count} أسئلة اختيار من متعدد باللغة العربية في فئة ${category}. لكل سؤال، قدم 4 خيارات مختلفة وإجابة صحيحة واحدة مع التنسيق التالي:
السؤال؟ | خيار1 | خيار2 | خيار3 | خيار4 | الإجابة الصحيحة`;

  // استخدام مفتاح API مباشرةً
  const apiKey = "AIzaSyAO2VNgxFr3Yk0y0eCADWd1FCzmz1rGXB0";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // إعداد الـ payload المناسب وفقًا لتوثيق API
  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // استخراج النص من الرد
    const resultText = data.candidates[0].content.parts[0].text;
    
    const parsedQuestions = parseQuestions(resultText);
    if (parsedQuestions.length === 0) {
      throw new Error("لم يتم توليد أي أسئلة");
    }
    
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
