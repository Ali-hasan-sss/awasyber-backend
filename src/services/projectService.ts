import Project, { IProject } from "@/models/Project";
import Payment from "@/models/Payment";
import Modification from "@/models/Modification";
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
    currentUserId?: string;
    currentUserRole?: "admin" | "employee" | "client";
  } = {}
) => {
  const {
    userId,
    page = 1,
    limit = 10,
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
    query.$or = [
      { employees: new Types.ObjectId(currentUserId) },
      // Employees can also see projects if they are the only employee (for backward compatibility)
    ];
  }

  const projects = await Project.find(query)
    .populate("userId", "name companyName email")
    .populate("employees", "name email companyName role")
    .populate("payments")
    .populate("modifications")
    .populate("activeModificationId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return projects;
};

export const getProjectById = async (
  id: string,
  currentUserId?: string,
  currentUserRole?: "admin" | "employee" | "client"
) => {
  const project = await Project.findById(id)
    .populate("userId", "name companyName email")
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
    .populate("userId", "name companyName email")
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
