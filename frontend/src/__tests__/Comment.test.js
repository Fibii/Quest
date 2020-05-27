import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import comment from '../__mocks__/comment'
import Comment from '../components/Comment/Comment'
import user from '../__mocks__/user'
import '@testing-library/jest-dom/extend-expect'


describe('Comment tests', () => {
  /**
   * First state is initialized to nothing, when the edit button is clicked,
   * it should be updated to 'UPDATED' and so on
   * */
  test('renders Comment and buttons with the author logged in and executes actions', async () => {
    let state = 'NOTHING'
    const EDITED = 'EDITED'
    const DELETED = 'DELETED'
    const UPDATED = 'UPDATED'
    let value = 0

    const setState = (newState) => {
      state = newState
    }

    const upvote = () => {
      value += 1
    }

    const downvote = () => {
      value -= 1
    }

    const { getByTestId, rerender } = render(
      <Comment
        handleEdit={() => setState(EDITED)}
        handleDelete={() => setState(DELETED)}
        handleUpdate={() => setState(UPDATED)}
        handleUpvote={() => upvote()}
        handleDownVote={() => downvote()}
        comment={comment}
        user={user}
      />,
    )

    expect(getByTestId('questionIcons-container')).toBeInTheDocument()
    fireEvent.click(getByTestId('delete-button'))
    expect(state).toBe('NOTHING')
    rerender(
      <Comment
        handleEdit={() => setState(EDITED)}
        handleDelete={() => setState(DELETED)}
        handleUpdate={() => setState(UPDATED)}
        handleUpvote={() => upvote()}
        handleDownVote={() => downvote()}
        comment={comment}
        user={user}
      />,
    )
    fireEvent.click(getByTestId('confirm-button'))
    expect(state).toBe(DELETED)
    rerender(
      <Comment
        handleEdit={() => setState(EDITED)}
        handleDelete={() => setState(DELETED)}
        handleUpdate={() => setState(UPDATED)}
        handleUpvote={() => upvote()}
        handleDownVote={() => downvote()}
        comment={comment}
        user={user}
      />,
    )
    fireEvent.click(getByTestId('upvote-button'))
    expect(value).toBe(1)
    fireEvent.click(getByTestId('downvote-button'))
    expect(value).toBe(0)


    // THESE TESTS WILL BE UNCOMMENTED WHEN THEIR FEATURES ARE ADDED TO Comment.js
    // fireEvent.click(getByTestId('edit-button'))
    // expect(state).toBe(EDITED)
    // fireEvent.click(getByTestId('update-button'))
    // rerender(
    //   <Comment
    //     handleEdit={() => setState(EDITED)}
    //     handleDelete={() => setState(DELETED)}
    //     handleUpdate={() => setState(UPDATED)}
    //     handleUpvote={() => upvote()}
    //     handleDownVote={() => downvote()}
    //     comment={comment}
    //     user={user}
    //   />,
    // )
    // fireEvent.click(getByTestId('confirm-button'))
    // expect(state).toBe(UPDATED)
  })

  test('renders Comment without icons when a user is not logged in', async () => {
    const { queryByTestId } = render(
      <Comment
        handleEdit={() => null}
        handleDelete={() => null}
        handleUpdate={() => null}
        handleUpvote={() => null}
        handleDownVote={() => null}
        comment={comment}
        user={undefined}
      />,
    )

    expect(queryByTestId('questionIcons-container')).toBeNull()
  })

  test('renders Comment without icons when the author is not logged in', async () => {
    const notAuthor = {
      ...user,
      id: '5e8e330f42b04e2f7dbe2225',
    }

    const { queryByTestId } = render(
      <Comment
        handleEdit={() => null}
        handleDelete={() => null}
        handleUpdate={() => null}
        handleUpvote={() => null}
        handleDownVote={() => null}
        comment={comment}
        user={notAuthor}
      />,
    )

    expect(queryByTestId('questionIcons-container')).toBeNull()
  })
})
