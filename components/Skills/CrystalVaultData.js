'use client';

/**
 * 5-Bottle Apothecary 3D Carousel Skills Specification
 * Exact 1:1 match to the Pin-to-Pin Specification:
 * 0: Python (#1d4ed8, Deep Royal Blue)
 * 1: JavaScript (#d97706, Rich Deep Amber)
 * 2: React (#0284c7, Deep Electric Cyan, DEFAULT CENTER HERO)
 * 3: FastAPI (#059669, Deep Emerald)
 * 4: MySQL (#ea580c, Deep Burnt Orange)
 */
export const APOTHECARY_CAROUSEL_SKILLS = [
  {
    key: 'python',
    name: 'Python',
    domainPill: 'Programming',
    category: 'Programming',
    zoneId: 'programming',
    liquidColor: '#3b82f6',
    liquidColorHex: 0x3b82f6,
    colorName: 'Deep Royal Blue',
    proficiency: 94,
    role: 'Core Backend, Scripting & ML Pipelines',
    description:
      'Versatile high-level programming language engineered for clean readability, rapid automation scripting, robust backend architectures, and machine learning pipelines.',
    learningAdvantages: [
      'Universal industry standard across AI, scientific computing, automation & backend microservices.',
      'Massive battle-tested ecosystem (FastAPI, Pandas, scikit-learn, Selenium) with rapid prototyping speed.',
    ],
    myCapabilities: [
      'Engineered asynchronous REST APIs, automated web scrapers, and end-to-end ML model pipelines.',
      'Implemented 100+ computational algorithms, statistical transforms, and system automation scripts.',
    ],
    related: ['fastapi', 'pandas', 'scikit_learn', 'mysql'],
  },
  {
    key: 'react',
    name: 'React',
    domainPill: 'Frontend',
    category: 'Frontend',
    zoneId: 'frontend',
    liquidColor: '#00d8ff',
    liquidColorHex: 0x00d8ff,
    colorName: 'Deep Electric Cyan',
    proficiency: 92,
    role: 'Declarative Component Architecture & Modern UI',
    description:
      'Industry-standard declarative UI library for building dynamic, state-driven single page applications through reusable component hierarchies and reactive hooks.',
    learningAdvantages: [
      'Declarative component model ensuring predictable UI state synchronization and modularity.',
      'Lightning-fast virtual DOM reconciliation and vast production-grade hooks ecosystem.',
    ],
    myCapabilities: [
      'Architected modular responsive SPAs with dynamic 60 FPS state-driven micro-interactions.',
      'Developed custom hooks, real-time client state managers, and accessible component hierarchies.',
    ],
    related: ['bootstrap', 'html5', 'css3', 'fastapi'],
  },
  {
    key: 'fastapi',
    name: 'FastAPI',
    domainPill: 'Backend',
    category: 'Backend',
    zoneId: 'backend',
    liquidColor: '#059669',
    liquidColorHex: 0x059669,
    colorName: 'Deep Emerald',
    proficiency: 90,
    role: 'High-Performance Python Async Microservices & APIs',
    description:
      'Modern, high-velocity asynchronous Python framework built on Starlette and Pydantic, delivering NodeJS-comparable throughput with automatic OpenAPI documentation.',
    learningAdvantages: [
      'Blazing execution speed powered by ASGI (uvicorn) and modern Python type hints.',
      'Automatic, interactive Swagger/OpenAPI documentation with strict runtime Pydantic validation.',
    ],
    myCapabilities: [
      'Developed Hospital Management System endpoints with full CRUD operations for patients and doctors.',
      'Structured Pydantic validation schemas, dependency injection, and asynchronous database connections.',
    ],
    related: ['python', 'mysql', 'dbms'],
  },
  {
    key: 'pandas',
    name: 'Pandas',
    domainPill: 'AI & Data',
    category: 'AI / ML',
    zoneId: 'ai-ml',
    liquidColor: '#0284c7',
    liquidColorHex: 0x0284c7,
    colorName: 'Electric Azure Blue',
    proficiency: 88,
    role: 'Tabular DataFrames, Cleaning & High-Volume Data Wrangling',
    description:
      'A powerful Python library for data manipulation, cleaning and analysis across large structured datasets.',
    learningAdvantages: [
      'Premier industry tool for high-volume 2D tabular data manipulation, cleaning and wrangling.',
      'Vector-optimized column operations with seamless SQL, CSV, JSON, and NumPy interoperability.',
    ],
    myCapabilities: [
      'Applied data preprocessing and feature preparation for FraudShield AI payment fraud classification.',
      'Conducted exploratory data analysis (EDA), missing value imputation, and correlation metrics.',
    ],
    related: ['python', 'scikit_learn', 'random_forest'],
  },
  {
    key: 'mysql',
    name: 'MySQL',
    domainPill: 'Database',
    category: 'Database',
    zoneId: 'database',
    liquidColor: '#ea580c',
    liquidColorHex: 0xea580c,
    colorName: 'Deep Burnt Amber',
    proficiency: 89,
    role: 'Relational Schemas, ACID Transactions & Indexing',
    description:
      'Leading open-source relational database management system providing reliable structured table architectures, foreign key constraints, and transactional integrity.',
    learningAdvantages: [
      'ACID compliance guaranteeing transaction atomicity, consistency, isolation, and durability.',
      'Mature B-Tree and Hash indexing strategies optimizing high-frequency lookups and queries.',
    ],
    myCapabilities: [
      'Engineered normalized relational schemas (3NF) for hospital patient/doctor records and appointments.',
      'Crafted complex multi-table JOINs, indexing strategies, and transactional integrity constraints.',
    ],
    related: ['dbms', 'fastapi', 'python'],
  },
  {
    key: 'scikit_learn',
    name: 'scikit-learn',
    domainPill: 'AI / ML',
    category: 'AI / ML',
    zoneId: 'ai-ml',
    liquidColor: '#f59e0b',
    liquidColorHex: 0xf59e0b,
    colorName: 'Coral Amber',
    proficiency: 86,
    role: 'Predictive Modeling, Random Forest & Classification Pipelines',
    description:
      'Python standard library for statistical machine learning, offering unified estimator interfaces for classification, regression, clustering, and data preprocessing.',
    learningAdvantages: [
      'Unified estimator API (fit-predict-transform) standard for classification, regression, and clustering.',
      'Production-grade preprocessing pipelines with automated cross-validation and hyperparameter tuning.',
    ],
    myCapabilities: [
      'Developed FraudShield AI to classify online payment transactions as fraudulent or legitimate.',
      'Trained Random Forest classifiers with feature preparation, confusion matrices, and ROC-AUC evaluation.',
    ],
    related: ['pandas', 'python', 'random_forest'],
  },
  {
    key: 'dbms',
    name: 'DBMS',
    domainPill: 'Core Concepts',
    category: 'Core Concepts',
    zoneId: 'core-concepts',
    liquidColor: '#6366f1',
    liquidColorHex: 0x6366f1,
    colorName: 'Royal Indigo',
    proficiency: 90,
    role: 'Relational Algebra, Schema Normalization (1NF-BCNF) & ACID',
    description:
      'Theoretical foundations of Database Management Systems, including relational algebra, schema normalization up to Boyce-Codd Normal Form, and transaction scheduling.',
    learningAdvantages: [
      'Systematic normalization theory eliminating update, insertion, and deletion anomalies.',
      'Rigorous transaction serializability, concurrency control protocols, and two-phase locking (2PL).',
    ],
    myCapabilities: [
      'Designed normalized relational schemas with primary/foreign key constraints and indexing.',
      'Optimized transaction isolation levels and query execution plans for data consistency.',
    ],
    related: ['mysql', 'oop', 'python'],
  },
  {
    key: 'bootstrap',
    name: 'Bootstrap',
    domainPill: 'Frontend',
    category: 'Frontend',
    zoneId: 'frontend',
    liquidColor: '#7952b3',
    liquidColorHex: 0x7952b3,
    colorName: 'Rich Violet',
    proficiency: 91,
    role: 'Responsive Utility Scaffolding & Rapid UI Layouts',
    description:
      'World-renowned responsive front-end framework featuring a 12-column flexbox grid system, extensive utility classes, and pre-styled UI components.',
    learningAdvantages: [
      'Battle-tested 12-column flexbox grid system for rapid cross-device interface scaffolding.',
      'Extensive suite of accessible, cross-browser normalized UI primitives and utility classes.',
    ],
    myCapabilities: [
      'Built clean, mobile-first responsive interfaces and hospital management UI dashboards.',
      'Leveraged utility classes, modal dialogs, and navigation primitives for rapid prototyping.',
    ],
    related: ['html5', 'css3', 'react'],
  },
  {
    key: 'html5',
    name: 'HTML5 & CSS3',
    domainPill: 'Frontend',
    category: 'Frontend',
    zoneId: 'frontend',
    liquidColor: '#e34f26',
    liquidColorHex: 0xe34f26,
    colorName: 'Crimson Orange',
    proficiency: 93,
    role: 'Semantic Web Architecture & Modern Styling Systems',
    description:
      'Foundational web standards defining accessible semantic DOM structure, CSS Flexbox/Grid layouts, and hardware-accelerated animations.',
    learningAdvantages: [
      'Native accessibility (a11y) and SEO enhancement through proper semantic element hierarchies.',
      'Hardware-accelerated CSS keyframe transforms and responsive layout systems without runtime overhead.',
    ],
    myCapabilities: [
      'Structured clean, accessible DOM trees with high Lighthouse performance and accessibility scores.',
      'Engineered fluid multi-breakpoint layouts, custom themes, and glassmorphic styling.',
    ],
    related: ['bootstrap', 'react'],
  },
  {
    key: 'oop',
    name: 'OOP',
    domainPill: 'Core Concepts',
    category: 'Core Concepts',
    zoneId: 'core-concepts',
    liquidColor: '#06b6d4',
    liquidColorHex: 0x06b6d4,
    colorName: 'Luminous Teal',
    proficiency: 91,
    role: 'Encapsulation, Polymorphism, Inheritance & SOLID Architecture',
    description:
      'Rigorous software engineering paradigm structuring programs around self-contained objects, class contracts, abstraction boundaries, and reusable design patterns.',
    learningAdvantages: [
      'Encapsulation protecting internal state and exposing strict, clean software interfaces.',
      'SOLID principles eliminating rigid architectural coupling and long-term technical debt.',
    ],
    myCapabilities: [
      'Designed extensible class hierarchies, interface contracts, and reusable design patterns in Python.',
      'Refactored procedural scripts into clean, maintainable, object-oriented software modules.',
    ],
    related: ['python', 'dbms', 'computer_networks'],
  },
  {
    key: 'computer_networks',
    name: 'Computer Networks',
    domainPill: 'Core Concepts',
    category: 'Core Concepts',
    zoneId: 'core-concepts',
    liquidColor: '#0284c7',
    liquidColorHex: 0x0284c7,
    colorName: 'Sky Blue',
    proficiency: 85,
    role: 'OSI & TCP/IP Stack, DNS, HTTP/HTTPS, Sockets & Client-Server',
    description:
      'Foundational principles governing distributed data transmission across the 7-layer OSI model and 4-layer TCP/IP stack, from sockets to application-layer protocols.',
    learningAdvantages: [
      'Deep grasp of TCP 3-way handshakes, reliable packet delivery, and flow control mechanisms.',
      'Clear comprehension of DNS resolution, TLS encryption handshakes, certificates, and routing.',
    ],
    myCapabilities: [
      'Debugged HTTP status codes, CORS headers, network latency, and REST API communication.',
      'Architected resilient client-server request-response lifecycles and endpoint security.',
    ],
    related: ['fastapi', 'dsa', 'oop'],
  },
];

