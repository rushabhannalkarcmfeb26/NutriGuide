const nodemailer = require('nodemailer');

// ─── Build SMTP Transporter ──────────────────────────────────────────────────
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for port 465 (SSL), false for 587 (TLS)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: true,   // Enforce valid SSL certificates
            minVersion: 'TLSv1.2'       // Minimum TLS version for security
        }
    });
};

// ─── Send Email with Retry ───────────────────────────────────────────────────
const sendWithRetry = async (transporter, mailOptions, attempt = 1) => {
    const maxRetries = 2;
    try {
        console.log(`\n📧 [Email] Attempt ${attempt} — Sending to: ${mailOptions.to}`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ [Email] SUCCESS — Message ID: ${info.messageId}`);
        console.log(`   Accepted: ${info.accepted}`);
        console.log(`   Response: ${info.response}\n`);
        return info;
    } catch (err) {
        console.error(`❌ [Email] FAILED on attempt ${attempt} — Error: ${err.message}`);
        if (attempt < maxRetries) {
            console.log(`🔁 [Email] Retrying in 2 seconds... (attempt ${attempt + 1}/${maxRetries})`);
            await new Promise(r => setTimeout(r, 2000));
            return sendWithRetry(transporter, mailOptions, attempt + 1);
        }
        throw err; // All retries exhausted — propagate error
    }
};

// ─── Controller ─────────────────────────────────────────────────────────────
exports.sendHelpRequest = async (req, res) => {
    const { message, userEmail, userName } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ message: 'Message body is required.' });
    }

    const credentialsConfigured =
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASS &&
        process.env.EMAIL_PASS !== 'your_16_character_app_password_here';

    if (!credentialsConfigured) {
        console.warn('\n⚠️  [Email] SMTP credentials not configured in .env');
        console.warn('   Set EMAIL_USER and EMAIL_PASS to send real emails.\n');
        console.log('─────────────────────────────────────────────────────');
        console.log(`📩  [MOCK EMAIL]`);
        console.log(`   To     : ${process.env.EMAIL_TO || 'nutraguidehelp@gmail.com'}`);
        console.log(`   From   : ${userName || 'User'} <${userEmail || 'unknown'}>`);
        console.log(`   Subject: NutriGuide Support Request`);
        console.log(`   Body   :\n${message}`);
        console.log('─────────────────────────────────────────────────────\n');
        return res.status(200).json({ message: 'Email logged (mock mode — configure SMTP credentials to send real emails)' });
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || `NutriGuide Support <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO || 'nutraguidehelp@gmail.com',
        subject: `NutriGuide Support Request from ${userName || 'User'}`,
        text: [
            `────────────────────────────────────`,
            `  NutriGuide Support Request`,
            `────────────────────────────────────`,
            `Sender Name  : ${userName || 'Unknown'}`,
            `Sender Email : ${userEmail || 'Unknown'}`,
            ``,
            `Message:`,
            message,
            `────────────────────────────────────`
        ].join('\n')
    };

    try {
        const transporter = createTransporter();

        // Verify SMTP connection before sending
        console.log(`\n🔌 [SMTP] Verifying connection to ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}...`);
        await transporter.verify();
        console.log(`✅ [SMTP] Connection verified successfully.`);

        await sendWithRetry(transporter, mailOptions);
        res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error('\n💥 [Email] All retries exhausted. Final error:');
        console.error(`   Code   : ${error.code || 'N/A'}`);
        console.error(`   Message: ${error.message}`);
        console.error(`   Stack  : ${error.stack}\n`);

        let userMessage = 'Failed to send email. Please try again later.';
        if (error.code === 'EAUTH') userMessage = 'Email authentication failed. Check SMTP credentials in .env.';
        else if (error.code === 'ECONNECTION') userMessage = 'Could not connect to mail server. Check SMTP host/port.';
        else if (error.code === 'ETIMEDOUT') userMessage = 'Connection timed out. Check your network or SMTP settings.';

        res.status(500).json({ message: userMessage, error: error.message });
    }
};
