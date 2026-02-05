import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvestmentHistoryClient from "@/components/account/investment-history-client";

export default function InvestmentHistoryPage() {
    return (
        <div className="container mx-auto px-4 py-8">
             <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Historique</h1>
                <p className="text-muted-foreground">
                    Retrouvez tous vos investissements passés et en cours.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Mes Placements</CardTitle>
                </CardHeader>
                <CardContent>
                    <InvestmentHistoryClient />
                </CardContent>
            </Card>
        </div>
    );
}