export const VAULT_ZONES = [
  {
    id: 'all',
    title: 'All',
    iconType: 'all',
  },
  {
    id: 'programming',
    title: 'Programming',
    iconType: 'code',
  },
  {
    id: 'frontend',
    title: 'Frontend',
    iconType: 'frontend',
  },
  {
    id: 'backend',
    title: 'Backend',
    iconType: 'backend',
  },
  {
    id: 'database',
    title: 'Database',
    iconType: 'database',
  },
  {
    id: 'ai-ml',
    title: 'AI / ML',
    iconType: 'aiml',
  },
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    iconType: 'core',
  },
];

export const VAULT_TECHNOLOGIES = [
  // 0: Python (Far Left in reference: vivid purple liquid)
  {
    key: 'python',
    name: 'Python',
    zoneId: 'programming',
    category: 'Programming',
    domainPill: 'Programming',
    liquidColor: '#9333EA',
    liquidColorHex: 0x9333ea,
    proficiency: 92,
    role: 'Core Backend, Scripting & ML Pipelines',
    badge: 'Primary Language',
    description:
      'Versatile, high-level programming language engineered for clean readability, rapid automation scripting, robust backend architectures, and machine learning computation.',
    learningAdvantages: [
      'Universal industry standard across AI, scientific computing, automation & backend microservices.',
      'Massive battle-tested ecosystem (FastAPI, Pandas, NumPy, Scikit-learn) with rapid prototyping speed.',
    ],
    myCapabilities: [
      'Engineered asynchronous REST APIs, automated data scrapers, and end-to-end ML model pipelines.',
      'Implemented 100+ computational algorithms, statistical transforms, and system scripts.',
    ],
    related: ['fastapi', 'pandas', 'scikit_learn', 'ml_fundamentals'],
  },

  // 1: React (Mid Left in reference: bright cyan liquid)
  {
    key: 'react',
    name: 'React',
    zoneId: 'frontend',
    category: 'Frontend',
    domainPill: 'Frontend',
    liquidColor: '#00D8FF',
    liquidColorHex: 0x00d8ff,
    proficiency: 90,
    role: 'Declarative Component Architecture & Modern UI',
    badge: 'UI Library',
    description:
      'Industry-standard declarative UI library for building dynamic, state-driven single page applications through reusable component hierarchies and reactive hooks.',
    learningAdvantages: [
      'Declarative component model ensuring predictable UI state synchronization and modularity.',
      'Lightning-fast virtual DOM reconciliation and vast production-grade hooks ecosystem.',
    ],
    myCapabilities: [
      'Architected modular responsive SPAs with dynamic 60 FPS state-driven micro-interactions.',
      'Developed custom hooks, real-time client state managers, and accessible component hierarchies.',
    ],
    related: ['javascript', 'html5', 'css3', 'bootstrap'],
  },

  // 2: FastAPI (Near Left in reference: vibrant emerald green liquid)
  {
    key: 'fastapi',
    name: 'FastAPI',
    zoneId: 'backend',
    category: 'Backend',
    domainPill: 'Backend',
    liquidColor: '#00E676',
    liquidColorHex: 0x00e676,
    proficiency: 88,
    role: 'High-Performance Python Async REST APIs & OpenAPI',
    badge: 'API Framework',
    description:
      'Modern, high-velocity asynchronous Python framework built on Starlette and Pydantic, delivering NodeJS-comparable throughput with automatic OpenAPI documentation.',
    learningAdvantages: [
      'Blazing execution speed powered by ASGI (uvicorn) and modern Python type hints.',
      'Automatic, interactive Swagger/OpenAPI documentation with strict runtime Pydantic validation.',
    ],
    myCapabilities: [
      'Built high-concurrency asynchronous REST APIs with token authentication and rate-limiting.',
      'Integrated ML model inference endpoints and real-time streaming data services.',
    ],
    related: ['python', 'mysql', 'llm_api'],
  },

  // 3: Pandas (CENTER HERO in reference: luminous electric azure blue liquid)
  {
    key: 'pandas',
    name: 'Pandas',
    zoneId: 'ai-ml',
    category: 'AI & Machine Learning',
    domainPill: 'AI & Data',
    liquidColor: '#00B4D8',
    liquidColorHex: 0x00b4d8,
    proficiency: 85,
    role: 'Tabular DataFrames, Cleaning & High-Volume Data Wrangling',
    badge: 'Data Analytics',
    description:
      'A powerful Python library for data manipulation, cleaning and analysis across large structured datasets.',
    learningAdvantages: [
      'Premier industry tool for high-volume 2D tabular data manipulation, cleaning and wrangling.',
      'Vector-optimized column operations with seamless SQL, CSV, JSON, and NumPy interoperability.',
    ],
    myCapabilities: [
      'Executed in-depth exploratory data analysis (EDA), missing value imputations, and feature engineering.',
      'Engineered multi-table grouping, aggregation pipelines, and temporal time-series resampling.',
    ],
    related: ['python', 'scikit_learn', 'ml_fundamentals'],
  },

  // 4: MySQL (Near Right in reference: amber golden honey liquid)
  {
    key: 'mysql',
    name: 'MySQL',
    zoneId: 'database',
    category: 'Database',
    domainPill: 'Database',
    liquidColor: '#FFB300',
    liquidColorHex: 0xffb300,
    proficiency: 87,
    role: 'Relational Schemas, ACID Transactions & Complex Querying',
    badge: 'RDBMS',
    description:
      'Leading open-source relational database management system providing reliable structured table architectures, foreign key constraints, and transactional integrity.',
    learningAdvantages: [
      'ACID compliance guaranteeing transaction atomicity, consistency, isolation, and durability.',
      'Mature B-Tree and Hash indexing strategies optimizing high-frequency lookups and queries.',
    ],
    myCapabilities: [
      'Designed normalized relational schemas (3NF/BCNF) with foreign key referential integrity.',
      'Crafted complex multi-table JOINs, aggregation queries, and index-optimized lookups.',
    ],
    related: ['dbms', 'fastapi', 'python'],
  },

  // 5: Scikit-learn (Mid Right in reference: ruby red/coral liquid)
  {
    key: 'scikit_learn',
    name: 'scikit-learn',
    zoneId: 'ai-ml',
    category: 'AI & Machine Learning',
    domainPill: 'AI / ML',
    liquidColor: '#FF1744',
    liquidColorHex: 0xff1744,
    proficiency: 84,
    role: 'Model Pipelines, Estimator APIs & Feature Preprocessing',
    badge: 'ML Toolkit',
    description:
      'Python standard library for statistical machine learning, offering unified estimator interfaces for classification, regression, clustering, and data preprocessing.',
    learningAdvantages: [
      'Unified estimator API (fit-predict-transform) standard for classification, regression, and clustering.',
      'Production-grade preprocessing pipelines with automated hyperparameter grid search (GridSearchCV).',
    ],
    myCapabilities: [
      'Trained predictive classifiers with rigorous cross-validation and ROC-AUC evaluation metrics.',
      'Constructed feature scaling pipelines with StandardScaler, OneHotEncoder, and Imputers.',
    ],
    related: ['ml_fundamentals', 'random_forest', 'pandas', 'python'],
  },

  // 6: DBMS (Far Right in reference: royal violet/indigo liquid)
  {
    key: 'dbms',
    name: 'DBMS',
    zoneId: 'core-concepts',
    category: 'Core Concept',
    domainPill: 'Core Concepts',
    liquidColor: '#6366F1',
    liquidColorHex: 0x6366f1,
    proficiency: 89,
    role: 'Relational Algebra, Schema Normalization (1NF-BCNF) & ACID',
    badge: 'Database Theory',
    description:
      'Theoretical foundations of Database Management Systems, including relational algebra, schema normalization up to Boyce-Codd Normal Form, and transaction scheduling.',
    learningAdvantages: [
      'Systematic normalization theory eliminating update, insertion, and deletion anomalies.',
      'Rigorous transaction serializability, concurrency control protocols, and two-phase locking (2PL).',
    ],
    myCapabilities: [
      'Analyzed query execution plans, disk page I/O bottlenecks, and schema normalization anomalies.',
      'Engineered deadlock-free transactional workflows ensuring complete ACID compliance.',
    ],
    related: ['mysql', 'oop', 'dsa'],
  },

  // 7: JavaScript
  {
    key: 'javascript',
    name: 'JavaScript',
    zoneId: 'programming',
    category: 'Programming',
    domainPill: 'Programming',
    liquidColor: '#FFD600',
    liquidColorHex: 0xffd600,
    proficiency: 90,
    role: 'Modern Asynchronous & Interactive Web Logic',
    badge: 'ES6+ Standard',
    description:
      'The foundational scripting language of the web, powering dynamic browser interfaces, asynchronous network operations, and modern event-driven logic.',
    learningAdvantages: [
      'Universal browser execution with zero client setup or compilation needed.',
      'First-class asynchronous execution model utilizing Promises and async/await event loops.',
    ],
    myCapabilities: [
      'Crafted dynamic client-side DOM micro-interactions, asynchronous network pipelines, and WebGL logic.',
      'Managed complex browser application state, event debouncing, and web storage synchronization.',
    ],
    related: ['react', 'html5', 'css3'],
  },

  // 8: Machine Learning Fundamentals
  {
    key: 'ml_fundamentals',
    name: 'Machine Learning',
    zoneId: 'ai-ml',
    category: 'AI & Machine Learning',
    domainPill: 'AI / ML',
    liquidColor: '#D946EF',
    liquidColorHex: 0xd946ef,
    proficiency: 86,
    role: 'Supervised Learning, Loss Optimization & Evaluation Metrics',
    badge: 'Core Theory',
    description:
      'Foundational predictive modeling principles covering supervised and unsupervised paradigms, loss function optimization, gradient descent, and cross-validation.',
    learningAdvantages: [
      'Mathematical clarity on loss surfaces, gradient descent optimization, and regularization.',
      'Disciplined bias-variance tradeoff management preventing model underfitting and overfitting.',
    ],
    myCapabilities: [
      'Formulated supervised and unsupervised predictive tasks with rigorous train-test validation.',
      'Evaluated predictive models using ROC-AUC, precision, recall, and F1-score metrics.',
    ],
    related: ['scikit_learn', 'random_forest', 'pandas', 'python'],
  },

  // 9: Random Forest
  {
    key: 'random_forest',
    name: 'Random Forest',
    zoneId: 'ai-ml',
    category: 'AI & Machine Learning',
    domainPill: 'AI / ML',
    liquidColor: '#10B981',
    liquidColorHex: 0x10b981,
    proficiency: 85,
    role: 'Bagging Ensembles, Non-Linear Classifiers & Feature Importance',
    badge: 'Ensemble Model',
    description:
      'Powerful ensemble learning algorithm combining multiple randomized decision trees through bootstrap aggregating (bagging) to achieve high predictive accuracy and low variance.',
    learningAdvantages: [
      'High resistance to overfitting compared to individual unpruned decision trees.',
      'Inherent ability to capture non-linear relationships and ranking feature importances.',
    ],
    myCapabilities: [
      'Trained multi-tree decision ensembles for non-linear tabular classification and regression tasks.',
      'Extracted feature importance scores to guide dimensionality reduction and domain insights.',
    ],
    related: ['scikit_learn', 'ml_fundamentals', 'python'],
  },

  // 10: RAG Fundamentals
  {
    key: 'rag_fundamentals',
    name: 'RAG Fundamentals',
    zoneId: 'ai-ml',
    category: 'AI & Machine Learning',
    domainPill: 'AI / ML',
    liquidColor: '#3B82F6',
    liquidColorHex: 0x3b82f6,
    proficiency: 84,
    role: 'Retrieval-Augmented Generation & Grounded Context Pipelines',
    badge: 'GenAI Architecture',
    description:
      'Architectural paradigm augmenting Large Language Models by retrieving relevant factual knowledge chunks from external knowledge stores before generation.',
    learningAdvantages: [
      'Eliminates LLM hallucinations by grounding responses in verified external document chunks.',
      'Cost-efficient compared to continuously fine-tuning heavy foundation models.',
    ],
    myCapabilities: [
      'Architected document chunking, embedding generation, and vector retrieval pipelines for Q&A.',
      'Integrated semantic vector lookups with system prompt steering for factual grounding.',
    ],
    related: ['embeddings', 'vector_search', 'llm_api', 'python'],
  },

  // 11: Embeddings
  {
    key: 'embeddings',
    name: 'Embeddings',
    zoneId: 'ai-ml',
    category: 'AI & Machine Learning',
    domainPill: 'AI / ML',
    liquidColor: '#06B6D4',
    liquidColorHex: 0x06b6d4,
    proficiency: 86,
    role: 'Dense Vector Representations & Latent Semantic Projections',
    badge: 'Vector Science',
    description:
      'High-dimensional vector representations translating text tokens, sentences, or code into geometric latent coordinates where semantic similarity corresponds to spatial proximity.',
    learningAdvantages: [
      'Captures nuanced contextual meaning far beyond traditional keyword token matching.',
      'Enables mathematical vector algebra (cosine distance, dot product) on natural language.',
    ],
    myCapabilities: [
      'Generated token and sentence vector representations using modern transformer embedding models.',
      'Implemented semantic deduplication, similarity clustering, and semantic query matching.',
    ],
    related: ['vector_search', 'rag_fundamentals', 'llm_api'],
  },

  // 12: Vector Search
  {
    key: 'vector_search',
    name: 'Vector Search',
    zoneId: 'ai-ml',
    category: 'AI & Machine Learning',
    domainPill: 'AI / ML',
    liquidColor: '#EC4899',
    liquidColorHex: 0xec4899,
    proficiency: 85,
    role: 'High-Dimensional Nearest Neighbors & Cosine Distance Indexing',
    badge: 'Vector Search',
    description:
      'Algorithms and indexing data structures (HNSW, IVF, Cosine Distance) engineered to perform sub-millisecond similarity lookups across millions of high-dimensional vectors.',
    learningAdvantages: [
      'Sub-millisecond approximate nearest neighbor (ANN) retrieval over high-dimensional vector spaces.',
      'Core architectural foundation powering modern GenAI search engines, RAG, and AI agents.',
    ],
    myCapabilities: [
      'Configured vector indexes using HNSW and Cosine Distance for sub-second retrieval lookups.',
      'Integrated hybrid keyword and semantic search pipelines for high-precision document recall.',
    ],
    related: ['embeddings', 'rag_fundamentals', 'llm_api'],
  },

  // 13: LLM API
  {
    key: 'llm_api',
    name: 'LLM API',
    zoneId: 'ai-ml',
    category: 'AI & Machine Learning',
    domainPill: 'AI / ML',
    liquidColor: '#14B8A6',
    liquidColorHex: 0x14b8a6,
    proficiency: 88,
    role: 'Foundation Models, Prompt Engineering & Structured Outputs',
    badge: 'Generative AI',
    description:
      'Integration and orchestration of frontier Large Language Models via programmatic APIs, utilizing structured prompting, system steering, and schema-constrained responses.',
    learningAdvantages: [
      'Harnesses state-of-the-art foundation models with zero local GPU infrastructure overhead.',
      'Strict schema validation using JSON mode and structured function-calling interfaces.',
    ],
    myCapabilities: [
      'Engineered system prompt steering, structured JSON schema extractors, and agent workflows.',
      'Integrated streaming model completion endpoints into asynchronous backend REST services.',
    ],
    related: ['rag_fundamentals', 'embeddings', 'fastapi', 'python'],
  },

  // 14: OOP
  {
    key: 'oop',
    name: 'OOP',
    zoneId: 'core-concepts',
    category: 'Core Concept',
    domainPill: 'Core Concepts',
    liquidColor: '#8B5CF6',
    liquidColorHex: 0x8b5cf6,
    proficiency: 91,
    role: 'Encapsulation, Polymorphism, Inheritance & SOLID Principles',
    badge: 'Architecture',
    description:
      'Rigorous software engineering paradigm structuring programs around self-contained objects, class contracts, abstraction boundaries, and reusable design patterns.',
    learningAdvantages: [
      'Encapsulation protecting internal state and exposing strict, clean software interfaces.',
      'SOLID principles eliminating rigid architectural coupling and long-term technical debt.',
    ],
    myCapabilities: [
      'Designed extensible class hierarchies, interface contracts, and reusable design patterns.',
      'Refactored complex monolithic procedural code into modular, easily testable OOP components.',
    ],
    related: ['python', 'dsa', 'dbms'],
  },

  // 15: Computer Networks
  {
    key: 'computer_networks',
    name: 'Computer Networks',
    zoneId: 'core-concepts',
    category: 'Core Concept',
    domainPill: 'Core Concepts',
    liquidColor: '#0284C7',
    liquidColorHex: 0x0284c7,
    proficiency: 83,
    role: 'OSI & TCP/IP Stack, DNS, HTTP/HTTPS, Sockets & Routing',
    badge: 'Protocols',
    description:
      'Foundational principles governing distributed data transmission across the 7-layer OSI model and 4-layer TCP/IP stack, from sockets to application-layer protocols.',
    learningAdvantages: [
      'Deep grasp of TCP 3-way handshakes, reliable packet delivery, and flow control mechanisms.',
      'Clear comprehension of DNS resolution, TLS encryption handshakes, certificates, and routing.',
    ],
    myCapabilities: [
      'Debugged CORS headers, network latency bottlenecks, proxies, and WebSocket socket connections.',
      'Architected resilient client-server request-response lifecycles and REST communication.',
    ],
    related: ['fastapi', 'dsa', 'oop'],
  },

  // 16: Data Structures & Algorithms
  {
    key: 'dsa',
    name: 'DSA',
    zoneId: 'core-concepts',
    category: 'Core Concept',
    domainPill: 'Core Concepts',
    liquidColor: '#FF6D00',
    liquidColorHex: 0xff6d00,
    proficiency: 88,
    role: '100+ Problems Solved • Time/Space Complexity & Algorithmic Optimality',
    badge: 'Problem Solving',
    description:
      'Core computational problem solving encompassing asymptotic Big-O analysis, fundamental data structures (arrays, hash maps, trees, graphs), and algorithmic strategies.',
    learningAdvantages: [
      'Rigorous Big-O time and space complexity evaluation for writing optimal computational logic.',
      'Core mastery of fundamental data structures: HashMaps, Balanced Trees, Graphs, and Heaps.',
    ],
    myCapabilities: [
      'Solved 100+ LeetCode algorithmic problems across binary search, sliding window & graph traversals.',
      'Selected optimal data structures to minimize runtime latency and reduce memory footprints.',
    ],
    related: ['python', 'oop', 'dbms'],
  },

  // 17: HTML5
  {
    key: 'html5',
    name: 'HTML5',
    zoneId: 'frontend',
    category: 'Frontend',
    domainPill: 'Frontend',
    liquidColor: '#FF3D00',
    liquidColorHex: 0xff3d00,
    proficiency: 95,
    role: 'Semantic Document Architecture & Web Accessibility',
    badge: 'Web Standard',
    description:
      'Foundational semantic markup standard defining the accessible structure, content hierarchy, and multimedia capabilities of the modern web.',
    learningAdvantages: [
      'Native accessibility (a11y) and SEO enhancement through proper semantic element tags.',
      'Strict compliance with universal modern W3C open standards with zero third-party runtimes.',
    ],
    myCapabilities: [
      'Structured clean, accessible semantic DOM trees with high Lighthouse performance scores.',
      'Implemented accessible forms, multimedia elements, and responsive layout scaffolding.',
    ],
    related: ['css3', 'react', 'bootstrap'],
  },

  // 18: CSS3
  {
    key: 'css3',
    name: 'CSS3',
    zoneId: 'frontend',
    category: 'Frontend',
    domainPill: 'Frontend',
    liquidColor: '#2979FF',
    liquidColorHex: 0x2979ff,
    proficiency: 92,
    role: 'Responsive Layouts, Flexbox, Grid & Keyframe Motion',
    badge: 'Styling Engine',
    description:
      'Advanced styling stylesheet language powering adaptive multi-breakpoint layouts, hardware-accelerated animations, and responsive visual design systems.',
    learningAdvantages: [
      'Hardware-accelerated CSS transforms and keyframe transitions with zero JavaScript overhead.',
      'CSS Custom Properties (Variables) enabling instant dynamic theme synchronization.',
    ],
    myCapabilities: [
      'Created fluid multi-device layouts, glassmorphic UI systems, and smooth keyframe animations.',
      'Styled adaptive dark/light design systems with responsive typography and spacing.',
    ],
    related: ['html5', 'bootstrap', 'react'],
  },

  // 19: Bootstrap
  {
    key: 'bootstrap',
    name: 'Bootstrap',
    zoneId: 'frontend',
    category: 'Frontend',
    domainPill: 'Frontend',
    liquidColor: '#8B5CF6',
    liquidColorHex: 0x8b5cf6,
    proficiency: 90,
    role: 'Responsive Utility Scaffolding & Rapid UI Prototyping',
    badge: 'UI Framework',
    description:
      'World-renowned responsive front-end framework featuring a 12-column flexbox grid system, extensive utility classes, and pre-styled UI components.',
    learningAdvantages: [
      'Battle-tested 12-column flexbox grid system for rapid interface scaffolding.',
      'Extensive suite of accessible, cross-browser normalized UI primitives and utility classes.',
    ],
    myCapabilities: [
      'Prototyped and shipped production-ready responsive dashboards with clean grid layouts.',
      'Customized theme variables, modal dialogs, and navigation primitives.',
    ],
    related: ['html5', 'css3', 'react'],
  },
];

export const TECH_BY_KEY = VAULT_TECHNOLOGIES.reduce((acc, tech) => {
  acc[tech.key] = tech;
  return acc;
}, {});
