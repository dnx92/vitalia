import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const LABELS = {
  service: {
    implants: 'Dental Implants', 'smile-makeover': 'Smile Makeover / Veneers',
    'full-restoration': 'Full Mouth Restoration', 'all-on-4': 'All-on-4 Implants',
    'crowns-bridges': 'Crowns & Bridges', whitening: 'Teeth Whitening',
    'root-canal': 'Root Canal / Endodontics', checkup: 'General Checkup & Cleaning',
    other: 'Other / Not Sure'
  },
  budget: {
    'under-3k': 'Under $3,000', '$3k-$7k': '$3,000 – $7,000', '$7k-$15k': '$7,000 – $15,000',
    '$15k-$25k': '$15,000 – $25,000', '$25k+': '$25,000+', unsure: 'Not Sure / Need Quote'
  },
  timeline: {
    asap: 'As soon as possible', '1-month': 'Within 1 month', '3-months': 'Within 3 months',
    '6-months': 'Within 6 months', exploring: 'Just exploring / No rush'
  },
  age: {
    'under-30': 'Under 30', '30-45': '30 – 45', '45-60': '45 – 60', '60+': '60+'
  }
};

function label(type, key) {
  return LABELS[type]?.[key] || key || 'Not specified';
}

function confirmationHTML(name, service) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,sans-serif;background:#f5f5f5">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
      <tr><td style="background:#1a365d;padding:40px 30px;text-align:center">
        <h1 style="color:#d4af37;margin:0;font-size:28px">Vitalia<span style="color:#fff">One</span></h1>
        <p style="color:#fff;margin:8px 0 0;font-size:16px;opacity:0.9">Premium Dental Care in Buenos Aires</p>
      </td></tr>
      <tr><td style="padding:40px 30px">
        <h2 style="color:#1a365d;margin:0 0 8px">Thank you, ${name}!</h2>
        <p style="color:#495057;font-size:16px;line-height:1.6">We've received your inquiry about <strong>${label('service', service)}</strong>.</p>
        <p style="color:#495057;font-size:16px;line-height:1.6">Our team will review your information and contact you within <strong>24 hours</strong> with a personalized treatment plan and quote.</p>
        <table style="background:#f8f9fa;border-radius:8px;padding:20px;margin:24px 0;width:100%">
          <tr><td style="color:#495057;font-size:14px;line-height:1.6">
            <strong style="color:#1a365d">Next steps:</strong><br>
            1. We review your case in detail<br>
            2. Prepare a customized treatment plan<br>
            3. Schedule a free video consultation
          </td></tr>
        </table>
        <p style="color:#495057;font-size:16px;line-height:1.6">If you have any urgent questions, contact us on <a href="https://wa.me/5491112345678" style="color:#d4af37;text-decoration:none;font-weight:600">WhatsApp</a>.</p>
      </td></tr>
      <tr><td style="background:#f8f9fa;padding:20px 30px;text-align:center;border-top:1px solid #e9ecef">
        <p style="color:#6c757d;font-size:12px;margin:0">Vitalia One &bull; Buenos Aires, Argentina<br><a href="mailto:info@vitaliaone.com" style="color:#d4af37;text-decoration:none">info@vitaliaone.com</a></p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}

function warmEmailHTML(lead) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,sans-serif;background:#f5f5f5">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
      <tr><td style="background:linear-gradient(135deg,#1a365d,#2a4a7f);padding:40px 30px;text-align:center">
        <h1 style="color:#d4af37;margin:0;font-size:28px">Vitalia<span style="color:#fff">One</span></h1>
        <p style="color:#fff;margin:8px 0 0;font-size:16px;opacity:0.9">Premium Dental Care in Buenos Aires</p>
      </td></tr>
      <tr><td style="padding:40px 30px">
        <h2 style="color:#1a365d;margin:0 0 16px">Hi ${lead.name}, here's your personalized plan</h2>
        <p style="color:#495057;font-size:16px;line-height:1.6">We've reviewed the information you shared and we're excited to help you achieve your dream smile. Here's a summary of your request:</p>

        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <tr><td style="padding:12px 16px;background:#f8f9fa;border-bottom:1px solid #e9ecef;color:#6c757d;font-size:14px">Treatment</td><td style="padding:12px 16px;border-bottom:1px solid #e9ecef;color:#1a365d;font-weight:600;font-size:14px">${label('service', lead.service)}</td></tr>
          <tr><td style="padding:12px 16px;background:#f8f9fa;border-bottom:1px solid #e9ecef;color:#6c757d;font-size:14px">Budget</td><td style="padding:12px 16px;border-bottom:1px solid #e9ecef;color:#1a365d;font-weight:600;font-size:14px">${label('budget', lead.budget)}</td></tr>
          <tr><td style="padding:12px 16px;background:#f8f9fa;border-bottom:1px solid #e9ecef;color:#6c757d;font-size:14px">Timeline</td><td style="padding:12px 16px;border-bottom:1px solid #e9ecef;color:#1a365d;font-weight:600;font-size:14px">${label('timeline', lead.timeline)}</td></tr>
          <tr><td style="padding:12px 16px;background:#f8f9fa;color:#6c757d;font-size:14px">Location</td><td style="padding:12px 16px;color:#1a365d;font-weight:600;font-size:14px">${lead.location || 'Not specified'}</td></tr>
        </table>

        <p style="color:#495057;font-size:16px;line-height:1.6">Our US-trained specialists are ready to provide you with world-class dental care at <strong style="color:#d4af37">70% less than US prices</strong>.</p>

        <table style="background:#f8f9fa;border-radius:8px;padding:20px;margin:24px 0;width:100%">
          <tr><td style="color:#495057;font-size:14px;line-height:1.6">
            <strong style="color:#1a365d">What happens next:</strong><br>
            1. We'll prepare a detailed treatment plan with exact pricing<br>
            2. Schedule a free video call with your specialist<br>
            3. Plan your trip to Buenos Aires &mdash; we handle everything
          </td></tr>
        </table>

        <p style="color:#495057;font-size:16px;line-height:1.6">Have questions? Reply to this email or reach us on <a href="https://wa.me/5491112345678" style="color:#d4af37;text-decoration:none;font-weight:600">WhatsApp</a>. We're here to help!</p>
      </td></tr>
      <tr><td style="background:#f8f9fa;padding:20px 30px;text-align:center;border-top:1px solid #e9ecef">
        <p style="color:#6c757d;font-size:12px;margin:0">Vitalia One &bull; Buenos Aires, Argentina<br><a href="mailto:info@vitaliaone.com" style="color:#d4af37;text-decoration:none">info@vitaliaone.com</a></p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}

export async function sendConfirmationEmail(lead) {
  const html = confirmationHTML(lead.name, lead.service);
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: lead.email,
    subject: `We received your inquiry - Vitalia One`,
    html
  });
  console.log(`Confirmation email sent to ${lead.email}: ${info.messageId}`);
}

export async function sendWarmEmail(lead) {
  const html = warmEmailHTML(lead);
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: lead.email,
    subject: `Your personalized dental plan - Vitalia One`,
    html
  });
  console.log(`Warm email sent to ${lead.email}: ${info.messageId}`);
}
