import React from 'react'
import {
  render, waitForElement, cleanup,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import Profile from '../components/Profile/Profile'
import user from '../__mocks__/user'
import utils from '../services/utils'

afterAll(cleanup)
afterEach(() => {
  jest.clearAllMocks()
})

describe('user tests', () => {
  test('displays an error message', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: undefined,
    })

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['user/badId']}>
        <Route path="user/:id">
          <Profile />
        </Route>
      </MemoryRouter>,
    )

    await waitForElement(() => getByTestId('notification'))
    expect(getByTestId('notification').textContent).toContain("Couldn't get this user")
  })

  test('loads and displays a user profile', async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL
    const url = `${baseUrl}/users/${user.id}`

    axiosMock.get.mockResolvedValueOnce({
      data: user,
    })

    const { getByTestId, getAllByTestId } = render(
      <MemoryRouter initialEntries={[`user/${user.id}`]}>
        <Route path="user/:id">
          <Profile />
        </Route>
      </MemoryRouter>,
    )


    await waitForElement(() => getByTestId('profile-container'))

    const questions = getAllByTestId('question').map((question) => question.textContent)
    expect(axiosMock.get).toHaveBeenCalledTimes(1)
    expect(axiosMock.get).toHaveBeenCalledWith(url)
    expect(getByTestId('fullname').textContent).toBe(user.fullname)
    expect(getByTestId('username').textContent).toContain(user.username)
    expect(getByTestId('location').textContent).toContain(utils.iff(user.location, user.location, ''))
    expect(questions).toEqual(user.questions.map((question) => question.title))
    expect(getByTestId('Joined').textContent).toContain(utils.formatDate(user.registerDate))
    expect(getByTestId('lastSignedInDate').textContent).toContain(utils.formatDate(user.lastSignedInDate))
  })
})
