import { useState } from 'react'

export function useReviewSheet() {
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  function review(id: string) {
    setReviewId(id)
    setOpen(true)
  }

  return { reviewId, open, setOpen, review }
}
