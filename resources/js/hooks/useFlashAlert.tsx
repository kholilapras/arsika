import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

type FlashType = {
    success?: string;
    error?: string;
};

export function useFlashAlert(flash: FlashType, duration: number = 3000) {
    const [visible, setVisible] = useState(false);
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setKey((prev) => prev + 1);
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [flash, duration]);

    const FlashAlert = () => {
        if (!visible) return null;

        return (
            <div key={key} className="fixed top-2 right-2 z-50 space-y-2 animate-fade-in">
                {flash.success && (
                    <Alert>
                        <CheckCircle2 />
                        <div>
                            <AlertTitle>Berhasil</AlertTitle>
                            <AlertDescription>{flash.success}</AlertDescription>
                        </div>
                    </Alert>
                )}
                {flash.error && (
                    <Alert>
                        <AlertCircle />
                        <div>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{flash.error}</AlertDescription>
                        </div>
                    </Alert>
                )}
            </div>
        );
    };

    return { FlashAlert };
}
