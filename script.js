/* Admin dashboard front-end demo
   - Uses localStorage as a lightweight "data store"
   - Renders either Applicants List page or Application Details page
   - Arrow action navigates to application-details.html?id=... */

(function () {
  const STORAGE_KEY = "applications";

  // Stage names align with the workflow diagram + your operational guidelines.
  const STAGES = {
    intake: "intake",
    treasury: "treasury",
    gis: "gis",
    inspection: "inspection",
    technicalReview: "technicalReview",
    final: "final",
    done: "done"
  };

  const STAGE_LABELS = {
    [STAGES.intake]: "Intake & Validation (Records Staff)",
    [STAGES.treasury]: "Payment Validation (Treasurer's Office)",
    [STAGES.gis]: "GIS Evaluation (GIS Specialist)",
    [STAGES.inspection]: "Inspection Report (Drone + Site Evaluation)",
    [STAGES.technicalReview]: "Technical Review (Draftsman)",
    [STAGES.final]: "Final Approval / Zoning Decision",
    [STAGES.done]: "Completed"
  };

  const SEED_APPLICATIONS = [
    {
      id: "A-1001",
      fullName: "Alyvia Kelley",
      status: "Approved",
      email: "a.kelley@gmail.com",
      dob: "06/18/1978",
      submittedAt: "2026-03-02",
      applicantType: "Individual",
      address: "Poblacion, Sample Province",
      documents: [
        { name: "Valid ID (Front)", type: "image", status: "Uploaded" },
        { name: "Valid ID (Back)", type: "image", status: "Uploaded" },
        { name: "Supporting Letter", type: "pdf", status: "Uploaded" }
      ],
      notes: "Approved after review.",
      timeline: [
        { at: "2026-03-03", by: "MPDO Staff", action: "Submitted for processing" },
        { at: "2026-03-05", by: "GIS Officer", action: "GIS check completed" },
        { at: "2026-03-10", by: "Inspection Team", action: "Inspection report saved" },
        { at: "2026-03-12", by: "Approving Authority", action: "Final approval granted" }
      ],
      workflow: {
        stage: STAGES.done,
        completed: {
          intake: { at: "2026-03-03", by: "Records Staff" },
          treasury: { at: "2026-03-04", by: "Treasurer's Office" },
          gis: { at: "2026-03-05", by: "GIS Specialist" },
          inspection: { at: "2026-03-10", by: "Drone Pilot / Project Evaluator" },
          technicalReview: { at: "2026-03-11", by: "Draftsman (Technical Review)" },
          final: { at: "2026-03-12", by: "MPDC / Zoning Administrator" }
        },
        recommendations: {
          gis: { outcome: "approve", notes: "Zoning and hazard constraints are consistent." },
          inspection: { outcome: "approve", notes: "Setback verification matches uploaded photos." },
          technicalReview: { outcome: "approve", notes: "No discrepancies found." }
        },
        finalDecision: { decision: "Approved", reason: "All conditions met; official notice issued." }
      }
    },
    {
      id: "A-1002",
      fullName: "Jaiden Nixon",
      status: "Approved",
      email: "jaiden. nixon@gmail.com".replace(" ", ""),
      dob: "09/30/1963",
      submittedAt: "2026-02-26",
      applicantType: "Organization",
      address: "Brgy. Rizal, Sample Province",
      documents: [
        { name: "Authorization Letter", type: "pdf", status: "Uploaded" },
        { name: "Valid ID", type: "image", status: "Uploaded" }
      ],
      notes: "Approved with no issues.",
      timeline: [
        { at: "2026-02-27", by: "MPDO Staff", action: "Validated applicant profile" },
        { at: "2026-03-01", by: "Treasurer's Office", action: "Payment records validated" },
        { at: "2026-03-06", by: "Approving Authority", action: "Approval issued" }
      ],
      workflow: {
        stage: STAGES.done,
        completed: {
          intake: { at: "2026-02-27", by: "Records Staff" },
          treasury: { at: "2026-03-01", by: "Treasurer's Office" },
          gis: { at: "2026-03-02", by: "GIS Specialist" },
          inspection: { at: "2026-03-04", by: "Drone Pilot / Project Evaluator" },
          technicalReview: { at: "2026-03-05", by: "Draftsman (Technical Review)" },
          final: { at: "2026-03-06", by: "MPDC / Zoning Administrator" }
        },
        recommendations: {
          gis: { outcome: "approve", notes: "Hazard constraints check passed." },
          inspection: { outcome: "approve", notes: "Ground-level verification matched." },
          technicalReview: { outcome: "approve", notes: "Technical documents complete." }
        },
        finalDecision: { decision: "Approved", reason: "Approved after full document evaluation." }
      }
    },
    {
      id: "A-1003",
      fullName: "Ace Foley",
      status: "Incomplete",
      email: "ace.fog@yahoo.com",
      dob: "12/09/1985",
      submittedAt: "2026-03-06",
      applicantType: "Individual",
      address: "Brgy. San Luis, Sample Province",
      documents: [{ name: "Valid ID", type: "image", status: "Uploaded" }],
      notes: "",
      timeline: [
        { at: "2026-03-06", by: "MPDO Staff", action: "Received application" },
        { at: "2026-03-07", by: "Treasurer's Office", action: "Payment pending validation" }
      ],
      workflow: {
        stage: STAGES.treasury,
        completed: {
          intake: { at: "2026-03-06", by: "Records Staff" }
        },
        recommendations: {}
      }
    },
    {
      id: "A-1004",
      fullName: "Nikolai Schmidt",
      status: "Under Review",
      email: "nikolai.schmidt1964@outlook.com",
      dob: "03/22/1956",
      submittedAt: "2026-02-18",
      applicantType: "Individual",
      address: "Brgy. Lanao, Sample Province",
      documents: [{ name: "Valid ID", type: "image", status: "Uploaded" }],
      notes: "",
      timeline: [
        { at: "2026-02-19", by: "MPDO Staff", action: "Initial validation complete" },
        { at: "2026-02-21", by: "Treasurer's Office", action: "Payment validated; forwarded to GIS" },
        { at: "2026-02-22", by: "GIS Officer", action: "GIS evaluation pending" }
      ],
      workflow: {
        stage: STAGES.gis,
        completed: {
          intake: { at: "2026-02-19", by: "Records Staff" },
          treasury: { at: "2026-02-21", by: "Treasurer's Office" }
        },
        recommendations: {}
      }
    },
    {
      id: "A-1005",
      fullName: "Clayton Charles",
      status: "Under Review",
      email: "me@clayton.com",
      dob: "10/14/1971",
      submittedAt: "2026-03-01",
      applicantType: "Individual",
      address: "Poblacion East, Sample Province",
      documents: [{ name: "Supporting Letter", type: "pdf", status: "Uploaded" }],
      notes: "",
      timeline: [
        { at: "2026-03-02", by: "MPDO Staff", action: "Intake validated; forwarded to Treasurer's Office" },
        { at: "2026-03-02", by: "Treasurer's Office", action: "Payment validated; forwarded to GIS" },
        { at: "2026-03-03", by: "GIS Officer", action: "GIS evaluation submitted; forwarded to Inspection Team" }
      ],
      workflow: {
        stage: STAGES.inspection,
        completed: {
          intake: { at: "2026-03-02", by: "Records Staff" },
          treasury: { at: "2026-03-02", by: "Treasurer's Office" },
          gis: { at: "2026-03-03", by: "GIS Specialist" }
        },
        recommendations: {
          gis: { outcome: "correct", notes: "Minor corrections needed after overlay verification." }
        }
      }
    },
    {
      id: "A-1006",
      fullName: "Reece Duran",
      status: "Under Review",
      email: "reece@yahoo.com",
      dob: "05/26/1980",
      submittedAt: "2026-02-09",
      applicantType: "Individual",
      address: "Brgy. Macopa, Sample Province",
      documents: [{ name: "Valid ID", type: "image", status: "Uploaded" }],
      notes: "",
      timeline: [
        { at: "2026-02-10", by: "MPDO Staff", action: "Received application" },
        { at: "2026-02-12", by: "Treasurer's Office", action: "Payment validated; forwarded to GIS" },
        { at: "2026-02-14", by: "GIS Officer", action: "GIS evaluation completed; forwarded to Inspection Team" },
        { at: "2026-02-18", by: "Inspection Team", action: "Inspection report ready; technical review pending" }
      ],
      workflow: {
        stage: STAGES.final,
        completed: {
          intake: { at: "2026-02-10", by: "Records Staff" },
          treasury: { at: "2026-02-12", by: "Treasurer's Office" },
          gis: { at: "2026-02-14", by: "GIS Specialist" },
          inspection: { at: "2026-02-18", by: "Drone Pilot / Project Evaluator" },
          technicalReview: { at: "2026-02-20", by: "Draftsman (Technical Review)" }
        },
        recommendations: {
          gis: { outcome: "deny", notes: "Hazard constraints indicate non-compliance in mapped zones." },
          inspection: { outcome: "deny", notes: "Setback verification supports non-compliance." },
          technicalReview: { outcome: "deny", notes: "Draftsman technical review confirms zoning mismatch." }
        }
      }
    },
    {
      id: "A-1007",
      fullName: "Princie Chen",
      status: "Pending",
      email: "prince.chen1997@gmail.com",
      dob: "07/05/1992",
      submittedAt: "2026-03-11",
      applicantType: "Individual",
      address: "Brgy. Bagong Silang, Sample Province",
      documents: [{ name: "Valid ID", type: "image", status: "Uploaded" }],
      notes: "",
      timeline: [{ at: "2026-03-11", by: "MPDO Staff", action: "Received application; intake pending validation" }],
      workflow: {
        stage: STAGES.intake,
        completed: {}
      }
    },
    {
      id: "A-1008",
      fullName: "Marlon Bautista",
      status: "Rejected",
      email: "marlon.bautista@gmail.com",
      dob: "01/11/1980",
      submittedAt: "2026-02-13",
      applicantType: "Individual",
      address: "Brgy. Masagana, Sample Province",
      documents: [
        { name: "Valid ID", type: "image", status: "Uploaded" },
        { name: "Zoning/Project Plan", type: "pdf", status: "Uploaded" }
      ],
      notes: "",
      timeline: [
        { at: "2026-02-13", by: "MPDO Staff", action: "Received application" },
        { at: "2026-02-14", by: "Treasurer's Office", action: "Payment validated; forwarded to GIS" },
        { at: "2026-02-16", by: "GIS Officer", action: "GIS evaluation completed; forwarded to Inspection Team" },
        { at: "2026-02-20", by: "Inspection Team", action: "Inspection discrepancies found; technical review pending" },
        { at: "2026-02-22", by: "Draftsman (Technical Review)", action: "Technical review confirms zoning mismatch" },
        { at: "2026-02-23", by: "MPDC / Zoning Administrator", action: "Final rejection recorded (legal decision)" }
      ],
      workflow: {
        stage: STAGES.done,
        completed: {
          intake: { at: "2026-02-13", by: "Records Staff" },
          treasury: { at: "2026-02-14", by: "Treasurer's Office" },
          gis: { at: "2026-02-16", by: "GIS Specialist" },
          inspection: { at: "2026-02-20", by: "Drone Pilot / Project Evaluator" },
          technicalReview: { at: "2026-02-22", by: "Draftsman (Technical Review)" },
          final: { at: "2026-02-23", by: "MPDC / Zoning Administrator" }
        },
        recommendations: {
          gis: { outcome: "deny", notes: "Land-use overlay indicates conflict with restricted zone." },
          inspection: { outcome: "deny", notes: "Setback verification indicates non-compliance." },
          technicalReview: { outcome: "deny", notes: "Plans do not match zoning requirements." }
        },
        finalDecision: { decision: "Rejected", reason: "Zoning/hazard non-compliance confirmed in review." }
      }
    },
    {
      id: "A-1009",
      fullName: "Louiza Beatrice Lim",
      status: "Incomplete",
      email: "lbeatricelim@mpdo.gov",
      dob: "03/07/1994",
      submittedAt: "2026-03-14",
      applicantType: "Individual",
      address: "Brgy. Poblacion, Sample Province",
      documents: [{ name: "Land Title (TCT)", type: "pdf", status: "Uploaded" }],
      notes: "",
      timeline: [
        { at: "2026-03-14", by: "MPDO Staff", action: "Received application" },
        { at: "2026-03-15", by: "MPDO Staff", action: "Documents incomplete; applicant requested for missing attachments" }
      ],
      workflow: {
        stage: STAGES.intake,
        completed: {
          intake: { at: "2026-03-15", by: "Records Staff" }
        },
        recommendations: {}
      }
    },
    {
      id: "A-1010",
      fullName: "Sofia Ramirez",
      status: "Under Review",
      email: "sofia.ramirez@gmail.com",
      dob: "09/02/1987",
      submittedAt: "2026-03-08",
      applicantType: "Individual",
      address: "Brgy. San Rafael, Sample Province",
      documents: [
        { name: "Valid ID", type: "image", status: "Uploaded" },
        { name: "Building Plan", type: "pdf", status: "Uploaded" }
      ],
      notes: "",
      timeline: [
        { at: "2026-03-08", by: "MPDO Staff", action: "Intake validated; forwarded to Treasurer's Office" },
        { at: "2026-03-08", by: "Treasurer's Office", action: "Payment validated; forwarded to GIS" },
        { at: "2026-03-09", by: "GIS Officer", action: "GIS overlay plotting ongoing; awaiting certification" }
      ],
      workflow: {
        stage: STAGES.gis,
        completed: {
          intake: { at: "2026-03-08", by: "Records Staff" },
          treasury: { at: "2026-03-08", by: "Treasurer's Office" }
        },
        recommendations: {}
      }
    },
    {
      id: "A-1011",
      fullName: "Gabriel Santos",
      status: "Approved",
      email: "gabriel.santos@gmail.com",
      dob: "02/14/1976",
      submittedAt: "2026-03-13",
      applicantType: "Individual",
      address: "Brgy. Maligaya, Sample Province",
      documents: [{ name: "Valid ID", type: "image", status: "Uploaded" }],
      notes: "Approved after document evaluation.",
      timeline: [
        { at: "2026-03-13", by: "MPDO Staff", action: "Received application" },
        { at: "2026-03-14", by: "Treasurer's Office", action: "Payment validated" },
        { at: "2026-03-15", by: "GIS Officer", action: "GIS check completed" },
        { at: "2026-03-16", by: "Approving Authority", action: "Final approval granted" }
      ],
      workflow: {
        stage: STAGES.done,
        completed: {
          intake: { at: "2026-03-13", by: "Records Staff" },
          treasury: { at: "2026-03-14", by: "Treasurer's Office" },
          gis: { at: "2026-03-15", by: "GIS Specialist" },
          inspection: { at: "2026-03-15", by: "Drone Pilot / Project Evaluator" },
          technicalReview: { at: "2026-03-16", by: "Draftsman (Technical Review)" },
          final: { at: "2026-03-16", by: "MPDC / Zoning Administrator" }
        },
        recommendations: {
          gis: { outcome: "approve", notes: "No hazard constraint conflicts." },
          inspection: { outcome: "approve", notes: "Setbacks verified." },
          technicalReview: { outcome: "approve", notes: "Documents consistent." }
        },
        finalDecision: { decision: "Approved", reason: "Complete evaluation passed." }
      }
    },
    {
      id: "A-1012",
      fullName: "Theresa Mendoza",
      status: "Pending",
      email: "theresa.mendoza@gmail.com",
      dob: "12/21/1983",
      submittedAt: "2026-03-12",
      applicantType: "Individual",
      address: "Brgy. Lumina, Sample Province",
      documents: [{ name: "Valid ID", type: "image", status: "Uploaded" }],
      notes: "",
      timeline: [{ at: "2026-03-12", by: "MPDO Staff", action: "Application received; pending intake validation" }],
      workflow: {
        stage: STAGES.intake,
        completed: {}
      }
    },
    {
      id: "A-1013",
      fullName: "Darren Cruz",
      status: "Under Review",
      email: "darren.cruz@gmail.com",
      dob: "04/08/1991",
      submittedAt: "2026-03-10",
      applicantType: "Individual",
      address: "Brgy. Rizal, Sample Province",
      documents: [
        { name: "Valid ID", type: "image", status: "Uploaded" },
        { name: "Tax Declaration", type: "pdf", status: "Uploaded" }
      ],
      notes: "",
      timeline: [
        { at: "2026-03-10", by: "MPDO Staff", action: "Validated applicant profile" },
        { at: "2026-03-10", by: "Treasurer's Office", action: "Payment validated; forwarded to GIS" },
        { at: "2026-03-11", by: "GIS Officer", action: "GIS evaluation in progress" }
      ],
      workflow: {
        stage: STAGES.gis,
        completed: {
          intake: { at: "2026-03-10", by: "Records Staff" },
          treasury: { at: "2026-03-10", by: "Treasurer's Office" }
        },
        recommendations: {}
      }
    },
    {
      id: "A-1014",
      fullName: "Mira Alonzo",
      status: "Incomplete",
      email: "mira.alonzo@gmail.com",
      dob: "06/30/1990",
      submittedAt: "2026-03-09",
      applicantType: "Individual",
      address: "Brgy. San Isidro, Sample Province",
      documents: [{ name: "Valid ID", type: "image", status: "Uploaded" }],
      notes: "",
      timeline: [
        { at: "2026-03-09", by: "MPDO Staff", action: "Documents incomplete; missing attachments requested" }
      ],
      workflow: {
        stage: STAGES.intake,
        completed: {
          intake: { at: "2026-03-09", by: "Records Staff" }
        },
        recommendations: {}
      }
    },
    {
      id: "A-1015",
      fullName: "Felix Navarro",
      status: "Rejected",
      email: "felix.navarro@gmail.com",
      dob: "08/19/1972",
      submittedAt: "2026-03-05",
      applicantType: "Individual",
      address: "Brgy. San Roque, Sample Province",
      documents: [
        { name: "Valid ID", type: "image", status: "Uploaded" },
        { name: "Building Plan", type: "pdf", status: "Uploaded" }
      ],
      notes: "Rejected due to zoning non-compliance.",
      timeline: [
        { at: "2026-03-05", by: "MPDO Staff", action: "Received application" },
        { at: "2026-03-06", by: "GIS Officer", action: "Zoning mismatch detected" },
        { at: "2026-03-07", by: "Approving Authority", action: "Final rejection recorded" }
      ],
      workflow: {
        stage: STAGES.done,
        completed: {
          intake: { at: "2026-03-05", by: "Records Staff" },
          treasury: { at: "2026-03-06", by: "Treasurer's Office" },
          gis: { at: "2026-03-06", by: "GIS Specialist" },
          inspection: { at: "2026-03-06", by: "Drone Pilot / Project Evaluator" },
          technicalReview: { at: "2026-03-07", by: "Draftsman (Technical Review)" },
          final: { at: "2026-03-07", by: "MPDC / Zoning Administrator" }
        },
        recommendations: {
          gis: { outcome: "deny", notes: "Overlay indicates restricted zone conflict." },
          inspection: { outcome: "deny", notes: "Setback verification inconsistent." },
          technicalReview: { outcome: "deny", notes: "Plans do not comply." }
        },
        finalDecision: { decision: "Rejected", reason: "Legal decision denied due to zoning conflicts." }
      }
    },
    {
      id: "A-1016",
      fullName: "Nina Villanueva",
      status: "Pending",
      email: "nina.villanueva@gmail.com",
      dob: "10/11/1988",
      submittedAt: "2026-03-04",
      applicantType: "Individual",
      address: "Brgy. San Jose, Sample Province",
      documents: [{ name: "Valid ID", type: "image", status: "Uploaded" }],
      notes: "",
      timeline: [{ at: "2026-03-04", by: "MPDO Staff", action: "Application received; pending intake" }],
      workflow: { stage: STAGES.intake, completed: {} }
    },
    {
      id: "A-1017",
      fullName: "Oscar Quirino",
      status: "Approved",
      email: "oscar.quirino@gmail.com",
      dob: "09/09/1980",
      submittedAt: "2026-03-02",
      applicantType: "Individual",
      address: "Brgy. Esperanza, Sample Province",
      documents: [{ name: "Zoning Checklist", type: "pdf", status: "Uploaded" }],
      notes: "Approved; clearance issued.",
      timeline: [
        { at: "2026-03-02", by: "MPDO Staff", action: "Received application" },
        { at: "2026-03-03", by: "Approving Authority", action: "Final approval granted" }
      ],
      workflow: {
        stage: STAGES.done,
        completed: {
          intake: { at: "2026-03-02", by: "Records Staff" },
          treasury: { at: "2026-03-02", by: "Treasurer's Office" },
          gis: { at: "2026-03-02", by: "GIS Specialist" },
          inspection: { at: "2026-03-02", by: "Drone Pilot / Project Evaluator" },
          technicalReview: { at: "2026-03-03", by: "Draftsman (Technical Review)" },
          final: { at: "2026-03-03", by: "MPDC / Zoning Administrator" }
        },
        recommendations: {
          gis: { outcome: "approve", notes: "Constraints consistent." },
          inspection: { outcome: "approve", notes: "Setbacks verified." },
          technicalReview: { outcome: "approve", notes: "Technical review OK." }
        },
        finalDecision: { decision: "Approved", reason: "Issued after complete review." }
      }
    },
    {
      id: "A-1018",
      fullName: "Yvonne Reyes",
      status: "Under Review",
      email: "yvonne.reyes@gmail.com",
      dob: "01/27/1993",
      submittedAt: "2026-03-01",
      applicantType: "Individual",
      address: "Brgy. Bagong Silang, Sample Province",
      documents: [
        { name: "Valid ID", type: "image", status: "Uploaded" },
        { name: "Tax Declaration", type: "pdf", status: "Uploaded" }
      ],
      notes: "",
      timeline: [
        { at: "2026-03-01", by: "MPDO Staff", action: "Validated profile; forwarded" },
        { at: "2026-03-01", by: "Treasurer's Office", action: "Payment validated; forwarded to GIS" },
        { at: "2026-03-02", by: "GIS Officer", action: "GIS certification pending" }
      ],
      workflow: {
        stage: STAGES.gis,
        completed: {
          intake: { at: "2026-03-01", by: "Records Staff" },
          treasury: { at: "2026-03-01", by: "Treasurer's Office" }
        },
        recommendations: {}
      }
    },
    {
      id: "A-1019",
      fullName: "Henry Caballero",
      status: "Incomplete",
      email: "henry.caballero@gmail.com",
      dob: "03/16/1985",
      submittedAt: "2026-02-28",
      applicantType: "Individual",
      address: "Brgy. Luntian, Sample Province",
      documents: [{ name: "Valid ID", type: "image", status: "Uploaded" }],
      notes: "",
      timeline: [{ at: "2026-02-28", by: "MPDO Staff", action: "Missing documents; applicant requested to upload attachments" }],
      workflow: {
        stage: STAGES.intake,
        completed: { intake: { at: "2026-02-28", by: "Records Staff" } }
      }
    },
    {
      id: "A-1020",
      fullName: "Zachary Perez",
      status: "Approved",
      email: "zachary.perez@gmail.com",
      dob: "07/07/1978",
      submittedAt: "2026-02-22",
      applicantType: "Individual",
      address: "Brgy. Riverside, Sample Province",
      documents: [{ name: "Final Checklist", type: "pdf", status: "Uploaded" }],
      notes: "Approved for pickup.",
      timeline: [
        { at: "2026-02-22", by: "MPDO Staff", action: "Received application" },
        { at: "2026-02-24", by: "Approving Authority", action: "Clearance issued / ready for pickup" }
      ],
      workflow: {
        stage: STAGES.done,
        completed: {
          intake: { at: "2026-02-22", by: "Records Staff" },
          treasury: { at: "2026-02-22", by: "Treasurer's Office" },
          gis: { at: "2026-02-23", by: "GIS Specialist" },
          inspection: { at: "2026-02-23", by: "Drone Pilot / Project Evaluator" },
          technicalReview: { at: "2026-02-24", by: "Draftsman (Technical Review)" },
          final: { at: "2026-02-24", by: "MPDC / Zoning Administrator" }
        },
        recommendations: {
          gis: { outcome: "approve", notes: "All conditions passed." },
          inspection: { outcome: "approve", notes: "Setbacks OK." },
          technicalReview: { outcome: "approve", notes: "Technical review OK." }
        },
        finalDecision: { decision: "Approved", reason: "Clearance ready." }
      }
    }
  ];

  let globalClicksBound = false;
  let selectedAppIdForRowMenu = null;
  let listControlsBound = false;

  function isAdmin() {
    return getRole() === "Admin";
  }

  function normalizeRole(role) {
    return (role || "Admin").trim();
  }

  function getRole() {
    return normalizeRole(localStorage.getItem("userRole") || "Admin");
  }

  function setRole(role) {
    localStorage.setItem("userRole", role);
  }

  function loadApplications() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
      return SEED_APPLICATIONS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
        return SEED_APPLICATIONS;
      }
      // Upgrade existing localStorage with any missing seed examples.
      // This prevents "nothing changed" when the browser still has older demo data.
      const existingById = new Map(parsed.map((a) => [String(a.id), a]));
      let didChange = false;

      SEED_APPLICATIONS.forEach((seedApp) => {
        const id = String(seedApp.id);
        const existing = existingById.get(id);
        if (!existing) {
          parsed.push(seedApp);
          didChange = true;
          return;
        }

        // Fill in missing workflow skeletons without overwriting user changes.
        if (!existing.workflow) {
          existing.workflow = seedApp.workflow;
          didChange = true;
        } else {
          if (!existing.workflow.stage && seedApp.workflow?.stage) {
            existing.workflow.stage = seedApp.workflow.stage;
            didChange = true;
          }
          if (!existing.workflow.completed) {
            existing.workflow.completed = seedApp.workflow.completed || {};
            didChange = true;
          }
          if (!existing.workflow.recommendations) {
            existing.workflow.recommendations = seedApp.workflow.recommendations || {};
            didChange = true;
          }
        }

        // Fill missing top-level fields
        if (!existing.submittedAt && seedApp.submittedAt) {
          existing.submittedAt = seedApp.submittedAt;
          didChange = true;
        }
        if (!existing.documents && seedApp.documents) {
          existing.documents = seedApp.documents;
          didChange = true;
        }
        if (!existing.timeline && seedApp.timeline) {
          existing.timeline = seedApp.timeline;
          didChange = true;
        }
      });

      if (didChange) {
        saveApplications(parsed);
      }

      return parsed;
    } catch (e) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
      return SEED_APPLICATIONS;
    }
  }

  function renderRoleUI() {
    const role = getRole();
    const roleInline = document.getElementById("roleNameInline");
    const roleTop = document.getElementById("roleNameTop");
    if (roleInline) roleInline.textContent = role;
    if (roleTop) roleTop.textContent = role;

    const rolePickerBtn = document.getElementById("rolePickerBtn");
    if (rolePickerBtn) {
      rolePickerBtn.style.display = isAdmin() ? "" : "none";
    }

    // Nav visibility based on data-role-allow
    const navLinks = document.querySelectorAll("[data-route]");
    navLinks.forEach((a) => {
      const allow = (a.getAttribute("data-role-allow") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (allow.length === 0) {
        a.style.display = "";
        return;
      }
      a.style.display = allow.includes(role) ? "" : "none";
    });
  }

  function seedRoleDialog() {
    const btn = document.getElementById("rolePickerBtn");
    const dialog = document.getElementById("roleDialog");
    const applyBtn = document.getElementById("roleDialogApplyBtn");
    if (!btn || !dialog || !applyBtn) return;
    if (!isAdmin()) return;
    const alreadyBound = btn.dataset.bound === "1";

    const role = getRole();
    const radios = dialog.querySelectorAll('input[name="role"]');
    radios.forEach((r) => {
      r.checked = r.value === role;
    });

    if (!alreadyBound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        dialog.showModal();
      });

      applyBtn.addEventListener("click", () => {
        if (!isAdmin()) {
          alert("Only Admin can change role assignments.");
          return;
        }
        const checked = dialog.querySelector('input[name="role"]:checked');
        if (!checked) return;
        setRole(checked.value);
        dialog.close();
        // Re-render current page
        init();
      });
    }
  }

  function normalizeStatus(status) {
    const s = String(status || "").toLowerCase().trim();
    if (!s) return "pending";
    if (s === "approved") return "approved";
    if (s === "rejected") return "rejected";
    if (s === "pending") return "pending";
    if (s === "incomplete") return "incomplete";
    if (s === "blocked") return "incomplete";
    if (s === "under review" || s === "under_review" || s === "in review") return "under review";
    return s;
  }

  function statusBadge(status) {
    const key = normalizeStatus(status);
    const map = {
      approved: { dot: "status-dot--green", text: "Approved" },
      "under review": { dot: "status-dot--orange", text: "Under Review" },
      rejected: { dot: "status-dot--red", text: "Rejected" },
      pending: { dot: "status-dot--gray", text: "Pending" },
      incomplete: { dot: "status-dot--yellow", text: "Incomplete" }
    };
    const picked = map[key] || { dot: "status-dot--gray", text: status || "Unknown" };
    return `<span class="status-badge"><span class="status-dot ${picked.dot}" aria-hidden="true"></span>${picked.text}</span>`;
  }

  function formatISODate(d) {
    const dt = d instanceof Date ? d : new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function getStage(app) {
    return app?.workflow?.stage || STAGES.done;
  }

  function ensureWorkflowShape(app) {
    if (!app.workflow) app.workflow = { stage: STAGES.done, completed: {}, recommendations: {} };
    if (!app.workflow.completed) app.workflow.completed = {};
    if (!app.workflow.recommendations) app.workflow.recommendations = {};
    return app;
  }

  function stageVisibleForRole(stage, role) {
    const s = stage;
    if (role === "Admin") return true;
    if (role === "MPDO Staff") return s === STAGES.intake;
    if (role === "Treasurer's Office") return s === STAGES.treasury;
    if (role === "GIS Officer") return s === STAGES.gis;
    if (role === "Inspection Team") return s === STAGES.inspection || s === STAGES.technicalReview;
    if (role === "Approving Authority") return s === STAGES.final;
    return false;
  }

  function getNextStage(stage) {
    if (stage === STAGES.intake) return STAGES.treasury;
    if (stage === STAGES.treasury) return STAGES.gis;
    if (stage === STAGES.gis) return STAGES.inspection;
    if (stage === STAGES.inspection) return STAGES.technicalReview;
    if (stage === STAGES.technicalReview) return STAGES.final;
    return STAGES.done;
  }

  function renderApplicantsTable() {
    const tbody = document.getElementById("applicantsBody");
    const empty = document.getElementById("emptyState");
    if (!tbody) return;

    const apps = loadApplications();
    tbody.innerHTML = "";

    const role = getRole();
    const sortBy = document.getElementById("sortBy")?.value || "submittedDesc";
    const statusFilter = document.getElementById("statusFilter")?.value || "all";
    const includeArchived = Boolean(document.getElementById("includeArchived")?.checked);
    const searchInput = document.querySelector('input.search[aria-label="Search applicants"]');
    const q = String(searchInput?.value || "")
      .trim()
      .toLowerCase();

    const isArchived = (a) => Boolean(a?.archived === true || a?.archivedAt);

    let visibleApps = apps
      .map((a) => ensureWorkflowShape(a))
      .filter((a) => (includeArchived ? isArchived(a) : !isArchived(a)))
      .filter((a) => stageVisibleForRole(getStage(a), role));

    // Status filtering
    const statusFilterMap = {
      all: null,
      approved: "approved",
      under_review: "under review",
      rejected: "rejected",
      pending: "pending",
      incomplete: "incomplete"
    };
    const wantedStatusKey = statusFilterMap[statusFilter] ?? null;
    if (wantedStatusKey) {
      visibleApps = visibleApps.filter((a) => normalizeStatus(a.status) === wantedStatusKey);
    }

    // Search filter (matches full name, email, or application id)
    if (q) {
      visibleApps = visibleApps.filter((a) => {
        const fullName = String(a.fullName || "").toLowerCase();
        const email = String(a.email || "").toLowerCase();
        const id = String(a.id || "").toLowerCase();
        return fullName.includes(q) || email.includes(q) || id.includes(q);
      });
    }

    // Sorting
    const toDate = (s) => {
      const dt = new Date(s);
      const t = dt.getTime();
      return Number.isFinite(t) ? t : 0;
    };

    const statusPriority = {
      incomplete: 1,
      pending: 2,
      "under review": 3,
      rejected: 4,
      approved: 5
    };

    visibleApps.sort((a, b) => {
      if (sortBy === "submittedAsc") return toDate(a.submittedAt) - toDate(b.submittedAt);
      if (sortBy === "submittedDesc") return toDate(b.submittedAt) - toDate(a.submittedAt);
      if (sortBy === "statusPriority") {
        const pa = statusPriority[normalizeStatus(a.status)] ?? 999;
        const pb = statusPriority[normalizeStatus(b.status)] ?? 999;
        if (pa !== pb) return pa - pb;
        return toDate(b.submittedAt) - toDate(a.submittedAt);
      }
      return 0;
    });

    empty && (visibleApps.length ? (empty.hidden = true) : (empty.hidden = false));

    visibleApps.forEach((app, idx) => {
      const tr = document.createElement("tr");
      const statusKey = normalizeStatus(app.status);
      const archived = Boolean(app?.archived === true || app?.archivedAt);
      const menuOptions = [
        { label: "Approved", value: "Approved" },
        { label: "Under Review", value: "Under Review" },
        { label: "Rejected", value: "Rejected" },
        { label: "Pending", value: "Pending" },
        { label: "Incomplete", value: "Incomplete" }
      ];
      const menuItemsHTML = menuOptions
        .map(
          (o) => `
            <button class="status-menu-item"
              type="button"
              data-status-option="${escapeAttr(o.value)}"
              data-id="${escapeAttr(app.id)}"
              ${app.status && normalizeStatus(app.status) === normalizeStatus(o.value) ? "disabled" : ""}
            >
              ${escapeHtml(o.label)}
            </button>`
        )
        .join("");

      tr.innerHTML = `
        <td class="td-muted">${idx + 1}</td>
        <td class="td-strong">${escapeHtml(app.fullName)}</td>
        <td>${statusBadge(app.status)}</td>
        <td class="td-muted">${escapeHtml(app.email || "")}</td>
        <td class="td-muted">${escapeHtml(app.submittedAt || "")}</td>
        <td>
          <div class="row-actions">
            <button class="icon-btn icon-btn--view" type="button" title="View details" data-action="view-details" data-id="${escapeAttr(
              app.id
            )}">
              <span aria-hidden="true" class="icon-open">↗</span>
            </button>
            <div class="status-inline">
              <button
                class="icon-btn"
                type="button"
                title="Change status"
                data-action="edit-status-menu"
                data-id="${escapeAttr(app.id)}"
              >
                <span aria-hidden="true">✎</span>
              </button>
              <div
                class="status-menu"
                data-status-menu
                data-id="${escapeAttr(app.id)}"
                aria-label="Status menu for ${escapeHtml(app.fullName)}"
              >
                ${menuItemsHTML}
              </div>
            </div>
            <div class="dots-inline">
              <button
                class="icon-btn"
                type="button"
                title="More actions (Delete/Archive)"
                data-action="row-menu"
                data-id="${escapeAttr(app.id)}"
              >
                ⋯
              </button>
              <div class="dots-menu" data-dots-menu data-id="${escapeAttr(app.id)}" aria-label="Row actions menu">
                <button class="dots-menu-item dots-menu-item--danger" type="button" data-dots-action="delete" data-id="${escapeAttr(app.id)}">Delete</button>
                ${
                  archived
                    ? `<button class="dots-menu-item" type="button" data-dots-action="restore" data-id="${escapeAttr(
                        app.id
                      )}">Restore</button>`
                    : `<button class="dots-menu-item" type="button" data-dots-action="archive" data-id="${escapeAttr(
                        app.id
                      )}">Archive</button>`
                }
              </div>
            </div>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function openDetailsPage(appId) {
    if (!appId) {
      alert("Missing application id.");
      return;
    }
    window.location.href = `application-details.html?id=${encodeURIComponent(appId)}`;
  }

  function saveApplications(apps) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }

  function getAppIndexById(appId, apps) {
    return apps.findIndex((a) => String(a.id) === String(appId));
  }

  function closeAllStatusMenus() {
    const menus = document.querySelectorAll(".status-menu[data-status-menu]");
    menus.forEach((m) => m.classList.remove("status-menu--open"));
  }

  function closeAllDotsMenus() {
    const menus = document.querySelectorAll(".dots-menu[data-dots-menu]");
    menus.forEach((m) => m.classList.remove("dots-menu--open"));
  }

  function toggleStatusMenu(appId, triggerEl) {
    const menu = document.querySelector(
      `.status-menu[data-status-menu][data-id="${String(appId)}"]`
    );
    if (!menu) return;

    // If trigger disabled, skip opening (handled by disabled attribute preventing click usually)
    if (menu.classList.contains("status-menu--open")) {
      menu.classList.remove("status-menu--open");
      return;
    }

    closeAllStatusMenus();
    menu.classList.add("status-menu--open");

    const triggerBtn = triggerEl || menu.previousElementSibling;
    const t = triggerBtn?.getBoundingClientRect?.();
    if (!t) return;

    const rect = menu.getBoundingClientRect();
    const menuW = rect.width || 190;
    const menuH = rect.height || 160;
    const margin = 8;

    const left = Math.max(8, Math.min(t.right - menuW, t.left));
    let top = t.bottom + margin;
    if (top + menuH > window.innerHeight - margin) {
      top = Math.max(margin, t.top - menuH - margin);
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function setDotsMenuMode(menuEl, mode) {
    if (!menuEl) return;
    const appId = menuEl.getAttribute("data-id");
    if (!appId) return;

    if (mode === "confirm-delete") {
      menuEl.innerHTML = `
        <div class="dots-menu-title">Confirm Delete</div>
        <div class="dots-menu-text">Are you sure you want to delete? This action cannot be retrieved.</div>
        <button class="dots-menu-item dots-menu-item--danger" type="button" data-dots-action="confirm-delete" data-id="${escapeAttr(appId)}">Delete</button>
        <button class="dots-menu-item" type="button" data-dots-action="cancel-delete" data-id="${escapeAttr(appId)}">Cancel</button>
      `;
      return;
    }

    // Default mode (depends on archive state)
    const apps = loadApplications();
    const app = apps.find((a) => String(a.id) === String(appId));
    const archived = Boolean(app?.archived === true || app?.archivedAt);

    const rightAction = archived
      ? `<button class="dots-menu-item" type="button" data-dots-action="restore" data-id="${escapeAttr(appId)}">Restore</button>`
      : `<button class="dots-menu-item" type="button" data-dots-action="archive" data-id="${escapeAttr(appId)}">Archive</button>`;

    menuEl.innerHTML = `
      <button class="dots-menu-item dots-menu-item--danger" type="button" data-dots-action="delete" data-id="${escapeAttr(appId)}">Delete</button>
      ${rightAction}
    `;
  }

  function toggleDotsMenu(appId, triggerEl) {
    const menu = document.querySelector(
      `.dots-menu[data-dots-menu][data-id="${String(appId)}"]`
    );
    if (!menu) return;

    if (menu.classList.contains("dots-menu--open")) {
      menu.classList.remove("dots-menu--open");
      return;
    }

    closeAllDotsMenus();
    menu.classList.add("dots-menu--open");

    const triggerBtn = triggerEl || menu.previousElementSibling;
    const t = triggerBtn?.getBoundingClientRect?.();
    if (!t) return;

    const rect = menu.getBoundingClientRect();
    const menuW = rect.width || 180;
    const menuH = rect.height || 120;
    const margin = 8;

    const left = Math.max(8, Math.min(t.right - menuW, t.left));
    let top = t.bottom + margin;
    if (top + menuH > window.innerHeight - margin) {
      top = Math.max(margin, t.top - menuH - margin);
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function archiveApp(appId) {
    const apps = loadApplications().map((a) => ensureWorkflowShape(a));
    const idx = getAppIndexById(appId, apps);
    if (idx < 0) return;

    const app = apps[idx];
    app.archived = true;
    app.archivedAt = formatISODate(new Date());

    if (!Array.isArray(app.timeline)) app.timeline = [];
    app.timeline.push({ at: app.archivedAt, by: getRole(), action: "Archived (demo)" });

    saveApplications(apps);
    closeAllStatusMenus();
    closeAllDotsMenus();
    renderApplicantsTable();
  }

  function restoreApp(appId) {
    const apps = loadApplications().map((a) => ensureWorkflowShape(a));
    const idx = getAppIndexById(appId, apps);
    if (idx < 0) return;

    const app = apps[idx];
    app.archived = false;
    if (app.archivedAt) delete app.archivedAt;

    if (!Array.isArray(app.timeline)) app.timeline = [];
    app.timeline.push({ at: formatISODate(new Date()), by: getRole(), action: "Restored from archive (demo)" });

    saveApplications(apps);
    closeAllStatusMenus();
    closeAllDotsMenus();
    renderApplicantsTable();
  }

  function deleteApp(appId) {
    const apps = loadApplications().filter((a) => String(a.id) !== String(appId));
    saveApplications(apps);
    closeAllStatusMenus();
    closeAllDotsMenus();
    renderApplicantsTable();
  }

  function applyStatusChange(appId, nextStatusLabel) {
    const apps = loadApplications().map((a) => ensureWorkflowShape(a));
    const idx = getAppIndexById(appId, apps);
    if (idx < 0) return;

    const app = apps[idx];
    const now = formatISODate(new Date());

    app.status = nextStatusLabel;

    // Keep RBAC stable: only admins' status edits will move workflow stage in this demo.
    if (getRole() === "Admin") {
      const norm = normalizeStatus(nextStatusLabel);
      if (norm === "approved" || norm === "rejected") {
        app.workflow.stage = STAGES.done;
      } else if (norm === "pending" || norm === "incomplete") {
        // Generic statuses map to intake so they stay visible in the MPDO Staff queue.
        app.workflow.stage = STAGES.intake;
      }
      // Under Review keeps the existing workflow.stage.
    }

    if (!Array.isArray(app.timeline)) app.timeline = [];
    app.timeline.push({
      at: now,
      by: getRole(),
      action: `Status updated to ${nextStatusLabel}`
    });

    saveApplications(apps);
    closeAllStatusMenus();
    renderApplicantsTable();
  }

  function bindListControlsOnce() {
    if (listControlsBound) return;
    const sortBy = document.getElementById("sortBy");
    const statusFilter = document.getElementById("statusFilter");
    const includeArchived = document.getElementById("includeArchived");
    const resetDemoBtn = document.getElementById("resetDemoBtn");
    const searchInput = document.querySelector('input.search[aria-label="Search applicants"]');
    if (sortBy) {
      sortBy.addEventListener("change", () => renderApplicantsTable());
    }
    if (statusFilter) {
      statusFilter.addEventListener("change", () => renderApplicantsTable());
    }
    if (includeArchived) {
      includeArchived.addEventListener("change", () => renderApplicantsTable());
    }
    if (searchInput) {
      // Update results while typing.
      searchInput.addEventListener("input", () => renderApplicantsTable());
    }
    if (resetDemoBtn) {
      resetDemoBtn.addEventListener("click", () => {
        // Close any open menus so clicks don't get swallowed by overlays.
        closeAllStatusMenus();
        closeAllDotsMenus();

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
        } catch (err) {
          alert("Could not reset demo data (localStorage blocked). Please try using a local server.");
          return;
        }

        // Reset filters so you immediately see the full demo list.
        const sortByEl = document.getElementById("sortBy");
        const statusFilterEl = document.getElementById("statusFilter");
        const includeArchivedEl = document.getElementById("includeArchived");
        if (sortByEl) sortByEl.value = "submittedDesc";
        if (statusFilterEl) statusFilterEl.value = "all";
        if (includeArchivedEl) includeArchivedEl.checked = false;

        renderApplicantsTable();
      });
    }
    listControlsBound = true;
  }

  function setupGlobalClicks() {
    if (globalClicksBound) return;
    globalClicksBound = true;
    document.addEventListener("click", (e) => {
      const btn = e.target.closest?.('[data-action="view-details"]');
      if (!btn) return;
      closeAllStatusMenus();
      const id = btn.getAttribute("data-id");
      openDetailsPage(id);
    });

    document.addEventListener("click", (e) => {
      const wfBtn = e.target.closest?.("[data-wf-action]");
      if (!wfBtn) return;
      closeAllStatusMenus();
      const action = wfBtn.getAttribute("data-wf-action");
      const id = wfBtn.getAttribute("data-id");
      handleWorkflowAction(action, id);
    });

    document.addEventListener("click", (e) => {
      const pencilBtn = e.target.closest?.('[data-action="edit-status-menu"]');
      if (!pencilBtn) return;
      const id = pencilBtn.getAttribute("data-id");
      toggleStatusMenu(id, pencilBtn);
    });

    document.addEventListener("click", (e) => {
      const menuBtn = e.target.closest?.('[data-action="row-menu"]');
      if (!menuBtn) return;
      closeAllStatusMenus();
      const id = menuBtn.getAttribute("data-id");
      toggleDotsMenu(id, menuBtn);
    });

    // Choose status from inline menu.
    document.addEventListener("click", (e2) => {
      const optionBtn = e2.target.closest?.(".status-menu-item");
      if (!optionBtn) return;
      const id = optionBtn.getAttribute("data-id");
      const nextStatus = optionBtn.getAttribute("data-status-option");
      const disabled = optionBtn.hasAttribute("disabled");
      if (disabled) return;
      applyStatusChange(id, nextStatus);
    });

    // Dots menu actions (inline delete confirm + archive)
    document.addEventListener("click", (e3) => {
      const menuItem = e3.target.closest?.("[data-dots-action]");
      if (!menuItem) return;

      const action = menuItem.getAttribute("data-dots-action");
      const id = menuItem.getAttribute("data-id");
      if (!action || !id) return;

      const menuEl = menuItem.closest?.(".dots-menu[data-dots-menu]");
      if (!menuEl) return;

      if (action === "delete") {
        setDotsMenuMode(menuEl, "confirm-delete");
        return;
      }

      if (action === "cancel-delete") {
        setDotsMenuMode(menuEl, "default");
        return;
      }

      if (action === "confirm-delete") {
        deleteApp(id);
        return;
      }

      if (action === "archive") {
        archiveApp(id);
        return;
      }

      if (action === "restore") {
        restoreApp(id);
        return;
      }
    });

    // Close inline status menus when clicking anywhere else.
    document.addEventListener("click", (e) => {
      const clickedMenu = e.target.closest?.(".status-menu");
      const clickedTrigger = e.target.closest?.('[data-action="edit-status-menu"]');
      const clickedDotsMenu = e.target.closest?.(".dots-menu");
      const clickedDotsTrigger = e.target.closest?.('[data-action="row-menu"]');
      if (clickedMenu || clickedTrigger || clickedDotsMenu || clickedDotsTrigger) return;
      closeAllStatusMenus();
      closeAllDotsMenus();
    });
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(str) {
    // For our simple attribute usage above, escapeHtml is sufficient.
    return escapeHtml(str);
  }

  function renderDetailsPage() {
    const root = document.getElementById("detailsRoot");
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const apps = loadApplications();
    const app = apps.find((a) => String(a.id) === String(id));

    const backBtn = document.getElementById("backToListBtn");
    if (backBtn && backBtn.dataset.bound !== "1") {
      backBtn.dataset.bound = "1";
      backBtn.addEventListener("click", () => (window.location.href = "index.html"));
    }

    if (!app) {
      root.innerHTML = `
        <div class="empty-card">
          <div class="empty-card__title">Application not found</div>
          <div class="empty-card__body">Return to Applicants List and try again.</div>
        </div>
      `;
      return;
    }

    ensureWorkflowShape(app);
    const docs = Array.isArray(app.documents) ? app.documents : [];
    const timeline = Array.isArray(app.timeline) ? app.timeline : [];
    const role = getRole();
    const stage = getStage(app);
    const stageLabel = STAGE_LABELS[stage] || stage;

    const gisReco = app?.workflow?.recommendations?.gis;
    const inspectionReco = app?.workflow?.recommendations?.inspection;
    const techReco = app?.workflow?.recommendations?.technicalReview;
    const finalDecision = app?.workflow?.finalDecision;

    root.innerHTML = `
      <div class="details-grid">
        <section class="details-card details-card--primary">
          <div class="details-card__header">
            <div>
              <div class="details-card__title">Application Details</div>
              <div class="crumb" style="margin-top:6px">${escapeHtml(stageLabel)}</div>
            </div>
            <div class="details-card__status">${statusBadge(app.status)}</div>
          </div>

          <div class="details-fields">
            <div class="field"><div class="field__label">Application ID</div><div class="field__value">${escapeHtml(app.id)}</div></div>
            <div class="field"><div class="field__label">Full Name</div><div class="field__value">${escapeHtml(app.fullName)}</div></div>
            <div class="field"><div class="field__label">E-mail</div><div class="field__value">${escapeHtml(app.email || "")}</div></div>
            <div class="field"><div class="field__label">Date Submitted</div><div class="field__value">${escapeHtml(app.submittedAt || "")}</div></div>
            <div class="field"><div class="field__label">Submitted At</div><div class="field__value">${escapeHtml(app.submittedAt || "")}</div></div>
            <div class="field"><div class="field__label">Applicant Type</div><div class="field__value">${escapeHtml(app.applicantType || "")}</div></div>
            <div class="field"><div class="field__label">Address</div><div class="field__value">${escapeHtml(app.address || "")}</div></div>
          </div>

          <div class="details-section">
            <div class="details-section__title">Admin Notes</div>
            <div class="details-section__body">${escapeHtml(app.notes || "")}</div>
          </div>

          <div class="details-section">
            <div class="details-section__title">Workflow Recommendations</div>
            <div class="wf-reco">
              <div class="wf-reco__item">
                <div class="wf-reco__title">GIS Specialist Recommendation</div>
                <div class="wf-reco__body">${escapeHtml(gisReco?.notes || (gisReco ? gisReco.outcome : "Not submitted yet"))}</div>
              </div>
              <div class="wf-reco__item">
                <div class="wf-reco__title">Inspection Recommendation</div>
                <div class="wf-reco__body">${escapeHtml(inspectionReco?.notes || (inspectionReco ? inspectionReco.outcome : "Not submitted yet"))}</div>
              </div>
              <div class="wf-reco__item">
                <div class="wf-reco__title">Technical Review Recommendation</div>
                <div class="wf-reco__body">${escapeHtml(techReco?.notes || (techReco ? techReco.outcome : "Not submitted yet"))}</div>
              </div>
              <div class="wf-reco__item">
                <div class="wf-reco__title">Final Decision</div>
                <div class="wf-reco__body">${escapeHtml(finalDecision?.decision ? `${finalDecision.decision}: ${finalDecision.reason || ""}` : "Not decided yet")}</div>
              </div>
            </div>
          </div>

          ${getRoleActionsHTML(app, role)}
        </section>

        <aside class="details-side">
          <section class="details-card">
            <div class="details-card__header">
              <div class="details-card__title">Documents</div>
            </div>
            <div class="doc-list">
              ${
                docs.length
                  ? docs
                      .map(
                        (d) => `
                    <div class="doc-item">
                      <div class="doc-item__name">${escapeHtml(d.name || "")}</div>
                      <div class="doc-item__meta">${escapeHtml(d.type || "")} • ${escapeHtml(d.status || "")}</div>
                    </div>`
                      )
                      .join("")
                  : `<div class="muted">No documents uploaded.</div>`
              }
            </div>
          </section>

          <section class="details-card">
            <div class="details-card__header">
              <div class="details-card__title">Timeline</div>
            </div>
            <div class="timeline">
              ${
                timeline.length
                  ? timeline
                      .map(
                        (t) => `
                      <div class="timeline-item">
                        <div class="timeline-item__at">${escapeHtml(t.at || "")}</div>
                        <div class="timeline-item__by">${escapeHtml(t.by || "")}</div>
                        <div class="timeline-item__action">${escapeHtml(t.action || "")}</div>
                      </div>`
                      )
                      .join("")
                  : `<div class="muted">No timeline events yet.</div>`
              }
            </div>
          </section>
        </aside>
      </div>
    `;
  }

  function init() {
    renderRoleUI();
    seedRoleDialog();
    setupGlobalClicks();
    renderDetailsPage();

    // Page routing by DOM markers (no real router).
    const detailsRoot = document.getElementById("detailsRoot");
    const applicantsBody = document.getElementById("applicantsBody");
    const dashboardRoot = document.getElementById("dashboardRoot");

    if (detailsRoot) return;

    if (applicantsBody) {
      renderApplicantsTable();
      bindListControlsOnce();
      return;
    }

    if (dashboardRoot) {
      renderDashboardPage();
      return;
    }
  }

  function renderDashboardPage() {
    const root = document.getElementById("dashboardRoot");
    if (!root) return;

    const apps = loadApplications().map((a) => ensureWorkflowShape(a));

    const nonArchived = apps.filter((a) => !Boolean(a.archived));
    const archived = apps.filter((a) => Boolean(a.archived));

    const counts = {
      approved: 0,
      "under review": 0,
      rejected: 0,
      pending: 0,
      incomplete: 0
    };

    nonArchived.forEach((a) => {
      const key = normalizeStatus(a.status);
      if (counts[key] !== undefined) counts[key] += 1;
    });

    root.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px; margin-top: 6px;">
        <div class="wf-reco__item" style="border-top: 3px solid #22c55e;">
          <div style="font-weight: 950;">Approved</div>
          <div style="color: var(--muted); font-weight: 900; margin-top: 6px;">${counts.approved}</div>
        </div>
        <div class="wf-reco__item" style="border-top: 3px solid #f59e0b;">
          <div style="font-weight: 950;">Under Review</div>
          <div style="color: var(--muted); font-weight: 900; margin-top: 6px;">${counts["under review"]}</div>
        </div>
        <div class="wf-reco__item" style="border-top: 3px solid #ef4444;">
          <div style="font-weight: 950;">Rejected</div>
          <div style="color: var(--muted); font-weight: 900; margin-top: 6px;">${counts.rejected}</div>
        </div>
        <div class="wf-reco__item" style="border-top: 3px solid #94a3b8;">
          <div style="font-weight: 950;">Pending</div>
          <div style="color: var(--muted); font-weight: 900; margin-top: 6px;">${counts.pending}</div>
        </div>
        <div class="wf-reco__item" style="border-top: 3px solid #facc15;">
          <div style="font-weight: 950;">Incomplete</div>
          <div style="color: var(--muted); font-weight: 900; margin-top: 6px;">${counts.incomplete}</div>
        </div>
      </div>

      <div style="margin-top: 14px; color: var(--muted); font-weight: 800;">
        Archived (hidden) records: ${archived.length}
      </div>
    `;
  }

  function getRoleActionsHTML(app, role) {
    const stage = getStage(app);
    // Workflow actions are gated by stage (not by textual status).
    if (stage === STAGES.done) {
      return `
        <div class="details-section">
          <div class="details-section__title">Role Actions</div>
          <div class="details-section__body muted">No actions available for this application.</div>
        </div>
      `;
    }

    const appId = escapeAttr(app.id);
    const completed = app?.workflow?.completed || {};

    // Helpers
    const btnPrimary = (text, wfAction, extraClass = "") =>
      `<button class="btn btn-primary ${extraClass}" type="button" data-wf-action="${wfAction}" data-id="${appId}">${escapeHtml(
        text
      )}</button>`;
    const btnDanger = (text, wfAction) =>
      `<button class="btn btn-danger" type="button" data-wf-action="${wfAction}" data-id="${appId}">${escapeHtml(
        text
      )}</button>`;
    const btnSecondary = (text, wfAction) =>
      `<button class="btn" type="button" data-wf-action="${wfAction}" data-id="${appId}">${escapeHtml(text)}</button>`;

    if (stage === STAGES.intake && (role === "MPDO Staff" || role === "Admin")) {
      return `
        <div class="details-section">
          <div class="details-section__title">Role Actions</div>
          <div class="role-action-hint">Records Staff can validate documents and either forward to payments or block the application.</div>
          <div class="wf-actions">
            ${btnPrimary("Validate & Intake (Forward to Treasurer's Office)", "wf-intake")}
            ${btnDanger("Block Application (Missing/Invalid docs)", "wf-block")}
          </div>
        </div>
      `;
    }

    if (stage === STAGES.treasury && (role === "Treasurer's Office" || role === "Admin")) {
      return `
        <div class="details-section">
          <div class="details-section__title">Role Actions</div>
          <div class="role-action-hint">Treasurer's Office validates payment records before the GIS step.</div>
          <div class="wf-actions">
            ${btnPrimary("Validate Payment (Forward to GIS)", "wf-treasury")}
          </div>
        </div>
      `;
    }

    if (stage === STAGES.gis && (role === "GIS Officer" || role === "Admin")) {
      const already = Boolean(completed?.gis);
      return `
        <div class="details-section">
          <div class="details-section__title">Role Actions</div>
          <div class="role-action-hint">GIS Specialist submits the GIS Evaluation Certification and a recommendation (final rejection is only by MPDC/Zoning Administrator).</div>
          <div class="wf-actions">
            ${
              already
                ? `<div class="muted">GIS evaluation already submitted.</div>`
                : btnPrimary("Submit GIS Evaluation & Recommendation", "wf-gis")
            }
          </div>
        </div>
      `;
    }

    if (stage === STAGES.inspection && (role === "Inspection Team" || role === "Admin")) {
      const already = Boolean(completed?.inspection);
      return `
        <div class="details-section">
          <div class="details-section__title">Role Actions</div>
          <div class="role-action-hint">Drone Pilot / Project Evaluator submits inspection results and recommendation (not final rejection).</div>
          <div class="wf-actions">
            ${
              already
                ? `<div class="muted">Inspection report already submitted.</div>`
                : btnPrimary("Submit Inspection Report & Recommendation", "wf-inspection")
            }
          </div>
        </div>
      `;
    }

    if (stage === STAGES.technicalReview && (role === "Inspection Team" || role === "Admin")) {
      const already = Boolean(completed?.technicalReview);
      return `
        <div class="details-section">
          <div class="details-section__title">Role Actions</div>
          <div class="role-action-hint">Draftsman performs Technical Review and records recommendation (final rejection is only by MPDC/Zoning Administrator).</div>
          <div class="wf-actions">
            ${
              already
                ? `<div class="muted">Technical review already submitted.</div>`
                : btnPrimary("Submit Technical Review & Recommendation", "wf-technicalReview")
            }
          </div>
        </div>
      `;
    }

    if (stage === STAGES.final && (role === "Approving Authority" || role === "Admin")) {
      return `
        <div class="details-section">
          <div class="details-section__title">Role Actions</div>
          <div class="role-action-hint">MPDC / Zoning Administrator provides the final approval or final rejection (legal authority).</div>
          <div class="wf-actions">
            ${btnPrimary("Approve (Issue Official Notice)", "wf-final-approve")}
            ${btnDanger("Reject (Record Final Legal Reason)", "wf-final-reject")}
          </div>
        </div>
      `;
    }

    // Not allowed for this role
    return `
      <div class="details-section">
        <div class="details-section__title">Role Actions</div>
        <div class="details-section__body muted">You do not have actions for this stage (${escapeHtml(stageLabel)}).</div>
      </div>
    `;
  }

  function handleWorkflowAction(action, appId) {
    const role = getRole();
    const apps = loadApplications().map((a) => ensureWorkflowShape(a));
    const idx = apps.findIndex((a) => String(a.id) === String(appId));
    if (idx < 0) return;

    const app = apps[idx];
    const stage = getStage(app);
    // Workflow actions are gated by workflow stage (status text may vary).
    if (stage === STAGES.done) return;

    const allowAdmin = role === "Admin";
    const now = formatISODate(new Date());

    const timelineBy = (by) => String(by || role);

    const pushTimeline = (by, act) => {
      if (!Array.isArray(app.timeline)) app.timeline = [];
      app.timeline.push({ at: now, by, action: act });
    };

    const save = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    };

    // Intake step
    if (action === "wf-intake") {
      if (!(role === "MPDO Staff" || allowAdmin) || stage !== STAGES.intake) return;
      app.workflow.completed.intake = { at: now, by: "Records Staff" };
      pushTimeline("Records Staff", "Intake validated; forwarded to Treasurer's Office");
      app.workflow.stage = getNextStage(STAGES.intake);
      app.status = "Under Review";
      save();
      refreshAfterMutation();
      return;
    }

    if (action === "wf-block") {
      if (!(role === "MPDO Staff" || allowAdmin) || stage !== STAGES.intake) return;
      app.workflow.completed.intake = { at: now, by: "Records Staff" };
      pushTimeline("Records Staff", "Application blocked (missing/invalid documents)");
      app.workflow.stage = STAGES.done;
      app.status = "Incomplete";
      app.workflow.finalDecision = app.workflow.finalDecision || {};
      save();
      refreshAfterMutation();
      return;
    }

    // Treasury step
    if (action === "wf-treasury") {
      if (!(role === "Treasurer's Office" || allowAdmin) || stage !== STAGES.treasury) return;
      app.workflow.completed.treasury = { at: now, by: "Treasurer's Office" };
      pushTimeline("Treasurer's Office", "Payment records validated; forwarded to GIS");
      app.workflow.stage = getNextStage(STAGES.treasury);
      app.status = "Under Review";
      save();
      refreshAfterMutation();
      return;
    }

    // GIS step
    if (action === "wf-gis") {
      if (!(role === "GIS Officer" || allowAdmin) || stage !== STAGES.gis) return;
      const outcome = (prompt("GIS Recommendation: approve / correct / deny", "approve") || "").trim().toLowerCase();
      const notes = prompt("GIS Evaluation Certification notes (brief):", "Overlay zoning/hazard verification results.") || "";
      const normalizedOutcome = ["approve", "correct", "deny"].includes(outcome) ? outcome : "correct";

      app.workflow.completed.gis = { at: now, by: "GIS Specialist" };
      app.workflow.recommendations.gis = { outcome: normalizedOutcome, notes: notes.trim() };
      pushTimeline("GIS Specialist", `GIS Evaluation Certification submitted (Recommendation: ${normalizedOutcome})`);
      app.workflow.stage = getNextStage(STAGES.gis);
      app.status = "Under Review";
      save();
      refreshAfterMutation();
      return;
    }

    // Inspection step
    if (action === "wf-inspection") {
      if (!(role === "Inspection Team" || allowAdmin) || stage !== STAGES.inspection) return;
      const outcome = (prompt("Inspection Recommendation: approve / correct / deny", "correct") || "").trim().toLowerCase();
      const notes = prompt("Inspection report notes (brief, include setbacks verification):", "Drone/site verification completed.") || "";
      const normalizedOutcome = ["approve", "correct", "deny"].includes(outcome) ? outcome : "correct";

      app.workflow.completed.inspection = { at: now, by: "Drone Pilot / Project Evaluator" };
      app.workflow.recommendations.inspection = { outcome: normalizedOutcome, notes: notes.trim() };
      pushTimeline(
        "Drone Pilot / Project Evaluator",
        `Inspection report submitted (Recommendation: ${normalizedOutcome})`
      );
      app.workflow.stage = getNextStage(STAGES.inspection);
      app.status = "Under Review";
      save();
      refreshAfterMutation();
      return;
    }

    // Technical review step
    if (action === "wf-technicalReview") {
      if (!(role === "Inspection Team" || allowAdmin) || stage !== STAGES.technicalReview) return;
      const outcome = (prompt("Technical Review Recommendation: approve / correct / deny", "correct") || "").trim().toLowerCase();
      const notes = prompt("Technical review notes (brief):", "Draftsman technical review completed.") || "";
      const normalizedOutcome = ["approve", "correct", "deny"].includes(outcome) ? outcome : "correct";

      app.workflow.completed.technicalReview = { at: now, by: "Draftsman (Technical Review)" };
      app.workflow.recommendations.technicalReview = { outcome: normalizedOutcome, notes: notes.trim() };
      pushTimeline(
        "Draftsman (Technical Review)",
        `Technical review submitted (Recommendation: ${normalizedOutcome})`
      );
      app.workflow.stage = getNextStage(STAGES.technicalReview);
      app.status = "Under Review";
      save();
      refreshAfterMutation();
      return;
    }

    // Final decision step (legal authority only)
    if (action === "wf-final-approve") {
      if (!(role === "Approving Authority" || allowAdmin) || stage !== STAGES.final) return;
      const reason = prompt("Final approval reason (brief):", "Approved based on complete evaluation.") || "";
      app.workflow.completed.final = { at: now, by: "MPDC / Zoning Administrator" };
      app.workflow.finalDecision = { decision: "Approved", reason: reason.trim() };
      pushTimeline("MPDC / Zoning Administrator", "Final approval granted (Official notice issued)");
      app.workflow.stage = STAGES.done;
      app.status = "Approved";
      save();
      refreshAfterMutation();
      return;
    }

    if (action === "wf-final-reject") {
      if (!(role === "Approving Authority" || allowAdmin) || stage !== STAGES.final) return;
      const reason = prompt("Final rejection legal reason (brief):", "Rejected due to zoning/hazard non-compliance.") || "";
      app.workflow.completed.final = { at: now, by: "MPDC / Zoning Administrator" };
      app.workflow.finalDecision = { decision: "Rejected", reason: reason.trim() };
      // Per your guidelines: rejection reason and decision only by MPDC/Zoning Administrator.
      pushTimeline("MPDC / Zoning Administrator", "Final rejection recorded (Legal authority decision)");
      app.workflow.stage = STAGES.done;
      app.status = "Rejected";
      save();
      refreshAfterMutation();
      return;
    }
  }

  function refreshAfterMutation() {
    // Re-render whichever view is currently open.
    if (document.getElementById("detailsRoot")) {
      renderDetailsPage();
    } else {
      renderApplicantsTable();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();

