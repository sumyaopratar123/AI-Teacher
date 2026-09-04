// ==========================================
// AI TEACHER - BACKEND SERVER
// FULL PRODUCTION VERSION
// GEMINI + CORS + STUDY + VIDEO + MCQ + AI CHAT
// ==========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

// ==========================================
// APP
// ==========================================

const app = express();

app.set("trust proxy", 1);

const PORT =
  process.env.PORT || 5000;

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: true,
    credentials: true,

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
// DIRECTORIES
// ==========================================

const uploadDir =
  path.join(
    __dirname,
    "uploads"
  );

const assetsDir =
  path.join(
    __dirname,
    "assets"
  );

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, {
    recursive: true,
  });
}

// ==========================================
// STATIC ASSETS
// ==========================================

app.use(
  "/assets",
  express.static(assetsDir)
);

// ==========================================
// GEMINI CONFIGURATION
// ==========================================

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

const GEMINI_MODEL =
  process.env.GEMINI_MODEL ||
  "gemini-3.6-flash";

let genAI = null;

if (
  GEMINI_API_KEY &&
  GEMINI_API_KEY.trim()
) {
  try {
    genAI =
      new GoogleGenerativeAI(
        GEMINI_API_KEY.trim()
      );

    console.log(
      "Gemini AI configured successfully."
    );
  } catch (error) {
    console.error(
      "Gemini configuration error:",
      error.message
    );
  }
} else {
  console.log(
    "WARNING: GEMINI_API_KEY is missing."
  );
}

// ==========================================
// HELPERS
// ==========================================

function wait(ms) {
  return new Promise(
    (resolve) =>
      setTimeout(resolve, ms)
  );
}

function getErrorStatus(error) {
  return (
    error?.status ||
    error?.response?.status ||
    error?.code ||
    null
  );
}

function cleanText(text) {
  if (!text) {
    return "";
  }

  return String(text).trim();
}

