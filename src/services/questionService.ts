
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Question {
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
      question: "ما هي أكبر قارة في العالم؟",
      options: ["آسيا", "أفريقيا", "أمريكا الشمالية", "أوروبا"],
      correctAnswer: "آسيا"
    },
    {
      question: "ما هي عملة اليابان؟",
      options: ["الين", "الدولار", "اليورو", "الجنيه"],
      correctAnswer: "الين"
    },
    {
      question: "كم عدد أضلاع المسدس؟",
      options: ["6", "5", "7", "8"],
      correctAnswer: "6"
    },
    {
      question: "أي من الحيوانات التالية ليس من الثدييات؟",
      options: ["التمساح", "الخفاش", "الحوت", "الفيل"],
      correctAnswer: "التمساح"
    },
    {
      question: "ما هو العنصر الأكثر وفرة في القشرة الأرضية؟",
      options: ["الأكسجين", "الحديد", "السيليكون", "الألومنيوم"],
      correctAnswer: "الأكسجين"
    },
    {
      question: "من هو مؤلف رواية 'الحرب والسلام'؟",
      options: ["ليو تولستوي", "فيودور دوستويفسكي", "تشارلز ديكنز", "فيكتور هوغو"],
      correctAnswer: "ليو تولستوي"
    },
    {
      question: "ما هي أصغر دولة في العالم؟",
      options: ["الفاتيكان", "موناكو", "ناورو", "توفالو"],
      correctAnswer: "الفاتيكان"
    }
  ],
  history: [
    {
      question: "متى بدأت الحرب العالمية الأولى؟",
      options: ["1914", "1918", "1939", "1945"],
      correctAnswer: "1914"
    },
    {
      question: "من هو أول رئيس للولايات المتحدة الأمريكية؟",
      options: ["جورج واشنطن", "توماس جيفرسون", "أبراهام لينكولن", "جون آدمز"],
      correctAnswer: "جورج واشنطن"
    },
    {
      question: "متى فتح المسلمون الأندلس؟",
      options: ["711 م", "622 م", "813 م", "1453 م"],
      correctAnswer: "711 م"
    },
    {
      question: "من هو القائد الذي عبر جبال الألب بالفيلة؟",
      options: ["هانيبال", "الإسكندر الأكبر", "يوليوس قيصر", "نابليون بونابرت"],
      correctAnswer: "هانيبال"
    },
    {
      question: "ما هي الثورة الت�� أطاحت بالقيصر الروسي عام 1917؟",
      options: ["الثورة البلشفية", "الثورة الفرنسية", "الثورة الصناعية", "ثورة المستعمرات الأمريكية"],
      correctAnswer: "الثورة البلشفية"
    },
    {
      question: "متى سقطت الإمبراطورية الرومانية الغربية؟",
      options: ["476 م", "410 م", "1453 م", "330 م"],
      correctAnswer: "476 م"
    },
    {
      question: "من هو مؤسس الدولة العباسية؟",
      options: ["أبو العباس السفاح", "هارون الرشيد", "المأمون", "المعتصم"],
      correctAnswer: "أبو العباس السفاح"
    },
    {
      question: "أين وقعت معركة حطين الشهيرة؟",
      options: ["فلسطين", "مصر", "العراق", "سوريا"],
      correctAnswer: "فلسطين"
    },
    {
      question: "من هو فاتح القسطنطينية؟",
      options: ["محمد الفاتح", "صلاح الدين الأيوبي", "طارق بن زياد", "قتيبة بن مسلم"],
      correctAnswer: "محمد الفاتح"
    },
    {
      question: "متى انتهت الحرب العالمية الثانية؟",
      options: ["1945", "1939", "1918", "1950"],
      correctAnswer: "1945"
    }
  ],
  science: [
    {
      question: "ما هو أكبر عضو في جسم الإنسان؟",
      options: ["الجلد", "الكبد", "الدماغ", "الرئتين"],
      correctAnswer: "الجلد"
    },
    {
      question: "ما هو العنصر الكيميائي الذي رمزه Fe؟",
      options: ["الحديد", "الفضة", "الذهب", "الفلور"],
      correctAnswer: "الحديد"
    },
    {
      question: "كم عدد العظام في جسم الإنسان البالغ؟",
      options: ["206", "300", "180", "240"],
      correctAnswer: "206"
    },
    {
      question: "ما هي أقرب نجمة إلى الأرض؟",
      options: ["الشمس", "بروكسيما قنطورس", "سيريوس", "النجم القطبي"],
      correctAnswer: "الشمس"
    },
    {
      question: "ما هي الوحدة الأساسية للكتلة في النظام الدولي للوحدات؟",
      options: ["الكيلوجرام", "الجرام", "الطن", "الباوند"],
      correctAnswer: "الكيلوجرام"
    },
    {
      question: "أي نوع من الإشعاع له أقصر طول موجي؟",
      options: ["أشعة جاما", "الأشعة فوق البنفسجية", "الأشعة السينية", "موجات الراديو"],
      correctAnswer: "أشعة جاما"
    },
    {
      question: "ما هو العنصر الأكثر وفرة في الكون؟",
      options: ["الهيدروجين", "الهيليوم", "الأكسجين", "الكربون"],
      correctAnswer: "الهيدروجين"
    },
    {
      question: "ما هي أسرع حاسة من حواس الإنسان؟",
      options: ["الشم", "السمع", "البصر", "التذوق"],
      correctAnswer: "الشم"
    },
    {
      question: "من صاحب نظرية النسبية؟",
      options: ["ألبرت أينشتاين", "إسحاق نيوتن", "نيلز بور", "ماري كوري"],
      correctAnswer: "ألبرت أينشتاين"
    },
    {
      question: "ما هو أكبر كوكب في المجموعة الشمسية؟",
      options: ["المشتري", "زحل", "أورانوس", "نبتون"],
      correctAnswer: "المشتري"
    }
  ],
  geography: [
    {
      question: "ما هي أطول سلسلة جبال في العالم؟",
      options: ["جبال الأنديز", "جبال الهيمالايا", "جبال روكي", "جبال الألب"],
      correctAnswer: "جبال الأنديز"
    },
    {
      question: "أي دولة تحتل أكبر مساحة في العالم؟",
      options: ["روسيا", "كندا", "الصين", "الولايات المتحدة"],
      correctAnswer: "روسيا"
    },
    {
      question: "ما هي عاصمة أستراليا؟",
      options: ["كانبرا", "سيدني", "ملبورن", "بريزبن"],
      correctAnswer: "كانبرا"
    },
    {
      question: "ما هي أكبر صحراء في العالم؟",
      options: ["الصحراء الكبرى", "صحراء الربع الخالي", "صحراء غوبي", "صحراء أتاكاما"],
      correctAnswer: "الصحراء الكبرى"
    },
    {
      question: "ما هو أعمق محيط في العالم؟",
      options: ["المحيط الهادئ", "المحيط الأطلسي", "المحيط الهندي", "المحيط المتجمد الشمالي"],
      correctAnswer: "المحيط الهادئ"
    },
    {
      question: "أي دولة تشتهر بأنها 'بلاد الشمس المشرقة'؟",
      options: ["اليابان", "الصين", "تايلاند", "إسبانيا"],
      correctAnswer: "اليابان"
    },
    {
      question: "ما هو البحر الذي يطلق عليه 'البحر الميت'؟",
      options: ["البحر الميت", "البحر الأحمر", "البحر الأبيض المتوسط", "بحر العرب"],
      correctAnswer: "البحر الميت"
    },
    {
      question: "ما هو الدولة التي يمر بها خط الاستواء والتي تقع في قارة أمريكا الجنوبية؟",
      options: ["الإكوادور", "البرازيل", "كولومبيا", "فنزويلا"],
      correctAnswer: "الإكوادور"
    },
    {
      question: "ما هو أعلى جبل في إفريقيا؟",
      options: ["كليمنجارو", "كينيا", "إلجون", "أطلس"],
      correctAnswer: "كليمنجارو"
    },
    {
      question: "ما هي أصغر قارة في العالم؟",
      options: ["أستراليا", "أوروبا", "أنتاركتيكا", "أمريكا الشمالية"],
      correctAnswer: "أستراليا"
    }
  ],
  sports: [
    {
      question: "من هو اللاعب الذي فاز بأكبر عدد من الكرات الذهبية؟",
      options: ["ليونيل ميسي", "كريستيانو رونالدو", "بيليه", "دييجو مارادونا"],
      correctAnswer: "ليونيل ميسي"
    },
    {
      question: "ما هي الدولة التي استضافت أول كأس عالم لكرة القدم؟",
      options: ["أوروجواي", "البرازيل", "إيطاليا", "فرنسا"],
      correctAnswer: "أوروجواي"
    },
    {
      question: "كم عدد اللاعبين في فريق كرة السلة؟",
      options: ["5", "6", "7", "11"],
      correctAnswer: "5"
    },
    {
      question: "أي رياضة تُلعب في ويمبلدون؟",
      options: ["التنس", "الجولف", "الكريكيت", "الهوكي"],
      correctAnswer: "التنس"
    },
    {
      question: "من هو أسرع إنسان في العالم حاليًا؟",
      options: ["أوساين بولت", "جاستن جاتلين", "يوهان بليك", "نواه لايلز"],
      correctAnswer: "أوساين بولت"
    },
    {
      question: "ما هي الرياضة الوطنية لليابان؟",
      options: ["السومو", "الجودو", "الكاراتيه", "الكيندو"],
      correctAnswer: "السومو"
    },
    {
      question: "كم مرة فازت البرازيل بكأس العالم لكرة القدم؟",
      options: ["5", "4", "6", "3"],
      correctAnswer: "5"
    },
    {
      question: "ما هو عدد الحلقات في شعار الألعاب الأولمبية؟",
      options: ["5", "4", "6", "3"],
      correctAnswer: "5"
    },
    {
      question: "من هو لاعب كرة السلة الذي يُعرف باسم 'الملك جيمس'؟",
      options: ["ليبرون جيمس", "مايكل جوردان", "كوبي براينت", "شاكيل أونيل"],
      correctAnswer: "ليبرون جيمس"
    },
    {
      question: "ما هي الدولة التي فازت بأكبر عدد من بطولات كأس العالم للكريكيت؟",
      options: ["أستراليا", "الهند", "إنجلترا", "باكستان"],
      correctAnswer: "أستراليا"
    }
  ],
  arabculture: [
    {
      question: "من هو مؤلف كتاب 'مقدمة ابن خلدون'؟",
      options: ["ابن خلدون", "ابن سينا", "الجاحظ", "ابن رشد"],
      correctAnswer: "ابن خلدون"
    },
    {
      question: "ما هو أقدم جامع في شمال أفريقيا؟",
      options: ["جامع القيروان", "الجامع الأزهر", "جامع الزيتونة", "جامع القرويين"],
      correctAnswer: "جامع القيروان"
    },
    {
      question: "من هو الشاعر الملقب بـ 'شاعر النيل'؟",
      options: ["حافظ إبراهيم", "أحمد شوقي", "نزار قباني", "محمود درويش"],
      correctAnswer: "حافظ إبراهيم"
    },
    {
      question: "ما هي المدينة العربية التي تلقب بـ 'عروس البحر المتوسط'؟",
      options: ["الإسكندرية", "بيروت", "تونس", "طنجة"],
      correctAnswer: "الإسكندرية"
    },
    {
      question: "من هو مؤسس علم الاجتماع؟",
      options: ["ابن خلدون", "الفارابي", "ابن رشد", "الخوارزمي"],
      correctAnswer: "ابن خلدون"
    },
    {
      question: "ما هو أكبر مسجد في العالم من حيث المساحة؟",
      options: ["المسجد الحرام", "المسجد النبوي", "مسجد الحسن الثاني", "جامع الشيخ زايد"],
      correctAnswer: "المسجد الحرام"
    },
    {
      question: "من هي أول امرأة عربية تفوز بجائزة نوبل؟",
      options: ["توكل كرمان", "نوال السعداوي", "غادة السمان", "فدوى طوقان"],
      correctAnswer: "توكل كرمان"
    },
    {
      question: "ما هي الآلة الموسيقية التي اخترعها زرياب؟",
      options: ["العود", "القانون", "الناي", "الرباب"],
      correctAnswer: "العود"
    },
    {
      question: "ما هو الكتاب الذي ألفه الجاحظ ويتحدث عن الحيوانات؟",
      options: ["كتاب الحيوان", "البخلاء", "البيان والتبيين", "المحاسن والأضداد"],
      correctAnswer: "كتاب الحيوان"
    },
    {
      question: "أي مدينة عربية تعتبر أقدم عاصمة مأهولة في العالم؟",
      options: ["دمشق", "القدس", "بغداد", "القاهرة"],
      correctAnswer: "دمشق"
    }
  ],
  inventions: [
    {
      question: "من اخترع المصباح الكهربائي؟",
      options: ["توماس إديسون", "نيكولا تسلا", "أليكساندر جراهام بيل", "جاليليو جاليلي"],
      correctAnswer: "توماس إديسون"
    },
    {
      question: "من اخترع البنسلين؟",
      options: ["ألكسندر فلمنج", "لويس باستير", "جوناس سالك", "روبرت كوخ"],
      correctAnswer: "ألكسندر فلمجين"
    },
    {
      question: "من هو مخترع الإنترنت؟",
      options: ["تيم بيرنرز لي", "بيل جيتس", "ستيف جوبز", "مارك زوكربيرج"],
      correctAnswer: "تيم بيرنرز لي"
    },
    {
      question: "ما هو أول حاسوب إلكتروني في العالم؟",
      options: ["ENIAC", "UNIVAC", "IBM PC", "Apple I"],
      correctAnswer: "ENIAC"
    },
    {
      question: "من اخترع الطباعة بالحروف المتحركة؟",
      options: ["يوهانس جوتنبرج", "جيمس وات", "توماس إديسون", "جراهام بيل"],
      correctAnswer: "يوهانس جوتنبرج"
    },
    {
      question: "من هو العالم العربي الذي اخترع الجبر؟",
      options: ["الخوارزمي", "ابن سينا", "ابن الهيثم", "جابر بن حيان"],
      correctAnswer: "الخوارزمي"
    },
    {
      question: "من اخترع الراديو؟",
      options: ["جوليلمو ماركوني", "نيكولا تسلا", "توماس إديسون", "ألكسندر جراهام بيل"],
      correctAnswer: "جوليلمو ماركوني"
    },
    {
      question: "من اخترع السيارة التي تعمل بمحرك احتراق داخلي؟",
      options: ["كارل بنز", "هنري فورد", "رودولف ديزل", "إتيان لينوار"],
      correctAnswer: "كارل بنز"
    },
    {
      question: "من اخترع الديناميت؟",
      options: ["ألفريد نوبل", "روبرت أوبنهايمر", "ماري كوري", "إسحاق نيوتن"],
      correctAnswer: "ألفريد نوبل"
    },
    {
      question: "من اخترع التلفاز؟",
      options: ["فيلو فارنسوورث", "توماس إديسون", "نيكولا تسلا", "جوزيف هنري"],
      correctAnswer: "فيلو فارنسوورث"
    }
  ],
  literature: [
    {
      question: "من هو مؤلف رواية 'ألف ليلة وليلة'؟",
      options: ["مجهول", "نجيب محفوظ", "طه حسين", "توفيق الحكيم"],
      correctAnswer: "مجهول"
    },
    {
      question: "من هو أول أديب عربي حائز على جائزة نوبل للآداب؟",
      options: ["نجيب محفوظ", "أدونيس", "غسان كنفاني", "محمود درويش"],
      correctAnswer: "نجيب محفوظ"
    },
    {
      question: "من هو كاتب مسرحية 'هاملت'؟",
      options: ["وليام شكسبير", "موليير", "تينيسي ويليامز", "أرثر ميلر"],
      correctAnswer: "وليام شكسبير"
    },
    {
      question: "من هو شاعر المعلقات الذي لُقب بـ 'الملك الضليل'؟",
      options: ["امرؤ القيس", "عنترة بن شداد", "زهير بن أبي سلمى", "لبيد بن ربيعة"],
      correctAnswer: "امرؤ القيس"
    },
    {
      question: "من هو مؤلف رواية 'الحرب والسلام'؟",
      options: ["ليو تولستوي", "فيودور دوستويفسكي", "أنطون تشيخوف", "نيكولاي غوغول"],
      correctAnswer: "ليو تولستوي"
    },
    {
      question: "من هي مؤلفة رواية 'مرتفعات وذرينغ'؟",
      options: ["إميلي برونتي", "جين أوستن", "فرجينيا وولف", "شارلوت برونتي"],
      correctAnswer: "إميلي برونتي"
    },
    {
      question: "من هو صاحب كتاب 'البخلاء'؟",
      options: ["الجاحظ", "ابن المقفع", "المتنبي", "أبو العلاء المعري"],
      correctAnswer: "الجاحظ"
    },
    {
      question: "من هو شاعر الأندلس الشهير صاحب الموشقات؟",
      options: ["ابن زيدون", "لسان الدين بن الخطيب", "ابن زمرك", "ابن خفاجة"],
      correctAnswer: "لسان الدين بن الخطيب"
    },
    {
      question: "من هو مؤلف رواية 'دون كيخوته'؟",
      options: ["ميغيل دي سرفانتس", "فيكتور هوغو", "غوته", "دانتي أليغييري"],
      correctAnswer: "ميغيل دي سرفانتس"
    },
    {
      question: "من هو مؤلف كتاب 'الأيام'؟",
      options: ["طه حسين", "نجيب محفوظ", "العقاد", "توفيق الحكيم"],
      correctAnswer: "طه حسين"
    }
  ]
};

