import { Client, Databases, ID, Query } from "appwrite"

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID
const ENDPOINT_ID = import.meta.env.VITE_APPWRITE_ENDPOINT

const client = new Client().setEndpoint(ENDPOINT_ID).setProject(PROJECT_ID);
const db = new Databases(client)

export const incSearchCount = async (search, movie) => {
    console.log(search);

    try {
        const results = await db.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal("searchTerm", search)])
        if (results.documents.length > 0) {
            const doc = results.documents[0]
            console.log(doc);
            await db.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, { count: doc.count + 1 })
            console.log(results);
        } else {
            await db.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: search,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }

    } catch (error) {
        console.log(error);
    }
}

export const getTrendingMovies = async () => {

    try { 
        const res = await db.listDocuments(DATABASE_ID,COLLECTION_ID,[
          Query.limit(5),
          Query.orderDesc("count")
        ])
        return res.documents;
    } catch (error) {
        console.log(error);
    }
}
