import React from 'react'
import {
  render, waitForElement, cleanup, fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import user from '../__mocks__/user'
import Header from '../components/Header'
import UserContext from '../components/UserContext'
import questions from '../__mocks__/questions'

afterAll(cleanup)
afterEach(() => {
  jest.clearAllMocks()
})

const MAIN_URL = process.env.REACT_APP_URL

describe('header tests', () => {
  test('renders header and drawer with logged in user', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: questions,
    })

    const { getByTestId } = render(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={[MAIN_URL]}>
          <Route path={MAIN_URL}>
            <Header />
          </Route>
        </MemoryRouter>
      </UserContext.Provider>,
    )

    await waitForElement(() => getByTestId('header-container'))
    expect(getByTestId('header-container')).toBeInTheDocument()
    fireEvent.click(getByTestId('open-drawer'))
    expect(getByTestId('drawer-container')).toBeInTheDocument()
  })
})
