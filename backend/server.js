// ==========================================
// AI TEACHER - BACKEND SERVER
// FULL REPLACEMENT CODE
// PERSONALIZED LEARNING VERSION
// ==========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const pdfParseModule = require("pdf-parse");

const { GoogleGenAI } = require("@google/genai");

// ==========================================
// APP
// ==========================================

const app = express();

const PORT = process.env.PORT || 5000;

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// ==========================================
// FOLDERS
// ==========================================

const uploadDir = path.join(
  __dirname,
  "uploads"
);

const assetsDir = path.join(
  __dirname,
  "assets"
);

const downloadsDir = path.join(
  __dirname,
  "downloads"
);

// ==========================================
// CREATE FOLDERS
// ==========================================

[
  uploadDir,
  assetsDir,
  downloadsDir,
].forEach((folder) => {

  if (!fs.existsSync(folder)) {

    fs.mkdirSync(
      folder,
      {
        recursive: true,
      }
    );

  }

});

// ==========================================
// STATIC FILES
// ==========================================

app.use(
  "/assets",
  express.static(assetsDir)
);

app.use(
  "/downloads",
  express.static(downloadsDir)
);

// ==========================================
// GEMINI CONFIGURATION
// ==========================================

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

const GEMINI_MODEL =
  process.env.GEMINI_MODEL ||
  "gemini-3.6-flash";

let ai = null;

if (
  GEMINI_API_KEY &&
  GEMINI_API_KEY.trim()
) {

  ai = new GoogleGenAI({
    apiKey:
      GEMINI_API_KEY.trim(),
  });

  console.log(
    "Gemini AI configured successfully."
  );

} else {

  console.log(
    "WARNING: GEMINI_API_KEY is missing."
  );

}

// ==========================================
// GEMINI RESPONSE TEXT
// ==========================================

function getGeminiText(
  response
) {

  if (!response) {

    return "";

  }

  if (
    typeof response.text ===
    "string"
  ) {

    return response.text.trim();

  }

  if (
    typeof response.text ===
    "function"
  ) {

    const result =
      response.text();

    if (
      typeof result ===
      "string"
    ) {

      return result.trim();

    }

  }

  if (
    response.candidates &&
    response.candidates[0] &&
    response.candidates[0].content &&
    response.candidates[0].content.parts
  ) {

    return response.candidates[0]
      .content
      .parts
      .map(
        (part) =>
          part.text || ""
      )
      .join("")
      .trim();

  }

  return "";

}

// ==========================================
// GENERATE AI RESPONSE
// ==========================================

async function generateAIResponse(
  prompt,
  options = {}
) {

  if (!ai) {

    throw new Error(
      "Gemini API is not configured. Please check GEMINI_API_KEY in .env file."
    );

  }

  console.log(
    "Using Gemini model:",
    GEMINI_MODEL
  );

  try {

    const request = {

      model:
        GEMINI_MODEL,

      contents:
        prompt,

    };

    if (
      options.responseMimeType
    ) {

      request.config = {

        responseMimeType:
          options.responseMimeType,

      };

    }

    const response =
      await ai.models.generateContent(
        request
      );

    const text =
      getGeminiText(
        response
      );

    if (
      !text ||
      !text.trim()
    ) {

      throw new Error(
        "Gemini AI did not return any text."
      );

    }

    return text.trim();

  } catch (error) {

    console.error(
      "Gemini Generate Error:",
      error
    );

    throw new Error(
      error.message ||
      "Failed to generate AI response."
    );

  }

}

// ==========================================
// PDF PARSER
// ==========================================

async function extractPdfText(
  pdfBuffer
) {

  if (
    typeof pdfParseModule ===
    "function"
  ) {

    const result =
      await pdfParseModule(
        pdfBuffer
      );

    return {

      text:
        result.text || "",

      numpages:
        result.numpages || 1,

    };

  }

  if (
    pdfParseModule &&
    typeof pdfParseModule.default ===
    "function"
  ) {

    const result =
      await pdfParseModule.default(
        pdfBuffer
      );

    return {

      text:
        result.text || "",

      numpages:
        result.numpages || 1,

    };

  }

  if (
    pdfParseModule &&
    pdfParseModule.PDFParse
  ) {

    const PDFParse =
      pdfParseModule.PDFParse;

    let parser = null;

    try {

      parser =
        new PDFParse({

          data:
            new Uint8Array(
              pdfBuffer
            ),

        });

      const result =
        await parser.getText();

      return {

        text:
          result.text || "",

        numpages:
          result.total ||
          result.numpages ||
          result.numPages ||
          1,

      };

    } finally {

      if (
        parser &&
        typeof parser.destroy ===
        "function"
      ) {

        try {

          await parser.destroy();

        } catch (error) {

          console.log(
            "PDF cleanup warning:",
            error.message
          );

        }

      }

    }

  }

  throw new Error(
    "Unsupported pdf-parse package version."
  );

}

