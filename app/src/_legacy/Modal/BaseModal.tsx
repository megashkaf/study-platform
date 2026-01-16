import React from "react";
import { Button } from "@/components/buttons";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const BaseModal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            aria-modal="true"
            role="dialog"
        >
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-lg p-6 w-96 z-10">
                {children}
                <Button
                    onClick={onClose}
                    variant={"transparent"}
                    size={"sm"}
                    borderRadius={"pill"}
                    className="absolute top-2 right-2"
                >
                    ✕
                </Button>
            </div>
        </div>
    );
};

export default BaseModal;
