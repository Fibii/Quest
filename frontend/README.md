# Quest

![Status](https://img.shields.io/badge/Status-developing-brightgree)
![Actions Status](https://github.com/Fibii/Quest/workflows/Github%20CI/badge.svg)

Quest is a question/answer webapp based on React. It provides basic interactive operations, such as 
- creating questions (and editing/updating them) 
- upvote system (upvoting or downvoting a question/comment)
- profile page (a page that shows the info of a user alongside the questions they posted) 
- comments
- search functionality (currently just a stub)
- UI supports both desktop and mobile resolutions
 
##### Design 

- `/components`: contains react components, this is where the logic that makes the 
app works is written alongside ui code

- `/services`: contains utils the app uses, such as: 
    - API: `questions`, `users`
    - Validator: validates user input
    - Utils: contains helper functions that are used by multiple components
    - Test Helpers: components/function used specifically for `__tests__`
    
- `/actions`: if you used `redux`, you know what actions are, otherwise [check this link](https://redux.js.org/basics/actions), for 
now, there's only one action, `Question Action` and its `dispatch` wrapper, i choose to go with this implementation
because `Question` component was too big (~900 loc) and now it's ~300 loc

- `/reducers`: since there's only one `action`, there's also only one `reducer`
which is `Question Reducer`

- `__tests__`: includes tests for all the components, all of this tests should pass, if 
a test fails, then it is a bug and it should be reported. 
*(if you're contributing, make sure all your tests pass before you do a PR)*
- Context api for user auth, (if the user selects remember me, the token is saved
in localStorage, this will be replaced with cookies in the future)

- To keep components clean and readable, they'll be split into two parts, for `Question` component, `Question`and `QuestionView` will have the 
`View` (`Question` should have api logic and such, `QuestionView` will have the ui as a `jsx`)
, the reason for this is to make it easier to customize the app without needing 
react knowledge

##### Testing

- Keep the design simple, don't re-test components, example:
    1. instead of testing the whole `Comment` component inside `Question`, test `comment.content`
    only, and test `Comment` as a whole component in its own test file
    
    2. don't write useless tests: if `user.username` is rendered as `@(username)`, don't tests
    whether `@()` is rendered or not, instead check if `username` is in `@(username)`


