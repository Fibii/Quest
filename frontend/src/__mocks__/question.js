const question = {
  tags: [],
  comments: [
    {
      content: 'yes new comment by fibi',
      likes: [
        {
          _id: '5e76c5a7bdd6e639a05e3d13',
          value: 0,
        },
        {
          _id: '5e875c31a876bf63d94cd601',
          value: 1,
          likedBy: '5e875947a876bf63d94cd5fe',
        },
        {
          _id: '5e875c33a876bf63d94cd603',
          value: -2,
          likedBy: '5e875947a876bf63d94cd5fe',
        },
      ],
      postedBy: null,
      id: '5e76c5a7bdd6e639a05e3d12',
    },
    {
      content: 'another comment by fibi',
      likes: [
        {
          _id: '5e76c5b0bdd6e639a05e3d15',
          value: 0,
        },
        {
          _id: '5e875c2aa876bf63d94cd5ff',
          value: 1,
          likedBy: '5e875947a876bf63d94cd5fe',
        },
      ],
      postedBy: null,
      id: '5e76c5b0bdd6e639a05e3d14',
    },
    {
      content: 'comment by fibi ayy',
      likes: [
        {
          _id: '5e8e344142b04e2f7dbe2227',
          value: 0,
        },
      ],
      postedBy: {
        username: 'fibi',
        id: '5e8e330f42b04e2f7dbe2224',
      },
      id: '5e8e344142b04e2f7dbe2226',
    },
    {
      content: '6666',
      likes: [
        {
          _id: '5e8fc13967ee260e05339971',
          value: 0,
        },
      ],
      postedBy: {
        username: 'fibi',
        id: '5e8e330f42b04e2f7dbe2224',
      },
      id: '5e8fc13967ee260e05339970',
    },
  ],
  title: 'asdawd asdwa ',
  content: 'dsawd asdwad asdwa',
  solved: false,
  likes: [
    {
      _id: '5e90f2b22370477f68d95fd0',
      value: 0,
    },
  ],
  postedDate: '2020-04-10T22:26:58.674Z',
  postedBy: {
    username: 'fibi',
    id: '5e8e330f42b04e2f7dbe2224',
  },
  id: '5e90f2b22370477f68d95fcf',
}

export default question
