import { Request, Response, NextFunction } from "express";

const homeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).render("base");
  } catch (err) {
    next(err);
  }
};

export default homeController;
