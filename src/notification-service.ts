import nodemailer from "nodemailer";

interface EmailNotification {
  email: string;
  totalSignups: number;
  createdAt: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  // If SMTP credentials are not configured, log a warning
  if (!user || !pass) {
    console.warn(
      "⚠️ SMTP not configured. Email notifications will not be sent. " +
      "Set SMTP_USER, SMTP_PASS, SMTP_HOST, and SMTP_PORT in .env"
    );
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendNewSignupNotification(
  signup: EmailNotification
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("📧 [DEV] New signup notification would be sent to fvalera.developer@gmail.com");
    console.log(`📧 [DEV] Signer email: ${signup.email}`);
    console.log(`📧 [DEV] Total signups: ${signup.totalSignups}`);
    return;
  }

  const ownerEmail = "fvalera.developer@gmail.com";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1F2E28; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Nuevo Suscriptor - Wasa-Text</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; color: #333;">
          <strong style="font-size: 18px; color: #1F2E28;">${signup.email}</strong> se acaba de suscribir a la lista de espera de Wasa-Text.
        </p>
        
        <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e0e0e0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; color: #666; font-size: 14px;">Email</td>
              <td style="padding: 8px; font-weight: bold; color: #1F2E28;">${signup.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #666; font-size: 14px;">Fecha</td>
              <td style="padding: 8px; font-weight: bold; color: #1F2E28;">${signup.createdAt}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #666; font-size: 14px;">Total suscriptores</td>
              <td style="padding: 8px; font-weight: bold; color: #1F2E28;">${signup.totalSignups}</td>
            </tr>
          </table>
        </div>

        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 20px;">
          Este mensaje fue enviado automáticamente por el sistema de registro de Wasa-Text.
        </p>
      </div>
    </div>
  `;

  const text = `
🎉 Nuevo Suscriptor - Wasa-Text

${signup.email} se acaba de suscribir a la lista de espera.

Email: ${signup.email}
Fecha: ${signup.createdAt}
Total suscriptores: ${signup.totalSignups}
  `;

  try {
    await transporter.sendMail({
      from: `"Wasa-Text" <${process.env.SMTP_USER}>`,
      to: ownerEmail,
      subject: `🎉 Nuevo suscriptor: ${signup.email}`,
      html,
      text,
    });
    console.log(`✅ Notification email sent to ${ownerEmail} about ${signup.email}`);
  } catch (error) {
    console.error("Error sending notification email:", error);
    // Don't throw - we don't want to block the signup process
  }
}