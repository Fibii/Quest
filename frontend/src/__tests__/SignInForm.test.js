import {
  cleanup, fireEvent, render, waitForElement,
} from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import axiosMock from 'axios'
import React from 'react'
import inputHelper from '../services/testHelpers/inputHelper'
import SignIn from '../components/SignInForm'
import user from '../__mocks__/user'
import '@testing-library/jest-dom/extend-expect'
import loggedUser from '../__mocks__/loggedUser'
import UserContext from '../components/UserContext'


jest.mock('axios')
afterAll(cleanup)
afterEach(() => {
  jest.clearAllMocks()
})

const baseUrl = 'http://localhost:3001/api'
const url = `${baseUrl}/login/`


describe('SingIn tests', () => {
  test('user can sign in', async () => {
    let testUser = null

    const setUser = (loggedUser) => {
      testUser = loggedUser
    }

    const { getByTestId } = render(
      <UserContext.Provider value={[null, setUser]}>
        <MemoryRouter initialEntries={['/login']}>
          <Route path="/login">
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

    await waitForElement(() => getByTestId('signin-container'))
    expect(axiosMock.post).toBeCalledTimes(1)
    expect(axiosMock.post).toBeCalledWith(url, loggedOutUser)
    expect(testUser).toEqual(loggedUser)
  })
})
