import { processJobs } from "@/functions";
import { User } from "@/models/user";
import { prisma } from "@/prisma/client";

export default async function handler(req, res) {
  const { token } = req.query;

  if (req.method !== "GET") return res.status(404).json("Method not allowed");
  if (!token || token !== process.env.TOKEN)
    return res.status(404).json("Token required.");

  await prisma.params.update({
    where: {
      id: 1,
    },
    data: {
      lastProcessedJob: new Date(),
    },
  });
  const updated = await processJobs();

  if (updated) {
    // Send notification to all user registered in the bot with details about the bus schedule
    await User.notify();
    res.status(200).json("Se actualizó la información.");
  } else {
    res.status(200).json("Sin cambios.");
  }
}
