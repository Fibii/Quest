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

const REDIRECT_INFO_MESSAGE = "You're already logged in, you'll be redirected to the homepage in 5 seconds"
const HOME_URL = '/'
const NEW_QUESTION_URL = '/question/new'
const LOGIN_URL = '/login'

const setup = async (path, container = 'mainApp-container') => {
  const renderResult = render(
    <MemoryRouter initialEntries={[path]}>
      <LocationDisplay />
      <MainApp />
    </MemoryRouter>,
  )
  await waitForElement(() => renderResult.getByTestId(container))
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
    expect(getByTestId('welcome-container')).toBeInTheDocument()
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

  test('renders login if a user is not logged in', async () => {
    const { getByTestId } = await setup(LOGIN_URL)
    expect(getByTestId('location-display').textContent).toEqual(LOGIN_URL)
    expect(getByTestId('signin-container')).toBeInTheDocument()
  })

  test(`redirect to home if a logged user accesses ${LOGIN_URL}`, async () => {
    jest.useFakeTimers()
    window.localStorage.setItem('qa_userLoggedIn', JSON.stringify(loggedUser))
    const { getByTestId } = await setup(LOGIN_URL, 'notification')
    expect(getByTestId('notification')).toBeInTheDocument()
    expect(getByTestId('notification').textContent).toContain(REDIRECT_INFO_MESSAGE)
    await setTimeout(() => expect(getByTestId('location-display').textContent).toEqual(HOME_URL), 5000)
    jest.runAllTimers()
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
