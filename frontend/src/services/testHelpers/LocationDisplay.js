import { withRouter } from 'react-router-dom'
import React from 'react'

/**
 * used to test route redirection
 * usage:
 *      <Route path={'/somepath'}>
 *        <LocationDisplay />
 *      </Route>
 * after firing an event that redirects to /somepath, check if id did by:
 * expect(getByTestId('location-display').textContent).toEqual(/somepath)
 * */
const LocationDisplay = withRouter(({ location }) => (
  <div data-testid="location-display">{location.pathname}</div>
))

export default LocationDisplay
