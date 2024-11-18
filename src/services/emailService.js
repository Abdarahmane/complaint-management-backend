import nodemailer from 'nodemailer';

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Fonction pour envoyer un email de bienvenue
export const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Welcome to Our Service!',
            text: `Hello ${userName},\n\nThank you for registering on our platform. We are excited to have you with us!`
        };

        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent to', userEmail);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
};
