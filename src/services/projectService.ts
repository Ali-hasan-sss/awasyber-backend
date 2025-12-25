import Project, { IProject } from "@/models/Project";
import Payment from "@/models/Payment";
import Modification from "@/models/Modification";
import { User } from "@/models/User";
import { Types } from "mongoose";

export interface ProjectPhasePayload {
  title: { en: string; ar: string };
  description?: { en?: string; ar?: string };
  duration: number;
  phaseNumber?: number;
  status?: "upcoming" | "in_progress" | "completed";
  progress?: number;
}

export interface CreateProjectPayload {
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  logo?: string;
  userId: string;
  totalCost: number;
  phases: ProjectPhasePayload[];
  startDate?: string;
  progress?: number;
  progressType?: "project" | "modification";
  projectUrl?: string;
  employees?: string[]; // Array of employee user IDs
}

export interface UpdateProjectPayload {
  name?: { en: string; ar: string };
  description?: { en: string; ar: string };
  logo?: string;
  totalCost?: number;
  phases?: ProjectPhasePayload[];
  startDate?: string;
  progress?: number;
  progressType?: "project" | "modification";
  activeModificationId?: string;
  projectUrl?: string;
  employees?: string[]; // Array of employee user IDs
}

export const createProject = async (payload: CreateProjectPayload) => {
  const project = new Project({
    ...payload,
    userId: new Types.ObjectId(payload.userId),
    startDate: payload.startDate ? new Date(payload.startDate) : undefined,
    progress: payload.progress || 0,
    progressType: payload.progressType || "project",
    employees: payload.employees
      ? payload.employees.map((id) => new Types.ObjectId(id))
      : [],
  });
  return await project.save();
};