// Cache for pre-generated questions to avoid API calls on every game start
let questionsCache: Record<string, Question[]> = {};

// Initialize Google Generative AI with API key
const API_KEY = "AIzaSyDeh4J6gm-eln8JE_PpKt8qNtiUdjyTZYc";
const genAI = new GoogleGenerativeAI(API_KEY);

// Try to pre-generate questions for all categories when the app loads
export const preGenerateQuestions = async () => {
  console.log("Pre-generating questions for all categories...");
  try {
    for (const category of categories) {
      if (!questionsCache[category.id]) {
        console.log(`Pre-generating questions for ${category.id}...`);
        try {
          const questions = await generateQuestionsFromAPI(category.id, 20);
          if (questions && questions.length > 0) {
            questionsCache[category.id] = questions;
            console.log(`Successfully pre-generated ${questions.length} questions for ${category.id}`);
          }
        } catch (error) {
          console.log(`Failed to pre-generate questions for ${category.id}, will use fallback`);
          // If pre-generation fails, we'll fall back to local questions later
        }
      }
    }
  } catch (error) {
    console.error("Error during question pre-generation:", error);
  }
};

async function generateQuestionsFromAPI(category: string, count: number = 20): Promise<Question[]> {
  try {
    console.log(`Using Gemini API to generate ${count} questions for category: ${category}`);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Generate ${count} multiple-choice trivia questions in Arabic about the category "${category}".
      Return the result ONLY as a valid JSON array.
      Each object in the array should have the following keys:
      - "question": string in Arabic containing a challenging knowledge question
      - "options": array of 4 strings in Arabic with possible answers
      - "correctAnswer": string (must be one of the options)

      Ensure the output is only the JSON array, with no introductory text or markdown formatting.
      Make the questions challenging but not impossibly difficult.
      For the ${category} category, ensure questions are relevant, accurate and diverse.
      Each question must have exactly 4 options, and one correct answer that matches one of the options.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Got response from Gemini API");
    
    // Try to parse JSON safely
    let parsedQuestions;
    try {
      // Clean the text if it contains ```json ... ```
      const cleanedText = text.replace(/^```json\s*|```$/g, '').trim();
      parsedQuestions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error("Response text was:", text);
      throw new Error("Invalid JSON format received from API.");
    }

    // Ensure the result is an array
    if (!Array.isArray(parsedQuestions)) {
      console.error("Parsed data is not an array:", parsedQuestions);
      throw new Error("API did not return a valid array of questions.");
    }

    // Validate each question
    const validQuestions = parsedQuestions.filter((q: any) => {
      return (
        q && 
        typeof q.question === 'string' && 
        Array.isArray(q.options) && 
        q.options.length === 4 && 
        typeof q.correctAnswer === 'string' &&
        q.options.includes(q.correctAnswer)
      );
    });

    if (validQuestions.length === 0) {
      throw new Error("No valid questions were returned from the API.");
    }

    console.log(`Successfully generated ${validQuestions.length} valid questions`);
    return validQuestions;
  } catch (error) {
    console.error("Error generating questions with Gemini API:", error);
    throw error;
  }
}

