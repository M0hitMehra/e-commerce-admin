import prismadb from "@/lib/prismadb"
import BillboardForm from "./components/billboard-forms"



type Props = {}

const BillboardPage = async ({
    params
}: {
    params: { billboardid: string }
}) => {
    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: params.billboardid
        }
    })
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6' >
                <BillboardForm initalData={billboard} />   
            </div>
        </div>
    )
}

export default BillboardPage