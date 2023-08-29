"use client"

import { useEffect, useState } from "react"
import { Modal } from "@/components/ui/model"
import { Button } from "@/components/ui/button"

interface AlertModalProps {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => {},
    loading: boolean
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) {
        null
    }

    return (
        <Modal
            title="Are you sure you want to delete this store?"
            description="The action cannot be undone"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full" >
                <Button disabled={loading} variant={'outline'} onClick={onClose} >
                    Cancel
                </Button>
                <Button disabled={loading} variant={"destructive"} onClick={onConfirm} >
                    Continue
                </Button>
            </div>
        </Modal>
    )
}

