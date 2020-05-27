import React from 'react'
import {
  render, waitForElement, cleanup, fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import question from '../__mocks__/question'
import utils from '../services/utils'
import Question from '../components/Question/Question'
import UserContext from '../components/UserContext/UserContext'
import user from '../__mocks__/user'
import inputHelper from '../services/testHelpers/inputHelper'

afterAll(cleanup)
afterEach(() => {
  jest.clearAllMocks()
})

const baseUrl = process.env.REACT_APP_BACKEND_URL
const url = `${baseUrl}/questions/${question.id}`

const TITLE_HELPERTEXT = 'title must be 6 characters long at least and 64 at most'
const CONTENT_HELPERTEXT = 'content must be at least 8 characters long'
const TAGS_HELPERTEXT = 'tags must be words, separated by space, like in "hello world"'

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
    expect(getByTestId('notification').textContent)
      .toContain('cannot connect to the server')
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

  test('displays edit page and edits (update) a question', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: question,
    })

    const { getByTestId, getAllByTestId, queryByTestId } = render(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={[`question/${question.id}`]}>
          <Route path="question/:id">
            <Question />
          </Route>
        </MemoryRouter>
      </UserContext.Provider>,
    )

    await waitForElement(() => getAllByTestId('question-container'))
    expect(queryByTestId('update-button')).toBeNull()
    fireEvent.click(getByTestId('edit-button'))
    expect(queryByTestId('update-button')).toBeInTheDocument()
    // to be refactored into expect(edit-container) to in the document
    // after exporting edit view to its own component
    expect(getByTestId('title-input'))
      .toBeInTheDocument()
    expect(getByTestId('content-input'))
      .toBeInTheDocument()
    expect(getByTestId('tags-input'))
      .toBeInTheDocument()

    // jest.clearAllMocks()
    const editedQuestion = {
      title: 'edited question title',
      content: 'edited question content',
      tags: 'edited tags',
      solved: question.solved,
    }

    const updatedQuestion = {
      ...editedQuestion,
      tags: editedQuestion.tags.split(' '),
    }

    axiosMock.put.mockResolvedValueOnce({
      data: {
        ...question,
        title: editedQuestion.title,
        content: editedQuestion.content,
        tags: updatedQuestion.tags,
      },
    })


    fireEvent.change(getByTestId('title-input'), inputHelper.parseValue(editedQuestion.title))
    fireEvent.change(getByTestId('content-input'), inputHelper.parseValue(editedQuestion.content))
    fireEvent.change(getByTestId('tags-input'), inputHelper.parseValue(editedQuestion.tags))

    fireEvent.click(getByTestId('update-button'))
    fireEvent.click(getByTestId('confirm-button')) // confirm the alertWindow
    await waitForElement(() => getAllByTestId('question-container'))
    expect(axiosMock.put).toBeCalledTimes(1)
    expect(axiosMock.put).toBeCalledWith(url, updatedQuestion, null)
  })

  test('validates edit question input', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: question,
    })

    const { getByTestId, getAllByTestId, container } = render(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={[`question/${question.id}`]}>
          <Route path="question/:id">
            <Question />
          </Route>
        </MemoryRouter>
      </UserContext.Provider>,
    )

    await waitForElement(() => getAllByTestId('question-container'))
    fireEvent.click(getByTestId('edit-button'))

    const editedQuestion = {
      title: 'a',
      content: 'ab',
      tags: '$$$$, ',
      solved: question.solved,
    }

    // clear the input fields
    fireEvent.change(getByTestId('title-input'), inputHelper.parseValue(''))
    fireEvent.change(getByTestId('content-input'), inputHelper.parseValue(''))
    fireEvent.change(getByTestId('tags-input'), inputHelper.parseValue(''))

    fireEvent.change(getByTestId('title-input'), inputHelper.parseValue(editedQuestion.title))
    fireEvent.change(getByTestId('content-input'), inputHelper.parseValue(editedQuestion.content))
    fireEvent.change(getByTestId('tags-input'), inputHelper.parseValue(editedQuestion.tags))

    expect(container.querySelector('#title-helper-text').textContent).toEqual(TITLE_HELPERTEXT)
    expect(container.querySelector('#content-helper-text').textContent).toEqual(CONTENT_HELPERTEXT)
    expect(container.querySelector('#tags-helper-text').textContent).toEqual(TAGS_HELPERTEXT)

    fireEvent.click(getByTestId('update-button'))
    fireEvent.click(getByTestId('confirm-button')) // confirm the alertWindow
    await waitForElement(() => getAllByTestId('question-container'))
    expect(axiosMock.put).toBeCalledTimes(0)
  })

  test('deletes a question', async () => {
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

    axiosMock.delete.mockResolvedValueOnce({
      status: 204,
    })

    await waitForElement(() => getAllByTestId('question-container'))
    fireEvent.click(getAllByTestId('delete-button')[0])
    fireEvent.click(getByTestId('confirm-button'))
    await waitForElement(() => getAllByTestId('question-container'))
    expect(axiosMock.delete).toBeCalledTimes(1)
    expect(axiosMock.delete).toBeCalledWith(url, null)
  })
})
