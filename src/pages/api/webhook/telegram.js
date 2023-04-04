import { User } from "@/models/user";

// https://blog.devgenius.io/write-a-simple-telegram-bot-in-next-js-b49379e77163
// https://api.telegram.org/bot6050581439:AAH5RGQQ_w5NcIypRvl84Ijp_KVVKLyO9Dk/setWebhook?url=https://5f05-200-7-156-46.ngrok.io/api/webhook/telegram
export default async function handler(req, res) {
  const { message, my_chat_member } = req.body;

  // El usuario se registro en el bot
  if (message && message.text === "/start") {
    await User.registerUser(req.body.message.from, req.body);
  }

  // Notificar a todos los usuarios registrados en el bot
  // if (message && message.text === "/notify") {
  //   await User.notify();
  // }

  // El usuario se retiro del bot
  if (my_chat_member && my_chat_member.new_chat_member.status === "kicked") {
    // await User.deleteUser(req.body.my_chat_member.from.username);
  }

  res.status(200).send("OK");
}
