import React, { useEffect, useState } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Link } from 'react-router-dom'
import questionService from '../../services/questions'
import grey from '@material-ui/core/colors/grey'

const drawerWidth = '80%'

const useStyles = makeStyles(theme => ({

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

  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputRoot: {
    color: 'inherit',
  },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },

  drawer: {
    width: drawerWidth,
    height: '80%',
  },

  drawerPaper: {
    width: drawerWidth,
    marginTop: 80,
    margin: '0 auto',
    background: grey[100]
  },

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },

  link: {
    textDecoration: 'none',
    color: 'inherit',
    outline: 'none'
  }

}))

const SearchBar = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [questions, setQuestions] = useState([])

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

  const handleInput = (event) => {
    setSearchInput(event.target.value)
    if (searchInput.length > 0) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon/>
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
        onChange={handleInput}
      />
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="top"
          transitionDuration={0}
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >

          <List>
            {questions && questions.filter(question => question.title.startsWith(searchInput))
              .map(question => (
                <Link to={`/question/${question.id}`} className={classes.link}
                      onClick={() => setOpen(false)} key={question.id}>
                  <ListItem button><ListItemText>{question.title}</ListItemText></ListItem>
                </Link>
              ))}
          </List>
        </Drawer>
      </ClickAwayListener>
    </div>
  )

}

export default SearchBar