export const listProjects = async (
  filters: {
    userId?: string;
    page?: number;
    limit?: number;
    search?: string;
    currentUserId?: string;
    currentUserRole?: "admin" | "employee" | "client";
  } = {}
) => {
  const {
    userId,
    page = 1,
    limit = 10,
    search,
    currentUserId,
    currentUserRole,
  } = filters;
  const skip = (page - 1) * limit;

  const query: any = {};
  if (userId) {
    query.userId = new Types.ObjectId(userId);
  }

  // If current user is an employee, only show projects they are assigned to
  if (currentUserRole === "employee" && currentUserId) {
    query.employees = new Types.ObjectId(currentUserId);
  }

  // Search functionality - search by project name (will filter by client name after population)
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [{ "name.en": searchRegex }, { "name.ar": searchRegex }];
  }

  // Build the query
  const projectsQuery = Project.find(query)
    .populate("userId", "name companyName email phone")
    .populate("employees", "name email companyName role")
    .populate("payments")
    .populate("modifications")
    .populate("activeModificationId")
    .sort({ createdAt: -1 });

  // If search is provided, also filter by client name after population
  let projects = await projectsQuery.lean();

  // Filter by client name if search is provided (after population)
  if (search && search.trim()) {
    const searchLower = search.trim().toLowerCase();
    projects = projects.filter((project: any) => {
      const projectNameEn = project.name?.en?.toLowerCase() || "";
      const projectNameAr = project.name?.ar?.toLowerCase() || "";
      const clientName =
        typeof project.userId === "object" && project.userId?.name
          ? project.userId.name.toLowerCase()
          : "";
      const companyName =
        typeof project.userId === "object" && project.userId?.companyName
          ? project.userId.companyName.toLowerCase()
          : "";

      return (
        projectNameEn.includes(searchLower) ||
        projectNameAr.includes(searchLower) ||
        clientName.includes(searchLower) ||
        companyName.includes(searchLower)
      );
    });
  }

  // Get total count for pagination
  const totalCount = projects.length;

  // Apply pagination
  const paginatedProjects = projects.slice(skip, skip + limit);

  return {
    projects: paginatedProjects,
    totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

export const getProjectById = async (
  id: string,
  currentUserId?: string,
  currentUserRole?: "admin" | "employee" | "client"
) => {
  const project = await Project.findById(id)
    .populate("userId", "name companyName email phone")
    .populate("employees", "name email companyName role")
    .populate("payments")
    .populate("modifications")
    .populate("activeModificationId")
    .lean();

  if (!project) {
    throw new Error("Project not found");
  }

  // Check access: admin can access all, employee can only access if assigned
  if (currentUserRole === "employee" && currentUserId) {
    const employeeIds =
      project.employees?.map((emp: any) =>
        typeof emp === "object" && emp !== null && "_id" in emp
          ? emp._id.toString()
          : emp.toString()
      ) || [];
    if (!employeeIds.includes(currentUserId)) {
      throw new Error("Access denied: You are not assigned to this project");
    }
  }

  return project;
};

export const updateProject = async (
  id: string,
  payload: UpdateProjectPayload,
  currentUserId?: string,
  currentUserRole?: "admin" | "employee" | "client"
) => {
  // Check access before updating
  if (currentUserRole === "employee" && currentUserId) {
    const project = await Project.findById(id).populate("employees").lean();
    if (!project) {
      throw new Error("Project not found");
    }
    const employeeIds =
      project.employees?.map((emp: any) =>
        typeof emp === "object" && emp !== null && "_id" in emp
          ? emp._id.toString()
          : emp.toString()
      ) || [];
    if (!employeeIds.includes(currentUserId)) {
      throw new Error("Access denied: You are not assigned to this project");
    }
  }

  const updateData: any = { ...payload };
  if (payload.startDate) {
    updateData.startDate = new Date(payload.startDate);
  }
  if (payload.activeModificationId) {
    updateData.activeModificationId = new Types.ObjectId(
      payload.activeModificationId
    );
  }
  if (payload.employees) {
    updateData.employees = payload.employees.map(
      (id) => new Types.ObjectId(id)
    );
  }

  const project = await Project.findByIdAndUpdate(id, updateData, {
    new: true,
  })
    .populate("userId", "name companyName email phone")
    .populate("payments")
    .populate("modifications")
    .populate("activeModificationId")
    .lean();

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const deleteProject = async (id: string) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new Error("Project not found");
  }

  // Delete related payments and modifications
  await Payment.deleteMany({ projectId: new Types.ObjectId(id) });
  await Modification.deleteMany({ projectId: new Types.ObjectId(id) });

  await Project.findByIdAndDelete(id);
  return project;
};

// Payment methods
export interface CreatePaymentPayload {
  title: { en: string; ar: string };
  description?: { en?: string; ar?: string };
  projectId: string;
  userId: string;
  amount: number;
  dueDate: string;
  status?: "due" | "due_soon" | "paid" | "upcoming";
}

export const createPayment = async (payload: CreatePaymentPayload) => {
  const payment = new Payment({
    ...payload,
    projectId: new Types.ObjectId(payload.projectId),
    userId: new Types.ObjectId(payload.userId),
    dueDate: new Date(payload.dueDate),
    status: payload.status || "upcoming",
  });

  const savedPayment = await payment.save();

  // Add payment to project
  await Project.findByIdAndUpdate(payload.projectId, {
    $push: { payments: savedPayment._id },
  });

  return savedPayment;
};

