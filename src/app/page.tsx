// 'use client'

import { getServerSession } from 'next-auth'
import Book from './components/Book'
import { getAllBooks } from './lib/microcms/client'
import { BookType, PurchaseType, UserType } from './types/type'
import { nextAuthOptions } from './lib/next-auth/options'

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
    const { contents } = await getAllBooks()
    //useSessionはSSRで使えないので、getServerSessionを使う
    const session = await getServerSession(nextAuthOptions)
    // const user:UserType = session?.user このようにするとsessionが未定義の可能性があるので、下記のように書く
    const user = session?.user as UserType //未定義ではない場合に型をUserTypeにする
    let purchaseBookIds: string[]

    if (user) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
            { cache: 'no-cache' }, //標準でSSR
        )
        const purchaseData = await response.json()
        // console.log(purchaseData)

        purchaseBookIds = purchaseData.map(
            (purchaseBook: PurchaseType) => purchaseBook.bookId,
        )
        // console.log(purchaseBookIds)
    } else {
        purchaseBookIds = []
    }
    return (
        <>
            <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
                <h2 className="text-center w-full font-bold text-3xl mb-2">
                    Book Commerce
                </h2>
                {contents.map((book: BookType) => (
                    <Book
                        key={book.id}
                        book={book}
                        //購入した本のIDが含まれている配列purchaseBookIdsの中にbook.idが含まれているかどうか
                        isPurchased={purchaseBookIds.includes(book.id)}
                    />
                ))}
            </main>
        </>
    )
}
