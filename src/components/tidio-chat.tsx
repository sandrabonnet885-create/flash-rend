"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        tidioChatApi?: {
            show: () => void;
            hide: () => void;
            open: () => void;
            close: () => void;
            on: (event: string, callback: () => void) => void;
        };
    }
}

export default function TidioChat() {
    useEffect(() => {
        // Only load Tidio if the public key is configured
        const tidioKey = process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY;
        
        if (!tidioKey) {
            console.warn("Tidio public key not configured. Chat widget will not load.");
            return;
        }

        // Check if script is already loaded
        if (document.getElementById("tidio-chat-script")) {
            return;
        }

        // Create and inject Tidio script
        const script = document.createElement("script");
        script.id = "tidio-chat-script";
        script.src = `//code.tidio.co/${tidioKey}.js`;
        script.async = true;

        // Optional: Add event listener for when Tidio is ready
        script.onload = () => {
            console.log("Tidio chat loaded successfully");
            
            // You can customize Tidio behavior here
            // Example: Hide chat on certain pages
            // if (window.tidioChatApi) {
            //     window.tidioChatApi.hide();
            // }
        };

        script.onerror = () => {
            console.error("Failed to load Tidio chat widget");
        };

        document.body.appendChild(script);

        // Cleanup function
        return () => {
            const existingScript = document.getElementById("tidio-chat-script");
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    // This component doesn't render anything visible
    // The Tidio widget is injected by the script
    return null;
}