export const updatePayment = async (
  id: string,
  payload: Partial<CreatePaymentPayload>
) => {
  const updateData: any = { ...payload };
  if (payload.dueDate) {
    updateData.dueDate = new Date(payload.dueDate);
  }
  if (payload.projectId) {
    updateData.projectId = new Types.ObjectId(payload.projectId);
  }
  if (payload.userId) {
    updateData.userId = new Types.ObjectId(payload.userId);
  }

  const payment = await Payment.findByIdAndUpdate(id, updateData, {
    new: true,
  })
    .populate("projectId")
    .populate("userId", "name companyName")
    .lean();

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

export const deletePayment = async (id: string) => {
  const payment = await Payment.findById(id);
  if (!payment) {
    throw new Error("Payment not found");
  }

  // Remove payment from project
  await Project.findByIdAndUpdate(payment.projectId, {
    $pull: { payments: new Types.ObjectId(id) },
  });

  await Payment.findByIdAndDelete(id);
  return payment;
};

// Get all payments with filtering
export const getAllPayments = async (
  filters: {
    projectId?: string;
    startDate?: string;
    endDate?: string;
    status?: "due" | "due_soon" | "paid" | "upcoming";
    page?: number;
    limit?: number;
  } = {}
) => {
  const {
    projectId,
    startDate,
    endDate,
    status,
    page = 1,
    limit = 100,
  } = filters;
  const skip = (page - 1) * limit;

  const query: any = {};

  if (projectId) {
    query.projectId = new Types.ObjectId(projectId);
  }

  if (startDate || endDate) {
    query.dueDate = {};
    if (startDate) {
      query.dueDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.dueDate.$lte = new Date(endDate);
    }
  }

  if (status) {
    query.status = status;
  }

  const payments = await Payment.find(query)
    .populate("projectId", "name logo")
    .populate("userId", "name companyName")
    .sort({ dueDate: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Payment.countDocuments(query);

  // Calculate statistics
  const allPayments = await Payment.find(query).lean();

  // Get incomes for the same date range
  const Income = (await import("@/models/Income")).default;
  const incomeQuery: any = {};
  if (startDate || endDate) {
    incomeQuery.dueDate = {};
    if (startDate) {
      incomeQuery.dueDate.$gte = new Date(startDate);
    }
    if (endDate) {
      incomeQuery.dueDate.$lte = new Date(endDate);
    }
  }
  const allIncomes = await Income.find(incomeQuery).lean();

  // Calculate total revenue from both payments and incomes
  const paymentsRevenue = allPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  // For recurring incomes (monthly contracts), count them for each month in the range
  let incomesRevenue = 0;
  if (startDate && endDate) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    allIncomes.forEach((income: any) => {
      if (income.status === "paid") {
        if (income.recurring && income.type === "monthly_contract") {
          // Calculate how many months this income should be counted
          const baseDate = new Date(income.dueDate);
          const baseDay = baseDate.getDate();

          let currentDate = new Date(startDateObj);
          currentDate.setDate(baseDay);
          if (currentDate.getDate() !== baseDay) {
            currentDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              0
            );
          }

          let count = 0;
          while (currentDate <= endDateObj) {
            if (currentDate >= startDateObj) {
              count++;
            }
            currentDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              baseDay
            );
            if (currentDate.getDate() !== baseDay) {
              currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                0
              );
            }
          }
          incomesRevenue += income.amount * count;
        } else {
          // One-time income
          const incomeDate = new Date(income.dueDate);
          if (incomeDate >= startDateObj && incomeDate <= endDateObj) {
            incomesRevenue += income.amount;
          }
        }
      }
    });
  } else {
    // If no date range, just count paid incomes once
    incomesRevenue = allIncomes
      .filter((i: any) => i.status === "paid")
      .reduce((sum, i: any) => sum + i.amount, 0);
  }

  const totalRevenue = paymentsRevenue + incomesRevenue;

  const pendingAmount = allPayments
    .filter((p) => p.status !== "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const dueSoonCount = allPayments.filter(
    (p) => p.status === "due_soon" || p.status === "due"
  ).length;

  return {
    payments,
    totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    statistics: {
      totalRevenue,
      pendingAmount,
      dueSoonCount,
      totalPayments: allPayments.length,
      paidPayments: allPayments.filter((p) => p.status === "paid").length,
    },
  };
};

// Modification methods
export interface ModificationFilePayload {
  url: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
}