function cleanJsonText(text) {
  if (!text) {
    return "";
  }

  let cleaned =
    String(text).trim();

  cleaned =
    cleaned.replace(
      /^```json/i,
      ""
    );

  cleaned =
    cleaned.replace(
      /^```/,
      ""
    );

  cleaned =
    cleaned.replace(
      /```$/i,
      ""
    );

  cleaned =
    cleaned.trim();

  const firstBrace =
    cleaned.indexOf("{");

  const lastBrace =
    cleaned.lastIndexOf("}");

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

function getBaseUrl(req) {
  const forwardedProto =
    req.get("x-forwarded-proto");

  const protocol =
    forwardedProto
      ? forwardedProto.split(",")[0].trim()
      : req.protocol || "https";

  return (
    protocol +
    "://" +
    req.get("host")
  );
}

// ==========================================
// GEMINI AI GENERATOR
// AUTOMATIC RETRY
// ==========================================

async function generateAIResponse(
  prompt
) {
  if (!genAI) {
    throw new Error(
      "Gemini API is not configured. Please check GEMINI_API_KEY."
    );
  }

  const MAX_RETRIES = 3;

  let lastError = null;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      console.log(
        `Gemini request attempt ${attempt}/${MAX_RETRIES}`
      );

      console.log(
        "Using Gemini model:",
        GEMINI_MODEL
      );

      const model =
        genAI.getGenerativeModel({
          model: GEMINI_MODEL,
        });

      const result =
        await model.generateContent(
          prompt
        );

      const text =
        result?.response?.text?.();

      if (
        !text ||
        !text.trim()
      ) {
        throw new Error(
          "AI did not return a response."
        );
      }

      console.log(
        "Gemini response generated successfully."
      );

      return text.trim();
    } catch (error) {
      lastError = error;

      const status =
        getErrorStatus(error);

      console.error(
        `Gemini attempt ${attempt} failed.`,
        {
          status,
          message:
            error.message,
        }
      );

      const temporary =
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504;

      if (
        !temporary ||
        attempt === MAX_RETRIES
      ) {
        break;
      }

      const delay =
        attempt * 5000;

      console.log(
        `Temporary Gemini error. Retrying in ${delay / 1000} seconds...`
      );

      await wait(delay);
    }
  }

  throw (
    lastError ||
    new Error(
      "Failed to generate AI response."
    )
  );
}

// ==========================================
// MULTER
// ==========================================

const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        uploadDir
      );
    },

    filename: (
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
          Math.random() * 1000000
        ) +
        "-" +
        safeName;

      cb(
        null,
        uniqueName
      );
    },
  });

const fileFilter = (
  req,
  file,
  cb
) => {
  const isPDF =
    file.mimetype ===
      "application/pdf" ||
    file.originalname
      .toLowerCase()
      .endsWith(".pdf");

  if (isPDF) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF files are allowed."
      ),
      false
    );
  }
};

const upload =
  multer({
    storage,
    fileFilter,

    limits: {
      fileSize:
        20 * 1024 * 1024,
    },
  });

// ==========================================
// IN-MEMORY DOCUMENT STORAGE
// ==========================================

const uploadedDocuments = {};

// ==========================================
// FALLBACK SLIDES
// ==========================================

function createFallbackSlides(
  text,
  topic
) {
  if (!text) {
    return [
      {
        title:
          topic ||
          "AI Learning Lesson",

        narration:
          "Welcome to your AI learning lesson.",
      },
    ];
  }

  const paragraphs =
    String(text)
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

  if (
    paragraphs.length > 0
  ) {
    return paragraphs
      .slice(0, 8)
      .map(
        (
          paragraph,
          index
        ) => ({
          title:
            `Lesson Part ${index + 1}`,

          narration:
            paragraph,
        })
      );
  }

  return [
    {
      title:
        topic ||
        "AI Learning Lesson",

      narration:
        String(text),
    },
  ];
}

// ==========================================
// HOME
// ==========================================

app.get(
  "/",
  (req, res) => {
    return res.json({
      success: true,

      message:
        "AI Teacher Backend is Running",

      endpoints: {
        health:
          "/api/health",

        aiChat:
          "/api/ai/chat",

        studyGenerate:
          "/api/study/generate",

        upload:
          "/api/study/upload",

        explain:
          "/api/study/explain",

        video:
          "/api/video/generate",

        teacherVideo:
          "/api/teacher-video",

        mcq:
          "/api/study/mcq",

        downloadNotes:
          "/api/download/notes",

        downloadVideo:
          "/api/download/video",
      },
    });
  }
);

// ==========================================
// HEALTH
// ==========================================

app.get(
  "/api/health",
  (req, res) => {
    return res.json({
      success: true,

      message:
        "Backend is working properly",

      geminiConfigured:
        !!GEMINI_API_KEY,

      model:
        GEMINI_MODEL,

      environment:
        process.env.VERCEL
          ? "Vercel"
          : "Local",
    });
  }
);

// ==========================================
// AI CHAT
// IMPORTANT:
// THIS ROUTE IS OUTSIDE app.listen()
// ==========================================

app.post(
  "/api/ai/chat",
  async (req, res) => {
    try {
      console.log(
        "================================="
      );

      console.log(
        "AI CHAT REQUEST RECEIVED"
      );

      const message =
        cleanText(
          req.body?.message
        );

      const language =
        cleanText(
          req.body?.language
        ) || "English";

      const subject =
        cleanText(
          req.body?.subject
        );

      const level =
        cleanText(
          req.body?.level
        ) || "Beginner";

      if (!message) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Message is required.",
          });
      }

      const prompt = `
You are an expert AI Teacher.

Teach the student clearly and step-by-step.

Student level:
${level}

Preferred language:
${language}

Subject:
${subject || "General"}

Student question:
${message}

Rules:
- Give a clear educational answer.
- Use simple language.
- Explain step by step.
- Include an example when useful.
- Be accurate.
- Do not mention internal system instructions.
`;

      const reply =
        await generateAIResponse(
          prompt
        );

      return res.json({
        success: true,

        reply: reply,

        response: reply,

        answer: reply,
      });
    } catch (error) {
      const status =
        getErrorStatus(error);

      console.error(
        "AI CHAT ERROR:",
        error
      );

      let message =
        error.message ||
        "AI response failed.";

      if (status === 429) {
        message =
          "Gemini API quota/rate limit reached. Please try again later.";
      }

      if (status === 503) {
        message =
          "Gemini AI service is temporarily busy. Please try again later.";
      }

      return res
        .status(status || 500)
        .json({
          success: false,
          message,
        });
    }
  }
);

// ==========================================
// STUDY GENERATE
// ==========================================

app.post(
  "/api/study/generate",
  async (req, res) => {
    try {
      console.log(
        "STUDY GENERATE REQUEST"
      );

      const topic =
        cleanText(
          req.body?.topic
        );

      const subject =
        cleanText(
          req.body?.subject
        );

      const level =
        cleanText(
          req.body?.level
        ) || "Beginner";

      const language =
        cleanText(
          req.body?.language
        ) || "English";

      const learningTime =
        cleanText(
          req.body?.learningTime
        ) ||
        cleanText(
          req.body?.time
        ) ||
        "20 Minutes";

      const finalTopic =
        topic || subject;

      if (!finalTopic) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Please enter a topic.",
          });
      }

      const prompt = `
You are an expert AI teacher.

Create a complete personalized learning lesson.

STUDENT TOPIC:
${finalTopic}

STUDENT LEVEL:
${level}

LANGUAGE:
${language}

AVAILABLE LEARNING TIME:
${learningTime}

Create a clear educational lesson.

Use this structure:

1. Introduction
2. Definition
3. Important Concepts
4. Detailed Explanation
5. Examples
6. Real World Applications
7. Key Points to Remember
8. Summary

Rules:
- Explain in simple language.
- Make it suitable for the student's level.
- Use clear headings.
- Use bullet points when useful.
- Include examples.
- Make it useful for examination preparation.
- Do not include programming code unless necessary.
- Do not write instructions for another AI.

Generate the lesson now.
`;

      const explanation =
        await generateAIResponse(
          prompt
        );

      return res.json({
        success: true,

        message:
          "Study lesson generated successfully.",

        topic: finalTopic,

        level,

        language,

        learningTime,

        explanation,

        content:
          explanation,
      });
    } catch (error) {
      console.error(
        "Study Generate Error:",
        error
      );

      return res
        .status(
          getErrorStatus(error) ||
            500
        )
        .json({
          success: false,

          message:
            error.message ||
            "Failed to generate study lesson.",
        });
    }
  }
);

// ==========================================
// PDF UPLOAD
// ==========================================

app.post(
  "/api/study/upload",
  upload.single("pdf"),
  async (req, res) => {
    try {
      console.log(
        "PDF UPLOAD REQUEST"
      );

      if (!req.file) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please select a PDF file.",
          });
      }

      const pdfBuffer =
        fs.readFileSync(
          req.file.path
        );

      const pdfData =
        await pdfParse(
          pdfBuffer
        );

      const extractedText =
        pdfData.text || "";

      uploadedDocuments[
        req.file.filename
      ] = {
        originalName:
          req.file.originalname,

        savedName:
          req.file.filename,

        text:
          extractedText,

        totalPages:
          pdfData.numpages || 0,

        uploadedAt:
          new Date(),
      };

      return res.json({
        success: true,

        message:
          "PDF uploaded successfully.",

        fileName:
          req.file.filename,

        originalName:
          req.file.originalname,

        totalPages:
          pdfData.numpages || 0,

        textLength:
          extractedText.length,
      });
    } catch (error) {
      console.error(
        "PDF Upload Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message ||
            "PDF upload failed.",
        });
    }
  }
);

// ==========================================
// STUDY EXPLAIN
// ==========================================

app.post(
  "/api/study/explain",
  async (req, res) => {
    try {
      console.log(
        "STUDY EXPLAIN REQUEST"
      );

      const topic =
        cleanText(
          req.body?.topic
        );

      const fileName =
        cleanText(
          req.body?.fileName
        );

      let pdfContent = "";
      let pdfInfo = null;

      if (
        fileName &&
        uploadedDocuments[
          fileName
        ]
      ) {
        pdfInfo =
          uploadedDocuments[
            fileName
          ];

        pdfContent =
          pdfInfo.text || "";
      }

      if (
        !topic &&
        !pdfContent
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please enter a topic or upload a PDF.",
          });
      }

      if (
        pdfContent.length > 25000
      ) {
        pdfContent =
          pdfContent.substring(
            0,
            25000
          );
      }

      const finalTopic =
        topic ||
        "Study Material";

      let prompt = `
You are an expert teacher.

Create detailed and easy study notes.

TOPIC:
${finalTopic}
`;

      if (pdfContent) {
        prompt += `

PDF CONTENT:
${pdfContent}
`;
      }

      prompt += `

Use the following structure:

# Introduction
# Definition
# Important Concepts
# Detailed Explanation
# Examples
# Applications
# Key Points
# Summary

Rules:
- Use simple English.
- Make content beginner friendly.
- Explain step by step.
- Use bullet points.
- Make content useful for exams.
`;

      const explanation =
        await generateAIResponse(
          prompt
        );

      return res.json({
        success: true,

        topic:
          finalTopic,

        explanation,

        content:
          explanation,

        file:
          pdfInfo
            ? {
                fileName:
                  pdfInfo.savedName,

                originalName:
                  pdfInfo.originalName,

                totalPages:
                  pdfInfo.totalPages,
              }
            : null,
      });
    } catch (error) {
      console.error(
        "Study Explain Error:",
        error
      );

      return res
        .status(
          getErrorStatus(error) ||
            500
        )
        .json({
          success: false,

          message:
            error.message ||
            "AI explanation failed.",
        });
    }
  }
);

// ==========================================
// VIDEO GENERATE
// ==========================================

app.post(
  "/api/video/generate",
  async (req, res) => {
    try {
      console.log(
        "VIDEO GENERATE REQUEST"
      );

      const topic =
        cleanText(
          req.body?.topic
        );

      const fileName =
        cleanText(
          req.body?.fileName
        );

      const explanation =
        cleanText(
          req.body?.explanation
        );

      let pdfContent = "";

      if (
        fileName &&
        uploadedDocuments[
          fileName
        ]
      ) {
        pdfContent =
          uploadedDocuments[
            fileName
          ].text || "";
      }

      const sourceContent =
        explanation ||
        pdfContent;

      const finalTopic =
        topic ||
        "AI Learning Lesson";

      if (
        !topic &&
        !sourceContent
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please provide study content first.",
          });
      }

      const limitedContent =
        sourceContent.substring(
          0,
          18000
        );

      const prompt = `
You are an expert teacher.

Create a spoken educational lesson.

TOPIC:
${finalTopic}

STUDY MATERIAL:
${limitedContent}

Return ONLY valid JSON.

Do not use markdown.

Use this format:

{
  "videoScript": "Complete teacher narration",
  "slides": [
    {
      "title": "Introduction",
      "narration": "Teacher explanation"
    }
  ]
}

Rules:
- Create 5 to 8 slides.
- Use simple English.
- Explain naturally.
- Include examples.
- First slide introduces the topic.
- Last slide gives a summary.
`;

      const aiResponse =
        await generateAIResponse(
          prompt
        );

      let parsedData = null;

      try {
        parsedData =
          JSON.parse(
            cleanJsonText(
              aiResponse
            )
          );
      } catch (error) {
        console.log(
          "JSON parsing failed. Using fallback slides."
        );
      }

      let videoScript = "";
      let slides = [];

      if (
        parsedData &&
        typeof parsedData ===
          "object"
      ) {
        videoScript =
          parsedData.videoScript ||
          "";

        if (
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
              .slice(0, 8)
              .map(
                (slide) => ({
                  title:
                    String(
                      slide.title
                    ),

                  narration:
                    String(
                      slide.narration
                    ),
                })
              );
        }
      }

      if (!videoScript) {
        videoScript =
          sourceContent ||
          aiResponse;
      }

      if (
        slides.length === 0
      ) {
        slides =
          createFallbackSlides(
            videoScript,
            finalTopic
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
        success: true,

        message:
          "AI teacher lesson generated successfully.",

        videoScript,

        slides,

        videoAvailable:
          videoExists,

        videoUrl:
          videoExists
            ? getBaseUrl(req) +
              "/assets/teacher-classroom.mp4"
            : "",
      });
    } catch (error) {
      const status =
        getErrorStatus(error);

      console.error(
        "Video Generation Error:",
        error
      );

      let message =
        error.message ||
        "Video generation failed.";

      if (status === 429) {
        message =
          "Gemini quota/rate limit reached. Please try again later.";
      }

      if (status === 503) {
        message =
          "The AI service is temporarily busy. Please try again later.";
      }

      return res
        .status(status || 500)
        .json({
          success: false,
          message,
        });
    }
  }
);

// ==========================================
// TEACHER VIDEO
// ==========================================

app.get(
  "/api/teacher-video",
  (req, res) => {
    try {
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
            success: false,

            message:
              "teacher-classroom.mp4 was not found.",
          });
      }

      return res.json({
        success: true,

        videoUrl:
          getBaseUrl(req) +
          "/assets/teacher-classroom.mp4",
      });
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message,
        });
    }
  }
);

// ==========================================
// MCQ QUIZ
// ==========================================

app.post(
  "/api/study/mcq",
  async (req, res) => {
    try {
      console.log(
        "MCQ GENERATE REQUEST"
      );

      const topic =
        cleanText(
          req.body?.topic
        ) ||
        "Study Topic";

      const explanation =
        cleanText(
          req.body?.explanation
        );

      const content =
        explanation.substring(
          0,
          12000
        );

      const prompt = `
Create an educational multiple choice quiz.

TOPIC:
${topic}

STUDY NOTES:
${content}

Return ONLY valid JSON in this format:

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

Rules:
- Generate exactly 10 questions.
- Every question must have exactly 4 options.
- correctAnswer must be 0, 1, 2, or 3.
- Questions must be based on the topic and notes.
- Use easy and medium difficulty.
`;

      const aiResponse =
        await generateAIResponse(
          prompt
        );

      const quizData =
        JSON.parse(
          cleanJsonText(
            aiResponse
          )
        );

      if (
        !quizData ||
        !Array.isArray(
          quizData.questions
        )
      ) {
        throw new Error(
          "Invalid quiz format received from AI."
        );
      }

      const questions =
        quizData.questions
          .slice(0, 10)
          .map(
            (item) => ({
              question:
                String(
                  item.question ||
                  "Question unavailable"
                ),

              options:
                Array.isArray(
                  item.options
                )
                  ? item.options
                      .slice(0, 4)
                      .map(String)
                  : [],

              correctAnswer:
                Number.isInteger(
                  Number(
                    item.correctAnswer
                  )
                )
                  ? Math.max(
                      0,
                      Math.min(
                        3,
                        Number(
                          item.correctAnswer
                        )
                      )
                    )
                  : 0,

              explanation:
                String(
                  item.explanation ||
                  ""
                ),
            })
          )
          .filter(
            (item) =>
              item.options.length ===
              4
          );

      return res.json({
        success: true,
        questions,
      });
    } catch (error) {
      const status =
        getErrorStatus(error);

      console.error(
        "MCQ Error:",
        error
      );

      let message =
        error.message ||
        "Failed to generate quiz.";

      if (status === 429) {
        message =
          "Gemini quota/rate limit reached. Please try again later.";
      }

      if (status === 503) {
        message =
          "Gemini AI service is temporarily busy. Please try again later.";
      }

      return res
        .status(status || 500)
        .json({
          success: false,
          message,
        });
    }
  }
);

// ==========================================
// DOWNLOAD NOTES
// ==========================================

app.post(
  "/api/download/notes",
  (req, res) => {
    try {
      const topic =
        cleanText(
          req.body?.topic
        ) ||
        "Study Notes";

      const explanation =
        cleanText(
          req.body?.explanation
        );

      const safeTopic =
        topic
          .replace(
            /[^a-zA-Z0-9-_]/g,
            "-"
          )
          .replace(
            /-+/g,
            "-"
          );

      const content =
        `${topic}

========================================

${explanation}
`;

      const fileName =
        `${
          safeTopic ||
          "study-notes"
        }-notes.txt`;

      res.setHeader(
        "Content-Type",
        "text/plain; charset=utf-8"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      return res.send(
        content
      );
    } catch (error) {
      console.error(
        "Notes Download Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message ||
            "Failed to download notes.",
        });
    }
  }
);

// ==========================================
// DOWNLOAD TEACHER VIDEO
// ==========================================

app.get(
  "/api/download/video",
  (req, res) => {
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
          success: false,

          message:
            "Teacher video file was not found.",

          expectedFile:
            "backend/assets/teacher-classroom.mp4",
        });
    }

    return res.download(
      videoPath,
      "AI-Teacher-Video.mp4"
    );
  }
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use(
  (req, res) => {
    return res
      .status(404)
      .json({
        success: false,

        message:
          "API route not found.",

        method:
          req.method,

        path:
          req.originalUrl,
      });
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
          success: false,

          message:
            error.message,
        });
    }

    return res
      .status(500)
      .json({
        success: false,

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
    console.log(
      "================================="
    );

    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      `Backend: http://localhost:${PORT}`
    );

    console.log(
      `Health Check: http://localhost:${PORT}/api/health`
    );

    console.log(
      `AI Chat: http://localhost:${PORT}/api/ai/chat`
    );

    console.log(
      `Study Generate: http://localhost:${PORT}/api/study/generate`
    );

    console.log(
      `MCQ: http://localhost:${PORT}/api/study/mcq`
    );

    console.log(
      `Teacher Video: http://localhost:${PORT}/api/teacher-video`
    );

    console.log(
      `Gemini AI: ${
        genAI
          ? "READY"
          : "NOT CONFIGURED"
      }`
    );

    console.log(
      `Gemini Model: ${GEMINI_MODEL}`
    );

    console.log(
      "================================="
    );
  }
);

// ==========================================
// EXPORT
// ==========================================

module.exports = app;