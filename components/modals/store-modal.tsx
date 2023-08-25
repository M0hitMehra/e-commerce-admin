"use client";
import * as z from "zod"

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../ui/model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from 'axios'
import { toast } from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {
    const storeModal = useStoreModal()
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
            setLoading(true)
            const { data } = await axios.post('/api/stores', values)
            toast.success("Store created successfully")
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false);
        }
    }
    return (
        <Modal title="Create Store" description="Add a new store to manage products and categories"
            isOpen={storeModal.isOpen} onClose={storeModal.onClose}>
            <div>
                <div className="space-y-4 py-2 pb-4" >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} >
                            < FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="E-commerce" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-x-2 pt-6 w-full flex items-center justify-end">
                                <Button disabled={loading} variant={"outline"} onClick={storeModal.onClose} >Cancel</Button>
                                <Button disabled={loading} type="submit">Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}