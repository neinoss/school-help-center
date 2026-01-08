import React, { useEffect, useState } from "react";
import GradeSidebar from "./components/GradeSidebar";
import { SupportWidget } from "./components/SupportWidget";
import AuthPanel from "./components/AuthPanel";
import ProfileCard from "./components/ProfileCard";
import { getMe, getResources, logout as apiLogout } from "./api";
import "./components/SupportWidget.css";
import "./App.css";


/* ----------------------------------------
   SUBJECT INFORMATION + GRADES
---------------------------------------- */
const subjectConfig = {
  arabic: {
    key: "arabic",
    name: "Arabic",
    summary: "Arabic language, grammar, and reading skills.",
    icon: "AR",
    grades: Array.from({ length: 12 }, (_, i) => i + 1)
  },
  english: {
    key: "english",
    name: "English",
    summary: "Vocabulary, grammar, and reading in English.",
    icon: "EN",
    grades: Array.from({ length: 12 }, (_, i) => i + 1)
  },
  science: {
    key: "science",
    name: "Science",
    summary: "Biology, physics, chemistry and the world around us.",
    icon: "SCI",
    grades: Array.from({ length: 12 }, (_, i) => i + 1)
  },
  math: {
    key: "math",
    name: "Math",
    summary: "Numbers, operations, algebra and problem solving.",
    icon: "MTH",
    grades: Array.from({ length: 12 }, (_, i) => i + 1)
  },
  history: {
    key: "history",
    name: "History",
    summary: "Past civilizations, historic events, and people.",
    icon: "HIS",
    grades: Array.from({ length: 9 }, (_, i) => i + 4) // Grade 4-12
  },
  geography: {
    key: "geography",
    name: "Geography",
    summary: "Maps, continents, climates, and physical features.",
    icon: "GEO",
    grades: Array.from({ length: 9 }, (_, i) => i + 4)
  },
  computer: {
    key: "computer",
    name: "Computer Learning",
    summary: "Basics, typing, coding and digital skills.",
    icon: "CS",
    grades: Array.from({ length: 12 }, (_, i) => i + 1)
  },
  economics: {
    key: "economics",
    name: "Economics",
    summary: "Supply, demand, money, basic economic concepts.",
    icon: "ECO",
    grades: [11, 12]
  },
  social: {
    key: "social",
    name: "Social Studies",
    summary: "Civics, culture and human behavior.",
    icon: "SOC",
    grades: [11, 12]
  }
};

