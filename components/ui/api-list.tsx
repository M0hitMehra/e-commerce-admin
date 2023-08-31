"use client"

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "@/components/ui/api-alert";

interface ApiListProps {
    entityName: string;
    entityIdName: string;
}

export const ApiList: React.FC<ApiListProps> = ({
    entityIdName,
    entityName
}) => {
    const params = useParams()
    const origin = useOrigin()

    const base_url = `${origin}/api/${params.storeId}`
    return (
        <div>
            <ApiAlert
                title="GET"
                variant="public"
                description={`${base_url}/${entityName}`}
            />

            <ApiAlert
                title="GET"
                variant="public"
                description={`${base_url}/${entityName}/{${entityIdName}}`}
            />

            <ApiAlert
                title="POST"
                variant="admin"
                description={`${base_url}/${entityName}`}
            />

            <ApiAlert
                title="PATCH"
                variant="admin"
                description={`${base_url}/${entityName}/{${entityIdName}}`}
            />

            <ApiAlert
                title="DELETE"
                variant="admin"
                description={`${base_url}/${entityName}/{${entityIdName}}`}
            />
        </div>
    )
}