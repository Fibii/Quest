import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import UpvoteBox from '../components/UpvoteBox/UpvoteBox'

describe('UpvoteBox tests', () => {
  test('renders upvoteBox and executes callback', async () => {
    let likes = 0

    const upvote = () => {
      likes += 1
    }

    const downvote = () => {
      likes -= 1
    }

    const { getByTestId } = render(
      <UpvoteBox
        likes={likes}
        handleUpvote={() => upvote()}
        handleDownvote={() => downvote()}
      />,
    )


    expect(parseInt(getByTestId('upvoteBox-likes').textContent, 10)).toBe(likes)
    fireEvent.click(getByTestId('upvote-button'))
    expect(likes).toBe(1)
    fireEvent.click(getByTestId('downvote-button'))
    expect(likes).toBe(0)
  })
})
