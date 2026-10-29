
import React, { useEffect, useState } from "react";
import "./App.css";

const sampleCourses = [
  {
    id: 1,
    title: "Java Programming",
    instructor: "Ravi Kumar",
    category: "Programming",
    icon: "☕",
    color: "purple",
    description: "Learn Java from the basics."
  },
  {
    id: 2,
    title: "React JS",
    instructor: "Priya Sharma",
    category: "Web Development",
    icon: "⚛️",
    color: "blue",
    description: "Build interactive websites."
  },
  {
    id: 3,
    title: "MySQL Database",
    instructor: "Kiran Rao",
    category: "Database",
    icon: "🗄️",
    color: "orange",
    description: "Learn SQL and database basics."
  },
  {
    id: 4,
    title: "Python Programming",
    instructor: "Ananya Reddy",
    category: "Programming",
    icon: "🐍",
    color: "green",
    description: "Start coding with Python."
  }
];

// Each question has four options.
// a = index of the correct option (starting from 0).

const quizBank = {
  "Java Programming": [
    { q: "Which keyword creates a class in Java?", options: ["class", "define", "struct", "new"], a: 0 },
    { q: "What is the entry point of a Java program?", options: ["start()", "main()", "run()", "init()"], a: 1 },
    { q: "Which type stores true or false?", options: ["int", "char", "boolean", "String"], a: 2 },
    { q: "Which keyword creates an object?", options: ["class", "this", "void", "new"], a: 3 },
    { q: "Which symbol ends most Java statements?", options: [".", ";", ":", ","], a: 1 },
    { q: "Which type stores whole numbers?", options: ["int", "String", "boolean", "char"], a: 0 },
    { q: "Which keyword is used for class inheritance?", options: ["implements", "extends", "inherits", "import"], a: 1 },
    { q: "Which collection stores unique elements?", options: ["ArrayList", "Array", "HashSet", "String"], a: 2 },
    { q: "Which structure handles exceptions?", options: ["try-catch", "if-else", "for-loop", "switch"], a: 0 },
    { q: "What is the extension of a Java source file?", options: [".class", ".html", ".java", ".js"], a: 2 }
  ],

  "React JS": [
    { q: "React is primarily used to build what?", options: ["Databases", "User interfaces", "Operating systems", "Networks"], a: 1 },
    { q: "Which language is commonly used with React?", options: ["JavaScript", "SQL", "C", "Assembly"], a: 0 },
    { q: "Which hook manages component state?", options: ["useRoute", "useFetch", "useState", "useClass"], a: 2 },
    { q: "What syntax describes UI in React?", options: ["SQL", "JSX", "JDBC", "CSS only"], a: 1 },
    { q: "Which prop helps identify list items?", options: ["id-only", "index-only", "value", "key"], a: 3 },
    { q: "Which hook handles side effects?", options: ["useEffect", "useStyle", "useHTML", "useButton"], a: 0 },
    { q: "How is data passed to a component?", options: ["Tables", "Props", "Queries", "Packages"], a: 1 },
    { q: "Which event handles a button click?", options: ["onHover", "onSubmitOnly", "onClick", "onRunDB"], a: 2 },
    { q: "Which command starts this React app?", options: ["npm start", "java start", "mysql run", "git open"], a: 0 },
    { q: "How is JavaScript embedded in JSX?", options: ["<% %>", "${}", "()", "{}"], a: 3 }
  ],

  "MySQL Database": [
    { q: "What is MySQL?", options: ["A browser", "A database management system", "A CSS library", "An operating system"], a: 1 },
    { q: "Which SQL command retrieves data?", options: ["GET", "OPEN", "SELECT", "READ"], a: 2 },
    { q: "Which command adds a row?", options: ["INSERT", "CHANGE", "PUSH", "APPEND"], a: 0 },
    { q: "Which clause filters rows?", options: ["ORDER", "GROUP", "TABLE", "WHERE"], a: 3 },
    { q: "Which key uniquely identifies a row?", options: ["Foreign key", "Primary key", "Duplicate key", "Search key"], a: 1 },
    { q: "Which command modifies existing data?", options: ["UPDATE", "SELECT", "CREATE", "SHOW"], a: 0 },
    { q: "Which command deletes rows?", options: ["ERASE", "REMOVE", "DELETE", "CLEAR"], a: 2 },
    { q: "Which SQL function counts rows?", options: ["SUM()", "TOTAL()", "NUMBER()", "COUNT()"], a: 3 },
    { q: "Which clause sorts query results?", options: ["SORT BY", "ORDER BY", "ARRANGE", "FILTER"], a: 1 },
    { q: "Which command creates a table?", options: ["CREATE TABLE", "MAKE ROW", "NEW DATABASE", "INSERT TABLE"], a: 0 }
  ],

  "Python Programming": [
    { q: "Which symbol starts a comment in Python?", options: ["//", "#", "/*", "--"], a: 1 },
    { q: "Which function displays output?", options: ["show()", "displayText()", "print()", "echoText()"], a: 2 },
    { q: "Which data type stores text?", options: ["str", "int", "bool", "float"], a: 0 },
    { q: "Which keyword defines a function?", options: ["function", "define", "fun", "def"], a: 3 },
    { q: "Which collection is ordered and allows duplicates?", options: ["set", "list", "dictionary keys", "None"], a: 1 },
    { q: "Which operator checks equality?", options: ["=", "==", "!=", ":="], a: 1 },
    { q: "Which loop iterates over a sequence?", options: ["for", "select", "repeatSQL", "switch"], a: 0 },
    { q: "Which value represents no value in Python?", options: ["null", "0", "None", "empty"], a: 2 },
    { q: "Which brackets create a list?", options: ["{}", "()", "<>", "[]"], a: 3 },
    { q: "What is the Python file extension?", options: [".java", ".py", ".jsx", ".sql"], a: 1 }
  ]
};

