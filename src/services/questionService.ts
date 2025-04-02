
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

// مجموعة من الأسئلة الافتراضية لكل فئة في حالة فشل API
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
  ],
  // أسئلة افتراضية أخرى للفئات الأخرى...
};

export async function generateQuestions(category: string, count: number = 10): Promise<Question[]> {
  // استخدام اسم الفئة بالعربية في المطالبة
  const categoryNameInArabic = categories.find(cat => cat.id === category)?.name || category;

  const prompt = `
    أنشئ ${count} أسئلة اختيار من متعدد باللغة العربية حول موضوع "${categoryNameInArabic}".
    يجب أن تكون الإجابة بالتنسيق التالي فقط وبدون أي نص إضافي (يجب أن تكون JSON صالحة):
    [
      {
        "question": "السؤال هنا",
        "options": ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
        "correctAnswer": "الإجابة الصحيحة هنا"
      }
    ]
    تأكد من أن الإجابة الصحيحة هي واحدة من الخيارات المتاحة.
    يجب أن تكون الاستجابة JSON صالحة فقط، بدون أي نص إضافي.
  `;

  try {
    console.log("Sending request to Gemini API with category:", categoryNameInArabic);
    
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
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error(`خطأ في الـ API: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    
    // استخراج النص من الاستجابة
    const text = data.candidates[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("No text in API response");
      throw new Error("لا يوجد محتوى في استجابة API");
    }
    
    // البحث عن جزء JSON في الاستجابة (في حالة وجود نص إضافي)
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) {
      console.error("Could not parse JSON response");
      throw new Error("تعذر تحليل استجابة JSON");
    }
    
    try {
      // تحليل JSON
      const questions = JSON.parse(jsonMatch[0]);
      console.log("Parsed questions:", questions);
      
      // التحقق من صحة بنية البيانات
      const validQuestions = questions.filter((q: any) => 
        q.question && 
        Array.isArray(q.options) && 
        q.options.length >= 2 && 
        q.correctAnswer && 
        q.options.includes(q.correctAnswer)
      );
      
      if (validQuestions.length === 0) {
        throw new Error("لم يتم العثور على أسئلة صالحة");
      }
      
      return validQuestions;
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw text:", text);
      throw new Error("خطأ في تحليل JSON");
    }
  } catch (error) {
    console.error("Failed to generate questions:", error);
    toast.error("فشل في توليد الأسئلة، استخدام الأسئلة الافتراضية");
    
    // استخدام الأسئلة الافتراضية للفئة، أو الأسئلة العامة إذا لم تكن موجودة
    return fallbackQuestions[category] || fallbackQuestions.general || [];
  }
}
