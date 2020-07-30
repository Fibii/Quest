import React from 'react'
import {
  render, waitForElement, screen,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import axiosMock from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import questions from '../__mocks__/questions'
import SearchBar from '../components/SearchBar/SearchBar'
import LocationDisplay from '../services/testHelpers/LocationDisplay'


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
  beforeEach(() => {
    if (window.document) {
      window.document.createRange = () => ({
        setStart: () => {},
        setEnd: () => {},
        commonAncestorContainer: {
          nodeName: 'BODY',
          ownerDocument: document,
        },
      })
    }
  })
  test('renders SearchBar and shows search result', async () => {
    await setup()
    expect(
      screen.getByRole('textbox'),
    ).toBeInTheDocument()
    await userEvent.type(
      screen.getByRole('textbox'),
      SEARCH_VALUE,
      { allAtOnce: true },
    )
    expect(
      screen.getByRole('option', { name: /second question/i }),
    ).toHaveTextContent(questions[1].title)
  })

  test('redirects to a question when a question is clicked', async () => {
    const { getByTestId } = await setup()
    const QUESTION_LINK = `${MAIN_URL}question/${questions[1].id}`
    await userEvent.type(
      screen.getByRole('textbox'),
      SEARCH_VALUE,
      { allAtOnce: true },
    )
    await userEvent.click(screen.getByRole('option'))
    expect(getByTestId('location-display')).toHaveTextContent(QUESTION_LINK)
  })
})
