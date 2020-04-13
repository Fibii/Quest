import React from 'react'
import {
  render, waitForElement, cleanup,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import question from '../__mocks__/question'
import utils from '../services/utils'
import Question from '../components/Question'
import UserContext from '../components/UserContext'
import user from '../__mocks__/user'

jest.mock('axios')
afterAll(cleanup)
afterEach(() => {
  jest.clearAllMocks()
})

const baseUrl = 'http://localhost:3001/api'
const url = `${baseUrl}/questions/${question.id}`


describe('question tests', () => {
  test('displays an error message', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: undefined,
    })

    const { getByTestId } = render(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={['question/badId']}>
          <Route path="question/:id">
            <Question />
          </Route>
        </MemoryRouter>
      </UserContext.Provider>,
    )

    await waitForElement(() => getByTestId('question-container'))
    expect(getByTestId('notification').textContent).toContain('cannot connect to the server')
  })


  test('loads and displays a question', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: question,
    })

    const { getByTestId, getAllByTestId } = render(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={[`question/${question.id}`]}>
          <Route path="question/:id">
            <Question />
          </Route>
        </MemoryRouter>
      </UserContext.Provider>,
    )


    await waitForElement(() => getAllByTestId('question-container'))

    const comments = getAllByTestId('comment-content').map((comment) => comment.textContent)
    expect(axiosMock.get).toHaveBeenCalledTimes(1)
    expect(axiosMock.get).toHaveBeenCalledWith(url)
    expect(getByTestId('title').textContent).toBe(question.title)
    expect(getByTestId('content').textContent).toBe(question.content)
    expect(parseInt(getAllByTestId('upvoteBox-likes')[0].textContent, 10)).toBe(utils.getLikes(question.likes))
    expect(comments).toEqual(question.comments.map((comment) => comment.content))
  })
})
