import { Request, Response, NextFunction } from "express";
import {
  createQuotationRequest,
  listQuotationRequests,
  getQuotationRequestById,
  updateQuotationStatus,
} from "@/services/quotationService";

export const createQuotationRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quotation = await createQuotationRequest(req.body);
    res.status(201).json(quotation);
  } catch (error) {
    next(error);
  }
};

export const listQuotationRequestsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, search, serviceId, status } = req.query;
    const result = await listQuotationRequests({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string | undefined,
      serviceId: serviceId as string | undefined,
      status: status as any,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getQuotationRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quotation = await getQuotationRequestById(req.params.id);
    res.json(quotation);
  } catch (error) {
    next(error);
  }
};

export const updateQuotationStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quotation = await updateQuotationStatus(
      req.params.id,
      req.body.status
    );
    res.json(quotation);
  } catch (error) {
    next(error);
  }
};
