import React from 'react'
import {
  render, waitForElement, cleanup, fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import questions from '../__mocks__/questions'
import LocationDisplay from '../services/testHelpers/LocationDisplay'
import SearchBar from '../components/PartialViews/SearchBar'
import inputHelper from '../services/testHelpers/inputHelper'

afterAll(cleanup)
afterEach(() => {
  jest.clearAllMocks()
})

const MAIN_URL = process.env.REACT_APP_URL
const SEARCH_VALUE = 'sec'

const setup = async () => {
  axiosMock.get.mockResolvedValueOnce({
    data: questions,
  })

  const renderResult = render(
    <MemoryRouter initialEntries={[MAIN_URL]}>
      <LocationDisplay />
      <Route path={MAIN_URL}>
        <SearchBar />
      </Route>
    </MemoryRouter>,
  )

  await waitForElement(() => renderResult.getByTestId('searchBar-container'))
  return renderResult
}


describe('SearchBar tests', () => {
  test('renders SearchBar and shows search result', async () => {
    const { getByTestId, getAllByTestId } = await setup()
    expect(getByTestId('searchBar-container')).toBeInTheDocument()
    fireEvent.change(getByTestId('searchBar-input'), inputHelper.parseValue(SEARCH_VALUE))
    expect(getByTestId('content')).toBeInTheDocument()
    const titles = getAllByTestId('content-title').map((question) => question.textContent)
    expect(titles).toContain(questions[1].title)
  })
})
