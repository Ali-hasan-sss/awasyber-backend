import nodemailer from "nodemailer";
import env from "@/config/env";

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.emailHost,
      port: env.emailPort,
      secure: env.emailPort === 465, // true for 465, false for other ports
      auth: {
        user: env.emailUser,
        pass: env.emailPassword,
      },
    });
  }
  return transporter;
};

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (
  options: SendEmailOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    // Check email configuration
    const missingConfig: string[] = [];
    if (!env.emailUser) missingConfig.push("EMAIL_USER");
    if (!env.emailPassword) missingConfig.push("EMAIL_PASSWORD");
    if (!env.emailHost) missingConfig.push("EMAIL_HOST");
    if (!env.companyEmail) missingConfig.push("COMPANY_EMAIL");

    if (missingConfig.length > 0) {
      const errorMsg = `Email configuration missing: ${missingConfig.join(
        ", "
      )}. Please set these environment variables in your .env file.`;
      console.warn("[EMAIL] ❌ " + errorMsg);
      console.warn("[EMAIL] Current email configuration:", {
        EMAIL_HOST: env.emailHost || "NOT SET",
        EMAIL_PORT: env.emailPort,
        EMAIL_USER: env.emailUser ? "SET (***)" : "NOT SET",
        EMAIL_PASSWORD: env.emailPassword ? "SET (***)" : "NOT SET",
        EMAIL_FROM: env.emailFrom,
        COMPANY_EMAIL: env.companyEmail || "NOT SET",
      });
      return { success: false, error: errorMsg };
    }

    console.log("[EMAIL] Attempting to send email...", {
      to: options.to,
      subject: options.subject,
      from: env.emailFrom,
    });

    const mailOptions = {
      from: `"AWA Cyber" <${env.emailFrom}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || "",
      html: options.html,
    };

    const transport = getTransporter();
    const info = await transport.sendMail(mailOptions);

    console.log("[EMAIL] ✅ Email sent successfully!", {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[EMAIL] ❌ Error sending email:", {
      to: options.to,
      subject: options.subject,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, error: errorMessage };
  }
};

export const sendQuotationRequestEmail = async (quotationData: {
  fullName: string;
  email?: string;
  phone: string;
  companyName?: string;
  serviceName: string;
  projectDescription?: string;
  budget?: { from: number; to: number };
  expectedDuration?: string;
  startDate?: string;
  endDate?: string;
  additionalInfo?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  console.log("[QUOTATION EMAIL] Preparing email for quotation request...", {
    fullName: quotationData.fullName,
    email: quotationData.email,
    phone: quotationData.phone,
    serviceName: quotationData.serviceName,
  });
  const budgetText = quotationData.budget
    ? `${quotationData.budget.from.toLocaleString()} - ${quotationData.budget.to.toLocaleString()} OMR`
    : "غير محدد";

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #0ea5e9;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }
        .field {
          margin-bottom: 15px;
          padding: 10px;
          background-color: white;
          border-radius: 4px;
          border-right: 3px solid #0ea5e9;
        }
        .field-label {
          font-weight: bold;
          color: #0ea5e9;
          margin-bottom: 5px;
        }
        .field-value {
          color: #333;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>طلب عرض سعر جديد</h1>
      </div>
      <div class="content">
        <div class="field">
          <div class="field-label">الاسم:</div>
          <div class="field-value">${quotationData.fullName}</div>
        </div>
        
        ${
          quotationData.email
            ? `
        <div class="field">
          <div class="field-label">البريد الإلكتروني:</div>
          <div class="field-value">${quotationData.email}</div>
        </div>
        `
            : ""
        }
        
        <div class="field">
          <div class="field-label">رقم الهاتف:</div>
          <div class="field-value">${quotationData.phone}</div>
        </div>
        
        ${
          quotationData.companyName
            ? `
        <div class="field">
          <div class="field-label">اسم الشركة:</div>
          <div class="field-value">${quotationData.companyName}</div>
        </div>
        `
            : ""
        }
        
        <div class="field">
          <div class="field-label">الخدمة المطلوبة:</div>
          <div class="field-value">${quotationData.serviceName}</div>
        </div>
        
        ${
          quotationData.projectDescription
            ? `
        <div class="field">
          <div class="field-label">وصف المشروع:</div>
          <div class="field-value">${quotationData.projectDescription}</div>
        </div>
        `
            : ""
        }
        
        <div class="field">
          <div class="field-label">الميزانية:</div>
          <div class="field-value">${budgetText}</div>
        </div>
        
        ${
          quotationData.expectedDuration
            ? `
        <div class="field">
          <div class="field-label">المدة المتوقعة:</div>
          <div class="field-value">${quotationData.expectedDuration}</div>
        </div>
        `
            : ""
        }
        
        ${
          quotationData.startDate
            ? `
        <div class="field">
          <div class="field-label">تاريخ البدء:</div>
          <div class="field-value">${new Date(
            quotationData.startDate
          ).toLocaleDateString("ar-EG")}</div>
        </div>
        `
            : ""
        }
        
        ${
          quotationData.endDate
            ? `
        <div class="field">
          <div class="field-label">تاريخ الانتهاء:</div>
          <div class="field-value">${new Date(
            quotationData.endDate
          ).toLocaleDateString("ar-EG")}</div>
        </div>
        `
            : ""
        }
        
        ${
          quotationData.additionalInfo
            ? `
        <div class="field">
          <div class="field-label">معلومات إضافية:</div>
          <div class="field-value">${quotationData.additionalInfo}</div>
        </div>
        `
            : ""
        }
      </div>
      <div class="footer">
        <p>تم استلام هذا الطلب من موقع AWA Cyber</p>
        <p>© ${new Date().getFullYear()} AWA Cyber. جميع الحقوق محفوظة.</p>
      </div>
    </body>
    </html>
  `;

  const result = await sendEmail({
    to: env.companyEmail,
    subject: `طلب عرض سعر جديد من ${quotationData.fullName}`,
    html: htmlContent,
  });

  if (result.success) {
    console.log(
      "[QUOTATION EMAIL] ✅ Quotation request email sent successfully!",
      {
        messageId: result.messageId,
        to: env.companyEmail,
        fullName: quotationData.fullName,
      }
    );
  } else {
    console.error(
      "[QUOTATION EMAIL] ❌ Failed to send quotation request email",
      {
        error: result.error,
        fullName: quotationData.fullName,
      }
    );
  }

  return result;
};

export const sendContactMessageEmail = async (contactData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  console.log("[CONTACT EMAIL] Preparing email for contact message...", {
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
  });
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #0ea5e9;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }
        .field {
          margin-bottom: 15px;
          padding: 10px;
          background-color: white;
          border-radius: 4px;
          border-right: 3px solid #0ea5e9;
        }
        .field-label {
          font-weight: bold;
          color: #0ea5e9;
          margin-bottom: 5px;
        }
        .field-value {
          color: #333;
        }
        .message-box {
          background-color: white;
          padding: 15px;
          border-radius: 4px;
          border-right: 3px solid #0ea5e9;
          margin-top: 15px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>رسالة جديدة من صفحة اتصل بنا</h1>
      </div>
      <div class="content">
        <div class="field">
          <div class="field-label">الاسم:</div>
          <div class="field-value">${contactData.name}</div>
        </div>
        
        <div class="field">
          <div class="field-label">البريد الإلكتروني:</div>
          <div class="field-value"><a href="mailto:${contactData.email}">${
    contactData.email
  }</a></div>
        </div>
        
        ${
          contactData.phone
            ? `
        <div class="field">
          <div class="field-label">رقم الهاتف:</div>
          <div class="field-value"><a href="tel:${contactData.phone}">${contactData.phone}</a></div>
        </div>
        `
            : ""
        }
        
        <div class="message-box">
          <div class="field-label">نص الرسالة:</div>
          <div class="field-value" style="white-space: pre-wrap;">${
            contactData.message
          }</div>
        </div>
      </div>
      <div class="footer">
        <p>تم استلام هذه الرسالة من موقع AWA Cyber</p>
        <p>© ${new Date().getFullYear()} AWA Cyber. جميع الحقوق محفوظة.</p>
      </div>
    </body>
    </html>
  `;

  const result = await sendEmail({
    to: env.companyEmail,
    subject: `رسالة جديدة من ${contactData.name} - صفحة اتصل بنا`,
    html: htmlContent,
  });

  if (result.success) {
    console.log("[CONTACT EMAIL] ✅ Contact message email sent successfully!", {
      messageId: result.messageId,
      to: env.companyEmail,
      name: contactData.name,
      email: contactData.email,
    });
  } else {
    console.error("[CONTACT EMAIL] ❌ Failed to send contact message email", {
      error: result.error,
      name: contactData.name,
      email: contactData.email,
    });
  }

  return result;
};
