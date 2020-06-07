import React from 'react'
import {
  render, fireEvent, waitForElement, cleanup,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import user from '../__mocks__/user'
import SignupForm from '../components/SignupForm/SignupForm'
import LocationDisplay from '../services/testHelpers/LocationDisplay'
import inputHelper from '../services/testHelpers/inputHelper'

afterAll(cleanup)
afterEach(() => {
  jest.clearAllMocks()
})

const baseUrl = process.env.REACT_APP_BACKEND_URL
const url = `${baseUrl}/users`

const FULLNAME_HELPERTEXT = 'only characters are allowed\nlength must be between 3 and 32'
const USERNAME_HELPERTEXT = 'only alphanumerics are allowed\nlength must be between 3 and 32'
const EMAIL_HELPERTEXT = 'invalid email'
const PASSWORD_HELPERTEXT = 'must be between 8 to 32 characters long, must include one lowercase letter, one uppercase letter and no spaces'
const DATE_OF_BIRTH_HELPERTEXT = 'Birthday must be between 1900 and 2018'
const SERVER_DOWN = 'couldn\'t connect to the server'
const LOGIN_PATH = '/login'


describe('SignupForm tests', () => {
  test('shows an error when the server is down', async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Route path="/register">
          <SignupForm />
        </Route>
      </MemoryRouter>,
    )

    const unregisteredUser = {
      username: user.username,
      email: user.email,
      dateOfBirth: inputHelper.formatDate(new Date(user.dateOfBirth)),
      fullname: user.fullname,
      password: 'PassWord123',
    }

    axiosMock.post.mockResolvedValueOnce({
      data: null,
    })

    expect(getByTestId('signup-container')).toBeInTheDocument()
    fireEvent.change(getByTestId('username-input'), inputHelper.parseValue(unregisteredUser.username))
    fireEvent.change(getByTestId('email-input'), inputHelper.parseValue(unregisteredUser.email))
    fireEvent.change(getByTestId('dateOfBirth-input'), inputHelper.parseValue(unregisteredUser.dateOfBirth))
    fireEvent.change(getByTestId('password-input'), inputHelper.parseValue(unregisteredUser.password))
    fireEvent.change(getByTestId('fullname-input'), inputHelper.parseValue(unregisteredUser.fullname))
    fireEvent.click(getByTestId('submit-button'))

    await waitForElement(() => getByTestId('signup-container'))
    expect(getByTestId('notification').textContent).toContain(SERVER_DOWN)
  })

  test('renders and posts a new valid user', async () => {
    const { getByTestId, rerender } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Route path="/register">
          <SignupForm />
        </Route>
      </MemoryRouter>,
    )

    const unregisteredUser = {
      username: user.username,
      email: user.email,
      dateOfBirth: inputHelper.formatDate(new Date(user.dateOfBirth)),
      fullname: user.fullname,
      password: 'PassWord123',
    }

    const registeredUser = {
      ...unregisteredUser,
      dateOfBirth: new Date(unregisteredUser.dateOfBirth),
    }

    axiosMock.post.mockResolvedValueOnce({
      data: user,
    })

    expect(getByTestId('signup-container')).toBeInTheDocument()
    fireEvent.change(getByTestId('username-input'), inputHelper.parseValue(unregisteredUser.username))
    fireEvent.change(getByTestId('email-input'), inputHelper.parseValue(unregisteredUser.email))
    fireEvent.change(getByTestId('dateOfBirth-input'), inputHelper.parseValue(unregisteredUser.dateOfBirth))
    fireEvent.change(getByTestId('password-input'), inputHelper.parseValue(unregisteredUser.password))
    fireEvent.change(getByTestId('fullname-input'), inputHelper.parseValue(unregisteredUser.fullname))
    fireEvent.click(getByTestId('submit-button'))

    rerender(
      <MemoryRouter initialEntries={['/register/']}>
        <Route path="/register/">
          <SignupForm />
        </Route>
      </MemoryRouter>,
    )

    await waitForElement(() => getByTestId('signup-container'))
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
    expect(axiosMock.post).toHaveBeenCalledWith(url, registeredUser)
  })

  test('validates input', async () => {
    const { getByTestId, container } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Route path="/register">
          <SignupForm />
        </Route>
      </MemoryRouter>,
    )

    axiosMock.post.mockResolvedValueOnce({
      data: user,
    })

    expect(getByTestId('signup-container')).toBeInTheDocument()
    const unregisteredUser = {
      username: 'bad_u$er',
      email: 'not@mail',
      dateOfBirth: '1111-11-11',
      fullname: '12315',
      password: 'azzzzzzzsf',
    }

    fireEvent.change(getByTestId('username-input'), inputHelper.parseValue(unregisteredUser.username))
    fireEvent.change(getByTestId('email-input'), inputHelper.parseValue(unregisteredUser.email))
    fireEvent.change(getByTestId('dateOfBirth-input'), inputHelper.parseValue(unregisteredUser.dateOfBirth))
    fireEvent.change(getByTestId('password-input'), inputHelper.parseValue(unregisteredUser.password))
    fireEvent.change(getByTestId('fullname-input'), inputHelper.parseValue(unregisteredUser.fullname))
    fireEvent.click(getByTestId('submit-button'))
    expect(container.querySelector('#fullName-helper-text').textContent).toEqual(FULLNAME_HELPERTEXT)
    expect(container.querySelector('#username-helper-text').textContent).toEqual(USERNAME_HELPERTEXT)
    expect(container.querySelector('#email-helper-text').textContent).toEqual(EMAIL_HELPERTEXT)
    expect(container.querySelector('#password-helper-text').textContent).toEqual(PASSWORD_HELPERTEXT)
    expect(container.querySelector('#dateOfBirth-helper-text').textContent).toEqual(DATE_OF_BIRTH_HELPERTEXT)

    expect(getByTestId('notification')).toBeInTheDocument()
    expect(getByTestId('notification').textContent)
      .toContain('All fields are required, if a field is red, then fix it, make sure dob is valid')
    expect(axiosMock.post).toHaveBeenCalledTimes(0)
  })

  test('redirects to /login when login link is clicked', async () => {
    const { getByTestId, queryByTestId } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Route path="/register">
          <SignupForm />
        </Route>
        <Route path={LOGIN_PATH}>
          <LocationDisplay />
        </Route>
      </MemoryRouter>,
    )
    expect(queryByTestId('location-display')).toBeNull()
    fireEvent.click(getByTestId('login-link'))
    expect(getByTestId('location-display')).toBeInTheDocument()
    expect(getByTestId('location-display').textContent).toEqual(LOGIN_PATH)
  })
})
