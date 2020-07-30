import React from 'react'
import {
  render, waitForElement, cleanup, fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import user from '../__mocks__/user'
import Header from '../components/Header/Header'
import UserContext from '../components/UserContext/UserContext'
import questions from '../__mocks__/questions'
import LocationDisplay from '../services/testHelpers/LocationDisplay'

afterAll(cleanup)
afterEach(() => {
  jest.clearAllMocks()
})

const MAIN_URL = process.env.REACT_APP_URL
const APP_NAME = 'Quest'
const HOME_ROUTE = '/'
const NEW_QUESTION_ROUTE = '/question/new'
const PROFILE_BUTTON = 'Profile'
const LOGOUT_BUTTON = 'Logout'
const PROFILE_LINK = `${HOME_ROUTE}user/${user.id}`

// eslint-disable-next-line no-unused-vars
const setUser = jest.fn((user) => null)

const setup = async (user = null, setUser = null) => {
  axiosMock.get.mockResolvedValueOnce({
    data: questions,
  })

  const renderResult = render(
    <UserContext.Provider value={[user, setUser]}>
      <MemoryRouter initialEntries={[MAIN_URL]}>
        <LocationDisplay />
        <Route path={MAIN_URL}>
          <Header />
        </Route>
      </MemoryRouter>
    </UserContext.Provider>,
  )

  await waitForElement(() => renderResult.getByTestId('header-container'))
  return renderResult
}

describe('header tests', () => {
  test('renders header and drawer with logged in user', async () => {
    const { getByTestId } = await setup(user)
    expect(getByTestId('header-container')).toBeInTheDocument()
    fireEvent.click(getByTestId('open-drawer'))
    expect(getByTestId('drawer-container')).toBeInTheDocument()
  })

  test('redirects to links with a logged in user', async () => {
    const { getByTestId } = await setup(user, setUser)
    fireEvent.click(getByTestId('open-drawer'))
    fireEvent.click(getByTestId('newQuestion-button'))
    expect(getByTestId('location-display').textContent).toEqual(NEW_QUESTION_ROUTE)
    fireEvent.click(getByTestId('home-button'))
    expect(getByTestId('location-display').textContent).toEqual(HOME_ROUTE)
    fireEvent.click(getByTestId('newQuestion-button'))
    fireEvent.click(getByTestId('logo'))
    expect(getByTestId('location-display').textContent).toEqual(HOME_ROUTE)
    fireEvent.click(getByTestId('logoutDrawer-button'))
    expect(setUser).toBeCalledTimes(1)
    expect(setUser).toBeCalledWith(null)
  })

  test('renders header without drawer when a user is not logged in', async () => {
    const { queryByTestId, getByTestId } = await setup()
    expect(getByTestId('header-container')).toBeInTheDocument()
    expect(queryByTestId('open-drawer')).toBeNull()
    expect(getByTestId('logo').textContent).toContain(APP_NAME)
  })

  test('redirect to homepage when logo is clicked for a logged out user', async () => {
    const { getByTestId } = await setup()
    fireEvent.click(getByTestId('logo'))
    expect(getByTestId('location-display').textContent).toEqual(HOME_ROUTE)
  })

  test('renders and ... avatar menu buttons for desktop', async () => {
    const { getByTestId } = await setup(user, setUser)
    fireEvent.click(getByTestId('avatarDesktop-button'))
    expect(getByTestId('profile-button').textContent).toEqual(PROFILE_BUTTON)
    fireEvent.click(getByTestId('profile-button'))
    expect(getByTestId('location-display').textContent).toEqual(PROFILE_LINK)
    expect(getByTestId('logoutHeader-button').textContent).toEqual(LOGOUT_BUTTON)
    fireEvent.click(getByTestId('logoutHeader-button'))
    expect(setUser).toBeCalledTimes(1)
    expect(setUser).toBeCalledWith(null)
  })
})
