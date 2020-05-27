import {
  cleanup, fireEvent, render, waitForElement,
} from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import axiosMock from 'axios'
import React from 'react'
import inputHelper from '../services/testHelpers/inputHelper'
import SignIn from '../components/SignInForm/SignInForm'
import user from '../__mocks__/user'
import '@testing-library/jest-dom/extend-expect'
import loggedUser from '../__mocks__/loggedUser'
import UserContext from '../components/UserContext/UserContext'
import LocationDisplay from '../services/testHelpers/LocationDisplay'


afterAll(cleanup)
afterEach(() => {
  jest.clearAllMocks()
})

const baseUrl = process.env.REACT_APP_BACKEND_URL
const LOGIN_URL = '/login'
const APP_URL = '/'
const LOGIN_ERROR = 'error, incorrect username or password'
const url = `${baseUrl + LOGIN_URL}/`

describe('SingIn tests', () => {
  test('user can sign in', async () => {
    let testUser = null

    const setUser = (loggedUser) => {
      testUser = loggedUser
    }

    const { getByTestId } = render(
      <UserContext.Provider value={[null, setUser]}>
        <MemoryRouter initialEntries={[LOGIN_URL]}>
          <LocationDisplay />
          <Route path={LOGIN_URL}>
            <SignIn setUser={setUser} />
          </Route>
        </MemoryRouter>
        ,
      </UserContext.Provider>,
    )

    axiosMock.post.mockResolvedValueOnce({
      data: loggedUser,
    })

    const loggedOutUser = {
      username: user.username,
      password: 'password',

    }

    expect(getByTestId('signin-container'))
      .toBeInTheDocument()
    fireEvent.change(getByTestId('username-input'), inputHelper.parseValue(user.username))
    fireEvent.change(getByTestId('password-input'), inputHelper.parseValue(loggedOutUser.password))
    fireEvent.click(getByTestId('submit-button'))

    await waitForElement(() => getByTestId('location-display'))
    expect(axiosMock.post).toBeCalledTimes(1)
    expect(axiosMock.post).toBeCalledWith(url, loggedOutUser)
    expect(testUser).toEqual(loggedUser)
    expect(getByTestId('location-display').textContent).toEqual(APP_URL)
  })

  test("a user with wrong info can't sign in", async () => {
    const { getByTestId } = render(
      <UserContext.Provider value={[null, () => null]}>
        <MemoryRouter initialEntries={[LOGIN_URL]}>
          <LocationDisplay />
          <Route path={LOGIN_URL}>
            <SignIn setUser={() => null} />
          </Route>
        </MemoryRouter>
        ,
      </UserContext.Provider>,
    )

    axiosMock.post.mockResolvedValueOnce({
      data: undefined,
    })

    const loggedOutUser = {
      username: user.username,
      password: 'password',

    }

    fireEvent.change(getByTestId('username-input'), inputHelper.parseValue(user.username))
    fireEvent.change(getByTestId('password-input'), inputHelper.parseValue(loggedOutUser.password))
    fireEvent.click(getByTestId('submit-button'))
    await waitForElement(() => getByTestId('signin-container'))
    expect(getByTestId('notification').textContent).toContain(LOGIN_ERROR)
    expect(getByTestId('location-display').textContent).toEqual(LOGIN_URL)
  })
})