/* ----------------------------------------
   YOUTUBE SEARCH HELPERS
---------------------------------------- */
function buildYouTubeSearchUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query
  )}`;
}

/* ----------------------------------------
   UNIQUE TOPICS PER SUBJECT + GRADE
---------------------------------------- */
const subjectGradeTopics = {
  arabic: {
    1: [
      "Arabic alphabet and letter names",
      "Recognising letters at beginning and end",
      "Short vowels fatha kasra damma",
      "Reading simple two-letter words",
      "Tracing and writing basic letters"
    ],
    2: [
      "Three-letter Arabic words",
      "Reading simple Arabic sentences",
      "Tanween basics for kids",
      "Short Arabic stories for grade 2",
      "Dictation practice simple words"
    ],
    3: [
      "Long vowels alif waw yaa",
      "Reading paragraph level Arabic",
      "Pronouns and simple grammar",
      "Synonyms and antonyms in Arabic",
      "Reading comprehension grade 3"
    ],
    4: [
      "Present and past tense in Arabic",
      "Subject and predicate mubtada khabar",
      "Describing people and places",
      "Reading informative texts",
      "Writing short paragraphs"
    ],
    5: [
      "Gender in Arabic masculine feminine",
      "Plural forms broken plural basics",
      "Connecting ideas with conjunctions",
      "Reading informational texts",
      "Writing opinion paragraphs"
    ],
    6: [
      "Advanced vocabulary for kids",
      "Idioms and expressions in Arabic",
      "Reading biographies and reports",
      "Summarising Arabic texts",
      "Writing short essays grade 6"
    ],
    7: [
      "Nouns verbs particles review",
      "Simple morphology roots and patterns",
      "Reading classic short texts",
      "Analysing characters in stories",
      "Writing descriptive essays"
    ],
    8: [
      "Advanced grammar grade 8",
      "Active and passive voice basics",
      "Reading newspaper style Arabic",
      "Argumentative reading practice",
      "Writing persuasive paragraphs"
    ],
    9: [
      "Complex sentence structures",
      "Figurative language simile metaphor",
      "Reading literary Arabic texts",
      "Critical thinking about texts",
      "Writing narrative essays"
    ],
    10: [
      "Advanced morphology and forms",
      "Reading modern Arabic articles",
      "Summarising complex texts",
      "Formal letter writing in Arabic",
      "Opinion articles grade 10"
    ],
    11: [
      "Classical Arabic poetry basics",
      "Analysing rhetorical devices",
      "Reading historical Arabic texts",
      "Writing research style paragraphs",
      "Formal speech writing"
    ],
    12: [
      "Advanced Arabic literature review",
      "Interpreting Quranic style language",
      "Critical essays in Arabic",
      "Editing and proofreading in Arabic",
      "Exam revision grade 12 Arabic"
    ]
  },

  english: {
    1: [
      "Alphabet sounds A to Z",
      "Short vowel words CVC",
      "Sight words for grade 1",
      "Listening to simple stories",
      "Speaking simple sentences"
    ],
    2: [
      "Long vowel words",
      "Sight words grade 2",
      "Reading short storybooks",
      "Basic punctuation full stop question mark",
      "Simple grammar nouns and verbs"
    ],
    3: [
      "Reading longer stories grade 3",
      "Using adjectives to describe",
      "Present simple tense practice",
      "Comprehension questions for kids",
      "Writing short paragraphs in English"
    ],
    4: [
      "Past simple tense for kids",
      "Adverbs and more adjectives",
      "Reading non-fiction texts",
      "Summarising stories",
      "Writing paragraph with topic sentence"
    ],
    5: [
      "Present perfect for kids",
      "Complex sentences with conjunctions",
      "Reading informational articles",
      "Making inferences in reading",
      "Writing opinion paragraph"
    ],
    6: [
      "Narrative writing techniques",
      "Reading biographies and reports",
      "Passive voice basics for kids",
      "Comparing and contrasting texts",
      "Writing descriptive essays"
    ],
    7: [
      "Argumentative writing for teens",
      "Figurative language similes and metaphors",
      "Reading literary excerpts",
      "Analysing characters and themes",
      "Writing persuasive essays"
    ],
    8: [
      "Advanced grammar review grade 8",
      "Formal vs informal language",
      "Reading editorials and articles",
      "Summarising complex texts",
      "Writing formal letters and emails"
    ],
    9: [
      "Literary analysis introduction",
      "Reading short stories and novels",
      "Using quotes as evidence",
      "Analysing themes and symbols",
      "Writing analytical paragraphs"
    ],
    10: [
      "Advanced essay structure",
      "Comparative literature tasks",
      "Reading Shakespeare simplified",
      "Critical thinking in reading",
      "Writing exam style essays"
    ],
    11: [
      "Argumentative essays advanced",
      "Research skills and note taking",
      "Reading non fiction advanced",
      "Rhetorical devices in speeches",
      "Writing research reports"
    ],
    12: [
      "Exam revision English skills",
      "Advanced reading comprehension",
      "Analysing poetry and drama",
      "Timed writing strategies",
      "Editing and proofreading essays"
    ]
  },

  science: {
    1: [
      "Five senses for kids",
      "Living and nonliving things",
      "Animals and their homes",
      "Weather and seasons basics",
      "Plants parts and needs"
    ],
    2: [
      "Habitats for animals",
      "Life cycle of plants",
      "States of water solid liquid gas",
      "Simple machines around us",
      "Healthy living food and exercise"
    ],
    3: [
      "Human body systems basic",
      "Soil and rocks for kids",
      "Sun Earth and Moon",
      "Energy sources light and sound",
      "Simple experiments grade 3"
    ],
    4: [
      "Electricity basics for kids",
      "Forces push and pull",
      "Ecosystems and food chains",
      "Water cycle in detail",
      "Safety in the science lab"
    ],
    5: [
      "Matter and its properties",
      "Mixtures and solutions",
      "Cells and microorganisms",
      "Earth layers and earthquakes",
      "Space and planets grade 5"
    ],
    6: [
      "Photosynthesis explained",
      "Circulatory and respiratory systems",
      "Atoms and molecules introduction",
      "Weather and climate differences",
      "Scientific method grade 6"
    ],
    7: [
      "Genetics and heredity basics",
      "Chemical reactions introduction",
      "Force motion and speed",
      "Ecology and human impact",
      "Lab experiments for middle school"
    ],
    8: [
      "Periodic table basics",
      "Work energy and power",
      "Waves sound and light",
      "Environmental science issues",
      "Human body regulation systems"
    ],
    9: [
      "Biology cells and tissues",
      "Chemistry reactions and equations",
      "Physics motion and forces",
      "Earth science and astronomy",
      "Science investigations grade 9"
    ],
    10: [
      "Advanced biology topics",
      "Stoichiometry basics",
      "Electricity and magnetism",
      "Earth resources and sustainability",
      "Scientific reporting skills"
    ],
    11: [
      "Pre-college biology review",
      "Organic chemistry introduction",
      "Waves and modern physics",
      "Environmental systems",
      "Lab skills and data analysis"
    ],
    12: [
      "Exam revision general science",
      "Practice biology concepts",
      "Practice chemistry concepts",
      "Practice physics concepts",
      "Science exam strategies"
    ]
  },

  math: {
    1: [
      "Counting to 20 for kids",
      "Number recognition grade 1",
      "Basic addition within 10",
      "Basic subtraction within 10",
      "Shapes and patterns for kids"
    ],
    2: [
      "Addition and subtraction within 100",
      "Place value tens and ones",
      "Simple word problems grade 2",
      "Even and odd numbers",
      "Introduction to measurement"
    ],
    3: [
      "Multiplication basics grade 3",
      "Division basics sharing",
      "Fractions halves and quarters",
      "Time and money grade 3",
      "Word problems with operations"
    ],
    4: [
      "Multiplication tables practice",
      "Long division introduction",
      "Fractions and mixed numbers",
      "Geometry area and perimeter",
      "Multi-step word problems"
    ],
    5: [
      "Decimals introduction grade 5",
      "Fractions and decimals together",
      "Volume and measurement",
      "Graphing and data reading",
      "Order of operations basics"
    ],
    6: [
      "Ratios and proportions",
      "Percentages for kids",
      "Integers and number line",
      "Algebraic expressions basics",
      "Problem solving grade 6"
    ],
    7: [
      "Equations and inequalities",
      "Coordinate plane and graphs",
      "Geometry angles and triangles",
      "Probability and statistics basics",
      "Word problems for grade 7"
    ],
    8: [
      "Linear equations and functions",
      "Systems of equations basics",
      "Pythagorean theorem",
      "Transformations and symmetry",
      "Data analysis for grade 8"
    ],
    9: [
      "Algebra I review",
      "Quadratic functions basics",
      "Exponents and radicals",
      "Geometry proofs introduction",
      "Applied word problems grade 9"
    ],
    10: [
      "Advanced algebra topics",
      "Trigonometry basics",
      "2D and 3D geometry",
      "Statistics and variation",
      "Exam style math problems"
    ],
    11: [
      "Precalculus introduction",
      "Advanced trigonometry",
      "Functions and graphs review",
      "Probability and combinatorics",
      "Modeling real world with math"
    ],
    12: [
      "Calculus basics limits and derivatives",
      "Review of algebra and trigonometry",
      "Financial math and interest",
      "Statistics for exams",
      "Math exam practice grade 12"
    ]
  },

  history: {
    4: [
      "Ancient Egypt for kids",
      "Mesopotamia and early writing",
      "Greek myths and legends",
      "Early civilizations overview",
      "Timelines and history basics"
    ],
    5: [
      "Romans and their empire",
      "Ancient China introduction",
      "Famous explorers for kids",
      "Early Islamic history basics",
      "World civilizations grade 5"
    ],
    6: [
      "Middle Ages in Europe",
      "Castles knights and feudalism",
      "Trade routes like Silk Road",
      "Civilizations in Africa",
      "Timeline activities grade 6"
    ],
    7: [
      "Renaissance and inventions",
      "Age of exploration",
      "Ottoman Empire basics",
      "Revolution and change",
      "Historical sources and evidence"
    ],
    8: [
      "Industrial Revolution",
      "World War I overview",
      "World War II overview",
      "Lebanon and regional history intro",
      "Human rights and history"
    ],
    9: [
      "Cold War basics",
      "Decolonization and new nations",
      "Modern Middle East history",
      "United Nations and world peace",
      "Analysing historical events"
    ],
    10: [
      "Political ideologies overview",
      "Conflicts in the 20th century",
      "Globalisation and change",
      "Local Lebanese history deeper",
      "Evaluating historical sources"
    ],
    11: [
      "World history thematic review",
      "Revolutions and social change",
      "War peace and diplomacy",
      "History research skills",
      "Preparing for history exams"
    ],
    12: [
      "Revision of key eras",
      "Practicing history essays",
      "Source based questions",
      "Global conflicts and lessons",
      "Final exam skills for history"
    ]
  },

  geography: {
    4: [
      "Continents and oceans song",
      "Basic map skills grade 4",
      "Physical features mountains rivers",
      "Weather and seasons around world",
      "Countries and capitals for kids"
    ],
    5: [
      "World climates and biomes",
      "Natural resources and people",
      "Population and settlements",
      "Maps and coordinates",
      "Geography of Middle East basics"
    ],
    6: [
      "Plate tectonics and earthquakes",
      "Rivers and water systems",
      "Urban vs rural areas",
      "Environmental problems pollution",
      "Grade 6 map reading practice"
    ],
    7: [
      "Weather and climate deeper",
      "Agriculture and land use",
      "Economic geography basics",
      "Migration and population change",
      "Regional geography of Asia"
    ],
    8: [
      "Europe physical and human geography",
      "Africa physical and human geography",
      "North and South America overview",
      "Natural disasters and responses",
      "Map projects for grade 8"
    ],
    9: [
      "Middle East and North Africa geography",
      "Asia and global trade",
      "Resources energy and environment",
      "Globalisation and interdependence",
      "Geographical investigations"
    ],
    10: [
      "Advanced physical geography topics",
      "Climate change and impact",
      "Population case studies",
      "Sustainable development",
      "Exam style geography questions"
    ],
    11: [
      "Human geography advanced",
      "Regional studies for exams",
      "Geographic data and graphs",
      "Fieldwork skills",
      "Revision for geography tests"
    ],
    12: [
      "Global challenges and solutions",
      "Integrated physical and human geography",
      "Case study revision",
      "Exam techniques geography",
      "Practice papers grade 12"
    ]
  },

  computer: {
    1: [
      "What is a computer for kids",
      "Parts of a computer grade 1",
      "Using mouse and keyboard",
      "Basic computer safety rules",
      "Educational games for kids"
    ],
    2: [
      "Typing simple words",
      "Opening and closing programs",
      "Using paint or drawing apps",
      "Safe internet browsing for kids",
      "Computer lab rules grade 2"
    ],
    3: [
      "Typing practice home row",
      "Saving and opening files",
      "Basic presentations for kids",
      "Coding with blocks introduction",
      "Computer vocabulary grade 3"
    ],
    4: [
      "Word processing basics",
      "Creating simple slideshows",
      "Internet research for kids",
      "Scratch coding for beginners",
      "Digital citizenship grade 4"
    ],
    5: [
      "Typing speed improvement",
      "Formatting documents",
      "Creating charts and tables",
      "Scratch projects for grade 5",
      "Staying safe online"
    ],
    6: [
      "Spreadsheets basics",
      "Presentations with images and sound",
      "Intro to algorithms for kids",
      "Block coding games",
      "Responsible use of technology"
    ],
    7: [
      "Basic HTML and web pages",
      "Coding logic with variables",
      "File management and storage",
      "Cybersecurity basics for teens",
      "Digital footprints and privacy"
    ],
    8: [
      "More HTML and simple CSS",
      "Programming concepts loops and conditions",
      "Multimedia projects",
      "Cloud storage basics",
      "IT careers introduction"
    ],
    9: [
      "Introduction to real programming",
      "Problem solving with code",
      "Computer hardware vs software",
      "Networks and the internet basics",
      "Operating systems overview"
    ],
    10: [
      "Databases basics for students",
      "Web development introduction",
      "Programming projects grade 10",
      "Cyber safety advanced",
      "Digital productivity tools"
    ],
    11: [
      "Software development cycle basics",
      "Networking deeper concepts",
      "Data and information security",
      "Careers in computer science",
      "Exam preparation ICT"
    ],
    12: [
      "Revision of main ICT topics",
      "Programming practice for exams",
      "Networking and security review",
      "Digital projects portfolio",
      "Final ICT exam strategies"
    ]
  },

  economics: {
    11: [
      "Introduction to economics for students",
      "Needs wants and scarce resources",
      "Basic supply and demand curves",
      "Market structures simple explanation",
      "Role of government in economy"
    ],
    12: [
      "Macroeconomics basics GDP and inflation",
      "Unemployment and economic growth",
      "Money banking and interest rates",
      "International trade and exchange rates",
      "Personal finance and budgeting for teens"
    ]
  },

  social: {
    11: [
      "Citizenship rights and responsibilities",
      "Democracy and government systems",
      "Culture and identity for teens",
      "Social issues and empathy",
      "Decision making and ethics grade 11"
    ],
    12: [
      "Human rights and global issues",
      "Law justice and society",
      "Media and critical thinking",
      "Community service and leadership",
      "Social studies exam preparation"
    ]
  }
};

/* ----------------------------------------
   Build video objects for current subject+grade
---------------------------------------- */
function getVideosForSubjectAndGrade(subjectKey, grade) {
  const subject = subjectConfig[subjectKey];
  const topicsForGrade =
    subjectGradeTopics[subjectKey] &&
    subjectGradeTopics[subjectKey][grade];

  if (!subject || !topicsForGrade) return [];

  return topicsForGrade.map((topic) => {
    const query = `grade ${grade} ${subject.name.toLowerCase()} ${topic} for kids educational channel`;
    return {
      title: topic,
      description: `${subject.name} - ${topic} (Grade ${grade}).`,
      url: buildYouTubeSearchUrl(query)
    };
  });
}

/* ----------------------------------------
   THEMES + BACKGROUND IMAGES
---------------------------------------- */
const themes = {
  arabic: {
    background: "linear-gradient(135deg,#f9e7ff,#ffeaf4,#e9f7ff)",
    cardBg: "#ffffff",
    textColor: "#222",
    accent: "#cc77ff"
  },
  english: {
    background: "linear-gradient(135deg,#e3f2fd,#fff1f1,#f0ffe6)",
    cardBg: "#ffffff",
    textColor: "#222",
    accent: "#4285f4"
  },
  science: {
    background: "linear-gradient(135deg,#d4ffd9,#c8f7ff,#e8ffe9)",
    cardBg: "#ffffff",
    textColor: "#222",
    accent: "#45c466"
  },
  math: {
    background: "linear-gradient(135deg,#e0eaff,#f6f6ff,#e0f7ff)",
    cardBg: "#ffffff",
    textColor: "#222",
    accent: "#6c63ff"
  },
  history: {
    background: "linear-gradient(135deg,#fff4e3,#ffeedd,#fff8e6)",
    cardBg: "#ffffff",
    textColor: "#222",
    accent: "#d18c3b"
  },
  geography: {
    background: "linear-gradient(135deg,#e4ffe7,#e2f7ff,#f0fff4)",
    cardBg: "#ffffff",
    textColor: "#222",
    accent: "#3cb371"
  },
  computer: {
    background: "linear-gradient(135deg,#e8e9ff,#f6e8ff,#e8f7ff)",
    cardBg: "#ffffff",
    textColor: "#222",
    accent: "#6a5acd"
  },
  economics: {
    background: "linear-gradient(135deg,#fff8d2,#fff1e1,#f9ffe6)",
    cardBg: "#ffffff",
    textColor: "#222",
    accent: "#e0a600"
  },
  social: {
    background: "linear-gradient(135deg,#ffe7e7,#fff0e6,#ffecec)",
    cardBg: "#ffffff",
    textColor: "#222",
    accent: "#c44545"
  }
};

const backgroundImages = {
  home:
    "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1200",
  arabic:
    "https://images.pexels.com/photos/7131492/pexels-photo-7131492.jpeg?auto=compress&cs=tinysrgb&w=1200",
  english:
    "https://images.pexels.com/photos/4144226/pexels-photo-4144226.jpeg?auto=compress&cs=tinysrgb&w=1200",
  science:
    "https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1200",
  math:
    "https://images.pexels.com/photos/4148530/pexels-photo-4148530.jpeg?auto=compress&cs=tinysrgb&w=1200",
  history:
    "https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg?auto=compress&cs=tinysrgb&w=1200",
  geography:
    "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1200",
  computer:
    "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200",
  economics:
    "https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=1200",
  social:
    "https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=1200"
};









export default function App() {
  const [currentSubjectKey, setCurrentSubjectKey] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [activeView, setActiveView] = useState("home");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesError, setResourcesError] = useState("");
  const [dark, setDark] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("dark-mode") === "true"
  );

  const currentSubject = currentSubjectKey
    ? subjectConfig[currentSubjectKey]
    : null;
  const theme = currentSubject ? themes[currentSubjectKey] : null;

  useEffect(() => {
    let ignore = false;

    getMe()
      .then((data) => {
        if (!ignore) setUser(data.user || null);
      })
      .catch(() => {
        if (!ignore) setUser(null);
      })
      .finally(() => {
        if (!ignore) setAuthLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!currentSubjectKey || !selectedGrade) {
      setResources([]);
      setResourcesError("");
      return;
    }

    let ignore = false;
    setResourcesLoading(true);
    setResourcesError("");

    getResources(currentSubjectKey, selectedGrade)
      .then((rows) => {
        if (!ignore) setResources(Array.isArray(rows) ? rows : []);
      })
      .catch((err) => {
        if (!ignore) setResourcesError(err.message || "Failed to load resources.");
      })
      .finally(() => {
        if (!ignore) setResourcesLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [currentSubjectKey, selectedGrade]);

  function toggleDark() {
    const newState = !dark;
    setDark(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("dark-mode", newState);
    }
  }

  function handleAuth(userInfo) {
    setUser(userInfo);
    setActiveView("home");
  }

  async function handleLogout() {
    try {
      await apiLogout();
    } catch {
      // Ignore logout errors so UI can reset.
    }
    setUser(null);
    setActiveView("home");
  }

  function handleSelectSubject(key) {
    setCurrentSubjectKey(key);
    setSelectedGrade(null);
    setActiveView("home");
  }

  function handleBackHome() {
    setCurrentSubjectKey(null);
    setSelectedGrade(null);
    setActiveView("home");
  }

  const videosForGrade =
    currentSubject && selectedGrade
      ? getVideosForSubjectAndGrade(currentSubjectKey, selectedGrade)
      : [];

  const bgImageUrl = currentSubject
    ? backgroundImages[currentSubjectKey]
    : backgroundImages.home;

  return (
     <div
      className={dark ? "app-root dark" : "app-root"}
      style={{
        background: theme
          ? theme.background
          : "linear-gradient(135deg,#f3f4f8,#ffffff)"
      }}
    >
      {/* Faint background illustration */}
      <div
        className="bg-illustration"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />

      <div className="app-inner fade-in">
        {/* Modern centered header */}
        <header className="app-header fancy-header">
          <div className="header-center">
            <p className="school-name">AL BAYADER SCHOOL</p>
            <h1 className="app-title">School Help Center</h1>
            <p className="app-subtitle">
              Colorful resources and YouTube videos for every subject and grade.
            </p>
          </div>

          <div className="header-actions">
            <button className="back-btn" onClick={toggleDark}>
              {dark ? "Light Mode" : "Dark Mode"}
            </button>

            {currentSubject && (
              <button className="back-btn" onClick={handleBackHome}>
                Back to Subjects
              </button>
            )}

            <button
              className="back-btn"
              onClick={() => setActiveView("profile")}
            >
              {user ? "Profile" : "Login / Sign up"}
            </button>

            {user && (
              <button className="back-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>

          <div className="auth-status">
            {authLoading
              ? "Checking session..."
              : user
              ? `Signed in as ${user.email}`
              : "Not signed in"}
          </div>
        </header>

        {activeView === "profile" && (
          <div className="profile-view fade-up">
            {authLoading ? (
              <p className="auth-loading">Checking session...</p>
            ) : user ? (
              <ProfileCard user={user} onLogout={handleLogout} />
            ) : (
              <AuthPanel onAuth={handleAuth} />
            )}
          </div>
        )}

        {activeView === "home" && (
          <>
            {/* SUBJECT GRID (HOME) */}
            {!currentSubject && (
              <div>
                <p className="home-intro">
                  Choose a subject to explore videos and learning resources for
                  all grades.
                </p>

                <div className="subject-grid">
                  {Object.values(subjectConfig).map((s) => (
                    <button
                      key={s.key}
                      className="subject-card pop"
                      data-subject={s.key}
                      onClick={() => handleSelectSubject(s.key)}
                    >
                      <div className="subject-icon">{s.icon}</div>
                      <h2 className="subject-name">{s.name}</h2>
                      <p className="subject-summary">{s.summary}</p>
                      <p className="subject-grades">
                        Grades {s.grades[0]}-{s.grades[s.grades.length - 1]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SUBJECT VIEW */}
            {currentSubject && (
              <div className="subject-view fade-up">
                <h2 className="subject-view-title">
                  {currentSubject.icon} {currentSubject.name}
                </h2>

                <p className="subject-view-summary">{currentSubject.summary}</p>

                <div className="subject-layout">
                  <GradeSidebar
                    grades={currentSubject.grades}
                    selectedGrade={selectedGrade}
                    onSelectGrade={setSelectedGrade}
                  />

                  <section
                    className="subject-content-card glow"
                    style={{
                      backgroundColor: theme?.cardBg,
                      borderColor: theme?.accent
                    }}
                  >
                    <h3>
                      {selectedGrade
                        ? `Videos for Grade ${selectedGrade}`
                        : "Choose a grade"}
                    </h3>

                    {!selectedGrade && (
                      <p style={{ opacity: 0.7, marginTop: "10px" }}>
                        Pick a grade from the left to show at least 5 helpful
                        videos.
                      </p>
                    )}

                    {selectedGrade && resourcesLoading && (
                      <p className="resource-status">
                        Loading saved resources...
                      </p>
                    )}

                    {selectedGrade && resourcesError && (
                      <p className="resource-error">{resourcesError}</p>
                    )}

                    {selectedGrade && resources.length > 0 && (
                      <div className="resources-grid">
                        {resources.map((resource) => (
                          <div key={resource.id} className="resource-card pop">
                            <h4 className="resource-title">{resource.title}</h4>
                            {resource.description && (
                              <p>{resource.description}</p>
                            )}
                            {resource.youtube_url && (
                              <a
                                href={resource.youtube_url}
                                className="video-link"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open Resource
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedGrade && videosForGrade.length === 0 && (
                      <p style={{ opacity: 0.6, marginTop: "10px" }}>
                        No videos configured for this subject yet.
                      </p>
                    )}

                    {selectedGrade && videosForGrade.length > 0 && (
                      <div className="videos-grid">
                        {videosForGrade.map((video, i) => (
                          <div key={i} className="video-card pop">
                            <h4 className="video-title">
                              Grade {selectedGrade} - {video.title}
                            </h4>
                            <p>{video.description}</p>
                            <a
                              href={video.url}
                              className="video-link"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Watch Video
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
                <SupportWidget />
              </div>
            )}
          </>
        )}
      </div>
    </div>




  );
  
}