function App() {
  const [courses, setCourses] = useState(sampleCourses);
  const [enrolled, setEnrolled] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("Dashboard");

  const [quizCourse, setQuizCourse] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    fetch("https://learnspace-backend-9u69.onrender.com/api/courses")
      .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(data => {
        if (data.length > 0) {
          setCourses(data.map((course, index) => {
            const sample = sampleCourses.find(
              item => item.title.toLowerCase() ===
                (course.title || "").toLowerCase()
            ) || sampleCourses[index % sampleCourses.length];

            return {
              ...sample,
              ...course,
              icon: sample.icon,
              color: sample.color,
              category: sample.category,
              description: course.description ||
                sample.description
            };
          }));
        }
      })
      .catch(() => {
        // Display sample courses if the backend is unavailable.
      });
  }, []);

  const filteredCourses = courses.filter(course =>
    `${course.title} ${course.instructor || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const visibleCourses = page === "My Learning"
    ? filteredCourses.filter(course => enrolled.includes(course.id))
    : filteredCourses;

  function toggleEnrollment(id) {
    setEnrolled(previous =>
      previous.includes(id)
        ? previous.filter(courseId => courseId !== id)
        : [...previous, id]
    );
  }

  function startQuiz(title) {
    setQuizCourse(title);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
    setPage("Quiz");
  }

  function chooseAnswer(index) {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    if (index === quizBank[quizCourse][questionIndex].a) {
      setQuizScore(score => score + 1);
    }
  }

  function nextQuestion() {
    if (questionIndex < quizBank[quizCourse].length - 1) {
      setQuestionIndex(index => index + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  }

  function resetQuiz() {
    startQuiz(quizCourse);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">L</span>
          <span>LearnSpace</span>
        </div>

        <p className="nav-label">MENU</p>

        {["Dashboard", "Courses", "My Learning", "Quiz"].map(item => (
          <button
            key={item}
            className={`nav-item ${page === item ? "active" : ""}`}
            onClick={() => {
              setPage(item);
              setSearch("");
            }}
          >
            <span>
              {{
                Dashboard: "⌂",
                Courses: "▤",
                "My Learning": "▣",
                Quiz: "✓"
              }[item]}
            </span>
            {item}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="avatar">S</div>
          <div>
            <strong>Student</strong>
            <small>Learning account</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">YOUR LEARNING JOURNEY</span>
            <h1>
              {page === "Dashboard" ? "Welcome back!" : page}
            </h1>
            <p>Learn something new, one step at a time.</p>
          </div>
          <div className="top-avatar">S</div>
        </header>

        {page !== "Quiz" && (
          <section className="stats">
            <div className="stat-card">
              <span className="stat-icon lavender">▤</span>
              <p>Available courses</p>
              <h2>{courses.length}</h2>
            </div>

            <div className="stat-card">
              <span className="stat-icon mint">✓</span>
              <p>My enrolled courses</p>
              <h2>{enrolled.length}</h2>
            </div>

            <div className="stat-card">
              <span className="stat-icon peach">⌕</span>
              <p>Learning status</p>
              <h2>{enrolled.length ? "Started" : "Ready!"}</h2>
            </div>
          </section>
        )}

        {page === "Quiz" ? (
          <section className="quiz-panel">
            {!quizCourse ? (
              <>
                <span className="pill">COURSE QUIZZES</span>
                <h2>Choose your quiz</h2>
                <p>Select a course to answer its 10 questions.</p>

                {Object.keys(quizBank).map(title => (
                  <button
                    key={title}
                    className="answer-option"
                    onClick={() => startQuiz(title)}
                  >
                    {title} — 10 questions →
                  </button>
                ))}
              </>
            ) : quizFinished ? (
              <>
                <span className="pill">QUIZ COMPLETED</span>
                <h2>{quizCourse}</h2>

                <div className="quiz-final-score">
                  <div className="score-circle">
                    {quizScore}/10
                  </div>
                  <h3>
                    {quizScore >= 8
                      ? "Excellent work!"
                      : quizScore >= 5
                      ? "Good effort!"
                      : "Keep practicing!"}
                  </h3>
                  <p>
                    You answered {quizScore} out of 10 questions correctly.
                  </p>
                </div>

                <button className="enroll-btn" onClick={resetQuiz}>
                  Try Again ↻
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => {
                    setQuizCourse("");
                    setPage("Quiz");
                  }}
                >
                  Choose Another Quiz
                </button>
              </>
            ) : (
              <>
                <span className="pill">
                  QUESTION {questionIndex + 1} OF 10
                </span>

                <h2>{quizCourse}</h2>

                <div className="quiz-progress">
                  <div
                    style={{
                      width: `${((questionIndex + 1) / 10) * 100}%`
                    }}
                  />
                </div>

                <p>
                  Question {questionIndex + 1} · Choose one answer
                </p>

                <h3 className="quiz-question">
                  {quizBank[quizCourse][questionIndex].q}
                </h3>

                {quizBank[quizCourse][questionIndex].options.map(
                  (option, index) => {
                    const correct =
                      quizBank[quizCourse][questionIndex].a;

                    let answerClass = "";

                    if (selectedAnswer !== null && index === correct) {
                      answerClass = "answer-correct";
                    } else if (
                      selectedAnswer === index && index !== correct
                    ) {
                      answerClass = "answer-wrong";
                    }

                    return (
                      <button
                        key={option}
                        className={`answer-option ${answerClass}`}
                        onClick={() => chooseAnswer(index)}
                        disabled={selectedAnswer !== null}
                      >
                        <span className="option-letter">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                        {selectedAnswer !== null && index === correct
                          ? " ✓"
                          : ""}
                      </button>
                    );
                  }
                )}

                {selectedAnswer !== null && (
                  <div className="quiz-feedback">
                    <p>
                      {selectedAnswer ===
                        quizBank[quizCourse][questionIndex].a
                        ? "✓ Correct answer!"
                        : "✗ Incorrect answer. The correct answer is highlighted."}
                    </p>

                    <button
                      className="enroll-btn"
                      onClick={nextQuestion}
                    >
                      {questionIndex === 9
                        ? "View Final Score →"
                        : "Next Question →"}
                    </button>
                  </div>
                )}

                <p className="quiz-score">
                  Correct answers so far: {quizScore}
                </p>
              </>
            )}
          </section>
        ) : (
          <>
            <section className="section-heading">
              <div>
                <h2>
                  {page === "My Learning"
                    ? "Your enrolled courses"
                    : "Explore courses"}
                </h2>
                <p>
                  {page === "My Learning"
                    ? "Courses you have added to your learning list."
                    : "Discover a skill and start learning today."}
                </p>
              </div>

              <div className="search-box">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search courses..."
                />
              </div>
            </section>

            <section className="course-grid">
              {visibleCourses.map(course => (
                <article className="course-card" key={course.id}>
                  <div className={`course-banner ${course.color || "blue"}`}>
                    <span className="course-emoji">
                      {course.icon || "📘"}
                    </span>
                    <span className="pill">
                      {course.category || "Course"}
                    </span>
                  </div>

                  <div className="course-content">
                    <h3>{course.title}</h3>

                    <p className="description">
                      {course.description ||
                        "Explore this course and learn new skills."}
                    </p>

                    <div className="instructor">
                      <span className="instructor-avatar">
                        {(course.instructor || "T").charAt(0)}
                      </span>
                      <span>{course.instructor || "Instructor"}</span>
                    </div>

                    <button
                      className={`enroll-btn ${
                        enrolled.includes(course.id) ? "enrolled" : ""
                      }`}
                      onClick={() => toggleEnrollment(course.id)}
                    >
                      {enrolled.includes(course.id)
                        ? "✓ Added to My Learning"
                        : "Enroll now →"}
                    </button>

                    {quizBank[course.title] && (
                      <button
                        className="secondary-btn course-quiz-btn"
                        onClick={() => startQuiz(course.title)}
                      >
                        Take 10-Question Quiz →
                      </button>
                    )}
                  </div>
                </article>
              ))}

              {visibleCourses.length === 0 && (
                <div className="empty-state">
                  <h3>No courses found</h3>
                  <p>Try another search or explore all courses.</p>
                  <button
                    className="secondary-btn"
                    onClick={() => {
                      setSearch("");
                      setPage("Courses");
                    }}
                  >
                    Explore courses
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        <footer>LearnSpace · Keep learning, keep growing.</footer>
      </main>
    </div>
  );
}

export default App;
