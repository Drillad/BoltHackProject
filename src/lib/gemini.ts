import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. AI features will be disabled.');
}

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

// Helper function to clean AI responses
const cleanResponse = (text: string): string => {
  // Remove common introductory phrases - expanded patterns to catch more variations
  const introPatterns = [
    /^(Okay|Sure|Here|Alright|Certainly|Great|Yes|Of course),?\s+(here\s+are|is|I'll|I've|I'd|I will|I have|I would|let me|let's).+?[:.]/i,
    /^(Here\s+are|Here\s+is)\s+.+?[:.]/i,
    /^(Below\s+are|Below\s+is)\s+.+?[:.]/i,
    /^(Following\s+are|Following\s+is)\s+.+?[:.]/i,
    /^(These\s+are|This\s+is)\s+.+?[:.]/i,
    /^I've\s+created\s+.+?[:.]/i,
    /^I've\s+generated\s+.+?[:.]/i,
    /^I've\s+prepared\s+.+?[:.]/i,
    /^I've\s+developed\s+.+?[:.]/i,
    /^I've\s+designed\s+.+?[:.]/i,
    /^I've\s+come\s+up\s+with\s+.+?[:.]/i,
    /^Based\s+on\s+your\s+request,?\s+.+?[:.]/i,
    /^As\s+requested,?\s+.+?[:.]/i,
    /^As\s+per\s+your\s+request,?\s+.+?[:.]/i
  ];
  
  let cleanedText = text;
  
  // Apply each pattern to remove introductory text
  for (const pattern of introPatterns) {
    cleanedText = cleanedText.replace(pattern, '');
  }
  
  // Remove markdown formatting (bold, italic, etc.)
  cleanedText = cleanedText.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold
  cleanedText = cleanedText.replace(/\*(.*?)\*/g, '$1');     // Remove italic
  cleanedText = cleanedText.replace(/__(.*?)__/g, '$1');     // Remove underline
  cleanedText = cleanedText.replace(/~~(.*?)~~/g, '$1');     // Remove strikethrough
  
  // Remove any remaining "Here are" phrases that might appear in the middle of the text
  cleanedText = cleanedText.replace(/Here are \d+ .+?:/g, '');
  
  // Trim whitespace
  cleanedText = cleanedText.trim();
  
  return cleanedText;
};

export const generateContent = async (prompt: string, context?: any): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API is not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    // Create a comprehensive prompt based on the context
    let fullPrompt = prompt;
    
    if (context) {
      // Add language instruction based on context
      const language = context.language || 'th'; // Default to Thai if not specified
      
      // Add language instruction to the prompt
      let languageInstruction = '';
      if (language === 'th') {
        languageInstruction = `Please respond in Thai language only. Do not include any introductory phrases like "Here are" or "I've created". Just provide the direct content.`;
      } else if (language === 'zh') {
        languageInstruction = `Please respond in Chinese language only. Do not include any introductory phrases like "Here are" or "I've created". Just provide the direct content.`;
      } else {
        languageInstruction = `Please respond in English language only. Do not include any introductory phrases like "Here are" or "I've created". Just provide the direct content.`;
      }
      
      fullPrompt = `${prompt}\n\n${languageInstruction}\n\nContext: ${JSON.stringify(context, null, 2)}`;
    }

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return cleanResponse(response.text());
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
};

export const generateLessonContent = async (type: string, context: any): Promise<string> => {
  const prompts = {
    'lesson-objectives': `Create detailed learning objectives for a ${context.subject} lesson about "${context.topic}" for ${context.grade} students. The lesson duration is ${context.duration} minutes and should cater to ${context.learningStyle} learning style. Provide 3-5 specific, measurable objectives using action verbs like "analyze," "create," "evaluate," etc.`,
    
    'lesson-activities': `Design engaging teaching activities for a ${context.subject} lesson about "${context.topic}" for ${context.grade} students. The lesson is ${context.duration} minutes long and should accommodate ${context.learningStyle} learning style. Include:
    1. Opening activity (5-10 minutes)
    2. Main activities (2-3 activities)
    3. Closing activity (5 minutes)
    For each activity, specify the time allocation and brief instructions.`,
    
    'lesson-materials': `List all necessary materials and resources for a ${context.subject} lesson about "${context.topic}" for ${context.grade} students. Include:
    - Physical materials (books, worksheets, supplies)
    - Technology requirements
    - Visual aids
    - Handouts or printables
    - Any special equipment needed`,
    
    'lesson-assessment': `Create assessment methods for a ${context.subject} lesson about "${context.topic}" for ${context.grade} students. Include:
    - Formative assessment strategies during the lesson
    - Summative assessment at the end
    - Rubrics or criteria for evaluation
    - Different assessment methods for various learning styles
    - How to provide feedback to students`
  };

  const prompt = prompts[type as keyof typeof prompts] || prompt;
  return generateContent(prompt, context);
};

export const generateActivityContent = async (context: any): Promise<string> => {
  const prompt = `Create a detailed ${context.activityType} activity for ${context.subject} students in ${context.grade} about "${context.topic}". 

  Please provide:
  1. Clear step-by-step instructions
  2. Time allocation for each step
  3. Materials needed
  4. Learning objectives
  5. Assessment criteria
  6. Variations for different skill levels
  7. Tips for classroom management

  Make it engaging and age-appropriate for the specified grade level.`;

  return generateContent(prompt, context);
};

export const generateTestQuestions = async (context: any): Promise<string> => {
  const prompt = `Create ${context.questionCount} ${context.difficulty} level ${context.questionType} questions for ${context.subject} about "${context.topic}" for ${context.grade} students.

  For multiple choice questions, format as:
  Question text|Option A|Option B|Option C|Option D|Correct Answer Index (0-3)

  For other question types, provide:
  - Clear question text
  - Expected answer or answer criteria
  - Point value suggestions

  Ensure questions are:
  - Age-appropriate for ${context.grade}
  - Aligned with curriculum standards
  - Varied in cognitive complexity
  - Clear and unambiguous`;

  return generateContent(prompt, context);
};

export const generateStudentAnalysis = async (context: any): Promise<string> => {
  const prompt = `Analyze the academic performance and provide recommendations for student "${context.studentName}".

  Student Data:
  - Average Score: ${context.scores.average}%
  - Behavior: ${context.behavior}

  Please provide:
  1. Performance analysis (strengths and areas for improvement)
  2. Specific learning recommendations
  3. Teaching strategies that might work best
  4. Suggested interventions if needed
  5. Ways to motivate and engage this student
  6. Parent communication suggestions

  Keep the analysis constructive and actionable.`;

  return generateContent(prompt, context);
};