"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Initialize EmailJS (replace with your public key)
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "");

const contactInfo = [
    {
        icon: Mail,
        title: "Email",
        value: "contact@flashrend.site",
        href: "mailto:contact@flashrend.site",
    },
    {
        icon: Phone,
        title: "Téléphone",
        value: "+33 (0)1 23 45 67 89",
        href: "tel:+33123456789",
    },
    {
        icon: MapPin,
        title: "Adresse",
        value: "123 Avenue de la Crypto, 75000 Paris, France",
        href: "#",
    },
];

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactSection() {
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>();

    const onSubmit = async (data: ContactFormData) => {
        if (
            !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
            !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
        ) {
            toast.error("Configuration EmailJS manquante");
            return;
        }

        setIsLoading(true);
        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                {
                    to_email: "contact@flashrend.site",
                    from_name: data.name,
                    from_email: data.email,
                    subject: data.subject,
                    message: data.message,
                },
            );
            toast.success(
                "Message envoyé avec succès! Nous vous répondrons bientôt.",
            );
            reset();
        } catch (error) {
            console.error("Erreur EmailJS:", error);
            toast.error("Une erreur s'est produite. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-20 mt-20" id="contact">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Centered */}
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        Contactez-nous
                    </Badge>

                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
                        Nous sommes là pour{" "}
                        <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            vous aider
                        </span>
                    </h2>

                    <p className="text-sm lg:text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                        Vous avez des questions ? Notre équipe est disponible
                        24/7 pour répondre à vos demandes.
                    </p>
                </div>

                {/* Contact Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon;
                            return (
                                <Card
                                    key={index}
                                    className="hover:shadow-lg transition-shadow"
                                >
                                    <CardContent>
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-lg bg-linear-to-r from-amber-500/20 to-orange-600/20">
                                                <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold mb-1">
                                                    {info.title}
                                                </h3>
                                                <a
                                                    href={info.href}
                                                    className="text-foreground/70 hover:text-foreground transition-colors text-sm"
                                                >
                                                    {info.value}
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {/* Response Time Info */}
                        <Card className="bg-linear-to-r from-amber-500/10 to-orange-600/10 border-amber-200/20">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Temps de réponse
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground/70 text-sm">
                                    Notre équipe s'engage à répondre à vos
                                    messages dans les{" "}
                                    <span className="font-semibold text-amber-600">
                                        24 heures
                                    </span>
                                    .
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Envoyez-nous un message</CardTitle>
                            <CardDescription>
                                Remplissez le formulaire et nous vous répondrons
                                au plus tôt.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Nom complet
                                    </label>
                                    <Input
                                        placeholder="Votre nom"
                                        {...register("name", {
                                            required: "Le nom est requis",
                                            minLength: {
                                                value: 2,
                                                message:
                                                    "Le nom doit contenir au moins 2 caractères",
                                            },
                                        })}
                                        disabled={isLoading}
                                        className={
                                            errors.name ? "border-red-500" : ""
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="votre.email@exemple.com"
                                        {...register("email", {
                                            required: "L'email est requis",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message:
                                                    "Veuillez entrer un email valide",
                                            },
                                        })}
                                        disabled={isLoading}
                                        className={
                                            errors.email ? "border-red-500" : ""
                                        }
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Sujet
                                    </label>
                                    <Input
                                        placeholder="Sujet de votre message"
                                        {...register("subject", {
                                            required: "Le sujet est requis",
                                            minLength: {
                                                value: 3,
                                                message:
                                                    "Le sujet doit contenir au moins 3 caractères",
                                            },
                                        })}
                                        disabled={isLoading}
                                        className={
                                            errors.subject
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.subject && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.subject.message}
                                        </p>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Message
                                    </label>
                                    <Textarea
                                        placeholder="Votre message..."
                                        rows={5}
                                        {...register("message", {
                                            required: "Le message est requis",
                                            minLength: {
                                                value: 10,
                                                message:
                                                    "Le message doit contenir au moins 10 caractères",
                                            },
                                        })}
                                        disabled={isLoading}
                                        className={
                                            errors.message
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.message.message}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Envoyer le message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
