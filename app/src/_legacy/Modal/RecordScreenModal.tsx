import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import { Button } from "@/components/buttons";
import { Heading } from "@/components/Heading";

const RecordScreenModal = () => {
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

    useEffect(() => {
        const listener = () => setIsRecordModalOpen(true);

        // window.ipcRenderer.on("menu:record-actions", listener);

        // return () => {
        //     window.ipcRenderer.off("menu:record-actions", listener);
        // };
    }, []);

    return (
        <BaseModal
            isOpen={isRecordModalOpen}
            onClose={() => setIsRecordModalOpen(false)}
        >
            <Heading level={2}>Привет!</Heading>
            <p className="text-gray-600 mb-4">
                Это модальное окно с затемнением.
            </p>
            <Button
                variant="primary"
                onClick={() => setIsRecordModalOpen(false)}
            >
                Закрыть
            </Button>
        </BaseModal>
    );
};

export default RecordScreenModal;
