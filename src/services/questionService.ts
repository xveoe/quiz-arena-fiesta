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
    },
    {
      question: "ما هي أكبر دولة عربية من حيث المساحة؟",
      options: ["الجزائر", "السعودية", "مصر", "السودان"],
      correctAnswer: "الجزائر"
    },
    {
      question: "ما هو العنصر الأ��ثر وفرة في الغلاف الجوي للأرض؟",
      options: ["النيتروجين", "الأكسجين", "ثاني أكسيد الكربون", "الهيدروجين"],
      correctAnswer: "النيتروجين"
    }
  ],
  history: [
    {
      question: "متى بدأت الحرب العالمية الأولى؟",
      options: ["1914", "1918", "1939", "1945"],
      correctAnswer: "1914"
    },
    {
      question: "من هو مؤسس الدولة السعودية الحديثة؟",
      options: ["الملك عبد العزيز آل سعود", "الملك فيصل", "الملك فهد", "الملك سلمان"],
      correctAnswer: "الملك عبد العزيز آل سعود"
    }
  ],
  science: [
    {
      question: "ما هي أصغر وحدة في الكائن الحي؟",
      options: ["الخلية", "الذرة", "الجزء", "النواة"],
      correctAnswer: "الخلية"
    },
    {
      question: "ما هو العنصر الكيميائي الذي رمزه O؟",
      options: ["الأكسجين", "الذهب", "الفضة", "الأوزون"],
      correctAnswer: "الأكسجين"
    }
  ],
  // أضف المزيد من الأسئلة لبقية التصنيفات
};

// Cache for pre-generated questions
const questionCache: Record<string, Question[]> = {};

// Set to keep track of already used questions to avoid repetition
const usedQuestions = new Set<string>();

// دالة لتحليل النص الذي يُرجع من نموذج Gemini وتحويله إلى مصفوفة من الأسئلة.
function parseQuestions(text: string): Question[] {
  const questions: Question[] = [];
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  
  for (const line of lines) {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length >= 6) {
      // تأكد من أن السؤال والخيارات ليست فارغة
      if (
        parts[0] && 
        parts[1] && parts[2] && parts[3] && parts[4] && parts[5] &&
        !usedQuestions.has(parts[0])
      ) {
        // تأكد من أن الإجابة الصحيحة موجودة في الخيارات
        const options = parts.slice(1, 5);
        const correctAnswer = parts[5];
        
        if (options.includes(correctAnswer)) {
          questions.push({
            question: parts[0],
            options: options,
            correctAnswer: correctAnswer,
          });
        }
      }
    }
  }
  
  // تأكد من عدم وجود أسئلة متكررة
  const uniqueQuestions: Question[] = [];
  const questionTexts = new Set<string>();
  
  for (const q of questions) {
    if (!questionTexts.has(q.question)) {
      questionTexts.add(q.question);
      uniqueQuestions.push(q);
    }
  }
  
  return uniqueQuestions;
}

