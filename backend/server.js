// ==========================================
// AI TEACHER - BACKEND SERVER
// COMPLETE VERSION
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

const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

// CORS
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

// JSON body
app.use(
  express.json({
    limit: "50mb",
  })
);

// URL encoded body
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// ==========================================
// DIRECTORIES
// ==========================================

const uploadDir = path.join(
  __dirname,
  "uploads"
);

const assetsDir = path.join(
  __dirname,
  "assets"
);

// Create uploads directory
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// Create assets directory
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, {
    recursive: true,
  });
}

// Static assets
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

// Check Gemini key
if (
  GEMINI_API_KEY &&
  GEMINI_API_KEY.trim()
) {
  try {
    genAI =
      new GoogleGenerativeAI(
        GEMINI_API_KEY
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
// AI GENERATE FUNCTION
// ==========================================

async function generateAIResponse(
  prompt
) {
  // Check Gemini
  if (!genAI) {
    throw new Error(
      "Gemini API is not configured. Please check GEMINI_API_KEY."
    );
  }

  try {
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

    const response =
      result.response;

    const text =
      response.text();

    if (
      !text ||
      !text.trim()
    ) {
      throw new Error(
        "AI did not return a response."
      );
    }

    return text.trim();

  } catch (error) {

    console.error(
      "Gemini Generate Error:",
      error.message
    );

    throw error;
  }
}

// ==========================================
// MULTER CONFIGURATION
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

// ==========================================
// PDF FILE FILTER
// ==========================================

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
// UPLOAD CONFIGURATION
// ==========================================

const upload =
  multer({

    storage,

    fileFilter,

    limits: {

      fileSize:
        20 *
        1024 *
        1024,
    },
  });

// ==========================================
// MEMORY STORAGE
// ==========================================

// Store uploaded PDF information
const uploadedDocuments = {};

// ==========================================
// HELPER FUNCTION
// ==========================================

function cleanText(text) {

  if (!text) {
    return "";
  }

  return String(text)
    .trim();
}

// ==========================================
// CLEAN JSON TEXT
// ==========================================

function cleanJsonText(text) {

  if (!text) {
    return "";
  }

  let cleaned =
    String(text)
      .trim();

  // Remove markdown code block
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

  // Find JSON object
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

// ==========================================
// GET BASE URL
// ==========================================

function getBaseUrl(req) {

  return (
    req.protocol +
    "://" +
    req.get("host")
  );
}

// ==========================================
// CREATE FALLBACK SLIDES
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
      .slice(
        0,
        8
      )
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
// HOME ROUTE
// ==========================================

app.get(
  "/",
  (
    req,
    res
  ) => {

    res.json({

      success: true,

      message:
        "AI Teacher Backend is Running",

      endpoints: {

        health:
          "/api/health",

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
// STUDY GENERATE
// IMPORTANT ROUTE
// THIS FIXES:
// POST /api/study/generate
// ==========================================

app.post(
  "/api/study/generate",
  async (
    req,
    res
  ) => {

    try {

      console.log(
        "================================="
      );

      console.log(
        "STUDY GENERATE REQUEST RECEIVED"
      );

      console.log(
        "Request Body:",
        req.body
      );

      // ==================================
      // GET DATA
      // ==================================

      const topic =
        cleanText(
          req.body.topic
        );

      const subject =
        cleanText(
          req.body.subject
        );

      const level =
        cleanText(
          req.body.level
        ) ||
        "Beginner";

      const language =
        cleanText(
          req.body.language
        ) ||
        "English";

      const learningTime =
        cleanText(
          req.body.learningTime
        ) ||
        cleanText(
          req.body.time
        ) ||
        "20 Minutes";

      // ==================================
      // FINAL TOPIC
      // ==================================

      const finalTopic =
        topic ||
        subject;

      // ==================================
      // VALIDATION
      // ==================================

      if (!finalTopic) {

        return res
          .status(400)
          .json({

            success:
              false,

            message:
              "Please enter a topic.",
          });
      }

      // ==================================
      // AI PROMPT
      // ==================================

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
- Do not mention that you are an AI.

Generate the lesson now.
`;

      // ==================================
      // GENERATE AI RESPONSE
      // ==================================

      const explanation =
        await generateAIResponse(
          prompt
        );

      console.log(
        "Study lesson generated successfully."
      );

      // ==================================
      // RESPONSE
      // ==================================

      return res
        .status(200)
        .json({

          success:
            true,

          message:
            "Study lesson generated successfully.",

          topic:
            finalTopic,

          level:
            level,

          language:
            language,

          learningTime:
            learningTime,

          explanation:
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
        .status(500)
        .json({

          success:
            false,

          message:
            error.message ||
            "Failed to generate study lesson.",
        });
    }
  }
);

// ==========================================
// PDF UPLOAD ROUTE
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

      console.log(
        "================================="
      );

      console.log(
        "PDF UPLOAD REQUEST"
      );

      // Check file
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

      // Read PDF
      const pdfBuffer =
        fs.readFileSync(
          req.file.path
        );

      // Parse PDF
      const pdfData =
        await pdfParse(
          pdfBuffer
        );

      const extractedText =
        pdfData.text ||
        "";

      // Store document
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
          pdfData.numpages ||
          0,

        uploadedAt:
          new Date(),
      };

      console.log(
        "PDF uploaded successfully."
      );

      return res.json({

        success:
          true,

        message:
          "PDF uploaded successfully.",

        fileName:
          req.file.filename,

        originalName:
          req.file.originalname,

        totalPages:
          pdfData.numpages ||
          0,

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
// STUDY EXPLAIN ROUTE
// ==========================================

app.post(
  "/api/study/explain",

  async (
    req,
    res
  ) => {

    try {

      console.log(
        "STUDY EXPLAIN REQUEST"
      );

      const topic =
        cleanText(
          req.body.topic
        );

      const fileName =
        cleanText(
          req.body.fileName
        );

      let pdfContent =
        "";

      let pdfInfo =
        null;

      // Get PDF content
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
          pdfInfo.text ||
          "";
      }

      // Validation
      if (
        !topic &&
        !pdfContent
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            message:
              "Please enter a topic or upload a PDF.",
          });
      }

      // Limit PDF content
      if (
        pdfContent.length >
        25000
      ) {

        pdfContent =
          pdfContent.substring(
            0,
            25000
          );
      }

      // Subject
      const finalTopic =
        topic ||
        "Study Material";

      // Prompt
      let prompt = `
You are an expert teacher.

Create detailed and easy study notes.

TOPIC:

${finalTopic}
`;

      if (
        pdfContent
      ) {

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

      // Generate
      const explanation =
        await generateAIResponse(
          prompt
        );

      // Response
      return res.json({

        success:
          true,

        topic:
          finalTopic,

        explanation:
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
        .status(500)
        .json({

          success:
            false,

          message:
            error.message ||
            "AI explanation failed.",
        });
    }
  }
);

// ==========================================
// VIDEO GENERATE ROUTE
// ==========================================

app.post(
  "/api/video/generate",

  async (
    req,
    res
  ) => {

    try {

      console.log(
        "VIDEO GENERATE REQUEST"
      );

      const topic =
        cleanText(
          req.body.topic
        );

      const fileName =
        cleanText(
          req.body.fileName
        );

      const explanation =
        cleanText(
          req.body.explanation
        );

      let pdfContent =
        "";

      // Get PDF
      if (
        fileName &&
        uploadedDocuments[
          fileName
        ]
      ) {

        pdfContent =
          uploadedDocuments[
            fileName
          ].text ||
          "";
      }

      const sourceContent =
        explanation ||
        pdfContent;

      const finalTopic =
        topic ||
        "AI Learning Lesson";

      // Validation
      if (
        !topic &&
        !sourceContent
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            message:
              "Please provide study content first.",
          });
      }

      // Limit
      const limitedContent =
        sourceContent.substring(
          0,
          18000
        );

      // AI prompt
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

      // Generate AI
      const aiResponse =
        await generateAIResponse(
          prompt
        );

      let parsedData =
        null;

      // Parse JSON
      try {

        parsedData =
          JSON.parse(
            cleanJsonText(
              aiResponse
            )
          );

      } catch (error) {

        console.log(
          "JSON parsing failed."
        );
      }

      let videoScript =
        "";

      let slides =
        [];

      // If JSON successful
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
              .slice(
                0,
                8
              )
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

      // Fallback
      if (
        !videoScript
      ) {

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

      // Check video
      const videoPath =
        path.join(
          assetsDir,
          "teacher-classroom.mp4"
        );

      const videoExists =
        fs.existsSync(
          videoPath
        );

      // Response
      return res.json({

        success:
          true,

        message:
          "AI teacher lesson generated successfully.",

        videoScript:
          videoScript,

        slides:
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
            "Video generation failed.",
        });
    }
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

    try {

      const videoPath =
        path.join(
          assetsDir,
          "teacher-classroom.mp4"
        );

      // Check
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
              "teacher-classroom.mp4 was not found.",
          });
      }

      return res.json({

        success:
          true,

        videoUrl:
          getBaseUrl(req) +
          "/assets/teacher-classroom.mp4",
      });

    } catch (error) {

      return res
        .status(500)
        .json({

          success:
            false,

          message:
            error.message,
        });
    }
  }
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use(
  (
    req,
    res
  ) => {

    return res
      .status(404)
      .json({

        success:
          false,

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

    // Multer error
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
// START LOCAL SERVER
// ==========================================

if (
  require.main === module
) {

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
        `Study Generate: http://localhost:${PORT}/api/study/generate`
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
}

// ==========================================
// EXPORT
// ==========================================

module.exports = app;