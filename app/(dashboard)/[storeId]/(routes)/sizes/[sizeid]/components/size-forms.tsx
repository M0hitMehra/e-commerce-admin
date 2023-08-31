"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Size } from "@prisma/client"
import { Trash } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import { useOrigin } from "@/hooks/use-origin"
import { ImageUpload } from "@/components/ui/image-upload"

interface SizeFormProps {
    initalData: Size | null
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1)
})

type SizeFormValues = z.infer<typeof formSchema>

const SizeForm: React.FC<SizeFormProps> = ({
    initalData
}) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initalData ? "Edit Sizes" : "Create Sizes"
    const description = initalData ? "Edit a size" : "Add a new Size"
    const toastMessage = initalData ? "Size updated" : "Size created"
    const action = initalData ? "Save changes" : "Create"

    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initalData || {
            name: '',
            value: ''
        }
    })

    const onSubmit = async (data: SizeFormValues) => {
        try {
            setLoading(true)
            if (initalData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeid}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, data)

            }
            router.refresh()
            router.push(`/${params.storeId}/sizes`)
            toast.success(toastMessage)

        } catch (error) {
            toast.error("Error - Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeid}`)
            router.refresh()
            router.push(`/${params.storeId}/sizes`)
            toast.success("Size deleted successfully")

        } catch (error) {
            toast.error("Error - Make sure you removed all Product for this size first.")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }
    const origin = useOrigin()
    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between" >
                <Heading title={title} description={description} />
                {initalData && <Button disabled={loading} variant={"destructive"} size={"icon"} onClick={() => setOpen(true)} >
                    <Trash className="h-4 w-4" />
                </Button>}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full" >

                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Size name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)
                            }
                        />
                           <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Size Value" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)
                            }
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit" >
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default SizeForm









