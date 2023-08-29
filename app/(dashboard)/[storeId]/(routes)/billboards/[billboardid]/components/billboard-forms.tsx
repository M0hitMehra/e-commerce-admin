"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Billboard } from "@prisma/client"
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

interface BillboardFormProps {
    initalData: Billboard | null
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})

type BillboardFormValues = z.infer<typeof formSchema>

const BillboardForm: React.FC<BillboardFormProps> = ({
    initalData
}) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initalData ? "Edit Billboard" : "Create Billboard"
    const description = initalData ? "Edit a billboard" : "Add a new Billboard"
    const toastMessage = initalData ? "Billboard updated" : "Billboard created"
    const action = initalData ? "Save changes" : "Create"

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initalData || {
            label: '',
            imageUrl: ''
        }
    })

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true)
            if(initalData){
                 await axios.patch(`/api/${params.storeId}/billboards/${params.billboardid}`, data)
            }else{
               await axios.post(`/api/${params.storeId}/billboards`, data)

            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardid}`)
            router.refresh()
            router.push('/')
            toast.success("Billboard deleted successfully")

        } catch (error) {
            toast.error("Error - Make sure you removed all categories for this billboard first.")
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

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>)
                        }
                    />

                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Billboard label" {...field} />
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
            <Separator />
        </>
    )
}

export default BillboardForm









