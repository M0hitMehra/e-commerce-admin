import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const { label, imageUrl } = body
        if (!userId) return new NextResponse("Unauthenicated", { status: 401 })
        if (!label) return new NextResponse("Label is required", { status: 400 })
        if (!imageUrl) return new NextResponse("Image is required", { status: 400 })
        if (!params.storeId) return new NextResponse("Store Id is required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                userId,
                id: params.storeId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })
        return NextResponse.json(billboard)
    } catch (error) {
        console.log('[Billboards_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {

        if (!params.storeId) return new NextResponse("Store Id is required", { status: 400 })

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(billboards)
    } catch (error) {
        console.log('[Billboards_GET]', error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}