const express = require("express");
const fs = require("fs");
const path = require("path");

const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

const { PDFParse } = require("pdf-parse");
const say = require("say");

const router = express.Router();

/* =========================
   FFMPEG SETUP
========================= */

ffmpeg.setFfmpegPath(ffmpegPath);

console.log("FFmpeg Path:", ffmpegPath);


/* =========================
   FOLDERS
========================= */

const uploadsFolder = path.join(
  __dirname,
  "..",
  "uploads"
);

const audioFolder = path.join(
  __dirname,
  "..",
  "audio"
);

const videosFolder = path.join(
  __dirname,
  "..",
  "videos"
);

const assetsFolder = path.join(
  __dirname,
  "..",
  "assets"
);


/* =========================
   CARTOON TEACHER VIDEO
========================= */

const teacherVideoPath = path.join(
  assetsFolder,
  "teacher-classroom.mp4"
);


/* =========================
   CREATE FOLDERS
========================= */

[
  uploadsFolder,
  audioFolder,
  videosFolder,
  assetsFolder,
].forEach((folder) => {

  if (!fs.existsSync(folder)) {

    fs.mkdirSync(folder, {
      recursive: true,
    });

  }

});


/* =========================
   CREATE LONG SCRIPT
========================= */

function createLongScript(text) {

  const cleanText = text
    .replace(/\s+/g, " ")
    .trim();


  const sentences = cleanText
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(
      (sentence) =>
        sentence.length > 25
    );


  let selectedSentences = [];


  /*
    Take enough content
    for a long lesson
  */

  for (
    let i = 0;
    i < sentences.length;
    i++
  ) {

    selectedSentences.push(
      sentences[i]
    );


    const words =
      selectedSentences
        .join(" ")
        .split(/\s+/)
        .length;


    /*
      Around 1800 words
      gives approximately
      12 to 15 minutes
    */

    if (words >= 1800) {

      break;

    }

  }


  let lesson =
    "Hello students. Welcome to AI Teacher. ";


  lesson +=
    "Today we are going to study the material that you uploaded. ";


  lesson +=
    "Please listen carefully because we will understand the important concepts step by step. ";


  lesson +=
    "Let us begin our lesson. ";


  selectedSentences.forEach(
    (sentence, index) => {

      lesson +=
        `Point number ${index + 1}. `;


      lesson +=
        sentence + ". ";


      if (
        index % 5 === 4
      ) {

        lesson +=
          "Let us understand this concept carefully. ";


        lesson +=
          "This is an important part of the topic. ";

      }

    }
  );


  lesson +=
    "Now let us revise the important points. ";


  const revision =
    selectedSentences.slice(0, 15);


  revision.forEach(
    (sentence, index) => {

      lesson +=
        `Revision point ${index + 1}. `;


      lesson +=
        sentence + ". ";

    }
  );


  lesson +=
    "I hope you understood today's topic. ";


  lesson +=
    "Read the important concepts again and practice them carefully. ";


  lesson +=
    "Thank you for learning with AI Teacher. ";


  return lesson;

}


/* =========================
   CREATE SUMMARY
========================= */

function createSummary(text) {

  const sentences = text
    .split(/[.!?]+/)
    .map(
      (sentence) =>
        sentence.trim()
    )
    .filter(
      (sentence) =>
        sentence.length > 30
    );


  return sentences
    .slice(0, 10)
    .join(". ");

}


/* =========================
   CREATE TOPICS
========================= */

function createTopics(text) {

  const lines = text
    .split("\n")
    .map(
      (line) =>
        line.trim()
    )
    .filter(
      (line) =>
        line.length > 10
    );


  const topics = [];


  for (
    const line of lines
  ) {

    if (
      topics.length >= 10
    ) {

      break;

    }


    if (
      !topics.includes(line)
    ) {

      topics.push(
        line.substring(
          0,
          120
        )
      );

    }

  }


  return topics;

}


/* =========================
   GENERATE VOICE
========================= */

function generateVoice(
  text,
  audioPath
) {

  return new Promise(
    (resolve, reject) => {

      console.log(
        "Generating teacher voice..."
      );


      /*
        Windows voice
        Voice speed = 0.95
      */

      say.export(
        text,
        null,
        0.95,
        audioPath,
        (error) => {

          if (error) {

            reject(error);

            return;

          }


          console.log(
            "Teacher voice generated successfully."
          );


          resolve();

        }
      );

    }
  );

}


/* =========================
   GENERATE VIDEO
========================= */