export interface CreateModificationPayload {
  title: string;
  description: string;
  priority?: "low" | "medium" | "high" | "critical";
  projectId: string;
  userId: string;
  status?: "pending" | "accepted" | "completed" | "needs_extra_payment";
  extraPaymentAmount?: number;
  costAccepted?: boolean;
  attachedFiles?: ModificationFilePayload[];
  audioMessageUrl?: string;
}

export const createModification = async (
  payload: CreateModificationPayload
) => {
  const modification = new Modification({
    ...payload,
    projectId: new Types.ObjectId(payload.projectId),
    userId: new Types.ObjectId(payload.userId),
    priority: payload.priority || "medium",
    status: payload.status || "pending",
    costAccepted: payload.costAccepted || false,
  });

  const savedModification = await modification.save();

  // Add modification to project
  await Project.findByIdAndUpdate(payload.projectId, {
    $push: { modifications: savedModification._id },
  });

  // Send notification to all admins about new modification
  try {
    const { sendNotificationToAllAdmins } = await import(
      "@/utils/firebaseAdmin"
    );

    const [project, user] = await Promise.all([
      Project.findById(payload.projectId).lean(),
      User.findById(payload.userId).lean(),
    ]);

    const projectNameEn =
      (project as any)?.name?.en || (project as any)?.name || "Project";
    const projectNameAr =
      (project as any)?.name?.ar || (project as any)?.name || "المشروع";

    const clientName = (user as any)?.name || "";

    const titleEn = "New Project Modification";
    const titleAr = "تعديل جديد على المشروع";

    const bodyEn = `${clientName} added a new modification for project ${projectNameEn}`;
    const bodyAr = `${clientName} أضاف تعديلاً جديداً على المشروع ${projectNameAr}`;

    await sendNotificationToAllAdmins(
      `${titleEn} | ${titleAr}`,
      `${bodyEn}\n${bodyAr}`,
      {
        type: "project_modification",
        projectId: payload.projectId,
        modificationId: savedModification._id.toString(),
        projectNameEn,
        projectNameAr,
        clientName,
      }
    );
  } catch (error) {
    // لا نفشل إنشاء التعديل إذا فشل الإشعار
    console.error(
      "Failed to send notification for project modification:",
      error
    );
  }

  return savedModification;
};

export const updateModification = async (
  id: string,
  payload: Partial<CreateModificationPayload>
) => {
  const updateData: any = { ...payload };
  if (payload.projectId) {
    updateData.projectId = new Types.ObjectId(payload.projectId);
  }
  if (payload.userId) {
    updateData.userId = new Types.ObjectId(payload.userId);
  }

  const modification = await Modification.findByIdAndUpdate(id, updateData, {
    new: true,
  })
    .populate("projectId")
    .populate("userId", "name companyName")
    .lean();

  if (!modification) {
    throw new Error("Modification not found");
  }

  return modification;
};

export const deleteModification = async (id: string) => {
  const modification = await Modification.findById(id);
  if (!modification) {
    throw new Error("Modification not found");
  }

  // Remove modification from project
  await Project.findByIdAndUpdate(modification.projectId, {
    $pull: { modifications: new Types.ObjectId(id) },
  });

  await Modification.findByIdAndDelete(id);
  return modification;
};

// Generate portal code for project
export const generatePortalCode = async (projectId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  // Generate a unique 8-character code
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  let portalCode = generateCode();
  let attempts = 0;
  const maxAttempts = 10;

  // Ensure code is unique
  while (attempts < maxAttempts) {
    const existing = await Project.findOne({ portalCode });
    if (!existing || existing._id.toString() === projectId) {
      break;
    }
    portalCode = generateCode();
    attempts++;
  }

  project.portalCode = portalCode;
  await project.save();

  return project;
};

// Get project by portal code (for client portal)
export const getProjectByPortalCode = async (portalCode: string) => {
  const project = await Project.findOne({ portalCode })
    .populate("userId", "name email companyName")
    .populate("payments")
    .populate("modifications")
    .lean();

  if (!project) {
    throw new Error("Invalid portal code");
  }

  return project;
};
