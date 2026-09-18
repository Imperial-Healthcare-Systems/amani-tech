/* Amani Tech prototype — sample data simulating the database.
   All jobs, testimonials, stats and blog posts here are ILLUSTRATIVE for UX review. */

window.AT_DATA = (function () {
  const categories = [
    { id: 'it', name: 'IT & Software', slug: 'it', order: 1, active: true, subs: [
      { id: 'software-development', name: 'Software Development' },
      { id: 'cloud-devops', name: 'Cloud & DevOps' },
      { id: 'data-engineering', name: 'Data Engineering' },
      { id: 'data-science', name: 'Data Science' },
      { id: 'ai-ml', name: 'AI / ML' },
      { id: 'cybersecurity', name: 'Cybersecurity' },
      { id: 'qa-automation', name: 'QA / Automation' },
      { id: 'erp', name: 'ERP' },
      { id: 'it-project-management', name: 'IT Project Management' }
    ]},
    { id: 'finance', name: 'Finance & Accounting', slug: 'finance', order: 2, active: true, subs: [
      { id: 'accounting', name: 'Accounting' },
      { id: 'banking', name: 'Banking' },
      { id: 'financial-analysis', name: 'Financial Analysis' },
      { id: 'audit', name: 'Audit' }
    ]},
    { id: 'engineering', name: 'Engineering', slug: 'engineering', order: 3, active: true, subs: [
      { id: 'mechanical', name: 'Mechanical' },
      { id: 'civil', name: 'Civil' },
      { id: 'electrical', name: 'Electrical' },
      { id: 'electronics', name: 'Electronics' }
    ]},
    { id: 'operations', name: 'Operations & Supply Chain', slug: 'operations', order: 4, active: true, subs: [
      { id: 'logistics', name: 'Logistics' },
      { id: 'procurement', name: 'Procurement' },
      { id: 'plant-operations', name: 'Plant Operations' }
    ]},
    { id: 'sales', name: 'Sales & Marketing', slug: 'sales', order: 5, active: true, subs: [
      { id: 'inside-sales', name: 'Inside Sales' },
      { id: 'field-sales', name: 'Field Sales' },
      { id: 'digital-marketing', name: 'Digital Marketing' }
    ]},
    { id: 'hr', name: 'HR & Administration', slug: 'hr', order: 6, active: true, subs: [
      { id: 'recruitment', name: 'Recruitment' },
      { id: 'hr-operations', name: 'HR Operations' },
      { id: 'admin', name: 'Administration' }
    ]}
  ];

  const locations = ['Hyderabad', 'Bengaluru', 'Pune', 'Chennai', 'Mumbai', 'Gurugram', 'Remote'];

  const jobs = [
    {
      id: 'J-1041', slug: 'senior-java-developer-hyderabad', title: 'Senior Java Developer', company: 'Finserv Product Company',
      location: 'Hyderabad', workMode: 'Hybrid', expMin: 5, expMax: 8, salaryMin: 18, salaryMax: 26, type: 'Full-time',
      category: 'it', subcategory: 'software-development', skills: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Kafka'],
      posted: '2026-09-14', deadline: '2026-10-10', featured: true, status: 'PUBLISHED', source: 'Direct client', qualification: 'B.E. / B.Tech / MCA in Computer Science or related field',
      description: 'A financial services product company is expanding its core payments platform team. You will design and build high-throughput backend services in Java and Spring Boot, working closely with architects and product owners on features that handle millions of transactions daily.',
      responsibilities: ['Design, develop and maintain microservices using Java 17 and Spring Boot', 'Own features end to end — from technical design through deployment and monitoring', 'Review code and mentor two to three mid-level engineers', 'Collaborate with QA and DevOps on CI/CD and release quality', 'Participate in on-call rotation for production support'],
      requirements: ['5–8 years of hands-on Java development', 'Strong experience with Spring Boot, REST APIs and relational databases', 'Working knowledge of Kafka or similar messaging systems', 'Experience deploying to AWS (ECS, RDS, S3)', 'Clear written and verbal communication'],
      benefits: ['Health insurance for family', 'Hybrid working (3 days in office)', 'Annual performance bonus', 'Learning and certification budget']
    },
    {
      id: 'J-1042', slug: 'devops-engineer-bengaluru', title: 'DevOps Engineer', company: 'SaaS Scale-up',
      location: 'Bengaluru', workMode: 'On-site', expMin: 3, expMax: 6, salaryMin: 14, salaryMax: 22, type: 'Full-time',
      category: 'it', subcategory: 'cloud-devops', skills: ['Kubernetes', 'Terraform', 'AWS', 'GitHub Actions', 'Prometheus'],
      posted: '2026-09-13', deadline: '2026-10-05', featured: true, status: 'PUBLISHED', source: 'Direct client', qualification: 'B.E. / B.Tech or equivalent experience',
      description: 'Join a fast-growing SaaS company to own infrastructure and delivery pipelines across multiple environments. You will automate everything that can be automated and make deployments boring.',
      responsibilities: ['Manage Kubernetes clusters on AWS EKS', 'Write and maintain Terraform modules for all infrastructure', 'Build and optimise CI/CD pipelines in GitHub Actions', 'Set up observability with Prometheus, Grafana and alerting', 'Drive cost optimisation and security hardening'],
      requirements: ['3–6 years in DevOps or SRE roles', 'Production experience with Kubernetes and Terraform', 'Solid Linux and networking fundamentals', 'Scripting in Bash or Python', 'AWS certification is a plus'],
      benefits: ['ESOPs', 'Health insurance', 'Free meals', 'Relocation assistance']
    },
    {
      id: 'J-1043', slug: 'data-engineer-pune', title: 'Data Engineer', company: 'Global Analytics Firm',
      location: 'Pune', workMode: 'Hybrid', expMin: 3, expMax: 7, salaryMin: 15, salaryMax: 24, type: 'Full-time',
      category: 'it', subcategory: 'data-engineering', skills: ['Python', 'Spark', 'Airflow', 'Snowflake', 'SQL'],
      posted: '2026-09-12', deadline: '2026-10-12', featured: true, status: 'PUBLISHED', source: 'Direct client', qualification: 'Bachelor’s degree in Engineering, Statistics or related field',
      description: 'Build and operate data pipelines that feed analytics for retail and consumer clients. You will work with Spark, Airflow and Snowflake and own data quality for your domain.',
      responsibilities: ['Design and build batch and streaming pipelines', 'Model data in Snowflake for analytics consumption', 'Implement data quality checks and monitoring', 'Partner with analysts and data scientists on requirements'],
      requirements: ['3+ years building data pipelines in production', 'Strong SQL and Python', 'Hands-on with Spark and an orchestration tool (Airflow preferred)', 'Experience with a cloud data warehouse'],
      benefits: ['Hybrid working', 'Health and accident insurance', 'Certification reimbursement']
    },
    {
      id: 'J-1044', slug: 'accountant-mumbai', title: 'Accountant', company: 'Manufacturing Group',
      location: 'Mumbai', workMode: 'On-site', expMin: 2, expMax: 5, salaryMin: 4.5, salaryMax: 7, type: 'Full-time',
      category: 'finance', subcategory: 'accounting', skills: ['Tally', 'GST', 'TDS', 'MS Excel', 'Bank reconciliation'],
      posted: '2026-09-11', deadline: '2026-10-01', featured: false, status: 'PUBLISHED', source: 'Direct client', qualification: 'B.Com / M.Com; CA Inter preferred',
      description: 'Handle day-to-day accounting for a manufacturing group with three plants. Accurate books, timely compliance and clean month-end closes are the core of this role.',
      responsibilities: ['Post journal entries and maintain ledgers in Tally', 'Prepare GST and TDS returns', 'Reconcile bank and vendor accounts monthly', 'Support statutory audits with schedules and documentation'],
      requirements: ['2–5 years of accounting experience', 'Working knowledge of GST and TDS', 'Comfort with Tally and Excel', 'Attention to detail'],
      benefits: ['Provident fund', 'Health insurance', 'Annual bonus']
    },
    {
      id: 'J-1045', slug: 'mechanical-design-engineer-chennai', title: 'Mechanical Design Engineer', company: 'Automotive Components Manufacturer',
      location: 'Chennai', workMode: 'On-site', expMin: 3, expMax: 6, salaryMin: 6, salaryMax: 10, type: 'Full-time',
      category: 'engineering', subcategory: 'mechanical', skills: ['SolidWorks', 'CATIA', 'GD&T', 'DFMEA', 'Sheet metal'],
      posted: '2026-09-10', deadline: '2026-10-08', featured: true, status: 'PUBLISHED', source: 'Direct client', qualification: 'B.E. / B.Tech in Mechanical Engineering',
      description: 'Design sheet-metal and plastic components for two-wheeler platforms. You will take parts from concept to production release, working with tooling and quality teams.',
      responsibilities: ['Create 3D models and 2D drawings in SolidWorks / CATIA', 'Apply GD&T and tolerance stack-up analysis', 'Run DFMEA and support validation testing', 'Coordinate with suppliers on tooling feasibility'],
      requirements: ['3–6 years in automotive component design', 'Proficiency in SolidWorks or CATIA', 'Understanding of manufacturing processes for sheet metal and plastics'],
      benefits: ['Transport facility', 'Subsidised canteen', 'Health insurance']
    },
    {
      id: 'J-1046', slug: 'qa-automation-engineer-remote', title: 'QA Automation Engineer', company: 'HealthTech Platform',
      location: 'Remote', workMode: 'Remote', expMin: 2, expMax: 5, salaryMin: 9, salaryMax: 15, type: 'Contract',
      category: 'it', subcategory: 'qa-automation', skills: ['Selenium', 'Playwright', 'Java', 'REST Assured', 'CI/CD'],
      posted: '2026-09-15', deadline: '2026-09-30', featured: false, status: 'PUBLISHED', source: 'Staffing partner', qualification: 'Any graduate with relevant experience',
      description: 'Twelve-month contract (extendable) with a healthcare technology company. Build and maintain automated test suites for web and API layers.',
      responsibilities: ['Write and maintain UI automation in Playwright or Selenium', 'Automate API tests with REST Assured', 'Integrate suites into CI pipelines', 'Report defects with clear reproduction steps'],
      requirements: ['2–5 years in test automation', 'Strong Java or TypeScript', 'Experience testing REST APIs', 'Comfortable working in a fully remote team'],
      benefits: ['Fully remote', 'Contract on Amani Tech payroll with benefits', 'Extension based on performance']
    },
    {
      id: 'J-1047', slug: 'financial-analyst-gurugram', title: 'Financial Analyst', company: 'NBFC',
      location: 'Gurugram', workMode: 'Hybrid', expMin: 2, expMax: 4, salaryMin: 8, salaryMax: 12, type: 'Full-time',
      category: 'finance', subcategory: 'financial-analysis', skills: ['Financial modelling', 'Excel', 'Power BI', 'Budgeting', 'Variance analysis'],
      posted: '2026-09-09', deadline: '2026-10-09', featured: false, status: 'PUBLISHED', source: 'Direct client', qualification: 'MBA (Finance) / CA / CFA Level 1+',
      description: 'Support the FP&A team of a growing NBFC with budgeting, forecasting and management reporting.',
      responsibilities: ['Build and maintain financial models', 'Prepare monthly MIS and variance analysis', 'Support annual budgeting and quarterly forecasts', 'Automate reports in Power BI'],
      requirements: ['2–4 years in FP&A or financial analysis', 'Advanced Excel; Power BI a plus', 'Strong analytical and presentation skills'],
      benefits: ['Hybrid working', 'Health insurance', 'Performance bonus']
    },
    {
      id: 'J-1048', slug: 'cybersecurity-analyst-hyderabad', title: 'Cybersecurity Analyst (SOC L2)', company: 'IT Services Company',
      location: 'Hyderabad', workMode: 'On-site', expMin: 3, expMax: 6, salaryMin: 10, salaryMax: 16, type: 'Full-time',
      category: 'it', subcategory: 'cybersecurity', skills: ['SIEM', 'Splunk', 'Incident response', 'Threat hunting', 'CEH'],
      posted: '2026-09-08', deadline: '2026-10-15', featured: false, status: 'PUBLISHED', source: 'Direct client', qualification: 'B.E. / B.Tech; CEH or equivalent certification preferred',
      description: 'Work in a 24×7 security operations centre handling escalated alerts, investigations and incident response for enterprise clients.',
      responsibilities: ['Triage and investigate escalated SIEM alerts', 'Lead incident response and document findings', 'Tune detection rules and reduce false positives', 'Mentor L1 analysts'],
      requirements: ['3–6 years in SOC or security operations', 'Hands-on with Splunk or a comparable SIEM', 'Understanding of MITRE ATT&CK', 'Willing to work in rotational shifts'],
      benefits: ['Shift allowance', 'Health insurance', 'Certification sponsorship']
    },
    {
      id: 'J-1049', slug: 'sap-fico-consultant-bengaluru', title: 'SAP FICO Consultant', company: 'Global Consulting Firm',
      location: 'Bengaluru', workMode: 'Hybrid', expMin: 6, expMax: 10, salaryMin: 22, salaryMax: 32, type: 'Full-time',
      category: 'it', subcategory: 'erp', skills: ['SAP FICO', 'S/4HANA', 'GL', 'AP/AR', 'Asset accounting'],
      posted: '2026-09-07', deadline: '2026-10-20', featured: true, status: 'PUBLISHED', source: 'Direct client', qualification: 'CA / MBA (Finance) / B.Com with SAP certification',
      description: 'Lead FICO workstreams on S/4HANA implementation and rollout projects for manufacturing and pharma clients.',
      responsibilities: ['Gather requirements and design FICO solutions', 'Configure GL, AP, AR, Asset Accounting and Controlling', 'Lead testing cycles and cutover activities', 'Support post-go-live stabilisation'],
      requirements: ['6–10 years of SAP FICO experience with at least two end-to-end implementations', 'S/4HANA project experience', 'Strong understanding of finance processes'],
      benefits: ['Hybrid working', 'Health insurance', 'International project opportunities']
    },
    {
      id: 'J-1050', slug: 'inside-sales-executive-pune', title: 'Inside Sales Executive', company: 'EdTech Company',
      location: 'Pune', workMode: 'On-site', expMin: 1, expMax: 3, salaryMin: 3.5, salaryMax: 6, type: 'Full-time',
      category: 'sales', subcategory: 'inside-sales', skills: ['Lead qualification', 'CRM', 'Cold calling', 'Negotiation'],
      posted: '2026-09-15', deadline: '2026-10-02', featured: false, status: 'PUBLISHED', source: 'Direct client', qualification: 'Any graduate',
      description: 'Convert inbound leads into enrolments for professional upskilling programmes. Target-driven role with uncapped incentives.',
      responsibilities: ['Call and qualify inbound leads', 'Run product demos and follow-ups', 'Maintain pipeline in CRM', 'Meet monthly enrolment targets'],
      requirements: ['1–3 years in inside sales or telesales', 'Fluent English and Hindi', 'Comfortable with targets'],
      benefits: ['Uncapped incentives', 'Health insurance', 'Fast-track promotion path']
    },
    {
      id: 'J-1051', slug: 'electrical-engineer-hyderabad', title: 'Electrical Engineer — Projects', company: 'EPC Contractor',
      location: 'Hyderabad', workMode: 'On-site', expMin: 4, expMax: 8, salaryMin: 7, salaryMax: 11, type: 'Contract',
      category: 'engineering', subcategory: 'electrical', skills: ['HT/LT systems', 'AutoCAD Electrical', 'Substation', 'Site execution'],
      posted: '2026-09-06', deadline: '2026-09-28', featured: false, status: 'PUBLISHED', source: 'Direct client', qualification: 'B.E. / B.Tech in Electrical Engineering',
      description: 'Eighteen-month project contract on an industrial park electrification project. Site-based role with execution ownership.',
      responsibilities: ['Review electrical drawings and BOQs', 'Supervise HT/LT installation and testing', 'Coordinate with vendors and client engineers', 'Ensure safety compliance on site'],
      requirements: ['4–8 years in electrical project execution', 'Substation and HT/LT experience', 'Willing to be site-based'],
      benefits: ['Site allowance', 'Accommodation', 'Health insurance']
    },
    {
      id: 'J-1052', slug: 'machine-learning-engineer-remote', title: 'Machine Learning Engineer', company: 'AI Product Start-up',
      location: 'Remote', workMode: 'Remote', expMin: 3, expMax: 6, salaryMin: 20, salaryMax: 30, type: 'Full-time',
      category: 'it', subcategory: 'ai-ml', skills: ['Python', 'PyTorch', 'MLOps', 'LLMs', 'AWS SageMaker'],
      posted: '2026-09-14', deadline: '2026-10-14', featured: true, status: 'PUBLISHED', source: 'Direct client', qualification: 'B.Tech / M.Tech in CS, Statistics or related',
      description: 'Take models from notebook to production. You will own training pipelines, evaluation and serving for a document-intelligence product.',
      responsibilities: ['Build and maintain training and inference pipelines', 'Fine-tune and evaluate LLM-based components', 'Implement monitoring for model drift', 'Collaborate with backend engineers on serving APIs'],
      requirements: ['3–6 years in ML engineering', 'Strong Python and PyTorch', 'Production MLOps experience', 'Familiarity with LLM fine-tuning and evaluation'],
      benefits: ['Fully remote', 'ESOPs', 'Health insurance', 'Home office budget']
    },
    {
      id: 'J-1053', slug: 'hr-recruiter-hyderabad', title: 'HR Recruiter (Non-IT)', company: 'Retail Chain',
      location: 'Hyderabad', workMode: 'On-site', expMin: 1, expMax: 4, salaryMin: 3, salaryMax: 5, type: 'Full-time',
      category: 'hr', subcategory: 'recruitment', skills: ['Sourcing', 'Screening', 'Bulk hiring', 'Naukri portal', 'Onboarding'],
      posted: '2026-09-05', deadline: '2026-09-30', featured: false, status: 'PUBLISHED', source: 'Direct client', qualification: 'Any graduate; MBA (HR) preferred',
      description: 'Handle bulk hiring for store and warehouse roles across Telangana and Andhra Pradesh.',
      responsibilities: ['Source candidates via portals, references and drives', 'Screen and schedule interviews', 'Coordinate offers and onboarding', 'Maintain hiring trackers'],
      requirements: ['1–4 years in recruitment, preferably volume hiring', 'Telugu and English fluency', 'Organised and target-oriented'],
      benefits: ['Provident fund', 'Health insurance', 'Incentives on closures']
    },
    {
      id: 'J-1054', slug: 'procurement-executive-chennai', title: 'Procurement Executive', company: 'Pharma Manufacturer',
      location: 'Chennai', workMode: 'On-site', expMin: 2, expMax: 5, salaryMin: 4, salaryMax: 6.5, type: 'Full-time',
      category: 'operations', subcategory: 'procurement', skills: ['Vendor management', 'SAP MM', 'Negotiation', 'Purchase orders'],
      posted: '2026-09-04', deadline: '2026-10-04', featured: false, status: 'PUBLISHED', source: 'Direct client', qualification: 'B.Pharm / B.Sc / B.E. with supply chain exposure',
      description: 'Manage raw material and packaging procurement for a pharma formulation plant.',
      responsibilities: ['Raise and track purchase orders in SAP MM', 'Negotiate with approved vendors', 'Monitor deliveries and resolve discrepancies', 'Maintain vendor performance records'],
      requirements: ['2–5 years in procurement, pharma preferred', 'SAP MM experience', 'Good negotiation skills'],
      benefits: ['Transport', 'Canteen', 'Health insurance']
    },
    {
      id: 'J-1055', slug: 'frontend-developer-react-hyderabad', title: 'Frontend Developer (React)', company: 'Digital Agency',
      location: 'Hyderabad', workMode: 'Hybrid', expMin: 2, expMax: 4, salaryMin: 8, salaryMax: 13, type: 'Full-time',
      category: 'it', subcategory: 'software-development', skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'REST'],
      posted: '2026-09-16', deadline: '2026-10-16', featured: false, status: 'PUBLISHED', source: 'Direct client', qualification: 'Any graduate with relevant portfolio',
      description: 'Build responsive, accessible web interfaces for clients in retail and hospitality. You will work directly with designers and backend engineers.',
      responsibilities: ['Implement UI from Figma designs in React and TypeScript', 'Optimise performance and accessibility', 'Write unit tests and participate in code reviews'],
      requirements: ['2–4 years with React', 'Solid TypeScript and modern CSS', 'Experience with Next.js is a plus'],
      benefits: ['Hybrid working', 'Health insurance', 'Learning budget']
    },
    {
      id: 'J-1056', slug: 'graduate-trainee-engineer-pune', title: 'Graduate Trainee Engineer', company: 'Industrial Automation Company',
      location: 'Pune', workMode: 'On-site', expMin: 0, expMax: 1, salaryMin: 3.5, salaryMax: 4.5, type: 'Full-time',
      category: 'engineering', subcategory: 'electronics', skills: ['PLC basics', 'Electronics', 'Problem solving'],
      posted: '2026-09-13', deadline: '2026-10-13', featured: false, status: 'PUBLISHED', source: 'Campus partner', qualification: 'B.E. / B.Tech (2025 or 2026 batch) in Electronics, Instrumentation or Electrical',
      description: 'A one-year structured trainee programme with rotations across design, testing and field service, leading to a permanent engineer role.',
      responsibilities: ['Learn and support PLC panel design and testing', 'Assist senior engineers on customer sites', 'Document test results and procedures'],
      requirements: ['Fresh graduate or up to 1 year of experience', 'Strong fundamentals in electronics', 'Willingness to travel'],
      benefits: ['Structured training', 'Health insurance', 'Confirmation after 12 months']
    },
    {
      id: 'J-1057', slug: 'it-project-manager-mumbai', title: 'IT Project Manager', company: 'Banking Technology Provider',
      location: 'Mumbai', workMode: 'Hybrid', expMin: 8, expMax: 12, salaryMin: 25, salaryMax: 35, type: 'Full-time',
      category: 'it', subcategory: 'it-project-management', skills: ['PMP', 'Agile', 'Stakeholder management', 'Banking domain', 'JIRA'],
      posted: '2026-09-02', deadline: '2026-10-02', featured: false, status: 'PUBLISHED', source: 'Direct client', qualification: 'B.E. / MBA; PMP or PRINCE2 preferred',
      description: 'Deliver core banking implementation projects for private-sector banks. Manage scope, schedule, budget and a cross-functional team of 20+.',
      responsibilities: ['Plan and track delivery across multiple workstreams', 'Manage client stakeholders and steering committees', 'Own risk, issue and change management', 'Report status to leadership'],
      requirements: ['8–12 years in IT delivery with 4+ as project manager', 'Banking or financial services domain experience', 'PMP or equivalent certification'],
      benefits: ['Hybrid working', 'Health insurance', 'Performance bonus']
    }
  ];

  const services = [
    { slug: 'it-staffing', title: 'IT Staffing', short: 'Developers, cloud and DevOps engineers, data and AI specialists, QA, ERP and IT project managers — on contract or permanent terms.', icon: 'code' },
    { slug: 'non-it-staffing', title: 'Non-IT Staffing', short: 'Finance, accounting, engineering, operations, sales and support roles across industries.', icon: 'briefcase' },
    { slug: 'contract-staffing', title: 'Contract Staffing', short: 'Flexible, compliant workforce for project peaks, backfills and fixed-term needs.', icon: 'clock' },
    { slug: 'permanent-recruitment', title: 'Permanent Recruitment', short: 'End-to-end hiring for full-time positions, from brief to offer acceptance.', icon: 'usercheck' },
    { slug: 'bulk-project-hiring', title: 'Bulk & Project Hiring', short: 'Volume hiring for new sites, expansions and time-bound programmes.', icon: 'users' },
    { slug: 'fresher-hiring', title: 'Fresher & Entry-Level Hiring', short: 'Screened graduates and early-career talent ready to start.', icon: 'graduation' }
  ];

  const testimonials = [
    { id: 'T-1', name: 'Priya Raman', designation: 'Data Engineer', company: 'Placed via Amani Tech', rating: 5, status: 'APPROVED', featured: true, review: 'I had applied to dozens of portals with no response. Within a week of applying here, a recruiter called me, explained the role honestly, and prepared me for the interview. I joined in three weeks.' },
    { id: 'T-2', name: 'Suresh Menon', designation: 'Head of Engineering', company: 'SaaS Scale-up', rating: 5, status: 'APPROVED', featured: true, review: 'We needed two DevOps engineers before a product launch. Amani Tech sent four screened profiles in five days and both hires are still with us a year later.' },
    { id: 'T-3', name: 'Anita Deshmukh', designation: 'Plant HR Manager', company: 'Automotive Components Manufacturer', rating: 4, status: 'APPROVED', featured: true, review: 'Most agencies only understand IT. Amani Tech filled mechanical design and quality roles for us with candidates who actually matched the JD.' },
    { id: 'T-4', name: 'Rahul Verma', designation: 'SAP FICO Consultant', company: 'Placed via Amani Tech', rating: 5, status: 'APPROVED', featured: false, review: 'Clear communication at every step. I always knew where my application stood.' },
    { id: 'T-5', name: 'Kavya Nair', designation: 'Accountant', company: 'Manufacturing Group', rating: 5, status: 'PENDING', featured: false, review: 'The team was patient with my questions and negotiated a fair offer on my behalf.' },
    { id: 'T-6', name: 'Deepak Sharma', designation: 'Talent Acquisition Lead', company: 'NBFC', rating: 4, status: 'PENDING', featured: false, review: 'Responsive team and good quality shortlist for our FP&A roles.' }
  ];

  const blogs = [
    { slug: 'resume-a-recruiter-will-read', title: 'How to write a resume that a recruiter will actually read', category: 'Career Advice', author: 'Amani Tech Editorial', date: '2026-09-10', readTime: 6, featured: true, status: 'PUBLISHED', excerpt: 'Recruiters spend under a minute on a first pass. Here is how to make that minute count — structure, keywords, and the mistakes that get resumes skipped.', tags: ['Resume', 'Job search'] },
    { slug: 'contract-vs-permanent-hiring', title: 'Contract vs permanent hiring: which is right for your team?', category: 'Insights', author: 'Amani Tech Editorial', date: '2026-09-03', readTime: 5, featured: false, status: 'PUBLISHED', excerpt: 'Both models work — for different situations. A practical framework for choosing, with the cost and speed trade-offs employers usually miss.', tags: ['Hiring', 'Contract staffing'] },
    { slug: 'questions-before-accepting-an-offer', title: 'The 5 questions to ask before accepting a job offer', category: 'Career Advice', author: 'Amani Tech Editorial', date: '2026-08-27', readTime: 4, featured: false, status: 'PUBLISHED', excerpt: 'Salary is only one line. Ask these five questions and you will avoid the most common regrets we hear from candidates.', tags: ['Offers', 'Career growth'] },
    { slug: 'hiring-cloud-devops-2026', title: 'Hiring for cloud and DevOps in 2026: what employers are looking for', category: 'Insights', author: 'Amani Tech Editorial', date: '2026-08-20', readTime: 7, featured: false, status: 'PUBLISHED', excerpt: 'Platform engineering, cost ownership and security-by-default have moved from nice-to-have to baseline. What that means for job descriptions and screening.', tags: ['DevOps', 'Hiring trends'] },
    { slug: 'technical-interview-domain-switch', title: 'Preparing for a technical interview when you are switching domains', category: 'Career Advice', author: 'Amani Tech Editorial', date: '2026-08-13', readTime: 5, featured: false, status: 'PUBLISHED', excerpt: 'Moving from services to product, or from one industry to another? How to frame your experience so interviewers see transferable depth, not gaps.', tags: ['Interviews'] },
    { slug: 'non-it-hiring-deserves-rigour', title: 'Why non-IT hiring deserves the same rigour as tech hiring', category: 'Insights', author: 'Amani Tech Editorial', date: '2026-08-06', readTime: 4, featured: false, status: 'PUBLISHED', excerpt: 'Plant engineers, accountants and sales teams carry as much business risk as developers. A case for structured screening beyond IT.', tags: ['Non-IT', 'Screening'] }
  ];

  const careers = [
    { slug: 'senior-it-recruiter', position: 'Senior IT Recruiter', department: 'Recruitment', location: 'Hyderabad', workMode: 'Hybrid', experience: '4–7 years', status: 'PUBLISHED', posted: '2026-09-08',
      description: 'Own end-to-end recruitment for IT mandates — from understanding the requirement with the client to offer negotiation and joining.',
      responsibilities: ['Understand client requirements and build search strategies', 'Source, screen and present candidates with recruiter notes', 'Manage the candidate experience through interviews and offers', 'Mentor associate recruiters'],
      requirements: ['4–7 years in IT recruitment, agency experience preferred', 'Strong sourcing skills across portals, LinkedIn and referrals', 'Excellent communication and follow-through'],
      benefits: ['Health insurance', 'Performance incentives', 'Hybrid working', 'Learning budget'],
      howToApply: 'Email your resume to careers@amanitech.in with the subject line “Senior IT Recruiter”. Include a short note on the toughest role you have closed.' },
    { slug: 'account-manager-staffing', position: 'Account Manager — Staffing', department: 'Client Services', location: 'Bengaluru', workMode: 'Hybrid', experience: '5–9 years', status: 'PUBLISHED', posted: '2026-09-01',
      description: 'Grow and manage relationships with employer clients, ensuring requirements are understood, staffed on time and renewed.',
      responsibilities: ['Manage a portfolio of employer accounts', 'Translate requirements into clear briefs for the recruitment team', 'Track delivery, escalate risks and drive renewals', 'Identify expansion opportunities'],
      requirements: ['5–9 years in staffing account management or B2B client services', 'Understanding of contract and permanent staffing models', 'Commercial acumen'],
      benefits: ['Health insurance', 'Quarterly incentives', 'Hybrid working'],
      howToApply: 'Email your resume to careers@amanitech.in with the subject line “Account Manager — Staffing”.' },
    { slug: 'associate-recruiter-non-it', position: 'Associate Recruiter (Non-IT)', department: 'Recruitment', location: 'Hyderabad', workMode: 'On-site', experience: '0–2 years', status: 'PUBLISHED', posted: '2026-09-12',
      description: 'Start your recruitment career with structured training. You will support senior recruiters on finance, engineering and operations mandates.',
      responsibilities: ['Source candidates from portals and databases', 'Conduct first-level screening calls', 'Maintain trackers and schedule interviews'],
      requirements: ['0–2 years of experience; graduates welcome', 'Clear spoken and written English; Telugu or Hindi a plus', 'Curiosity about people and industries'],
      benefits: ['Structured onboarding', 'Health insurance', 'Clear promotion path'],
      howToApply: 'Email your resume to careers@amanitech.in with the subject line “Associate Recruiter”.' },
    { slug: 'full-stack-developer-internal', position: 'Full-Stack Developer (Internal Platform)', department: 'Technology', location: 'Remote', workMode: 'Remote', experience: '3–5 years', status: 'PUBLISHED', posted: '2026-08-25',
      description: 'Build and maintain the Amani Tech job platform and admin tools used by our recruiters every day.',
      responsibilities: ['Ship features across the Next.js frontend and Node backend', 'Maintain the PostgreSQL schema and API', 'Improve performance, accessibility and security'],
      requirements: ['3–5 years with TypeScript, React and Node', 'Experience with PostgreSQL and file storage', 'Product mindset'],
      benefits: ['Fully remote', 'Health insurance', 'Learning budget'],
      howToApply: 'Email your resume and a link to something you have built to careers@amanitech.in with the subject line “Full-Stack Developer”.' }
  ];

  const faqs = [
    { group: 'Job seekers', q: 'Do job seekers pay anything to apply?', a: 'No. Amani Tech never charges candidates for registration, applications or placements.' },
    { group: 'Job seekers', q: 'How do I know a job is genuine?', a: 'Every job on this site is posted by Amani Tech’s recruitment team after confirming the requirement with the employer.' },
    { group: 'Job seekers', q: 'What happens after I apply?', a: 'You receive a confirmation email. A recruiter reviews your application and contacts you if the role is a fit. You can check your status in your dashboard.' },
    { group: 'Job seekers', q: 'Which resume formats do you accept?', a: 'PDF, DOC and DOCX up to 5 MB.' },
    { group: 'Job seekers', q: 'Can I apply to more than one job?', a: 'Yes. Register once and apply to as many relevant roles as you like.' },
    { group: 'Employers', q: 'How quickly can employers expect a shortlist?', a: 'For most roles, profiles are shared within a few working days of the requirement being confirmed.' },
    { group: 'Employers', q: 'Do you offer contract staffing?', a: 'Yes. We provide contract, permanent and project-based staffing.' },
    { group: 'Employers', q: 'Do you place non-IT candidates?', a: 'Yes — finance, engineering, operations, sales, support and more.' },
    { group: 'Employers', q: 'Which locations do you cover?', a: 'We place candidates across major Indian cities and remote roles. Tell us the location in your requirement and we will confirm coverage.' },
    { group: 'Partners', q: 'Who can become a staffing partner?', a: 'Specialist staffing firms, regional agencies, campus partners and independent recruiters with a strong candidate network.' },
    { group: 'General', q: 'How is my data used?', a: 'Your resume is only shared with employers for roles you apply to. See our Privacy Policy for details.' },
    { group: 'General', q: 'How do I contact Amani Tech?', a: 'Use the contact page, email hello@amanitech.in or call +91 40 0000 0000 during office hours.' }
  ];

  const stats = [
    { number: 1200, suffix: '+', label: 'Candidates placed' },
    { number: 180, suffix: '+', label: 'Client companies' },
    { number: 25, suffix: '+', label: 'Job categories' },
    { number: 9, suffix: '', label: 'Years in staffing' }
  ];

  const industries = ['IT Services', 'Banking & Finance', 'Manufacturing', 'Healthcare', 'Retail & E-commerce', 'Education', 'Logistics', 'Telecom'];

  // Admin-only sample records
  const applications = [
    { id: 'A-3021', name: 'Priya Raman', email: 'priya.raman@example.com', phone: '+91 98450 11223', location: 'Bengaluru', profile: 'IT', category: 'it', subcategory: 'data-engineering', exp: 4, title: 'Data Engineer', job: 'J-1043', date: '2026-09-15T10:24:00', status: 'SUBMITTED', resume: 'priya-raman-resume.pdf' },
    { id: 'A-3020', name: 'Arjun Reddy', email: 'arjun.reddy@example.com', phone: '+91 99880 44556', location: 'Hyderabad', profile: 'IT', category: 'it', subcategory: 'software-development', exp: 6, title: 'Senior Software Engineer', job: 'J-1041', date: '2026-09-15T09:02:00', status: 'REVIEWING', resume: 'arjun-reddy.pdf' },
    { id: 'A-3019', name: 'Meera Iyer', email: 'meera.iyer@example.com', phone: '+91 98200 77889', location: 'Mumbai', profile: 'Non-IT', category: 'finance', subcategory: 'accounting', exp: 3, title: 'Accounts Executive', job: 'J-1044', date: '2026-09-14T16:40:00', status: 'SHORTLISTED', resume: 'meera-iyer-cv.docx' },
    { id: 'A-3018', name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 98111 22334', location: 'Gurugram', profile: 'Non-IT', category: 'finance', subcategory: 'financial-analysis', exp: 2, title: 'Financial Analyst', job: 'J-1047', date: '2026-09-14T11:15:00', status: 'SUBMITTED', resume: 'vikram-singh.pdf' },
    { id: 'A-3017', name: 'Sneha Kulkarni', email: 'sneha.k@example.com', phone: '+91 98600 55667', location: 'Pune', profile: 'IT', category: 'it', subcategory: 'cloud-devops', exp: 4, title: 'DevOps Engineer', job: 'J-1042', date: '2026-09-13T14:30:00', status: 'REVIEWING', resume: 'sneha-kulkarni.pdf' },
    { id: 'A-3016', name: 'Karthik Subramanian', email: 'karthik.s@example.com', phone: '+91 98400 33445', location: 'Chennai', profile: 'Non-IT', category: 'engineering', subcategory: 'mechanical', exp: 5, title: 'Design Engineer', job: 'J-1045', date: '2026-09-13T09:50:00', status: 'REJECTED', resume: 'karthik-resume.doc' },
    { id: 'A-3015', name: 'Fatima Sheikh', email: 'fatima.sheikh@example.com', phone: '+91 98700 66778', location: 'Hyderabad', profile: 'IT', category: 'it', subcategory: 'cybersecurity', exp: 3, title: 'SOC Analyst', job: 'J-1048', date: '2026-09-12T18:05:00', status: 'SUBMITTED', resume: 'fatima-sheikh.pdf' },
    { id: 'A-3014', name: 'Rohan Das', email: 'rohan.das@example.com', phone: '+91 98300 99001', location: 'Remote', profile: 'IT', category: 'it', subcategory: 'ai-ml', exp: 4, title: 'ML Engineer', job: 'J-1052', date: '2026-09-12T12:20:00', status: 'SHORTLISTED', resume: 'rohan-das.pdf' }
  ];

  const employerEnquiries = [
    { id: 'E-512', name: 'Suresh Menon', email: 'suresh@saas-scaleup.example', phone: '+91 80 4000 1234', company: 'SaaS Scale-up', designation: 'Head of Engineering', type: 'Contract', title: 'Site Reliability Engineer', positions: 2, location: 'Bengaluru', workMode: 'On-site', experience: '4–7 years', timeline: 'Within 30 days', date: '2026-09-15T11:10:00', status: 'NEW', notes: [] },
    { id: 'E-511', name: 'Anita Deshmukh', email: 'anita.d@autocomp.example', phone: '+91 44 2200 5678', company: 'Automotive Components Manufacturer', designation: 'Plant HR Manager', type: 'Permanent', title: 'Quality Engineer', positions: 3, location: 'Chennai', workMode: 'On-site', experience: '3–6 years', timeline: 'Within 60 days', date: '2026-09-14T15:45:00', status: 'CONTACTED', notes: [{ by: 'Admin', at: '2026-09-14T17:00:00', text: 'Called; JD to be shared by Monday.' }] },
    { id: 'E-510', name: 'Deepak Sharma', email: 'deepak.s@nbfc.example', phone: '+91 124 400 9876', company: 'NBFC', designation: 'Talent Acquisition Lead', type: 'Permanent', title: 'Senior Financial Analyst', positions: 1, location: 'Gurugram', workMode: 'Hybrid', experience: '5–8 years', timeline: 'Immediate', date: '2026-09-12T10:00:00', status: 'IN_DISCUSSION', notes: [{ by: 'Admin', at: '2026-09-13T11:30:00', text: 'Shortlist of 3 shared. Awaiting interview slots.' }] },
    { id: 'E-509', name: 'Neha Agarwal', email: 'neha@edtech.example', phone: '+91 20 6700 4321', company: 'EdTech Company', designation: 'Sales Director', type: 'Bulk hiring', title: 'Inside Sales Executive', positions: 15, location: 'Pune', workMode: 'On-site', experience: '1–3 years', timeline: 'Within 30 days', date: '2026-09-10T09:30:00', status: 'CONVERTED', notes: [] },
    { id: 'E-508', name: 'Ravi Kumar', email: 'ravi@logistics.example', phone: '+91 22 4500 1111', company: 'Logistics Provider', designation: 'Operations Head', type: 'Contract', title: 'Warehouse Supervisor', positions: 4, location: 'Mumbai', workMode: 'On-site', experience: '2–5 years', timeline: 'Within 60 days', date: '2026-09-05T14:00:00', status: 'CLOSED', notes: [{ by: 'Admin', at: '2026-09-08T10:00:00', text: 'Requirement put on hold by client.' }] }
  ];

  const vendorEnquiries = [
    { id: 'V-77', company: 'TalentBridge Consultants', contact: 'Manish Gupta', email: 'manish@talentbridge.example', phone: '+91 98100 12121', location: 'Delhi NCR', services: ['Permanent recruitment', 'Contract staffing'], specialization: 'BFSI, Fintech', years: 8, website: 'talentbridge.example', date: '2026-09-14T12:00:00', status: 'PENDING', notes: [] },
    { id: 'V-76', company: 'SkillPort Campus Solutions', contact: 'Lakshmi Prasad', email: 'lakshmi@skillport.example', phone: '+91 98480 34343', location: 'Hyderabad', services: ['Campus hiring'], specialization: 'Engineering graduates', years: 5, website: 'skillport.example', date: '2026-09-11T16:30:00', status: 'APPROVED', notes: [{ by: 'Admin', at: '2026-09-12T10:00:00', text: 'Agreement signed.' }] },
    { id: 'V-75', company: 'QuickHire Staffing', contact: 'Amit Joshi', email: 'amit@quickhire.example', phone: '+91 98200 56565', location: 'Mumbai', services: ['Contract staffing'], specialization: 'Blue-collar, logistics', years: 3, website: '', date: '2026-09-08T11:00:00', status: 'REJECTED', notes: [{ by: 'Admin', at: '2026-09-09T09:00:00', text: 'Outside current focus areas.' }] }
  ];

  const candidates = applications.map(a => ({ id: 'C-' + a.id.slice(2), name: a.name, email: a.email, phone: a.phone, location: a.location, profile: a.profile, category: a.category, subcategory: a.subcategory, exp: a.exp, title: a.title, registered: a.date, applications: 1, resume: a.resume }));

  return { categories, locations, jobs, services, testimonials, blogs, careers, faqs, stats, industries, applications, employerEnquiries, vendorEnquiries, candidates };
})();
