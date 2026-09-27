import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAILS = ["hermannrichy15@gmail.com", "danielmore12@icloud.com"];
const FROM_EMAIL = `FlashRend Team <${process.env.RESEND_FROM_EMAIL || "contact@flashrend.site"}>`;

type User = {
    email: string;
    firstName: string | null;
    lastName: string | null;
};

type Deposit = {
    id: string;
    amount: number;
    reference: string;
    transferDate: Date;
    adminNote?: string | null;
};

type Withdrawal = {
    id: string;
    amount: number;
    adminNote?: string | null;
};

type Investment = {
    id: string;
    amount: number;
    multiplier: number;
    potentialReturn: number;
    endsAt: Date;
};

// Email de bienvenue
export async function sendWelcomeEmail(user: User) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: "Bienvenue sur FlashRend ! 🎉",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://flashrend.site/logo.png" alt="FlashRend" style="height: 44px; margin-bottom: 12px;" />
                            <h1>Bienvenue sur FlashRend !</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour ${user.firstName || ""}${user.firstName && user.lastName ? " " + user.lastName : ""},</p>
                            
                            <p>Nous sommes ravis de vous accueillir sur <strong>FlashRend</strong>, votre plateforme d'investissement de confiance !</p>
                            
                            <p>Voici ce que vous pouvez faire dès maintenant :</p>
                            <ul>
                                <li>🎁 <strong>Réclamez votre bonus de bienvenue</strong> de 5€</li>
                                <li>💰 Effectuez votre premier dépôt par virement bancaire</li>
                                <li>📈 Lancez votre premier investissement</li>
                                <li>💸 Suivez vos gains en temps réel</li>
                            </ul>
                            
                            <p style="text-align: center;">
                                <a href="https://flashrend.site/account" class="button">Accéder à mon compte</a>
                            </p>
                            
                            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
                            
                            <p>Bonne chance dans vos investissements ! 🚀</p>
                            
                            <p>L'équipe FlashRend</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 FlashRend. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
}

// Dépôt soumis - Email utilisateur
export async function sendDepositSubmittedEmail(user: User, deposit: Deposit) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: "Dépôt en cours de traitement 💰",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://flashrend.site/logo.png" alt="FlashRend" style="height: 44px; margin-bottom: 12px;" />
                            <h1>Dépôt reçu !</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour ${user.firstName || ""}${user.firstName && user.lastName ? " " + user.lastName : ""},</p>
                            
                            <p>Nous avons bien reçu votre demande de dépôt par virement bancaire.</p>
                            
                            <div class="info-box">
                                <p><strong>Montant :</strong> ${deposit.amount.toFixed(2)}€</p>
                                <p><strong>Référence :</strong> ${deposit.reference}</p>
                                <p><strong>Date du virement :</strong> ${new Date(deposit.transferDate).toLocaleDateString("fr-FR")}</p>
                            </div>
                            
                            <p>Votre demande est en cours de vérification par notre équipe. Vous recevrez un email de confirmation dès que votre compte sera crédité.</p>
                            
                            <p><strong>Délai de traitement :</strong> généralement sous 24-48h ouvrées.</p>
                            
                            <p>Merci de votre confiance !</p>
                            
                            <p>L'équipe FlashRend</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 FlashRend. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Deposit submitted email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending deposit submitted email:", error);
    }
}

// Dépôt approuvé - Email utilisateur
export async function sendDepositApprovedEmail(user: User, deposit: Deposit) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: "Dépôt approuvé - Compte crédité ✅",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }
                        .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://flashrend.site/logo.png" alt="FlashRend" style="height: 44px; margin-bottom: 12px;" />
                            <h1>✅ Dépôt approuvé !</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour ${user.firstName || ""}${user.firstName && user.lastName ? " " + user.lastName : ""},</p>
                            
                            <p>Excellente nouvelle ! Votre dépôt a été approuvé et votre compte a été crédité.</p>
                            
                            <div class="info-box">
                                <p><strong>Montant crédité :</strong> ${deposit.amount.toFixed(2)}€</p>
                                <p><strong>Référence :</strong> ${deposit.reference}</p>
                            </div>
                            
                            ${deposit.adminNote ? `<p><strong>Note de l'administrateur :</strong> ${deposit.adminNote}</p>` : ""}
                            
                            <p>Vous pouvez maintenant utiliser ces fonds pour lancer vos investissements !</p>
                            
                            <p style="text-align: center;">
                                <a href="https://flashrend.site/account/investments" class="button">Commencer à investir</a>
                            </p>
                            
                            <p>Bonne chance dans vos investissements ! 🚀</p>
                            
                            <p>L'équipe FlashRend</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 FlashRend. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Deposit approved email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending deposit approved email:", error);
    }
}