// ==========================================
// MULTER STORAGE
// ==========================================

const storage =
  multer.diskStorage({

    destination:
      (
        req,
        file,
        cb
      ) => {

        cb(
          null,
          uploadDir
        );

      },

    filename:
      (
        req,
        file,
        cb
      ) => {

        const safeName =
          file.originalname.replace(
            /[^a-zA-Z0-9.\-_]/g,
            "-"
          );

        const uniqueName =
          Date.now() +
          "-" +
          Math.round(
            Math.random() *
            1000000
          ) +
          "-" +
          safeName;

        cb(
          null,
          uniqueName
        );

      },

  });

// ==========================================
// FILE FILTER
// ==========================================

const fileFilter =
  (
    req,
    file,
    cb
  ) => {

    const isPDF =

      file.mimetype ===
      "application/pdf"

      ||

      file.originalname
        .toLowerCase()
        .endsWith(
          ".pdf"
        );

    if (isPDF) {

      cb(
        null,
        true
      );

    } else {

      cb(
        new Error(
          "Only PDF files are allowed."
        ),
        false
      );

    }

  };

// ==========================================
// UPLOAD
// ==========================================

const upload =
  multer({

    storage,

    fileFilter,

    limits: {

      fileSize:
        25 *
        1024 *
        1024,

    },

  });

// ==========================================
// TEMP PDF STORAGE
// ==========================================

const uploadedDocuments =
  {};

// ==========================================
// CLEAN JSON
// ==========================================

function cleanJsonText(
  text
) {

  if (!text) {

    return "";

  }

  let cleaned =
    text
      .replace(
        /```json/gi,
        ""
      )
      .replace(
        /```/g,
        ""
      )
      .trim();

  const firstBrace =
    cleaned.indexOf(
      "{"
    );

  const lastBrace =
    cleaned.lastIndexOf(
      "}"
    );

  if (
    firstBrace !== -1 &&
    lastBrace !== -1
  ) {

    cleaned =
      cleaned.substring(
        firstBrace,
        lastBrace + 1
      );

  }

  return cleaned;

}

// ==========================================
// PERSONALIZATION HELPER
// ==========================================

function getPreferences(
  body = {}
) {

  const level =
    [
      "Beginner",
      "Intermediate",
      "Advanced",
    ].includes(body.level)
      ? body.level
      : "Beginner";

  const language =
    [
      "English",
      "Hindi",
      "Marathi",
    ].includes(body.language)
      ? body.language
      : "English";

  const allowedTimes =
    ["10", "20", "30"];

  const learningTime =
    allowedTimes.includes(
      String(
        body.learningTime
      )
    )
      ? String(
          body.learningTime
        )
      : "20";

  return {

    level,

    language,

    learningTime,

  };

}

// ==========================================
// PERSONALIZATION PROMPT
// ==========================================

function getPersonalizationPrompt(
  preferences
) {

  return `

STUDENT PERSONALIZATION:

Learning Level:
${preferences.level}

Preferred Language:
${preferences.language}

Available Learning Time:
${preferences.learningTime} minutes

IMPORTANT PERSONALIZATION RULES:

1. Adapt the explanation to the student's learning level.

2. Beginner:
Use very simple words, explain basic concepts slowly,
and provide easy examples.

3. Intermediate:
Use moderate technical detail and explain important concepts
with practical examples.

4. Advanced:
Provide deeper concepts, technical details,
and more challenging explanations.

5. Generate the teaching content primarily in:
${preferences.language}

6. Adjust the amount and depth of content for approximately:
${preferences.learningTime} minutes.

7. Make the lesson student-friendly and easy to understand.

`;

}

// ==========================================
// FALLBACK SLIDES
// ==========================================

