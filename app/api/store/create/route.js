import imagekit, { toFile } from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// create the store
export async function POST(request){
    try {
        const { userId } = getAuth(request)
        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get the data from the form
        const formData = await request.formData()

        const name = formData.get("name")
        const rawUsername = formData.get("username")
        const username = typeof rawUsername === 'string' ? rawUsername.trim() : ''
        const description = formData.get("description")
        const email = formData.get("email")
        const contact = formData.get("contact")
        const address = formData.get("address")
        const image = formData.get("image")

        if(!name || !username || !description || !email || !contact || !address || !image){
            return NextResponse.json({error: "missing store info"}, {status: 400})
        }

        // ensure the Clerk user exists in Prisma before creating a Store
        await prisma.user.upsert({
            where: { id: userId },
            create: {
                id: userId,
                email: "",
                name: "",
                image: "",
            },
            update: {},
        })

        // check is user have already registered a store
        const store = await prisma.store.findFirst({
            where: { userId: userId}
        })

        // if store is already registered then send status of store
        if(store){
            return NextResponse.json({status: store.status})
        }

        // check is username is already taken
        const isUsernameTaken = await prisma.store.findFirst({
            where: { username: username.toLowerCase() }
        })

        if(isUsernameTaken){
            return NextResponse.json({error: "username already taken"}, {status: 400})
        }

        // image upload to imagekit
        let response
        try {
            response = await imagekit.files.upload({
                file: await toFile(Buffer.from(await image.arrayBuffer()), image.name),
                fileName: image.name,
                folder: "logos"
            })
        } catch (uploadError) {
            console.error('ImageKit upload failed', uploadError)
            return NextResponse.json({ error: 'Image upload failed', details: uploadError.message || String(uploadError) }, { status: 500 })
        }

        const optimizedImage = imagekit.helper.buildSrc({
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
            src: response.filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: '512' }
            ]
        })

        let newStore
        try {
            newStore = await prisma.store.create({
                data: {
                    userId,
                    name,
                    description,
                    username: username.toLowerCase(),
                    email,
                    contact,
                    address,
                    logo: optimizedImage
                }
            })
        } catch (storeError) {
            console.error('Store creation failed', storeError)
            return NextResponse.json({ error: 'Store creation failed', details: storeError.message || String(storeError) }, { status: 500 })
        }

        try {
            await prisma.user.update({
                where: { id: userId },
                data: {store: {connect: {id: newStore.id}}}
            })
        } catch (linkError) {
            console.error('Linking user to store failed', linkError)
            return NextResponse.json({ error: 'Linking user to store failed', details: linkError.message || String(linkError) }, { status: 500 })
        }

        return NextResponse.json({message: "applied, waiting for approval"})

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, { status: 400 })
    }
}

// check is user have already registered a store if yes then send status of store

export async function GET(request) {
    try {
        const {userId} = getAuth(request)

        // check is user have already registered a store
        const store = await prisma.store.findFirst({
            where: { userId: userId}
        })

        // if store is already registered then send status of store
        if(store){
            return NextResponse.json({status: store.status})
        }

        return NextResponse.json({status: "not registered"})
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, { status: 400 })
    }
}