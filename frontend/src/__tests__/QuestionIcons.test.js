import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import QuestionIcons from '../components/QuestionIcons/QuestionIcons'

describe('QuestionIcons tests', () => {
  /**
   * First state is initialized to nothing, when the edit button is clicked,
   * it should be updated to 'UPDATED' and so on
   * */
  test('renders QuestionIcons and executes callback', async () => {
    let state = 'NOTHING'
    const EDITED = 'EDITED'
    const DELETED = 'DELETED'
    const UPDATED = 'UPDATED'
    const path = '/tests/question/icons'
    // jsdom doesn't implement window.prompt, implement it as an empty object
    // so jsdom doesn't throw an error
    window.prompt = () => {}

    /**
     * Function that gets called when one of the question is clicked, used to
     * update state
     * @param newState: the new state after a button is clicked, one of:
     *  - SHARED
     *  - EDITED
     *  - DELETED
     *  - UPDATED
     * */
    const update = (newState) => {
      state = newState
    }

    const { getByTestId, rerender } = render(
      <QuestionIcons
        direction="row"
        handleUpdate={() => update(UPDATED)}
        handleDelete={() => update(DELETED)}
        handleEdit={() => update(EDITED)}
        path={path}
      />,
    )

    fireEvent.click(getByTestId('edit-button'))
    expect(state).toBe(EDITED)
    // click the update button
    fireEvent.click(getByTestId('update-button'))
    // expect alertWindow to be open
    expect(state).toBe(EDITED)
    // rerender to get get the opened alertWindow into the dom
    rerender(
      <QuestionIcons
        direction="row"
        handleUpdate={() => update(UPDATED)}
        handleDelete={() => update(DELETED)}
        handleEdit={() => update(EDITED)}
        path={path}
      />,
    )
    // click confirm button on alertWindow
    fireEvent.click(getByTestId('confirm-button'))
    expect(state).toBe(UPDATED)

    // click the delete button
    fireEvent.click(getByTestId('delete-button'))
    // expect alertWindow to be open
    expect(state).toBe(UPDATED)
    // click confirm button on alertWindow
    rerender(
      <QuestionIcons
        direction="row"
        handleUpdate={() => update(UPDATED)}
        handleDelete={() => update(DELETED)}
        handleEdit={() => update(EDITED)}
        path={path}
      />,
    )
    fireEvent.click(getByTestId('confirm-button'))
    expect(state).toBe(DELETED)
    rerender(
      <QuestionIcons
        direction="row"
        handleUpdate={() => update(UPDATED)}
        handleDelete={() => update(DELETED)}
        handleEdit={() => update(EDITED)}
        path={path}
      />,
    )
    fireEvent.click(getByTestId('share-button'))
    expect(getByTestId('snackbar').textContent).toContain('copied to clipboards')
  })
})
