// TODO: Replace with actual Apps Script URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://script.google.com/macros/s/AKfycbyzUSCHcp-70DqzQwK8MjDZabtdXh5PfBoldylv1hncBI0Re_2-laCNUlxjiG67Wgkaqw/exec";

export interface CurriculumItem {
  // Identities
  program_id: string; // Used for filtering (e.g. B2C_PYTHON)
  program_identity?: string; // Legacy/Display (e.g. Kids)
  level_id: string; // e.g. "Trial Class", "Level 1"
  session_order: string | number; // e.g. 1
  unique_code: string; // e.g. PY1-001
  
  // Content
  topic_title: string; // Grouping (previously Unit) e.g. "Introduction"
  sub_topic_title: string; // Session Title (previously Topic) e.g. "Hello World"
  // unit_name removed
  learning_objective: string;
  activity_breakdown: string;
  mastery_focus: string;
  planet_theme: string;

  // Teacher Tools Links
  link_lesson_plan?: string;
  link_deck?: string;
  link_syllabus?: string;
  link_rubric_form?: string;
  link_sample?: string;
  explainer_video?: string;

  // Class Assets Links
  link_starter?: string;
  link_video_intro?: string;
  link_video_materi?: string;
  link_vbg?: string;

  // Legacy / Catch-all
  "content_&_pedagogy"?: string; 
  [key: string]: string | number | undefined;
}

export async function fetchCurriculum(): Promise<CurriculumItem[]> {
  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    if (!response.ok) {
        if (API_URL.includes("YOUR_APPS_SCRIPT_URL")) {
             console.warn("Using mock data because API_URL is not set.");
             return mockData;
        }
        throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) return [];

    // Filter out header row if present
    if (data.length > 0) {
        const first = data[0];
        // Weak check for header row
        if (first['topic_title'] === 'topic_title' || first['program_id'] === 'program_id') {
            data.shift();
        }
    }

    // Normalize data
    const normalizedItems: CurriculumItem[] = data.map((item: any) => {
       // 1. Identify Program ID
       const programId = item.program_id ? String(item.program_id) : (item.program_identity ? String(item.program_identity) : "Uncategorized");
       
       // Handle Level ID specifically for Trial Class
       // CRITICAL FIX: Check for undefined/null instead of falsy to catch 0
       let rawLevel = (item.level_id !== undefined && item.level_id !== null) ? String(item.level_id).trim() : "Unassigned";
       
       const upperLevel = rawLevel.toUpperCase();
       
       // Heuristic: 0, "0", "0.0", "TRIAL", "TRIAL CLASS" -> "Trial Class"
       if (rawLevel === "0" || rawLevel === "0.0" || upperLevel === "TRIAL" || upperLevel.includes("TRIAL CLASS") || upperLevel === "TRIAL CLASS") {
           rawLevel = "Trial Class";
       }

       // 2. Map Fields
       return {
           program_id: programId,
           program_identity: item.program_identity ? String(item.program_identity) : programId,
           // Correctly mapped level_id
           level_id: rawLevel, 
           unique_code: item.unique_code ? String(item.unique_code) : "",
           
           // Ensure sortable number
           session_order: parseInt(item.session_order) || item.session_order || 0,
           
           // Content
           // OLD SCHEMA: unit_name (Group), topic_title (Title)
           // NEW SCHEMA: topic_title (Group), sub-topic_title (Title)
           
           topic_title: item.topic_title ? String(item.topic_title) : "General", // Now acts as the Group (Unit)
           sub_topic_title: item['sub-topic_title'] ? String(item['sub-topic_title']) : (item.topic_title ? String(item.topic_title) : "Untitled Session"), // Title
           
           planet_theme: item.planet_theme ? String(item.planet_theme) : "",
           learning_objective: item.learning_objective ? String(item.learning_objective) : "",
           activity_breakdown: item.activity_breakdown ? String(item.activity_breakdown) : "",
           mastery_focus: item.mastery_focus ? String(item.mastery_focus) : "",

           // Links (Teacher)
           link_lesson_plan: normalizeLink(item.link_lesson_plan),
           link_deck: normalizeLink(item.link_deck),
           link_rubric_form: normalizeLink(item.link_rubric_form),
           link_sample: normalizeLink(item.link_sample),
           explainer_video: normalizeLink(item.explainer_video),
           link_syllabus: normalizeLink(item.link_syllabus || item.teacher_tools), 

           // Links (Student)
           link_starter: normalizeLink(item.link_starter || item.class_assets),
           link_video_intro: normalizeLink(item.link_video_intro),
           link_video_materi: normalizeLink(item.link_video_materi),
           link_vbg: normalizeLink(item.link_vbg || item[""]),
           
           "content_&_pedagogy": item["content_&_pedagogy"]
       };
    }).filter(item => item.program_id !== "Uncategorized" && item.program_id !== "0" && item.program_id !== "undefined");

    return normalizedItems;
  } catch (error) {
    console.error("Error fetching curriculum:", error);
    return [];
  }
}

function normalizeLink(link: string | undefined): string {
  if (!link) return "";
  const trimmed = link.trim();
  if (trimmed === "—" || trimmed === "-" || trimmed === "") return "";
  return trimmed;
}

const mockData: CurriculumItem[] = [
    { 
        program_id: "B2C_PYTHON",
        program_identity: "Kids",
        level_id: "Level 1",
        session_order: 1,
        unique_code: "PY1-001",
        topic_title: "Getting Started", // Group (previously Unit)
        sub_topic_title: "Introduction", // Title (previously Topic)
        learning_objective: "Learn basic syntax",
        planet_theme: "Cyber City",
        activity_breakdown: "1. Login\n2. Hello World\n3. Variables",
        mastery_focus: "Logic",
        link_lesson_plan: "https://example.com/plan",
        link_deck: "https://example.com/deck"
    },
    { 
        program_id: "B2C_PYTHON",
        level_id: "Level 1",
        session_order: 2,
        unique_code: "PY1-002",
        topic_title: "Flow Control", // Group
        sub_topic_title: "Loops", // Title
        learning_objective: "Master for and while loops",
        planet_theme: "Cyber City",
        activity_breakdown: "1. For Loop\n2. While Loop\n3. Practice",
        mastery_focus: "Logic"
    },
];
