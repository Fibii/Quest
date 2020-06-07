import { render, fireEvent, waitForElement } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect'
import user from '../__mocks__/user'
import QPaper from '../components/QPaper/QPaper'
import question from '../__mocks__/question'


describe('QPaper tests', () => {
  /**
   * First state is initialized to nothing, when the edit button is clicked,
   * it should be updated to 'UPDATED' and so on
   * */
  test('renders QPaper and executes delete function when the author is logged in', async () => {
    let state = 'NOTHING'
    const DELETED = 'DELETED'

    const setState = (newState) => {
      state = newState
    }

    const { getByTestId, rerender } = render(
      <MemoryRouter>
        <Route path="/">
          <QPaper
            handleDelete={() => setState(DELETED)}
            question={question}
            user={user}
          />
          ,
        </Route>
      </MemoryRouter>,
    )
    await waitForElement(() => getByTestId('qpaper-container'))
    fireEvent.click(getByTestId('delete-button'))
    expect(state).toBe('NOTHING')
    rerender(
      <MemoryRouter>
        <Route path="/">
          <QPaper
            handleDelete={() => setState(DELETED)}
            question={question}
            user={user}
          />
          ,
        </Route>
      </MemoryRouter>,
    )
    fireEvent.click(getByTestId('confirm-button'))
    expect(state).toBe(DELETED)
    rerender(
      <MemoryRouter>
        <Route path="/">
          <QPaper
            handleDelete={() => setState(DELETED)}
            question={question}
            user={user}
          />
          ,
        </Route>
      </MemoryRouter>,
    )
    fireEvent.click(getByTestId('share-button'))
    rerender(
      <MemoryRouter>
        <Route path="/">
          <QPaper
            handleDelete={() => setState(DELETED)}
            question={question}
            user={user}
          />
          ,
        </Route>
      </MemoryRouter>,
    )
    expect(getByTestId('snackbar').textContent).toContain('copied to clipboards')
  })

  test('renders QPaper without delete icon when the author is not logged in', async () => {
    const notAuthor = {
      ...user,
      id: '5e8e330f42b04e2f7dbe2225',
    }

    const { queryByTestId, rerender } = render(
      <MemoryRouter>
        <Route path="/">
          <QPaper
            handleDelete={() => null}
            question={question}
            user={notAuthor}
          />
          ,
        </Route>
      </MemoryRouter>,
    )

    expect(queryByTestId('delete-button')).toBeNull()
    fireEvent.click(queryByTestId('share-button'))
    rerender(
      <MemoryRouter>
        <Route path="/">
          <QPaper
            handleDelete={() => null}
            question={question}
            user={notAuthor}
          />
          ,
        </Route>
      </MemoryRouter>,
    )
    expect(queryByTestId('snackbar').textContent).toContain('copied to clipboards')
  })
})
