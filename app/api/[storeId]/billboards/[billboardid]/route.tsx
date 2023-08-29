import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";




export async function GET(req: Request, { params }: { params: { billboardid: string } }) {
    try {
        if (!params.billboardid) return new NextResponse("Billboard Id is required", { status: 400 })

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardid,
            }
        })
        return NextResponse.json(billboard)
    } catch (error) {
        console.log('[Billboard_GET]', error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


export async function PATCH(req: Request, { params }: { params: { storeId: string, billboardid: string } }) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const { label, imageUrl } = body
        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!label) return new NextResponse("Label is required", { status: 400 })
        if (!imageUrl) return new NextResponse("Image url is required", { status: 400 })
        if (!params.billboardid) return new NextResponse("Store Id is required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardid,
            },
            data: {
                label,
                imageUrl
            }
        })
        return NextResponse.json(billboard)
    } catch (error) {
        console.log('[Billboard_PATCH]', error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: { storeId: string, billboardid: string } }) {
    try {
        const { userId } = auth()
        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.billboardid) return new NextResponse("Billboard Id is required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardid,
            }
        })
        return new NextResponse("Billboard deleted successfully", { status: 200 })
    } catch (error) {
        console.log('[Billboard_DELETE]', error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}