import { Request, Response, NextFunction } from "express";

const statsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).render("stats");
  } catch (err) {
    next(err);
  }
};

export default statsController;
