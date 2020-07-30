
export const initialState = {
  drawerIsOpen: false,
  anchorEl: null,
}

export const headerReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_DRAWER': return {
      ...state,
      drawerIsOpen: true,
    }
    case 'CLOSE_DRAWER': return {
      ...state,
      drawerIsOpen: false,
    }
    case 'SET_ANCHOREL': return {
      ...state,
      anchorEl: action.anchorEl,
    }
    default: throw new Error(`unknown action type: ${action.type}`)
  }
}
