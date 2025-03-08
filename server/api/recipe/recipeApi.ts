import express, { Request, Response } from "express";
import { newChat } from "../../integrations/llm/completions";
const router = express.Router();

router.post("/generate", async (req: Request, res: Response) => {
  const appendMessage = newChat();

  const response = await appendMessage(req.body);

  res.status(200).json(response);
});

export default router;
