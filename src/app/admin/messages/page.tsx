"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, Send } from "lucide-react";
import { toast } from "sonner";

type User = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
};

export default function AdminMessagesPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [recipientMode, setRecipientMode] = useState<"user" | "custom">("user");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [customEmail, setCustomEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/admin/users/list");
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (recipientMode === "user" && !selectedUserId) {
            toast.error("Veuillez sélectionner un utilisateur");
            return;
        }
        if (recipientMode === "custom" && !customEmail.trim()) {
            toast.error("Veuillez renseigner une adresse email");
            return;
        }

        setIsSending(true);
        try {
            const response = await fetch("/api/admin/send-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: recipientMode === "user" ? selectedUserId : undefined,
                    email: recipientMode === "custom" ? customEmail.trim() : undefined,
                    subject,
                    message,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Email envoyé avec succès");
                setSubject("");
                setMessage("");
                setSelectedUserId("");
                setCustomEmail("");
            } else {
                toast.error(data.error || "Erreur lors de l'envoi");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Erreur serveur");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Envoyer un email</h1>
                <p className="text-foreground/60 mt-1">
                    Envoyez un message par email à un utilisateur ou à une adresse personnalisée
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Nouveau message
                    </CardTitle>
                    <CardDescription>
                        Le message sera encapsulé dans le template email officiel FlashRend
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Destinataire</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={recipientMode === "user" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setRecipientMode("user")}
                                >
                                    Utilisateur existant
                                </Button>
                                <Button
                                    type="button"
                                    variant={recipientMode === "custom" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setRecipientMode("custom")}
                                >
                                    Adresse personnalisée
                                </Button>
                            </div>
                        </div>

                        {recipientMode === "user" ? (
                            <div className="space-y-2">
                                <Label htmlFor="user">Utilisateur *</Label>
                                {isLoadingUsers ? (
                                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Chargement des utilisateurs...
                                    </div>
                                ) : (
                                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                        <SelectTrigger id="user" className="w-full">
                                            <SelectValue placeholder="Sélectionnez un utilisateur" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((u) => (
                                                <SelectItem key={u.id} value={u.id}>
                                                    {u.firstName} {u.lastName} ({u.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="customEmail">Adresse email *</Label>
                                <Input
                                    id="customEmail"
                                    type="email"
                                    value={customEmail}
                                    onChange={(e) => setCustomEmail(e.target.value)}
                                    placeholder="exemple@email.com"
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="subject">Sujet *</Label>
                            <Input
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Objet de l'email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Rédigez votre message ici..."
                                rows={8}
                                required
                            />
                            <p className="text-xs text-foreground/60">
                                Le message sera automatiquement inséré dans le template email FlashRend
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" disabled={isSending} className="w-full sm:w-auto">
                                {isSending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Envoyer l&apos;email
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
