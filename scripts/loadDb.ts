import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config"

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const { ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY } = process.env

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

const miuData = [
    'https://en.wikipedia.org/wiki/Maharishi_International_University',
    'https://www.miu.edu/',
    'https://www.miu.edu/academic-programs',
    'https://www.miu.edu/bs-in-computer-science',
    'https://compro.miu.edu/',
    'https://www.collegefactual.com/colleges/maharishi-university-of-management/',
    'https://compro.miu.edu/entry-tracks/',
    'https://compro.miu.edu/courses/',
    'https://compro.miu.edu/data-science/',
    'https://compro.miu.edu/faculty/',
    'https://compro.miu.edu/financial-aid/',
    'https://compro.miu.edu/internships/',
    'https://compro.miu.edu/student-life/career-strategies-workshop/',
    'https://compro.miu.edu/student-life/',
    'https://compro.miu.edu/student-life/meet-our-students/',
    'https://compro.miu.edu/families-at-miu/',
    'https://compro.miu.edu/fit-and-healthy/',
    'https://compro.miu.edu/student-life/local-fairfield-community/',
    'https://compro.miu.edu/student-life/personal-development/',
    'https://compro.miu.edu/blog/',
    'https://compro.miu.edu/blog/dann-and-marc/',
    'https://compro.miu.edu/blog/suvidkhuu-miu-compro-graduate-lead-data-engineer/',
    'https://compro.miu.edu/blog/miu-education/',
    'https://compro.miu.edu/blog/sumitra-maharjan/',
    'https://compro.miu.edu/blog/the-mike-parker-story/',
    'https://compro.miu.edu/blog/software-developer-recommends-tm-and-compro/',
    'https://compro.miu.edu/contact/',
    'https://compro.miu.edu/apply/',
    'https://www.linkedin.com/groups/3601775/',
    'https://www.facebook.com/computerprofessionals/',
    'https://www.instagram.com/miucompro/',
    'https://www.bestcolleges.com/schools/maharishi-university-of-management/',
    'https://www.trustpilot.com/review/www.miu.edu',
    'https://www.globalcountry.org/wp/maharishi-international-university/',
    'https://www.niche.com/colleges/maharishi-international-university/reviews/',
    'https://www.chea.org/maharishi-international-university',
    'https://collegescorecard.ed.gov/school?153861-Maharishi-International-University',
    'https://www.mastersportal.com/universities/17435/maharishi-international-university.html',
    'https://www.internationalstudent.com/school-search/1897/usa/iowa/maharishi-international-university/',
    'https://www.reddit.com/r/Iowa/comments/11pcury/maharishi_school_opinion/',
    'https://tm-women.org/maharishi-international-university/'
]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE })
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
})

const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: {
            dimension: 1536,
            metric: similarityMetric
        }
    })
    console.log(res)
}

const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    for await (const url of miuData) {
        const content = await scrapePage(url)
        const chunks = await splitter.splitText(content)
        for await (const chunk of chunks) {
            const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
                encoding_format: "float"
            })

            const vector = embedding.data[0].embedding

            const res = await collection.insertOne({
                $vector: vector,
                text: chunk
            })
            console.log(res)
        }
    }
}

const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true,
            timeout: 60000
        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate: async (page, browser) => {
            const result = await page.evaluate(() => document.body.innerHTML)
            await browser.close()
            return result;
        }
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection().then(() => loadSampleData())