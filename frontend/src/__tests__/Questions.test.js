import React from 'react'
import {
  render, waitForElement, cleanup,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import UserContext from '../components/UserContext/UserContext'
import user from '../__mocks__/user'
import questions from '../__mocks__/questions'
import Questions from '../components/Questions/Questions'
import utils from '../services/utils'

afterAll(cleanup)
afterEach(() => {
  jest.clearAllMocks()
})

const baseUrl = process.env.REACT_APP_BACKEND_URL
const url = `${baseUrl}/questions/`

describe('questions tests', () => {
  test('displays an error message', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: undefined,
    })

    const { getByTestId } = render(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={['/']}>
          <Route path="/">
            <Questions user={user} />
          </Route>
        </MemoryRouter>
      </UserContext.Provider>,
    )

    await waitForElement(() => getByTestId('notification'))
    expect(getByTestId('notification').textContent).toContain('Cannot connect to the server')
  })


  test('renders all questions with delete button if author is logged in', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: questions,
    })

    const { getAllByTestId } = render(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={['/']}>
          <Route path="/">
            <Questions user={user} />
          </Route>
        </MemoryRouter>
      </UserContext.Provider>,
    )


    await waitForElement(() => getAllByTestId('title'))
    const titles = getAllByTestId('title').map((title) => title.textContent)
    const contents = getAllByTestId('content').map((content) => content.textContent)
    const likes = getAllByTestId('likes').map((likes) => likes.textContent)
    const postedBy = getAllByTestId('postedBy').map((postedBy) => postedBy.textContent)
    const renderedQuestions = titles.map((title, index) => ({
      title,
      content: contents[index].split('.')[0], // remove the 3 dots
      likes: parseInt(likes[index], 10),
      postedBy: postedBy[index].split(':')[1], // remove "postedBy"
    }))
    const questionsList = questions.map((question) => ({
      title: question.title,
      content: question.content,
      likes: utils.getLikes(question),
      postedBy: question.postedBy.username,
    }))
    expect(axiosMock.get).toHaveBeenCalledTimes(1)
    expect(axiosMock.get).toHaveBeenCalledWith(url)
    expect(renderedQuestions).toEqual(questionsList)
    expect(getAllByTestId('delete-button')).toBeTruthy()
    expect(getAllByTestId('delete-button').length)
      .toBe(questionsList.filter((question) => question.postedBy === user.username).length)
  })
})
