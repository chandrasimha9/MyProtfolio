export const projectsData = [
  {
    id: "campusgpt",
    number: "01",
    title: "CAMPUSGPT",
    subtitle: "College Knowledge Assistant",
    tagline: "Intelligent document retrieval & grounded academic query assistance.",
    category: "AI & Retrieval-Augmented Generation",
    badge: "Explored AI Concept",
    technologies: ["Python", "Embeddings", "Vector Search", "RAG", "LLM API"],
    summary:
      "A college-focused assistant concept designed to help students find accurate answers directly from academic policies, campus notices, syllabus records, and FAQ documents.",
    accentColor: "#FFFFFF",
    gradient: "from-zinc-800/30 via-zinc-800/20 to-zinc-900/10",
    glowColor: "rgba(255, 255, 255, 0.15)",
    architecture: [
      {
        step: "01. Ingestion",
        title: "Document Text Extraction",
        desc: "Ingests raw institutional PDFs, handbook notices, and circulars to extract unstructured text.",
      },
      {
        step: "02. Processing",
        title: "Semantic Chunking",
        desc: "Splits documents into overlapping chunks with contextual boundaries to preserve semantic coherence.",
      },
      {
        step: "03. Vectorization",
        title: "Embeddings Generation",
        desc: "Transforms textual chunks into dense vector representations capturing semantic meaning.",
      },
      {
        step: "04. Indexing",
        title: "Vector Search & Retrieval",
        desc: "Performs cosine similarity search against indexed vector spaces for student queries.",
      },
      {
        step: "05. Synthesis",
        title: "Grounded LLM Generation",
        desc: "Supplies retrieved context chunks to LLM API to generate accurate, source-grounded answers without hallucination.",
      },
    ],
    features: [
      "Academic policy lookup without manual PDF searching",
      "Source citation grounding to prevent AI hallucinations",
      "Notice board and exam timetable query assistance",
      "Vector similarity retrieval architecture design",
    ],
    artworkType: "rag-network",
  },
  {
    id: "fraudshield-ai",
    number: "02",
    title: "FRAUDSHIELD AI",
    subtitle: "Fraud Detection in Online Payments",
    tagline: "Predictive classification of suspicious digital payment activity.",
    category: "Machine Learning & Security",
    badge: "Machine Learning Project",
    technologies: ["Python", "Scikit-learn", "Pandas", "Random Forest"],
    summary:
      "A machine-learning project designed to classify online payment transactions as potentially fraudulent or legitimate by discovering anomalous patterns across transaction attributes.",
    accentColor: "#E5E5E5",
    gradient: "from-zinc-800/30 via-zinc-800/20 to-zinc-900/10",
    glowColor: "rgba(255, 255, 255, 0.15)",
    architecture: [
      {
        step: "01. Preprocessing",
        title: "Data Preprocessing",
        desc: "Cleans raw transactional logs, manages missing values, and normalizes numeric distributions.",
      },
      {
        step: "02. Engineering",
        title: "Feature Preparation",
        desc: "Extracts transaction frequency, amount discrepancies, time deltas, and cardholder behavioral signals.",
      },
      {
        step: "03. Modeling",
        title: "Random Forest Classifier",
        desc: "Trains an ensemble of decision trees to capture non-linear fraud indicators with high resilience.",
      },
      {
        step: "04. Validation",
        title: "Evaluation Concepts",
        desc: "Assesses precision, recall, confusion matrix, and false-positive minimization strategies.",
      },
      {
        step: "05. Detection",
        title: "Suspicious Flagging",
        desc: "Classifies live transactions into binary fraud likelihood categories for downstream review.",
      },
    ],
    features: [
      "Supervised ensemble learning with Random Forest",
      "Class imbalance handling for rare fraudulent cases",
      "Key feature importance scoring across payment metrics",
      "Evaluation pipeline focused on precision-recall balance",
    ],
    artworkType: "decision-tree",
  },
  {
    id: "hospital-management",
    number: "03",
    title: "HOSPITAL MANAGEMENT SYSTEM",
    subtitle: "Healthcare Administration & Scheduling",
    tagline: "Robust backend API service with relational medical record management.",
    category: "Full-Stack Web Engineering",
    badge: "Full-Stack Application",
    technologies: ["Python", "FastAPI", "MySQL"],
    summary:
      "A full-stack hospital management application for structured patient registration, doctor staff records, and seamless appointment booking with relational database persistence.",
    accentColor: "#CCCCCC",
    gradient: "from-zinc-800/30 via-zinc-800/20 to-zinc-900/10",
    glowColor: "rgba(255, 255, 255, 0.15)",
    architecture: [
      {
        step: "01. Intake",
        title: "Patient Registration",
        desc: "Secure patient profile creation, contact tracking, and medical history identification.",
      },
      {
        step: "02. Rostering",
        title: "Doctor Management",
        desc: "Department cataloging, doctor availability tracking, and specialty records.",
      },
      {
        step: "03. Operations",
        title: "CRUD Operations",
        desc: "High-performance Create, Read, Update, and Delete actions across relational entities.",
      },
      {
        step: "04. Scheduling",
        title: "Appointment Booking & Assignment",
        desc: "Real-time doctor assignment, slot management, and schedule conflict resolution.",
      },
      {
        step: "05. Architecture",
        title: "FastAPI & MySQL Integration",
        desc: "Asynchronous REST endpoints with schema validation and ACID-compliant MySQL storage.",
      },
    ],
    features: [
      "Modular FastAPI router architecture with Pydantic validation",
      "Relational MySQL schema design with foreign key constraints",
      "Automated interactive OpenAPI / Swagger documentation",
      "Comprehensive patient-doctor appointment lifecycle tracking",
    ],
    artworkType: "medical-database",
  },
];