router.post(
  "/generate",

  async (
    req,
    res
  ) => {

    let parser;


    try {

      const {
        fileName,
      } = req.body;


      /* =========================
         CHECK PDF NAME
      ========================= */

      if (!fileName) {

        return res.status(400).json({

          success: false,

          message:
            "PDF file name is required!",

        });

      }


      /* =========================
         CHECK CARTOON VIDEO
      ========================= */

      if (
        !fs.existsSync(
          teacherVideoPath
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "teacher-classroom.mp4 not found inside backend/assets!",

        });

      }


      /* =========================
         PDF PATH
      ========================= */

      const safeFileName =
        path.basename(
          fileName
        );


      const pdfPath =
        path.join(
          uploadsFolder,
          safeFileName
        );


      if (
        !fs.existsSync(
          pdfPath
        )
      ) {

        return res.status(404).json({

          success: false,

          message:
            "PDF file not found!",

        });

      }


      console.log(
        "\nReading PDF:",
        safeFileName
      );


      /* =========================
         READ PDF
      ========================= */

      const pdfBuffer =
        fs.readFileSync(
          pdfPath
        );


      parser =
        new PDFParse({

          data:
            pdfBuffer,

        });


      const pdfData =
        await parser.getText();


      const originalText =
        pdfData.text ||
        "";


      const pdfText =
        originalText
          .replace(
            /\s+/g,
            " "
          )
          .trim();


      if (!pdfText) {

        return res.status(400).json({

          success: false,

          message:
            "No readable text found in PDF!",

        });

      }


      /* =========================
         CREATE LONG SCRIPT
      ========================= */

      console.log(
        "\nCreating long lesson script..."
      );


      const videoScript =
        createLongScript(
          pdfText
        );


      const wordCount =
        videoScript
          .split(/\s+/)
          .length;


      console.log(
        "Script created successfully."
      );


      console.log(
        "Total words:",
        wordCount
      );


      /* =========================
         SUMMARY
      ========================= */

      const summary =
        createSummary(
          pdfText
        );


      const topics =
        createTopics(
          originalText
        );


      /* =========================
         FILE NAMES
      ========================= */

      const timestamp =
        Date.now();


      const audioFileName =
        `audio-${timestamp}.wav`;


      const audioPath =
        path.join(
          audioFolder,
          audioFileName
        );


      const videoFileName =
        `ai-video-${timestamp}.mp4`;


      const videoPath =
        path.join(
          videosFolder,
          videoFileName
        );


      /* =========================
         GENERATE VOICE
      ========================= */

      await generateVoice(
        videoScript,
        audioPath
      );


      if (
        !fs.existsSync(
          audioPath
        )
      ) {

        throw new Error(
          "Audio file was not created!"
        );

      }


      const audioStats =
        fs.statSync(
          audioPath
        );


      console.log(
        "Audio generated:",
        audioStats.size,
        "bytes"
      );


      /* =========================
         CREATE CARTOON VIDEO
      ========================= */

      console.log(
        "\nCreating classroom video..."
      );


      console.log(
        "Teacher video:",
        teacherVideoPath
      );


      console.log(
        "Audio:",
        audioPath
      );


      await new Promise(
        (
          resolve,
          reject
        ) => {


          const command =
            ffmpeg();


          /*
            LOOP CARTOON VIDEO

            Video repeats until
            voice explanation ends
          */

          command

            .input(
              teacherVideoPath
            )

            .inputOptions([
              "-stream_loop -1",
            ])


            /* =========================
               ADD GENERATED AUDIO
            ========================= */

            .input(
              audioPath
            )


            /* =========================
               VIDEO SETTINGS
            ========================= */

            .videoCodec(
              "libx264"
            )

            .audioCodec(
              "aac"
            )


            .outputOptions([

              /*
                Scale video
              */

              "-vf scale=1280:720,setsar=1",


              /*
                Use audio until end
              */

              "-shortest",


              /*
                Faster rendering
              */

              "-preset ultrafast",


              /*
                Browser compatible
              */

              "-pix_fmt yuv420p",


              /*
                Audio quality
              */

              "-b:a 128k",


              /*
                Streaming support
              */

              "-movflags +faststart",


              /*
                Frame rate
              */

              "-r 24",

            ])


            .on(
              "start",

              (commandLine) => {

                console.log(
                  "\nFFmpeg started..."
                );


                console.log(
                  commandLine
                );

              }
            )


            .on(
              "progress",

              (progress) => {

                if (
                  progress.percent
                ) {

                  console.log(
                    "Video progress:",
                    Math.round(
                      progress.percent
                    ) + "%"
                  );

                }

              }
            )


            .on(
              "end",

              () => {

                console.log(
                  "\nVIDEO GENERATED SUCCESSFULLY!"
                );


                resolve();

              }
            )


            .on(
              "error",

              (
                error,
                stdout,
                stderr
              ) => {

                console.error(
                  "\nFFMPEG ERROR:"
                );


                console.error(
                  error.message
                );


                console.error(
                  "\nFFMPEG DETAILS:"
                );


                console.error(
                  stderr
                );


                reject(
                  error
                );

              }
            )


            .save(
              videoPath
            );

        }
      );


      /* =========================
         CHECK VIDEO
      ========================= */

      if (
        !fs.existsSync(
          videoPath
        )
      ) {

        throw new Error(
          "Video file was not created!"
        );

      }


      const videoStats =
        fs.statSync(
          videoPath
        );


      console.log(
        "Video size:",
        videoStats.size,
        "bytes"
      );


      /* =========================
         RESPONSE
      ========================= */

      const PORT =
        process.env.PORT ||
        5000;


      const baseUrl =
        `http://localhost:${PORT}`;


      return res.status(200).json({

        success: true,


        message:
          "AI Teacher video generated successfully! 🎥",


        videoGenerated:
          true,


        videoScript:
          videoScript,


        videoUrl:
          `${baseUrl}/videos/${videoFileName}`,


        explanation: {

          title:
            "AI Teacher Video Lesson",


          summary:
            summary,


          importantTopics:
            topics,


          totalPages:
            pdfData.total ||
            "Unknown",


          totalWords:
            wordCount,

        },

      });


    } catch (
      error
    ) {

      console.error(
        "\nVIDEO GENERATION ERROR:"
      );


      console.error(
        error
      );


      return res.status(500).json({

        success: false,


        message:
          "Video generation failed!",


        error:
          error.message,

      });


    } finally {


      if (
        parser
      ) {

        try {

          await parser.destroy();

        } catch (
          error
        ) {

          console.log(
            "PDF parser cleanup error"
          );

        }

      }

    }

  }
);


module.exports =
  router;