function createFallbackSlides(
  text,
  subject
) {

  const cleanText =
    (
      text ||
      ""
    )
      .replace(
        /[#*`]/g,
        ""
      )
      .trim();

  if (!cleanText) {

    return [

      {

        title:
          `Introduction to ${subject}`,

        narration:
          `${subject} is an important topic. Let us understand it step by step.`,

      },

    ];

  }

  const paragraphs =
    cleanText
      .split(
        /\n\s*\n/
      )
      .map(
        (item) =>
          item.trim()
      )
      .filter(
        (item) =>
          item.length > 30
      );

  let slides =
    paragraphs
      .slice(
        0,
        7
      )
      .map(
        (
          paragraph,
          index
        ) => ({

          title:
            `Lesson Part ${
              index + 1
            }`,

          narration:
            paragraph,

        })
      );

  if (
    slides.length === 0
  ) {

    slides = [

      {

        title:
          `Introduction to ${subject}`,

        narration:
          cleanText,

      },

    ];

  }

  return slides;

}

// ==========================================
// HOME
// ==========================================

app.get(
  "/",
  (
    req,
    res
  ) => {

    res.json({

      success:
        true,

      message:
        "AI Teacher Backend is Running",

      endpoints: {

        health:
          "/api/health",

        upload:
          "/api/study/upload",

        explain:
          "/api/study/explain",

        lesson:
          "/api/video/generate",

        mcq:
          "/api/study/mcq",

        teacherVideo:
          "/api/teacher-video",

      },

    });

  }
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get(
  "/api/health",
  (
    req,
    res
  ) => {

    const videoPath =
      path.join(
        assetsDir,
        "teacher-classroom.mp4"
      );

    const videoExists =
      fs.existsSync(
        videoPath
      );

    res.json({

      success:
        true,

      message:
        "Backend is working properly",

      geminiConfigured:
        !!ai,

      model:
        GEMINI_MODEL,

      videoAvailable:
        videoExists,

      videoUrl:
        videoExists
          ? `http://localhost:${PORT}/assets/teacher-classroom.mp4`
          : "",

    });

  }
);

// ==========================================
// TEACHER VIDEO
// ==========================================

app.get(
  "/api/teacher-video",
  (
    req,
    res
  ) => {

    const videoPath =
      path.join(
        assetsDir,
        "teacher-classroom.mp4"
      );

    if (
      !fs.existsSync(
        videoPath
      )
    ) {

      return res
        .status(404)
        .json({

          success:
            false,

          message:
            "Teacher video was not found.",

          expectedFile:
            "backend/assets/teacher-classroom.mp4",

        });

    }

    return res.json({

      success:
        true,

      videoAvailable:
        true,

      videoUrl:
        `http://localhost:${PORT}/assets/teacher-classroom.mp4`,

    });

  }
);

// ==========================================
// PDF UPLOAD
// ==========================================

app.post(
  "/api/study/upload",

  upload.single(
    "pdf"
  ),

  async (
    req,
    res
  ) => {

    try {

      if (!req.file) {

        return res
          .status(400)
          .json({

            success:
              false,

            message:
              "Please select a PDF file.",

          });

      }

      const topic =
        (
          req.body.topic ||
          ""
        ).trim();

      const pdfBuffer =
        fs.readFileSync(
          req.file.path
        );

      const pdfData =
        await extractPdfText(
          pdfBuffer
        );

      const extractedText =
        pdfData.text ||
        "";

      uploadedDocuments[
        req.file.filename
      ] = {

        originalName:
          req.file.originalname,

        savedName:
          req.file.filename,

        topic,

        text:
          extractedText,

        totalPages:
          pdfData.numpages ||
          1,

        uploadedAt:
          new Date(),

      };

      console.log(
        "PDF uploaded successfully:",
        req.file.originalname
      );

      return res.json({

        success:
          true,

        message:
          "PDF uploaded successfully.",

        file: {

          fileName:
            req.file.filename,

          originalName:
            req.file.originalname,

          totalPages:
            pdfData.numpages ||
            1,

          textLength:
            extractedText.length,

        },

      });

    } catch (error) {

      console.error(
        "PDF Upload Error:",
        error
      );

      return res
        .status(500)
        .json({

          success:
            false,

          message:
            error.message ||
            "PDF upload failed.",

        });

    }

  }
);

// ==========================================
// GENERATE STUDY NOTES
// PERSONALIZED
// ==========================================

app.post(
  "/api/study/explain",

  async (
    req,
    res
  ) => {

    try {

      const {
        topic,
        fileName,
      } = req.body;

      const preferences =
        getPreferences(
          req.body
        );

      let subject =
        (
          topic ||
          ""
        ).trim();

      let pdfContent =
        "";

      if (
        fileName &&
        uploadedDocuments[
          fileName
        ]
      ) {

        const document =
          uploadedDocuments[
            fileName
          ];

        pdfContent =
          document.text ||
          "";

        if (
          !subject &&
          document.topic
        ) {

          subject =
            document.topic;

        }

      }

      if (!subject) {

        subject =
          "the uploaded study material";

      }

      const limitedContent =
        pdfContent.substring(
          0,
          15000
        );

      const prompt =
        `
You are an expert teacher and educational content writer.

Create high quality and properly structured study notes.

TOPIC:
${subject}

STUDY MATERIAL:
${limitedContent || "No PDF was provided. Explain the topic using your knowledge."}

${getPersonalizationPrompt(preferences)}

Create detailed notes using this structure:

# ${subject}

## Introduction

## Definition

## Important Concepts

## Detailed Explanation

## Important Terms

## Examples

## Advantages or Importance

## Key Points for Examination

## Summary

RULES:

- Use clear headings.
- Use bullet points where necessary.
- Give useful examples.
- Make notes suitable for exam preparation.
- Do not mention that you are an AI.
- Return only the study notes.
`;

      console.log(
        "Generating personalized AI study notes..."
      );

      const explanation =
        await generateAIResponse(
          prompt
        );

      return res.json({

        success:
          true,

        subject,

        explanation,

        preferences,

      });

    } catch (error) {

      console.error(
        "Explanation Error:",
        error
      );

      return res
        .status(500)
        .json({

          success:
            false,

          message:
            error.message ||
            "Failed to generate study notes.",

        });

    }

  }
);

// ==========================================
// GENERATE AI TEACHER LESSON
// PERSONALIZED
// ==========================================

app.post(
  "/api/video/generate",

  async (
    req,
    res
  ) => {

    try {

      const {
        topic,
        explanation,
      } = req.body;

      const preferences =
        getPreferences(
          req.body
        );

      const subject =
        (
          topic ||
          "Study Topic"
        ).trim();

      const studyContent =
        (
          explanation ||
          ""
        )
          .substring(
            0,
            15000
          );

      if (!studyContent) {

        return res
          .status(400)
          .json({

            success:
              false,

            message:
              "Please generate study notes first.",

          });

      }

      const prompt =
        `
You are a friendly AI teacher.

Create a spoken lesson for a student.

TOPIC:
${subject}

STUDY NOTES:
${studyContent}

${getPersonalizationPrompt(preferences)}

Return ONLY valid JSON.

Use exactly this format:

{
  "slides": [
    {
      "title": "Lesson title",
      "narration": "Natural spoken explanation."
    }
  ]
}

RULES:

- Create between 5 and 7 lesson parts.
- Sound like a real teacher.
- Start by introducing the topic.
- Explain important concepts.
- Include an example.
- End with a short summary.
- Do not use markdown.
- Do not use unnecessary symbols.
`;

      console.log(
        "Generating personalized AI Teacher lesson..."
      );

      const aiResponse =
        await generateAIResponse(
          prompt,
          {
            responseMimeType:
              "application/json",
          }
        );

      let parsedData =
        null;

      try {

        parsedData =
          JSON.parse(
            cleanJsonText(
              aiResponse
            )
          );

      } catch (error) {

        console.log(
          "Lesson JSON parsing failed. Using fallback slides."
        );

      }

      let slides =
        [];

      if (
        parsedData &&
        Array.isArray(
          parsedData.slides
        )
      ) {

        slides =
          parsedData.slides
            .filter(
              (slide) =>
                slide &&
                slide.title &&
                slide.narration
            )
            .slice(
              0,
              8
            )
            .map(
              (slide) => ({

                title:
                  String(
                    slide.title
                  )
                    .replace(
                      /[#*`]/g,
                      ""
                    )
                    .trim(),

                narration:
                  String(
                    slide.narration
                  )
                    .replace(
                      /[#*`]/g,
                      ""
                    )
                    .trim(),

              })
            );

      }

      if (
        slides.length === 0
      ) {

        slides =
          createFallbackSlides(
            studyContent,
            subject
          );

      }

      const videoPath =
        path.join(
          assetsDir,
          "teacher-classroom.mp4"
        );

      const videoExists =
        fs.existsSync(
          videoPath
        );

      return res.json({

        success:
          true,

        message:
          "Personalized AI Teacher lesson generated successfully.",

        slides,

        preferences,

        videoAvailable:
          videoExists,

        videoUrl:
          videoExists
            ? `http://localhost:${PORT}/assets/teacher-classroom.mp4`
            : "",

      });

    } catch (error) {

      console.error(
        "Video Generation Error:",
        error
      );

      return res
        .status(500)
        .json({

          success:
            false,

          message:
            error.message ||
            "AI teacher lesson generation failed.",

        });

    }

  }
);

// ==========================================
// GENERATE MCQ QUIZ
// PERSONALIZED
// ==========================================

app.post(
  "/api/study/mcq",

  async (
    req,
    res
  ) => {

    try {

      const {
        topic,
        explanation,
      } = req.body;

      const preferences =
        getPreferences(
          req.body
        );

      const subject =
        topic ||
        "Study Topic";

      const content =
        (
          explanation ||
          ""
        )
          .substring(
            0,
            12000
          );

      const prompt =
        `
Create an educational multiple choice quiz.

TOPIC:
${subject}

STUDY NOTES:
${content}

${getPersonalizationPrompt(preferences)}

Return ONLY valid JSON.

Use exactly this format:

{
  "questions": [
    {
      "question": "Question here",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 0,
      "explanation": "Short explanation"
    }
  ]
}

RULES:

- Generate exactly 10 questions.
- Every question must contain exactly 4 options.
- correctAnswer must be 0, 1, 2, or 3.
- Questions must be related to the study notes.
- Match question difficulty to the student level.
- Use the student's preferred language.
`;

      console.log(
        "Generating personalized MCQ quiz..."
      );

      const aiResponse =
        await generateAIResponse(
          prompt,
          {
            responseMimeType:
              "application/json",
          }
        );

      let quizData;

      try {

        quizData =
          JSON.parse(
            cleanJsonText(
              aiResponse
            )
          );

      } catch (error) {

        console.error(
          "Quiz JSON Error:",
          aiResponse
        );

        throw new Error(
          "AI returned invalid quiz data. Please try again."
        );

      }

      if (
        !quizData.questions ||
        !Array.isArray(
          quizData.questions
        )
      ) {

        throw new Error(
          "Invalid quiz format."
        );

      }

      const questions =
        quizData.questions
          .slice(
            0,
            10
          )
          .map(
            (question) => ({

              question:
                question.question ||
                "Question unavailable",

              options:
                Array.isArray(
                  question.options
                )
                  ? question.options
                      .slice(
                        0,
                        4
                      )
                  : [],

              correctAnswer:
                Number(
                  question.correctAnswer
                ) || 0,

              explanation:
                question.explanation ||
                "",

            })
          );

      return res.json({

        success:
          true,

        questions,

        preferences,

      });

    } catch (error) {

      console.error(
        "MCQ Error:",
        error
      );

      return res
        .status(500)
        .json({

          success:
            false,

          message:
            error.message ||
            "Failed to generate quiz.",

        });

    }

  }
);

// ==========================================
// DOWNLOAD VIDEO
// ==========================================

app.get(
  "/api/download/video",

  (
    req,
    res
  ) => {

    const videoPath =
      path.join(
        assetsDir,
        "teacher-classroom.mp4"
      );

    if (
      !fs.existsSync(
        videoPath
      )
    ) {

      return res
        .status(404)
        .json({

          success:
            false,

          message:
            "Video file not found.",

        });

    }

    return res.download(
      videoPath,
      "AI-Teacher-Video.mp4"
    );

  }
);

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "SERVER ERROR:",
      error
    );

    if (
      error instanceof
      multer.MulterError
    ) {

      return res
        .status(400)
        .json({

          success:
            false,

          message:
            error.message,

        });

    }

    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message ||
          "Internal server error.",

      });

  }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(
  PORT,
  () => {

    const videoPath =
      path.join(
        assetsDir,
        "teacher-classroom.mp4"
      );

    console.log("");

    console.log(
      "=========================================="
    );

    console.log(
      "AI TEACHER BACKEND STARTED"
    );

    console.log(
      "=========================================="
    );

    console.log(
      `Server: http://localhost:${PORT}`
    );

    console.log(
      `Health: http://localhost:${PORT}/api/health`
    );

    console.log(
      `Video: http://localhost:${PORT}/assets/teacher-classroom.mp4`
    );

    console.log(
      `Video Exists: ${
        fs.existsSync(
          videoPath
        )
      }`
    );

    console.log(
      `Gemini AI: ${
        ai
          ? "READY"
          : "NOT CONFIGURED"
      }`
    );

    console.log(
      `Gemini Model: ${GEMINI_MODEL}`
    );

    console.log(
      "=========================================="
    );

    console.log("");

  }
);