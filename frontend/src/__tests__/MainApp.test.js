import React from 'react'
import {
  cleanup,
  render, waitForElement,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import axiosMock from 'axios'
import MainApp from '../components/MainApp/MainApp'
import LocationDisplay from '../services/testHelpers/LocationDisplay'
import loggedUser from '../__mocks__/loggedUser'
import questions from '../__mocks__/questions'
import localStorageMock from '../__mocks__/localStorage'
import user from '../__mocks__/user'

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
const REGISTER_URL = '/register'
const question = questions[0]
const QUESTION_URL = `/question/${question.id}`
const PROFILE_URL = `/user/${user.id}`

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

/**
 * a setup for tests of components that should be displayed when a user
 * is not logged in, like SignUpForm or SignInForm, if a user is logged in
 * and access /login or /register then they should be redirected to the home page
 *
 * @param url: the url when said components are rendered
 * @param redirectTo: the url that user is redirect to afte 5 seconds
 * */
const redirectSetup = async (url, redirectTo = HOME_URL) => {
  jest.setTimeout(10000)
  axiosMock.get.mockResolvedValue({
    data: questions,
  })
  window.localStorage.setItem('qa_userLoggedIn', JSON.stringify(loggedUser))
  const { getByTestId } = await setup(url, 'notification')
  expect(getByTestId('notification').textContent).toContain(REDIRECT_INFO_MESSAGE)
  await waitForElement(() => getByTestId('questions-container'), { timeout: 6000 })
  expect(getByTestId('location-display').textContent).toEqual(redirectTo)
}


const renderQuestion = async (user = null) => {
  if (user) {
    window.localStorage.setItem('qa_userLoggedIn', JSON.stringify(user))
    axiosMock.get.mockResolvedValue({
      data: questions,
    })
  }
  axiosMock.get.mockResolvedValueOnce({
    data: question,
  })
  const { getByTestId } = await setup(QUESTION_URL, 'question-container')
  expect(getByTestId('location-display').textContent).toEqual(QUESTION_URL)
  expect(getByTestId('question-container')).toBeInTheDocument()
}

const renderProfile = async (loggedInUser = null) => {
  if (loggedInUser) {
    window.localStorage.setItem('qa_userLoggedIn', JSON.stringify(loggedInUser))
    axiosMock.get.mockResolvedValue({
      data: questions,
    })
  }
  axiosMock.get.mockResolvedValueOnce({
    data: user,
  })
  const { getByTestId } = await setup(PROFILE_URL, 'profile-container')
  expect(getByTestId('location-display').textContent).toEqual(PROFILE_URL)
  expect(getByTestId('profile-container')).toBeInTheDocument()
}


describe('MainApp tests', () => {
  test('renders questions in home route if a user is logged in', async () => {
    window.localStorage.setItem('qa_userLoggedIn', JSON.stringify(loggedUser))
    axiosMock.get.mockResolvedValue({
      data: questions,
    })
    const { getByTestId } = await setup(HOME_URL, 'questions-container')
    expect(getByTestId('location-display').textContent).toEqual(HOME_URL)
    expect(getByTestId('questions-container')).toBeInTheDocument()
  })

  test('shows welcome page if a user is not logged in', async () => {
    const { getByTestId } = await setup(HOME_URL, 'welcome-container')
    expect(getByTestId('location-display').textContent).toEqual(HOME_URL)
    expect(getByTestId('welcome-container')).toBeInTheDocument()
  })

  test('renders newQuestionForm if a user is logged in', async () => {
    window.localStorage.setItem('qa_userLoggedIn', JSON.stringify(loggedUser))
    axiosMock.get.mockResolvedValue({
      data: questions,
    })
    const { getByTestId } = await setup(NEW_QUESTION_URL, 'questionForm-container')
    expect(getByTestId('location-display').textContent).toEqual(NEW_QUESTION_URL)
    expect(getByTestId('questionForm-container')).toBeInTheDocument()
  })

  test('renders login if a user is not logged in', async () => {
    const { getByTestId } = await setup(LOGIN_URL, 'signin-container')
    expect(getByTestId('location-display').textContent).toEqual(LOGIN_URL)
    expect(getByTestId('signin-container')).toBeInTheDocument()
  })

  test(`redirects to home if a logged user accesses ${LOGIN_URL}`, async () => {
    await redirectSetup(LOGIN_URL)
  })

  test(`redirects to home if a logged user accesses ${REGISTER_URL}`, async () => {
    await redirectSetup(REGISTER_URL)
  })

  test('renders register if a user is not logged in', async () => {
    const { getByTestId } = await setup(REGISTER_URL, 'signup-container')
    expect(getByTestId('location-display').textContent).toEqual(REGISTER_URL)
    expect(getByTestId('signup-container')).toBeInTheDocument()
  })

  test("doesn't render newQuestionForm if a user is not logged in", async () => {
    axiosMock.get.mockResolvedValue({
      data: questions,
    })
    const { getByTestId, queryByTestId } = await setup(NEW_QUESTION_URL, 'notification')
    expect(getByTestId('location-display').textContent).toEqual(NEW_QUESTION_URL)
    expect(queryByTestId('questionForm-container')).toBeNull()
  })

  test('renders Question if a user is not logged in', async () => {
    await renderQuestion()
  })

  test('renders Question if a user is logged in', async () => {
    await renderQuestion(loggedUser)
  })

  test('renders Profile if a user is not logged in', async () => {
    await renderProfile()
  })

  test('renders Profile if a user is logged in', async () => {
    await renderProfile(loggedUser)
  })
})
