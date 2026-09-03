import {
  useEffect,
  useRef,
  useState,
} from "react";

import Navbar from "../components/Navbar";

import "./Study.css";

const API_URL = "http://localhost:5000/api";

const STORAGE_KEY =
  "ai_teacher_study_session";

function Study() {

  // ==========================================
  // STATE
  // ==========================================

  const [topic, setTopic] =
    useState("");

  // ==========================================
  // PERSONALIZATION
  // ==========================================

  const [level, setLevel] =
    useState("Beginner");

  const [language, setLanguage] =
    useState("English");

  const [learningTime, setLearningTime] =
    useState("20");

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  const [
    uploadedFile,
    setUploadedFile,
  ] = useState(null);

  const [
    explanation,
    setExplanation,
  ] = useState("");

  const [
    slides,
    setSlides,
  ] = useState([]);

  const [
    questions,
    setQuestions,
  ] = useState([]);

  const [
    selectedAnswers,
    setSelectedAnswers,
  ] = useState({});

  const [
    quizSubmitted,
    setQuizSubmitted,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);

  const [
    isSpeaking,
    setIsSpeaking,
  ] = useState(false);

  const [
    currentSlide,
    setCurrentSlide,
  ] = useState(0);

  const [
    videoUrl,
    setVideoUrl,
  ] = useState("");

  const [
    videoDuration,
    setVideoDuration,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const videoRef =
    useRef(null);

  const currentSlideRef =
    useRef(0);

  const stopRequestedRef =
    useRef(false);

  // ==========================================
  // LOAD PROFILE PERSONALIZATION
  // ==========================================

  useEffect(() => {

    try {

      const userEmail =
        localStorage.getItem("userEmail") ||
        localStorage.getItem("email") ||
        localStorage.getItem("user_email") ||
        "";

      const possibleKeys = [
        userEmail
          ? `profile_${userEmail}`
          : null,
        "profile",
        "userProfile",
        "user_profile",
      ].filter(Boolean);

      for (const key of possibleKeys) {

        const savedProfile =
          localStorage.getItem(key);

        if (!savedProfile) {
          continue;
        }

        const profile =
          JSON.parse(savedProfile);

        if (profile.language) {
          setLanguage(profile.language);
        }

        if (profile.level) {
          setLevel(profile.level);
        }

        if (profile.learningTime) {
          setLearningTime(
            String(profile.learningTime)
          );
        }

        break;

      }

    } catch (error) {

      console.error(
        "Could not load profile preferences:",
        error
      );

    }

  }, []);

  // ==========================================
  // LOAD SAVED STUDY SESSION
  // ==========================================

  useEffect(() => {

    try {

      const savedData =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!savedData) {
        return;
      }

      const data =
        JSON.parse(savedData);

      if (data.topic) {
        setTopic(data.topic);
      }

      if (data.level) {
        setLevel(data.level);
      }

      if (data.language) {
        setLanguage(data.language);
      }

      if (data.learningTime) {
        setLearningTime(
          String(data.learningTime)
        );
      }

      if (data.explanation) {
        setExplanation(
          data.explanation
        );
      }

      if (
        Array.isArray(
          data.slides
        )
      ) {

        setSlides(
          data.slides
        );

      }

      if (
        Array.isArray(
          data.questions
        )
      ) {

        setQuestions(
          data.questions
        );

      }

      if (data.uploadedFile) {

        setUploadedFile(
          data.uploadedFile
        );

      }

      if (
        data.currentSlide !==
        undefined
      ) {

        setCurrentSlide(
          data.currentSlide
        );

      }

    } catch (error) {

      console.error(
        "Saved session error:",
        error
      );

    }

  }, []);

  // ==========================================
  // SAVE STUDY SESSION
  // ==========================================

  useEffect(() => {

    try {

      const data = {

        topic,

        level,

        language,

        learningTime,

        explanation,

        slides,

        questions,

        uploadedFile,

        currentSlide,

      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );

    } catch (error) {

      console.error(
        "Save session error:",
        error
      );

    }

  }, [
    topic,
    level,
    language,
    learningTime,
    explanation,
    slides,
    questions,
    uploadedFile,
    currentSlide,
  ]);

  // ==========================================
  // UPDATE SLIDE REF
  // ==========================================

  useEffect(() => {

    currentSlideRef.current =
      currentSlide;

  }, [
    currentSlide,
  ]);

  // ==========================================
  // GET TEACHER VIDEO
  // ==========================================

  useEffect(() => {

    const getTeacherVideo =
      async () => {

        try {

          const response =
            await fetch(
              `${API_URL}/teacher-video`
            );

          const data =
            await parseResponse(
              response
            );

          if (
            response.ok &&
            data.success &&
            data.videoUrl
          ) {

            setVideoUrl(
              data.videoUrl
            );

          }

        } catch (error) {

          console.error(
            "Teacher video error:",
            error
          );

        }

      };

    getTeacherVideo();

  }, []);

  // ==========================================
  // CLEANUP
  // ==========================================

  useEffect(() => {

    return () => {

      if (
        "speechSynthesis" in
        window
      ) {

        window
          .speechSynthesis
          .cancel();

      }

      if (
        videoRef.current
      ) {

        videoRef.current.pause();

      }

    };

  }, []);

  // ==========================================
  // SAFE RESPONSE PARSER
  // ==========================================

  const parseResponse =
    async (response) => {

      const text =
        await response.text();

      try {

        return JSON.parse(
          text
        );

      } catch (error) {

        console.error(
          "Invalid server response:",
          text
        );

        throw new Error(

          text.substring(
            0,
            300
          ) ||

          "Server returned an invalid response."

        );

      }

    };

  // ==========================================
  // STOP VOICE
  // ==========================================

  const stopVoice =
    () => {

      stopRequestedRef.current =
        true;

      if (
        "speechSynthesis" in
        window
      ) {

        window
          .speechSynthesis
          .cancel();

      }

      setIsSpeaking(
        false
      );

    };

  // ==========================================
  // STOP LESSON
  // ==========================================

  const stopLesson =
    () => {

      stopRequestedRef.current =
        true;

      if (
        "speechSynthesis" in
        window
      ) {

        window
          .speechSynthesis
          .cancel();

      }

      setIsPlaying(
        false
      );

      setIsSpeaking(
        false
      );

      if (
        videoRef.current
      ) {

        videoRef.current.pause();

      }

    };

  // ==========================================
  // PDF SELECT
  // ==========================================

  const handleFileChange =
    (event) => {

      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      const isPdf =

        file.type ===
        "application/pdf" ||

        file.name
          .toLowerCase()
          .endsWith(".pdf");

      if (!isPdf) {

        setError(
          "Please select a PDF file only."
        );

        setSelectedFile(
          null
        );

        return;
      }

      setSelectedFile(
        file
      );

      setUploadedFile(
        null
      );

      setError("");

      setSuccessMessage("");

    };

  // ==========================================
  // START STUDY
  // ==========================================

  const handleStartStudy =
    async () => {

      setError("");

      setSuccessMessage("");

      stopLesson();

      if (
        !topic.trim() &&
        !selectedFile
      ) {

        setError(
          "Please enter a topic or upload a PDF."
        );

        return;

      }

      try {

        setLoading(
          true
        );

        setExplanation("");

        setSlides([]);

        setQuestions([]);

        setSelectedAnswers({});

        setQuizSubmitted(
          false
        );

        setCurrentSlide(
          0
        );

        let currentFile =
          uploadedFile;

        // ======================================
        // STEP 1: UPLOAD PDF
        // ======================================

        if (
          selectedFile &&
          !uploadedFile
        ) {

          const formData =
            new FormData();

          formData.append(
            "pdf",
            selectedFile
          );

          formData.append(
            "topic",
            topic.trim()
          );

          formData.append(
            "level",
            level
          );

          formData.append(
            "language",
            language
          );

          formData.append(
            "learningTime",
            learningTime
          );

          const uploadResponse =
            await fetch(
              `${API_URL}/study/upload`,
              {
                method:
                  "POST",

                body:
                  formData,
              }
            );

          const uploadData =
            await parseResponse(
              uploadResponse
            );

          if (
            !uploadResponse.ok ||
            !uploadData.success
          ) {

            throw new Error(

              uploadData.message ||

              "PDF upload failed."

            );

          }

          currentFile =
            uploadData.file;

          setUploadedFile(
            currentFile
          );

        }

        // ======================================
        // STEP 2: GENERATE COMPLETE STUDY SESSION
        // ONE AI REQUEST
        // ======================================

        const response =
          await fetch(
            `${API_URL}/study/generate`,
            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body:
                JSON.stringify({

                  topic:
                    topic.trim(),

                  level,

                  language,

                  learningTime,

                  fileName:

                    currentFile?.fileName ||

                    currentFile?.filename ||

                    "",

                }),

            }
          );

        const data =
          await parseResponse(
            response
          );

        if (
          !response.ok ||
          !data.success
        ) {

          throw new Error(

            data.message ||

            "Study generation failed."

          );

        }

        // ======================================
        // NOTES
        // ======================================

        setExplanation(

          data.explanation ||

          ""

        );

        // ======================================
        // SLIDES
        // ======================================

        if (
          Array.isArray(
            data.slides
          )
        ) {

          setSlides(
            data.slides
          );

        }

        // ======================================
        // MCQ QUESTIONS
        // ======================================

        if (
          Array.isArray(
            data.questions
          )
        ) {

          setQuestions(
            data.questions
          );

        }

        // ======================================
        // SET GENERATED SUBJECT
        // ======================================

        if (
          !topic.trim() &&
          data.subject
        ) {

          setTopic(
            data.subject
          );

        }

        if (
          data.fallback
        ) {

          setSuccessMessage(

            "Study session generated successfully using backup content."

          );

        } else {

          setSuccessMessage(

            "AI Notes, Teacher Lesson and MCQ Quiz generated successfully! 🎉"

          );

        }

      } catch (error) {

        console.error(
          "Study Error:",
          error
        );

        setError(

          error.message ||

          "Could not generate study session."

        );

      } finally {

        setLoading(
          false
        );

      }

    };

  // ==========================================
  // GENERATE VIDEO
  // ==========================================

  const handleGenerateVideo =
    () => {

      setError("");

      if (
        slides.length === 0
      ) {

        setError(

          "Please generate the study session first."

        );

        return;

      }

      setCurrentSlide(
        0
      );

      setTimeout(
        () => {

          document
            .getElementById(
              "ai-video-section"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",
            });

        },
        100
      );

    };

  // ==========================================
  // GENERATE QUIZ
  // ==========================================

  const handleGenerateQuiz =
    () => {

      setError("");

      if (
        questions.length === 0
      ) {

        setError(

          "No quiz questions were generated."

        );

        return;

      }

      setSelectedAnswers(
        {}
      );

      setQuizSubmitted(
        false
      );

      setTimeout(
        () => {

          document
            .getElementById(
              "mcq-section"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",
            });

        },
        100
      );

    };

  // ==========================================
  // SELECT ANSWER
  // ==========================================

  const selectAnswer =
    (
      questionIndex,
      optionIndex
    ) => {

      if (
        quizSubmitted
      ) {
        return;
      }

      setSelectedAnswers(
        (previous) => ({
          ...previous,

          [questionIndex]:
            optionIndex,

        })
      );

    };

  // ==========================================
  // SUBMIT QUIZ
  // ==========================================

  const submitQuiz =
    () => {

      if (
        Object.keys(
          selectedAnswers
        ).length <
        questions.length
      ) {

        setError(

          "Please answer all questions before submitting."

        );

        return;

      }

      setError("");

      setQuizSubmitted(
        true
      );

    };

  // ==========================================
  // QUIZ SCORE
  // ==========================================

  const quizScore =
    questions.reduce(
      (
        score,
        question,
        index
      ) => {

        if (

          Number(
            selectedAnswers[index]
          ) ===

          Number(
            question.correctAnswer
          )

        ) {

          return score + 1;

        }

        return score;

      },
      0
    );

  // ==========================================
  // SPEAK SLIDE
  // ==========================================

  const speakSlide =
    (index) => {

      if (
        stopRequestedRef.current
      ) {
        return;
      }

      if (
        !slides[index]
      ) {
        return;
      }

      if (
        !(
          "speechSynthesis" in
          window
        )
      ) {

        setError(

          "Your browser does not support AI voice."

        );

        return;

      }

      window
        .speechSynthesis
        .cancel();

      const slide =
        slides[index];

      const speechText =

        `${slide.title}. ` +

        `${slide.narration}`;

      const utterance =
        new SpeechSynthesisUtterance(
          speechText
        );

      utterance.rate =
        0.9;

      utterance.pitch =
        1;

      utterance.volume =
        1;

      const voices =
        window
          .speechSynthesis
          .getVoices();

      const preferredVoice =

        voices.find(
          (voice) =>

            voice.lang
              .toLowerCase()
              .startsWith("en") &&

            voice.name
              .toLowerCase()
              .includes("zira")

        ) ||

        voices.find(
          (voice) =>

            voice.lang
              .toLowerCase()
              .startsWith("en")

        );

      if (
        preferredVoice
      ) {

        utterance.voice =
          preferredVoice;

      }

      utterance.onstart =
        () => {

          setIsSpeaking(
            true
          );

        };

      utterance.onend =
        () => {

          setIsSpeaking(
            false
          );

          if (
            stopRequestedRef.current
          ) {
            return;
          }

          if (
            index <
            slides.length - 1
          ) {

            const nextIndex =
              index + 1;

            currentSlideRef.current =
              nextIndex;

            setCurrentSlide(
              nextIndex
            );

            setTimeout(
              () => {

                if (
                  !stopRequestedRef.current
                ) {

                  speakSlide(
                    nextIndex
                  );

                }

              },
              500
            );

          } else {

            setIsPlaying(
              false
            );

            if (
              videoRef.current
            ) {

              videoRef.current.pause();

            }

          }

        };

      utterance.onerror =
        (event) => {

          console.error(
            "Speech error:",
            event
          );

          setIsSpeaking(
            false
          );

        };

      window
        .speechSynthesis
        .speak(
          utterance
        );

    };

  // ==========================================
  // PLAY LESSON
  // ==========================================

  const playLesson =
    async () => {

      if (
        slides.length === 0
      ) {

        setError(

          "Please generate the study session first."

        );

        return;

      }

      setError("");

      stopRequestedRef.current =
        false;

      if (
        "speechSynthesis" in
        window
      ) {

        window
          .speechSynthesis
          .cancel();

      }

      setCurrentSlide(
        0
      );

      currentSlideRef.current =
        0;

      setIsPlaying(
        true
      );

      // ======================================
      // START VIDEO
      // ======================================

      if (
        videoRef.current
      ) {

        try {

          videoRef.current.muted =
            true;

          videoRef.current.currentTime =
            0;

          await videoRef.current.play();

        } catch (error) {

          console.error(
            "Video play error:",
            error
          );

        }

      }

      // ======================================
      // START VOICE
      // ======================================

      setTimeout(
        () => {

          speakSlide(
            0
          );

        },
        300
      );

    };

  // ==========================================
  // NEXT SLIDE
  // ==========================================

  const nextSlide =
    () => {

      if (
        currentSlide >=
        slides.length - 1
      ) {
        return;
      }

      if (
        "speechSynthesis" in
        window
      ) {

        window
          .speechSynthesis
          .cancel();

      }

      const next =
        currentSlide + 1;

      currentSlideRef.current =
        next;

      setCurrentSlide(
        next
      );

      if (
        isPlaying
      ) {

        stopRequestedRef.current =
          false;

        setTimeout(
          () => {

            speakSlide(
              next
            );

          },
          200
        );

      }

    };

  // ==========================================
  // PREVIOUS SLIDE
  // ==========================================

  const previousSlide =
    () => {

      if (
        currentSlide <= 0
      ) {
        return;
      }

      if (
        "speechSynthesis" in
        window
      ) {

        window
          .speechSynthesis
          .cancel();

      }

      const previous =
        currentSlide - 1;

      currentSlideRef.current =
        previous;

      setCurrentSlide(
        previous
      );

      if (
        isPlaying
      ) {

        stopRequestedRef.current =
          false;

        setTimeout(
          () => {

            speakSlide(
              previous
            );

          },
          200
        );

      }

    };

  // ==========================================
  // VIDEO DURATION
  // ==========================================

  const handleVideoMetadata =
    () => {

      if (
        !videoRef.current
      ) {
        return;
      }

      const seconds =
        Math.floor(
          videoRef.current.duration
        );

      if (
        !Number.isFinite(
          seconds
        )
      ) {
        return;
      }

      const minutes =
        Math.floor(
          seconds / 60
        );

      const remainingSeconds =
        seconds % 60;

      setVideoDuration(

        `${minutes}:${String(
          remainingSeconds
        ).padStart(
          2,
          "0"
        )}`

      );

    };

  // ==========================================
  // DOWNLOAD VIDEO
  // ==========================================

  const downloadVideo =
    () => {

      window.open(
        `${API_URL}/download/video`,
        "_blank"
      );

    };

  // ==========================================
  // DOWNLOAD NOTES
  // ==========================================

  const downloadNotes =
    async () => {

      if (!explanation) {
        return;
      }

      try {

        const response =
          await fetch(
            `${API_URL}/download/notes`,
            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body:
                JSON.stringify({

                  topic,

                  explanation,

                }),

            }
          );

        if (!response.ok) {

          throw new Error(
            "Notes download failed."
          );

        }

        const blob =
          await response.blob();

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href =
          url;

        link.download =
          `${topic || "study-notes"}-notes.txt`;

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          url
        );

      } catch (error) {

        // FALLBACK DOWNLOAD

        const blob =
          new Blob(
            [

              `${topic || "Study Notes"}\n\n` +

              `${"=".repeat(50)}\n\n` +

              explanation,

            ],
            {
              type:
                "text/plain",
            }
          );

        const url =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href =
          url;

        link.download =
          `${topic || "study-notes"}-notes.txt`;

        link.click();

        URL.revokeObjectURL(
          url
        );

      }

    };

  // ==========================================
  // CLEAR SESSION
  // ==========================================

  const clearSession =
    () => {

      stopLesson();

      setTopic("");

      setSelectedFile(
        null
      );

      setUploadedFile(
        null
      );

      setExplanation("");

      setSlides([]);

      setQuestions([]);

      setSelectedAnswers(
        {}
      );

      setQuizSubmitted(
        false
      );

      setCurrentSlide(
        0
      );

      setError("");

      setSuccessMessage("");

      localStorage.removeItem(
        STORAGE_KEY
      );

    };

  // ==========================================
  // INLINE MARKDOWN
  // ==========================================

  const renderInlineText =
    (text) => {

      const parts =
        String(text).split(
          /(\*\*.*?\*\*|`.*?`)/
        );

      return parts.map(
        (
          part,
          index
        ) => {

          if (

            part.startsWith(
              "**"
            ) &&

            part.endsWith(
              "**"
            )

          ) {

            return (

              <strong
                key={index}
              >

                {
                  part.slice(
                    2,
                    -2
                  )
                }

              </strong>

            );

          }

          if (

            part.startsWith(
              "`"
            ) &&

            part.endsWith(
              "`"
            )

          ) {

            return (

              <code
                key={index}
              >

                {
                  part.slice(
                    1,
                    -1
                  )
                }

              </code>

            );

          }

          return part;

        }
      );

    };

  // ==========================================
  // FORMAT NOTES
  // ==========================================

  const renderExplanation =
    () => {

      if (!explanation) {
        return null;
      }

      const lines =
        explanation.split(
          "\n"
        );

      const elements =
        [];

      let bullets =
        [];

      let numbers =
        [];

      let codeLines =
        [];

      let inCode =
        false;

      const flushBullets =
        (key) => {

          if (
            bullets.length === 0
          ) {
            return;
          }

          elements.push(

            <ul
              key={`bullets-${key}`}
              className="ai-notes-list"
            >

              {
                bullets.map(
                  (
                    item,
                    index
                  ) => (

                    <li
                      key={index}
                    >

                      {
                        renderInlineText(
                          item
                        )
                      }

                    </li>

                  )
                )
              }

            </ul>

          );

          bullets =
            [];

        };

      const flushNumbers =
        (key) => {

          if (
            numbers.length === 0
          ) {
            return;
          }

          elements.push(

            <ol
              key={`numbers-${key}`}
              className="ai-notes-list"
            >

              {
                numbers.map(
                  (
                    item,
                    index
                  ) => (

                    <li
                      key={index}
                    >

                      {
                        renderInlineText(
                          item
                        )
                      }

                    </li>

                  )
                )
              }

            </ol>

          );

          numbers =
            [];

        };

      lines.forEach(
        (
          originalLine,
          index
        ) => {

          const line =
            originalLine.trim();

          // CODE BLOCK

          if (
            line.startsWith(
              "```"
            )
          ) {

            if (!inCode) {

              flushBullets(
                index
              );

              flushNumbers(
                index
              );

              inCode =
                true;

              codeLines =
                [];

            } else {

              elements.push(

                <pre
                  className="ai-code-block"
                  key={`code-${index}`}
                >

                  <code>

                    {
                      codeLines.join(
                        "\n"
                      )
                    }

                  </code>

                </pre>

              );

              inCode =
                false;

              codeLines =
                [];

            }

            return;

          }

          if (inCode) {

            codeLines.push(
              originalLine
            );

            return;

          }

          if (!line) {

            flushBullets(
              index
            );

            flushNumbers(
              index
            );

            return;

          }

          if (
            /^#\s+/.test(
              line
            )
          ) {

            flushBullets(
              index
            );

            flushNumbers(
              index
            );

            elements.push(

              <h2
                key={index}
                className="ai-notes-main-heading"
              >

                {
                  renderInlineText(

                    line.replace(
                      /^#\s+/,
                      ""
                    )

                  )
                }

              </h2>

            );

            return;

          }

          if (
            /^##\s+/.test(
              line
            )
          ) {

            flushBullets(
              index
            );

            flushNumbers(
              index
            );

            elements.push(

              <h3
                key={index}
                className="ai-notes-heading"
              >

                {
                  renderInlineText(

                    line.replace(
                      /^##\s+/,
                      ""
                    )

                  )
                }

              </h3>

            );

            return;

          }

          if (
            /^###\s+/.test(
              line
            )
          ) {

            flushBullets(
              index
            );

            flushNumbers(
              index
            );

            elements.push(

              <h4
                key={index}
                className="ai-notes-subheading"
              >

                {
                  renderInlineText(

                    line.replace(
                      /^###\s+/,
                      ""
                    )

                  )
                }

              </h4>

            );

            return;

          }

          if (
            /^[-*•]\s+/.test(
              line
            )
          ) {

            flushNumbers(
              index
            );

            bullets.push(

              line.replace(
                /^[-*•]\s+/,
                ""
              )

            );

            return;

          }

          if (
            /^\d+\.\s+/.test(
              line
            )
          ) {

            flushBullets(
              index
            );

            numbers.push(

              line.replace(
                /^\d+\.\s+/,
                ""
              )

            );

            return;

          }

          flushBullets(
            index
          );

          flushNumbers(
            index
          );

          elements.push(

            <p
              key={index}
              className="ai-notes-paragraph"
            >

              {
                renderInlineText(
                  line
                )
              }

            </p>

          );

        }
      );

      flushBullets(
        "end"
      );

      flushNumbers(
        "end"
      );

      return elements;

    };

  // ==========================================
  // CURRENT SLIDE
  // ==========================================

  const activeSlide =
    slides[
      currentSlide
    ];

  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="study-page">

      <Navbar />

      <main className="study-main">

        {/* HEADER */}

        <section className="study-header">

          <p className="study-tag">
            AI STUDY TEACHER
          </p>

          <h1>
            Your AI Learning Session 🤖
          </h1>

          <p>
            Learn with AI notes,
            teacher video,
            voice explanation
            and MCQ quiz.
          </p>

        </section>


        {/* STUDY INPUT */}

        <section className="study-card">

          <h2>
            Start Learning with AI 📚
          </h2>

          <p>
            Enter a topic,
            upload a PDF,
            or use both.
          </p>


          <label>
            What do you want to learn?
          </label>

          <input
            type="text"

            value={topic}

            onChange={
              (event) =>
                setTopic(
                  event.target.value
                )
            }

            placeholder="Example: Java, Python, Cloud Computing, DSA..."
          />


          {/* PERSONALIZATION PANEL */}

          <div
            className="personalization-panel"
          >

            <h3>
              🎯 Personalize Your Learning
            </h3>

            <div
              className="personalization-grid"
            >

              <div className="personalization-field">

                <label>
                  Level
                </label>

                <select
                  value={level}
                  onChange={
                    (event) =>
                      setLevel(event.target.value)
                  }
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>

              </div>


              <div className="personalization-field">

                <label>
                  Language
                </label>

                <select
                  value={language}
                  onChange={
                    (event) =>
                      setLanguage(event.target.value)
                  }
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                  <option>Hinglish</option>
                </select>

              </div>


              <div className="personalization-field">

                <label>
                  Learning Time
                </label>

                <select
                  value={learningTime}
                  onChange={
                    (event) =>
                      setLearningTime(event.target.value)
                  }
                >
                  <option value="10">
                    10 Minutes
                  </option>
                  <option value="20">
                    20 Minutes
                  </option>
                  <option value="30">
                    30 Minutes
                  </option>
                </select>

              </div>

            </div>

            <p className="personalization-note">
              AI will create the lesson according to
              your level, language and available
              learning time.
            </p>

          </div>


          <p className="or-text">
            OR
          </p>


          <label
            className="upload-box"
          >

            <input
              type="file"

              accept=".pdf,application/pdf"

              onChange={
                handleFileChange
              }

              hidden
            />

            <span>
              📤
            </span>

            <strong>
              Click to Upload PDF
            </strong>

            <small>
              PDF files only
            </small>

          </label>


          {selectedFile && (

            <div className="selected-file">

              📄 Selected:
              {" "}

              <strong>
                {
                  selectedFile.name
                }
              </strong>

            </div>

          )}


          {uploadedFile && (

            <div className="selected-file">

              ✅ Uploaded:
              {" "}

              <strong>

                {
                  uploadedFile.originalName ||

                  uploadedFile.fileName
                }

              </strong>

            </div>

          )}


          {error && (

            <div
              className="study-error"
            >

              ⚠️ {error}

            </div>

          )}


          {successMessage && (

            <div
              className="selected-file"
            >

              ✅ {successMessage}

            </div>

          )}


          <button
            className="start-study-btn"

            onClick={
              handleStartStudy
            }

            disabled={
              loading
            }
          >

            {
              loading

                ? "Generating Complete Study Session..."

                : "Start Study 🚀"
            }

          </button>


          {(explanation ||
            slides.length > 0 ||
            questions.length > 0) && (

            <button
              type="button"

              className="stop-lesson-btn"

              onClick={
                clearSession
              }
            >

              🗑 Clear Study Session

            </button>

          )}

        </section>


        {/* NOTES */}

        {explanation && (

          <section
            className="ai-explanation-section"
          >

            <div
              className="section-title-row"
            >

              <div>

                <p className="study-tag">
                  AI GENERATED NOTES
                </p>

                <h2>
                  📝 Study Notes
                </h2>

              </div>

              <div
                className="ai-ready-badge"
              >

                🟢 AI Ready

              </div>

            </div>


            <div
              className="ai-notes-container"
            >

              {
                renderExplanation()
              }

            </div>


            <div
              className="lesson-controls"
            >

              <button
                className="generate-video-btn"

                onClick={
                  handleGenerateVideo
                }
              >

                🎬 Open AI Teacher Video

              </button>


              <button
                className="generate-video-btn"

                onClick={
                  downloadNotes
                }
              >

                📥 Download Notes

              </button>


              <button
                className="generate-video-btn"

                onClick={
                  handleGenerateQuiz
                }
              >

                🧠 Open MCQ Quiz

              </button>

            </div>

          </section>

        )}


        {/* AI VIDEO */}

        {slides.length > 0 && (

          <section
            id="ai-video-section"

            className="ai-video-section"
          >

            <p
              className="study-tag"
            >
              AI TEACHER VIDEO
            </p>

            <h2>
              👨‍🏫 Your AI Teacher
            </h2>

            <p>
              Moving teacher video
              with AI voice explanation.

              {videoDuration && (

                <>
                  {" "}

                  Duration:
                  {" "}

                  <strong>
                    {videoDuration}
                  </strong>

                </>

              )}

            </p>


            {/* VIDEO */}

            <div
              className="teacher-video-container"
            >

              {videoUrl ? (

                <video
                  ref={videoRef}

                  src={videoUrl}

                  muted

                  loop

                  playsInline

                  controls

                  onLoadedMetadata={
                    handleVideoMetadata
                  }

                  className="teacher-video"
                >

                  Your browser does not support video.

                </video>

              ) : (

                <div
                  className="video-not-found"
                >

                  ⚠️ Teacher video was not found.

                  <br />

                  Put this file here:

                  <br />

                  <strong>
                    backend/assets/teacher-classroom.mp4
                  </strong>

                </div>

              )}

            </div>


            {/* DOWNLOAD VIDEO */}

            {videoUrl && (

              <div
                className="lesson-controls"
              >

                <button
                  className="generate-video-btn"

                  onClick={
                    downloadVideo
                  }
                >

                  📥 Download Video

                </button>

              </div>

            )}


            {/* LESSON STATUS */}

            <div
              className="lesson-status"
            >

              <span>
                Lesson Part
              </span>

              <strong>

                {currentSlide + 1}

                {" / "}

                {slides.length}

              </strong>

            </div>


            {activeSlide && (

              <div
                className="current-lesson-card"
              >

                <h3>

                  {
                    activeSlide.title
                  }

                </h3>

                <p>

                  {
                    activeSlide.narration
                  }

                </p>

              </div>

            )}


            {/* CONTROLS */}

            <div
              className="lesson-controls"
            >

              <button
                onClick={
                  previousSlide
                }

                disabled={
                  currentSlide === 0
                }
              >

                ⏮ Previous

              </button>


              {!isPlaying ? (

                <button
                  className="play-lesson-btn"

                  onClick={
                    playLesson
                  }
                >

                  ▶ Start Teacher Lesson

                </button>

              ) : (

                <button
                  className="stop-lesson-btn"

                  onClick={
                    stopLesson
                  }
                >

                  ⏹ Stop Lesson

                </button>

              )}


              <button
                onClick={
                  nextSlide
                }

                disabled={

                  currentSlide >=
                  slides.length - 1

                }
              >

                Next ⏭

              </button>

            </div>


            {/* VOICE STATUS */}

            <div
              className="voice-status"
            >

              {isSpeaking

                ? "🔊 AI Teacher is speaking..."

                : isPlaying

                  ? "⏳ Preparing next lesson part..."

                  : "🎤 Click Start Teacher Lesson to hear the AI voice."

              }

            </div>

          </section>

        )}


        {/* MCQ QUIZ */}

        {questions.length > 0 && (

          <section
            id="mcq-section"

            className="ai-explanation-section"
          >

            <p className="study-tag">
              AI GENERATED QUIZ
            </p>

            <h2>
              🧠 MCQ Quiz
            </h2>

            <p>
              Answer all questions
              and check your score.
            </p>


            {questions.map(
              (
                question,
                questionIndex
              ) => (

                <div
                  key={questionIndex}

                  className="current-lesson-card"
                >

                  <h3>

                    {questionIndex + 1}.
                    {" "}

                    {
                      question.question
                    }

                  </h3>


                  <div
                    className="quiz-options"
                  >

                    {
                      question.options?.map(
                        (
                          option,
                          optionIndex
                        ) => {

                          const selected =

                            selectedAnswers[
                              questionIndex
                            ] ===
                            optionIndex;


                          const isCorrect =

                            Number(
                              question.correctAnswer
                            ) ===
                            optionIndex;


                          let className =
                            "quiz-option";


                          if (
                            selected
                          ) {

                            className +=
                              " selected-option";

                          }


                          if (
                            quizSubmitted &&
                            isCorrect
                          ) {

                            className +=
                              " correct-option";

                          }


                          if (

                            quizSubmitted &&

                            selected &&

                            !isCorrect

                          ) {

                            className +=
                              " wrong-option";

                          }


                          return (

                            <button
                              type="button"

                              key={optionIndex}

                              className={
                                className
                              }

                              disabled={
                                quizSubmitted
                              }

                              onClick={
                                () =>

                                  selectAnswer(

                                    questionIndex,

                                    optionIndex

                                  )
                              }
                            >

                              {String.fromCharCode(
                                65 +
                                optionIndex
                              )}

                              . {" "}

                              {option}

                            </button>

                          );

                        }
                      )
                    }

                  </div>


                  {quizSubmitted && (

                    <div>

                      <p>

                        <strong>
                          Explanation:
                        </strong>

                        {" "}

                        {
                          question.explanation ||
                          "Check the correct answer above."
                        }

                      </p>

                    </div>

                  )}

                </div>

              )
            )}


            {!quizSubmitted ? (

              <button
                className="start-study-btn"

                onClick={
                  submitQuiz
                }
              >

                Submit Quiz 📝

              </button>

            ) : (

              <div
                className="voice-status"
              >

                🎉 Your Score:
                {" "}

                <strong>

                  {quizScore}

                  {" / "}

                  {questions.length}

                </strong>

              </div>

            )}

          </section>

        )}

      </main>

    </div>

  );

}

export default Study;