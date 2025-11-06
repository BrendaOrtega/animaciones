import nodemailer from "nodemailer";
import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";

// Validar que las credenciales de SES estén configuradas
const sesKey = process.env.SES_KEY;
const sesSecret = process.env.SES_SECRET;
const sesRegion = process.env.SES_REGION || "us-east-1";

console.log("🔍 Configuración de SES:");
console.log("  - SES_KEY:", sesKey ? `${sesKey.substring(0, 8)}...` : "❌ NO CONFIGURADO");
console.log("  - SES_SECRET:", sesSecret ? `${sesSecret.substring(0, 8)}...` : "❌ NO CONFIGURADO");
console.log("  - SES_REGION:", sesRegion);

if (!sesKey || !sesSecret) {
  console.warn("⚠️ ADVERTENCIA: Las credenciales de SES no están configuradas");
  console.warn("⚠️ Los emails NO se podrán enviar. Configura SES_KEY y SES_SECRET");
}

// Función para crear cliente de SES
const getSesClient = () => {
  if (!sesKey || !sesSecret) {
    throw new Error("SES credentials are required but not configured in .env");
  }

  return new SESClient({
    region: sesRegion,
    credentials: {
      accessKeyId: sesKey,
      secretAccessKey: sesSecret,
    },
  });
};

// Transporte de Amazon SES
export const emailTransport = nodemailer.createTransport({
  SES: {
    ses: getSesClient(),
    aws: { SendRawEmailCommand },
  },
});

console.log("📧 Usando Amazon SES como transporte de email");
