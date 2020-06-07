import { render } from '@testing-library/react'
import React from 'react'
import Notification from '../components/Notification/Notification'

describe('Notification Tests', () => {
  test('renders title and message', () => {
    const title = 'Error'
    const message = 'an internal error has occurred'
    const { getByTestId } = render(
      <Notification title={title} message={message} />,
    )
    expect(getByTestId('title').textContent).toEqual(title)
    expect(getByTestId('message').textContent).toEqual(message)
  })
})