// Main function to generate questions
export async function generateQuestions(category: string, count: number = 20): Promise<Question[]> {
  console.log("Generating questions for category:", category);
  
  // First check if we have cached questions for this category
  if (questionsCache[category] && questionsCache[category].length >= count) {
    console.log(`Using ${count} cached questions for ${category}`);
    
    // Return the requested number of questions from cache
    const cachedQuestions = questionsCache[category].slice(0, count);
    
    // Remove used questions from cache to avoid repeats
    questionsCache[category] = questionsCache[category].slice(count);
    
    return cachedQuestions;
  }
  
  try {
    // If no cache, generate questions using Gemini API
    const generatedQuestions = await generateQuestionsFromAPI(category, count);
    console.log(`Generated ${generatedQuestions.length} questions from Gemini API for ${category}`);
    toast.success("تم توليد أسئلة جديدة بواسطة الذكاء الاصطناعي");
    
    // Store extra questions in cache for future use
    if (generatedQuestions.length > count) {
      questionsCache[category] = generatedQuestions.slice(count);
    }
    
    // Return the requested number of questions
    return generatedQuestions.slice(0, count);
    
  } catch (error) {
    console.error("Error with Gemini API, falling back to local questions:", error);
    toast.error("حدث خطأ أثناء توليد الأسئلة، نستخدم الأسئلة المخزنة مسبقًا");
    
    // Fall back to the local database
    const fallbackCategoryQuestions = fallbackQuestions[category];
    
    if (fallbackCategoryQuestions && fallbackCategoryQuestions.length > 0) {
      console.log(`Using ${fallbackCategoryQuestions.length} fallback questions for ${category}`);
      
      // Return the questions or slice them if more than requested count
      return fallbackCategoryQuestions.length > count 
        ? fallbackCategoryQuestions.slice(0, count) 
        : fallbackCategoryQuestions;
    } else {
      // If no questions for this specific category, return general questions
      console.log("No fallback questions found for category, using general questions");
      return fallbackQuestions.general.slice(0, count);
    }
  }
}
