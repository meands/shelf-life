import express, { Request, Response } from "express";
import { streamResponse } from "@services/llm/completions";

const router = express.Router();

router.post("/generate", async (req: Request, res: Response) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  for await (const chunk of streamResponse(req.body)) {
    res.write(chunk);
  }
  res.status(200).end();
});

export default router;