// Dépôt rejeté - Email utilisateur
export async function sendDepositRejectedEmail(user: User, deposit: Deposit) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: "Dépôt non validé ❌",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://flashrend.site/logo.png" alt="FlashRend" style="height: 44px; margin-bottom: 12px;" />
                            <h1>Dépôt non validé</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour ${user.firstName || ""}${user.firstName && user.lastName ? " " + user.lastName : ""},</p>
                            
                            <p>Malheureusement, votre demande de dépôt n'a pas pu être validée.</p>
                            
                            <div class="info-box">
                                <p><strong>Montant :</strong> ${deposit.amount.toFixed(2)}€</p>
                                <p><strong>Référence :</strong> ${deposit.reference}</p>
                            </div>
                            
                            ${deposit.adminNote ? `<p><strong>Raison :</strong> ${deposit.adminNote}</p>` : ""}
                            
                            <p>Si vous pensez qu'il s'agit d'une erreur ou si vous avez des questions, n'hésitez pas à nous contacter à ${FROM_EMAIL}.</p>
                            
                            <p>Cordialement,</p>
                            <p>L'équipe FlashRend</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 FlashRend. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Deposit rejected email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending deposit rejected email:", error);
    }
}

// Notification admin - Nouveau dépôt
export async function sendAdminDepositNotification(user: User, deposit: Deposit) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAILS,
            subject: `🔔 Nouveau dépôt - ${deposit.amount.toFixed(2)}€`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; }
                        .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://flashrend.site/logo.png" alt="FlashRend" style="height: 44px; margin-bottom: 12px;" />
                            <h1>🔔 Nouveau dépôt</h1>
                        </div>
                        <div class="content">
                            <p>Un nouveau dépôt par virement bancaire a été soumis.</p>
                            
                            <div class="info-box">
                                <p><strong>Utilisateur :</strong> ${user.firstName || ""} ${user.lastName || ""} (${user.email})</p>
                                <p><strong>Montant :</strong> ${deposit.amount.toFixed(2)}€</p>
                                <p><strong>Référence :</strong> ${deposit.reference}</p>
                                <p><strong>Date du virement :</strong> ${new Date(deposit.transferDate).toLocaleDateString("fr-FR")}</p>
                                <p><strong>ID du dépôt :</strong> ${deposit.id}</p>
                            </div>
                            
                            <p style="text-align: center;">
                                <a href="https://flashrend.site/admin/bank-transfers" class="button">Gérer les dépôts</a>
                            </p>
                        </div>
                        <div class="footer">
                            <p>© 2026 FlashRend - Notification Admin</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Admin deposit notification sent`);
    } catch (error) {
        console.error("Error sending admin deposit notification:", error);
    }
}

// Investissement créé - Email utilisateur
export async function sendInvestmentCreatedEmail(user: User, investment: Investment) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: "Investissement lancé ! 📈",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; }
                        .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://flashrend.site/logo.png" alt="FlashRend" style="height: 44px; margin-bottom: 12px;" />
                            <h1>📈 Investissement lancé !</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour ${user.firstName || ""}${user.firstName && user.lastName ? " " + user.lastName : ""},</p>
                            
                            <p>Votre investissement a été lancé avec succès !</p>
                            
                            <div class="info-box">
                                <p><strong>Montant investi :</strong> ${investment.amount.toFixed(2)}€</p>
                                <p><strong>Multiplicateur :</strong> x${investment.multiplier}</p>
                                <p><strong>Retour potentiel :</strong> ${investment.potentialReturn.toFixed(2)}€</p>
                                <p><strong>Date de fin :</strong> ${new Date(investment.endsAt).toLocaleDateString("fr-FR")} à ${new Date(investment.endsAt).toLocaleTimeString("fr-FR")}</p>
                            </div>
                            
                            <p>Vous recevrez un email lorsque votre investissement sera terminé et que les fonds seront crédités sur votre compte.</p>
                            
                            <p style="text-align: center;">
                                <a href="https://flashrend.site/account/investments/performance" class="button">Suivre mes investissements</a>
                            </p>
                            
                            <p>Bonne chance ! 🚀</p>
                            
                            <p>L'équipe FlashRend</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 FlashRend. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Investment created email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending investment created email:", error);
    }
}

// Investissement terminé - Email utilisateur
export async function sendInvestmentCompletedEmail(user: User, investment: Investment) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: "Investissement terminé - Gains crédités ! 🎉",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }
                        .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                        .highlight { font-size: 24px; color: #10b981; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://flashrend.site/logo.png" alt="FlashRend" style="height: 44px; margin-bottom: 12px;" />
                            <h1>🎉 Félicitations !</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour ${user.firstName || ""}${user.firstName && user.lastName ? " " + user.lastName : ""},</p>
                            
                            <p>Excellente nouvelle ! Votre investissement est terminé et vos gains ont été crédités sur votre compte.</p>
                            
                            <div class="info-box">
                                <p><strong>Montant investi :</strong> ${investment.amount.toFixed(2)}€</p>
                                <p><strong>Multiplicateur :</strong> x${investment.multiplier}</p>
                                <p class="highlight">Montant crédité : ${investment.potentialReturn.toFixed(2)}€</p>
                                <p><strong>Gain :</strong> +${(investment.potentialReturn - investment.amount).toFixed(2)}€</p>
                            </div>
                            
                            <p>Vous pouvez maintenant réinvestir ces fonds ou demander un retrait !</p>
                            
                            <p style="text-align: center;">
                                <a href="https://flashrend.site/account" class="button">Voir mon compte</a>
                            </p>
                            
                            <p>Merci de votre confiance ! 🚀</p>
                            
                            <p>L'équipe FlashRend</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 FlashRend. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Investment completed email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending investment completed email:", error);
    }
}

// Retrait demandé - Email utilisateur
export async function sendWithdrawalRequestedEmail(user: User, withdrawal: Withdrawal) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: "Demande de retrait en cours de traitement 💸",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://flashrend.site/logo.png" alt="FlashRend" style="height: 44px; margin-bottom: 12px;" />
                            <h1>Demande de retrait reçue !</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour ${user.firstName || ""}${user.firstName && user.lastName ? " " + user.lastName : ""},</p>
                            
                            <p>Nous avons bien reçu votre demande de retrait.</p>
                            
                            <div class="info-box">
                                <p><strong>Montant :</strong> ${withdrawal.amount.toFixed(2)}€</p>
                            </div>
                            
                            <p>Votre demande est en cours de vérification par notre équipe. Vous recevrez un email de confirmation dès que le retrait sera traité.</p>
                            
                            <p><strong>Délai de traitement :</strong> généralement sous 24-48h ouvrées.</p>
                            
                            <p>Merci de votre confiance !</p>
                            
                            <p>L'équipe FlashRend</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 FlashRend. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Withdrawal requested email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending withdrawal requested email:", error);
    }
}

// Retrait approuvé - Email utilisateur
export async function sendWithdrawalApprovedEmail(user: User, withdrawal: Withdrawal) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: "Retrait approuvé - En cours de traitement ✅",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://flashrend.site/logo.png" alt="FlashRend" style="height: 44px; margin-bottom: 12px;" />
                            <h1>✅ Retrait approuvé !</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour ${user.firstName || ""}${user.firstName && user.lastName ? " " + user.lastName : ""},</p>
                            
                            <p>Excellente nouvelle ! Votre demande de retrait a été approuvée.</p>
                            
                            <div class="info-box">
                                <p><strong>Montant :</strong> ${withdrawal.amount.toFixed(2)}€</p>
                            </div>
                            
                            ${withdrawal.adminNote ? `<p><strong>Note de l'administrateur :</strong> ${withdrawal.adminNote}</p>` : ""}
                            
                            <p>Le virement sera effectué sous 2-5 jours ouvrés vers votre compte bancaire enregistré.</p>
                            
                            <p>Merci de votre confiance !</p>
                            
                            <p>L'équipe FlashRend</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 FlashRend. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Withdrawal approved email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending withdrawal approved email:", error);
    }
}

