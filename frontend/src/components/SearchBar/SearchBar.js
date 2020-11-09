import React, { useEffect, useState } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { grey } from '@material-ui/core/colors'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useHistory, useLocation } from 'react-router-dom'
import questionService from '../../services/questions'
import config from '../../config'


const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: '60%',
    },
  },
  clearIndicator: {
    marginRight: 4,
  },
  popupIndicator: {
    display: 'none',
  },
  textfield: {
    color: grey[100],
    paddingLeft: 8,
    fontSize: '1rem',
    marginBottom: 8,
    width: '100%',
  },
  autocomplete: {
    width: '100%',
    height: 40,
  },
}))

const SearchBar = () => {
  const classes = useStyles()
  const [questions, setQuestions] = useState([])
  const history = useHistory()
  const location = useLocation()
  const { urls } = config

  useEffect(() => {
    const getQuestions = async () => {
      const questions = await questionService.getAll()
      if (!questions) {
        console.log('ERROR: CANNOT GET QUESTIONS')
      } else {
        setQuestions(questions)
      }
    }
    getQuestions()
  }, [])

  return (
    <div data-testid="searchBar-container" className={classes.search}>
      <Autocomplete
        multiple
        id="searchbar"
        data-testid="searchbar"
        options={questions}
        getOptionLabel={(question) => question.title}
        noOptionsText="No questions were found"
        key={location.pathname}
        freeSolo
        className={classes.autocomplete}
        classes={{
          popupIndicator: classes.popupIndicator,
          clearIndicator: classes.clearIndicator,
        }}
        onChange={(event, newValue) => {
          if (newValue && newValue[0]) {
            console.log(newValue[0].id)
            history.push(`${urls.question}/${newValue[0].id}`)
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            type="textarea"
            margin="dense"
            fullWidth
            variant="standard"
            InputProps={{
              type: 'text',
              ...params.InputProps,
              ...{
                disableUnderline: true,
              },
              className: classes.textfield,
            }}
          />
        )}
      />
    </div>
  )
}

export default SearchBar