// دالة توليد الأسئلة باستخدام Gemini
export async function generateQuestions(categoryId: string, count: number, difficulty: number = 50): Promise<Question[]> {
  console.log(`Generating ${count} questions for category ${categoryId} with difficulty ${difficulty}`);
  
  // إنشاء مفتاح فريد للتخزين المؤقت
  const cacheKey = `${categoryId}_${difficulty}`;
  
  // Check if we have cached questions for this category and difficulty
  if (questionCache[cacheKey] && questionCache[cacheKey].length >= count) {
    console.log(`Using cached questions for ${categoryId} with difficulty ${difficulty}`);
    
    // Filter out already used questions to avoid repetition
    const unusedQuestions = questionCache[cacheKey].filter(q => !usedQuestions.has(q.question));
    
    // If we have enough unused questions, return them
    if (unusedQuestions.length >= count) {
      console.log(`Found ${unusedQuestions.length} unused questions in cache, using ${count} of them`);
      const selectedQuestions = unusedQuestions.slice(0, count);
      // Mark these questions as used
      selectedQuestions.forEach(q => usedQuestions.add(q.question));
      return selectedQuestions;
    }
    
    // Otherwise, generate new questions since we don't have enough unused ones
    console.log("Not enough unused questions in cache, generating new ones");
  }

  const categoryObj = categories.find((cat) => cat.id === categoryId);
  const category = categoryObj ? categoryObj.name : "معلومات عامة";

  // تحديد مستوى الصعوبة في نص
  let difficultyText = "متوسطة";
  if (difficulty < 30) {
    difficultyText = "سهلة";
  } else if (difficulty > 70) {
    difficultyText = "صعبة";
  }

  // نص التوجيه (prompt) المحسن للحصول على أسئلة فريدة
  const prompt = `أنشئ ${count + 5} أسئلة اختيارات متعددة باللغة العربية الفصحى في فئة "${category}" بمستوى صعوبة "${difficultyText}".

يجب أن تكون الأسئلة والخيارات مصاغة بلغة عربية فصحى سليمة نحوياً وإملائياً. احرص على الدقة التامة في صياغة الأسئلة وعلامات الترقيم والإعراب الصحيح.

الشروط المهمة:
1. الأسئلة يجب أن تكون متنوعة وفريدة وغير متكررة تماماً
2. تجنب الأسئلة البديهية أو المتشابهة في المعنى
3. لا تستخدم أسئلة تقليدية يمكن توقعها بسهولة
4. تأكد من أن الخيارات واضحة ومتمايزة ومختلفة عن بعضها
5. الإجابة الصحيحة يجب أن تكون واحدة فقط من الخيارات وموجودة بنفس الصيغة التي ذكرتها
6. استخدم علامات الترقيم المناسبة والتدقيق النحوي والإملائي

أخرج النتائج بالتنسيق التالي فقط (قسم كل حقل بعلامة |):
السؤال؟ | الخيار الأول | الخيار الثاني | الخيار الثالث | الخيار الرابع | الإجابة الصحيحة`;

  // استخدام مفتاح API مباشرةً
  const apiKey = "AIzaSyAO2VNgxFr3Yk0y0eCADWd1FCzmz1rGXB0";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // إعداد الـ payload
  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    }
  };

  try {
    console.log("Sending request to Gemini API");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // استخراج النص من الرد
    const resultText = data.candidates[0].content.parts[0].text;
    console.log("Received response from Gemini API");
    
    // Parse and validate the questions
    const parsedQuestions = parseQuestions(resultText);
    console.log(`Parsed ${parsedQuestions.length} valid questions`);
    
    if (parsedQuestions.length === 0) {
      console.error("No valid questions were generated");
      throw new Error("لم يتم توليد أي أسئلة صالحة");
    }
    
    // Cache the generated questions
    questionCache[cacheKey] = parsedQuestions;
    
    // Mark questions as used to prevent repetition
    const selectedQuestions = parsedQuestions.slice(0, count);
    selectedQuestions.forEach(q => usedQuestions.add(q.question));
    
    console.log(`Successfully selected ${selectedQuestions.length} questions`);
    return selectedQuestions;
  } catch (error) {
    console.error("خطأ أثناء توليد الأسئلة:", error);
    toast.error("حدث خطأ أثناء توليد الأسئلة، سيتم استخدام أسئلة افتراضية.");
    
    // استخدام الأسئلة الافتراضية كخطة بديلة
    const fallbackCategoryQuestions = fallbackQuestions[categoryId] || fallbackQuestions["general"];
    console.log(`Using ${Math.min(count, fallbackCategoryQuestions.length)} fallback questions`);
    
    return fallbackCategoryQuestions.slice(0, count);
  }
}

// Function to pre-generate questions for each category
export async function preGenerateQuestions() {
  console.log("Pre-generating questions for all categories...");
  
  for (const category of categories) {
    try {
      if (!questionCache[category.id]) {
        // Generate questions for each category in the background
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

// دالة لمسح مجموعة الأسئلة المستخدمة عند بدء لعبة جديدة
export function resetUsedQuestions() {
  usedQuestions.clear();
  console.log("Reset used questions tracking");
}

// دالة لتبديل السؤال الحالي بسؤال آخر من نفس الفئة
export async function swapQuestion(categoryId: string, currentQuestion: Question, difficulty: number = 50): Promise<Question | null> {
  const cacheKey = `${categoryId}_${difficulty}`;
  
  // إذا كان هناك أسئلة مخزنة بالفعل
  if (questionCache[cacheKey]) {
    // البحث عن سؤال غير مستخدم ومختلف عن السؤال الحالي
    const unusedQuestion = questionCache[cacheKey].find(q => 
      !usedQuestions.has(q.question) && q.question !== currentQuestion.question
    );
    
    if (unusedQuestion) {
      // وضع علامة على السؤال الجديد كمستخدم
      usedQuestions.add(unusedQuestion.question);
      return unusedQuestion;
    }
  }
  
  // إذا لم نجد سؤالًا مناسبًا، نحاول توليد سؤال جديد
  try {
    const newQuestions = await generateQuestions(categoryId, 1, difficulty);
    if (newQuestions.length > 0) {
      // تأكد من أن السؤال الجديد مختلف عن السؤال الحالي
      if (newQuestions[0].question !== currentQuestion.question) {
        return newQuestions[0];
      }
    }
  } catch (error) {
    console.error("خطأ أثناء توليد سؤال بديل:", error);
  }
  
  // إذا لم نتمكن من توليد سؤال جديد، نرجع null
  return null;
}
