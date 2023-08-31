import prismadb from "@/lib/prismadb"
import SizeForm from "./components/size-forms"



type Props = {}

const SizePage = async ({
    params
}: {
    params: { sizeid: string }
}) => {
    const size = await prismadb.size.findUnique({
        where: {
            id: params.sizeid
        }
    })
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6' >
                <SizeForm initalData={size} />   
            </div>
        </div>
    )
}

export default SizePage