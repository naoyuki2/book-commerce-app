import { BookType } from '@/app/types/type'
import { createClient } from 'microcms-js-sdk'

export const client = createClient({
    serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN!,
    apiKey: process.env.NEXT_PUBLIC_API_KEY!,
})

export const getAllBooks = async () => {
    const allBooks = await client.getList<BookType>({
        endpoint: 'bookcommerce',
        customRequestInit: {
            next: {
                revalidate: 3600, //1時間キャッシュ。ISRの実装
            },
        },
    })
    return allBooks
}

export const getDetailBook = async (contentId: string) => {
    const detailBook = await client.getListDetail<BookType>({
        endpoint: 'bookcommerce',
        customRequestInit: {
            cache: 'no-cache', //購入直後に更新するべきだからSSR
        },
        contentId,
    })
    return detailBook
}
