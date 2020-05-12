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

describe('MainApp tests', () => {
  test('renders questions in home route if a user is logged in', async () => {
    window.localStorage.setItem('qa_userLoggedIn', JSON.stringify(loggedUser))
    axiosMock.get.mockResolvedValue({
      data: questions,
    })
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <LocationDisplay />
        <MainApp />
      </MemoryRouter>,
    )
    await waitForElement(() => getByTestId('mainApp-container'))
    expect(getByTestId('location-display').textContent).toEqual('/')
    expect(getByTestId('questions-container')).toBeInTheDocument()
  })

  test('shows welcome page if a user is not logged in', async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <LocationDisplay />
        <MainApp />
      </MemoryRouter>,
    )
    await waitForElement(() => getByTestId('mainApp-container'))
    expect(getByTestId('location-display').textContent).toEqual('/')
  })

  test('renders newQuestionForm if a user is logged in', async () => {
    window.localStorage.setItem('qa_userLoggedIn', JSON.stringify(loggedUser))
    axiosMock.get.mockResolvedValue({
      data: questions,
    })
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/question/new']}>
        <LocationDisplay />
        <MainApp />
      </MemoryRouter>,
    )
    await waitForElement(() => getByTestId('mainApp-container'))
    expect(getByTestId('location-display').textContent).toEqual('/question/new')
    expect(getByTestId('questionForm-container')).toBeInTheDocument()
  })

  test("doesn't render newQuestionForm if a user is not logged in", async () => {
    axiosMock.get.mockResolvedValue({
      data: questions,
    })
    const { getByTestId, queryByTestId } = render(
      <MemoryRouter initialEntries={['/question/new']}>
        <LocationDisplay />
        <MainApp />
      </MemoryRouter>,
    )
    await waitForElement(() => getByTestId('mainApp-container'))
    expect(getByTestId('location-display').textContent).toEqual('/question/new')
    expect(queryByTestId('questionForm-container')).toBeNull()
  })
})
