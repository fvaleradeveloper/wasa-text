import { Resend } from "resend";

interface EmailNotification {
  email: string;
  totalSignups: number;
  createdAt: string;
}

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (resendClient) {
    return resendClient;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "⚠️ RESEND_API_KEY not configured. Email notifications will not be sent. " +
      "Set RESEND_API_KEY in Vercel environment variables."
    );
    return null;
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

export async function sendNewSignupNotification(
  signup: EmailNotification
): Promise<void> {
  const client = getResendClient();
  if (!client) {
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
    const data = await client.emails.send({
      from: "Wasa-Text <notifications@resend.dev>",
      to: [ownerEmail],
      subject: `🎉 Nuevo suscriptor: ${signup.email}`,
      html,
      text,
      tags: [
        {
          name: "category",
          value: "wasaptext",
        },
      ],
    });
    console.log(`✅ Notification email sent to ${ownerEmail} about ${signup.email}`);
    console.log(`📧 Resend response:`, JSON.stringify(data, null, 2));
  } catch (error: any) {
    console.error("❌ Error sending notification email:", error);
    console.error("❌ Error details:", error?.message || error);
    console.error("❌ Error response:", error?.response?.data || error?.response);
    // Don't throw - we don't want to block the signup process
  }
}