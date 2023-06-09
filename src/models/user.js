import { prisma } from "@/prisma/client";

export const User = {
  async registerUser(data, notify = false) {
    try {
      let user;

      if (data.username) {
        user = await prisma.user.findFirst({
          where: { username: data.username },
        });
      } else {
        user = await prisma.user.findFirst({
          where: { tid: data.id },
        });
      }

      // If user does not exist, create user
      if (!user) {
        user = await prisma.user.create({
          data: {
            username: data.username ? data.username : "",
            firstName: data.first_name,
            lastName: data.last_name,
            language: data.language_code,
            tid: data.id,
          },
        });

        // Enviar un mensaje de bienvenida con el nombre del usuario
        if (notify) {
          const message = `Hola ${user.firstName}, gracias por registrarte, te avisaré cuando cambie el horario del colectivo. No tienes que hacer más nada, te enviaré un mensaje cuando detecte cambios en el horario. Verifico si hay cambios cada 10 minutos, así que no te preocupes por estar pendiente.`;
          await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${user.tid}&text=${message}&parse_mode=HTML`
          );
        }
      }

      return user;
    } catch (error) {
      console.error("registerUser", error);
    }
  },

  async deleteUser(username) {
    try {
      const user = await prisma.user.findFirst({
        where: { username },
      });

      if (user) {
        await prisma.user.delete({
          where: { id: user.id },
        });
      }

      return user;
    } catch (error) {
      console.error("deleteUser", error);
    }
  },

  async notify() {
    try {
      // Send notification to all user registered in the bot with details about the bus schedule
      const users = await prisma.user.findMany();
      await Promise.all(
        users.map(async (user) => {
          // Enviar un mensaje de bienvenida con el nombre del usuario
          const message = `${user.firstName}, hubo cambios en el horario del colectivo. Ingresa al siguiente enlace para ver los detalles: <a href="https://soldinibus.com.ar">soldinibus.com.ar</a> :)`;
          await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${user.tid}&text=${message}&parse_mode=HTML`
          );
        })
      );
    } catch (error) {
      console.log("notify", error);
    }
  },
};