// Retrait rejeté - Email utilisateur
export async function sendWithdrawalRejectedEmail(user: User, withdrawal: Withdrawal) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: "Demande de retrait refusée ❌",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://flashrend.site/logo.png" alt="FlashRend" style="height: 44px; margin-bottom: 12px;" />
                            <h1>Demande de retrait refusée</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour ${user.firstName || ""}${user.firstName && user.lastName ? " " + user.lastName : ""},</p>
                            
                            <p>Malheureusement, votre demande de retrait n'a pas pu être validée.</p>
                            
                            <div class="info-box">
                                <p><strong>Montant :</strong> ${withdrawal.amount.toFixed(2)}€</p>
                            </div>
                            
                            ${withdrawal.adminNote ? `<p><strong>Raison :</strong> ${withdrawal.adminNote}</p>` : ""}
                            
                            <p>Les fonds ont été recrédités sur votre compte FlashRend.</p>
                            
                            <p>Si vous pensez qu'il s'agit d'une erreur ou si vous avez des questions, n'hésitez pas à nous contacter.</p>
                            
                            <p>Cordialement,</p>
                            <p>L'équipe FlashRend</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 FlashRend. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Withdrawal rejected email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending withdrawal rejected email:", error);
    }
}

// Message personnalisé envoyé par un admin
export async function sendAdminMessageEmail(
    recipient: { email: string; firstName?: string | null },
    subject: string,
    message: string
) {
    try {
        const paragraphs = message
            .split(/\n{2,}/)
            .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
            .join("");

        await resend.emails.send({
            from: FROM_EMAIL,
            to: recipient.email,
            subject,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .message-box { background: white; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://flashrend.site/logo.png" alt="FlashRend" style="height: 44px; margin-bottom: 12px;" />
                            <h1>Message de l'équipe FlashRend</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour ${recipient.firstName || ""},</p>

                            <div class="message-box">
                                ${paragraphs}
                            </div>

                            <p>Cordialement,</p>
                            <p>L'équipe FlashRend</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 FlashRend. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Admin message email sent to ${recipient.email}`);
    } catch (error) {
        console.error("Error sending admin message email:", error);
        throw error;
    }
}

// Notification admin - Nouveau retrait
export async function sendAdminWithdrawalNotification(user: User, withdrawal: Withdrawal) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAILS,
            subject: `🔔 Nouvelle demande de retrait - ${withdrawal.amount.toFixed(2)}€`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; }
                        .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://flashrend.site/logo.png" alt="FlashRend" style="height: 44px; margin-bottom: 12px;" />
                            <h1>🔔 Nouvelle demande de retrait</h1>
                        </div>
                        <div class="content">
                            <p>Une nouvelle demande de retrait a été soumise.</p>
                            
                            <div class="info-box">
                                <p><strong>Utilisateur :</strong> ${user.firstName || ""} ${user.lastName || ""} (${user.email})</p>
                                <p><strong>Montant :</strong> ${withdrawal.amount.toFixed(2)}€</p>
                                <p><strong>ID du retrait :</strong> ${withdrawal.id}</p>
                            </div>
                            
                            <p style="text-align: center;">
                                <a href="https://flashrend.site/admin/transactions" class="button">Gérer les retraits</a>
                            </p>
                        </div>
                        <div class="footer">
                            <p>© 2026 FlashRend - Notification Admin</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Admin withdrawal notification sent`);
    } catch (error) {
        console.error("Error sending admin withdrawal notification:", error);
    }
}
