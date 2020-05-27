import { render, waitForElement, fireEvent } from '@testing-library/react'
import React from 'react'
import AlertWindow from '../components/AlertWindow/AlertWindow'

describe('AlertWindow tests', () => {
  test('renders and executes callback', async () => {
    let open = true
    const setOpen = () => {
      open = false
    }

    let value = 'not executed'
    const callback = () => {
      value = 'executed'
    }

    const title = 'alertWindow test'
    const content = 'alertWindow content'
    const cancelButton = 'cancel'
    const confirmButton = 'confirm'

    const { getByTestId } = render(
      <AlertWindow
        title={title}
        content={content}
        cancelButton={cancelButton}
        confirmButton={confirmButton}
        callback={callback}
        open={open}
        setOpen={setOpen}
      />,
    )

    await waitForElement(() => getByTestId('alert-container'))
    expect(getByTestId('title').textContent).toBe(title)
    expect(getByTestId('content').textContent).toBe(content)
    expect(getByTestId('confirm-button').textContent).toBe(confirmButton)
    expect(getByTestId('cancel-button').textContent).toBe(cancelButton)
    expect(open).toBe(true)
    fireEvent.click(getByTestId('cancel-button'))
    expect(value).toBe('not executed')
    expect(open).toBe(false)
    fireEvent.click(getByTestId('confirm-button'))
    expect(value).toBe('executed')
    expect(open).toBe(false)
  })
})
