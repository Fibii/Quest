import React from 'react'
import {
  cleanup,
  render, waitForElement,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import axiosMock from 'axios'
import MainApp from '../components/MainApp'
import LocationDisplay from '../services/testHelpers/LocationDisplay'
import loggedUser from '../__mocks__/loggedUser'
import questions from '../__mocks__/questions'
import localStorageMock from '../__mocks__/localStorage'

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
})

afterAll(cleanup)
afterEach(() => {
  window.localStorage.removeItem('qa_userLoggedIn')
  jest.clearAllMocks()
})

const HOME_URL = '/'
const NEW_QUESTION_URL = '/question/new'

const setup = async (path) => {
  const renderResult = render(
    <MemoryRouter initialEntries={[path]}>
      <LocationDisplay />
      <MainApp />
    </MemoryRouter>,
  )
  await waitForElement(() => renderResult.getByTestId('mainApp-container'))
  return renderResult
}

describe('MainApp tests', () => {
  test('renders questions in home route if a user is logged in', async () => {
    window.localStorage.setItem('qa_userLoggedIn', JSON.stringify(loggedUser))
    axiosMock.get.mockResolvedValue({
      data: questions,
    })
    const { getByTestId } = await setup(HOME_URL)
    expect(getByTestId('location-display').textContent).toEqual(HOME_URL)
    expect(getByTestId('questions-container')).toBeInTheDocument()
  })

  test('shows welcome page if a user is not logged in', async () => {
    const { getByTestId } = await setup(HOME_URL)
    expect(getByTestId('location-display').textContent).toEqual(HOME_URL)
  })

  test('renders newQuestionForm if a user is logged in', async () => {
    window.localStorage.setItem('qa_userLoggedIn', JSON.stringify(loggedUser))
    axiosMock.get.mockResolvedValue({
      data: questions,
    })
    const { getByTestId } = await setup(NEW_QUESTION_URL)
    expect(getByTestId('location-display').textContent).toEqual(NEW_QUESTION_URL)
    expect(getByTestId('questionForm-container')).toBeInTheDocument()
  })

  test("doesn't render newQuestionForm if a user is not logged in", async () => {
    axiosMock.get.mockResolvedValue({
      data: questions,
    })
    const { getByTestId, queryByTestId } = await setup(NEW_QUESTION_URL)
    expect(getByTestId('location-display').textContent).toEqual(NEW_QUESTION_URL)
    expect(queryByTestId('questionForm-container')).toBeNull()
  })
})
