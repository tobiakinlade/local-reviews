import { getItem } from 'lib/data'
import prisma from 'lib/prisma'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Item({ item }) {
  const [rating, setRating] = useState(5)
  const [description, setDescription] = useState('')
  const router = useRouter()
  return (
    <div className='text-center'>
      <h1 className='mt-10 font-extrabold text-2xl'>{item.name}</h1>
      <h2 className='mt-10 font-bold'>{item.description}</h2>
      {item.rating !== 0 && (
        <h2 className='mt-10 font-bold'>
          Rating: {item.rating} / 5{' '}
          {[...Array(Math.round(item.rating / 10))].map(() => '⭐️ ')}
        </h2>
      )}
      <h2 className='mt-10 font-extrabold text-lg'>Add a new review</h2>
      <form
        className='mt-3'
        onChange={async (e) => {
          e.preventDefault()
          await fetch('/api/review', {
            body: JSON.stringify({
              rating,
              description,
              item: item.id,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          router.reload()
        }}
      >
        <div className='flex-1 mb-5'>
          <div className='flex-1 mb-2'>Rating</div>
          <select
            className='border border-gray-600 mb-5 px-2 py-1'
            onChange={(e) => setRating(e.target.value)}
          >
            <option value='5'>5</option>
            <option value='4'>4</option>
            <option value='3'>3</option>
            <option value='2'>2</option>
            <option value='1'>1</option>
          </select>
          <div className='flex-1 mb-2'>Description</div>
          <textarea
            className='border p-1 text-black'
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button className={`border px-8 py-2 mt-2 font-bold`}>Add item</button>
      </form>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const item = await getItem(prisma, parseInt(params.id))

  return {
    props: {
      item,
    },
  }
}
