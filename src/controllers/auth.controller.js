import { PrismaClient } from "@prisma/client";
import { status } from "../../utils/const.js";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";

const prisma = new PrismaClient();

export const auth = {
  authLogin: async (req, res, next) => {
    const { email = "", id = "", mat_khau } = req.body;
    console.log(email, id, mat_khau);
    try {
      let user = await prisma.nguoi_dung.findFirst({
        where: {
          OR: [{ nguoi_dung_id: Number(id) }, { email }],
        },
      });

      if (!user) {
        return res
          .status(status.FOUND)
          .json({ message: "Please check id/email" });
      }

      const passwordMatch =
        (await bcrypt.compare(mat_khau, user.mat_khau)) ||
        user.mat_khau == mat_khau;
      if (passwordMatch) return res.status(status.FOUND).json(`User found`);

      return res.status(status.NOT_AUTHORISE).json(`Passwword is wrong`);
    } catch (error) {
      return res.status(status.INTERNAL_SERVER).json({ message: `${error}` });
    }
  },
  authRegister: async (req, res, next) => {
    try {
      let { id = "", email, password } = req.body;

      let userExist = await prisma.nguoi_dung.findFirst({
        where: {
          OR: [{ nguoi_dung_id: Number(id) }, { email }],
        },
      });

      if (userExist) {
        return res
          .status(status.CLIENT_ERR)
          .json({ message: `Email or ID is existed` });
      }
      let file = req.file;
      if (!file) {
        // No file in the picture field
        return res
          .status(status.CLIENT_ERR)
          .json({ message: "No picture file provided" });
      }

      let secret = speakeasy.generateSecret({ length: 15 });
      let maxAge = 100;
      let minAge = 10;

      let newUser = await prisma.nguoi_dung.create({
        data: {
          email,
          anh_dai_dien: file.path,
          secret: secret.base32, // Use for MFA
          mat_khau: bcrypt.hashSync(password, 10),
          ho_ten: email.split("@")[0],
          tuoi: Math.floor(Math.random() * (maxAge - minAge + 1) + minAge),
        },
      });
      return res.status(status.OK).json({ message: { newUser } });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER).json({ message: `${error}` });
    }
  },
};
