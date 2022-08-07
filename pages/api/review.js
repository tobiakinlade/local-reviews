import prisma from 'lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(501).end()
  }

  const session = getSession({ req })
  if (!session) return res.status(401).json({ message: 'Not logged in' })

  const user = await prisma.findUnique({
    where: {
      id: session.user.id,
    },
  })

  if (!user) return res.status(401).json({ message: 'User not found' })

  await prisma.review.create({
    data: {
      description: req.body.description,
      rating: parseInt(req.body.rating),
      item: {
        connect: { id: req.body.item },
      },
    },
  })
  res.end()
}
