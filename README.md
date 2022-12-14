# Coralit - Surf everything

Coralit is a social media platform based on [Reddit](https://www.reddit.com/). It was developed as a personal project to learn and put together the skills of a front-end developer.

## Technologies

- React
- Jest
- Redux

## Development

Study of Reddit's structure
<img src='./src/assets/documentation/reddit-study.png'>

Order of business:

1. Setup Firebase auth and storage
2. Login & Register page
3. Setup Communities database
4. Community interface
5. Community page
6. Post creation page
7. Comment creation interface
8. Setup upvotes (flexible order)
9. Setup user settings and subs
10. User/Profile page
11. Home page
12. Search interface
13. Home page filters (hot, best, new, etc)
14. User activity tabs (posts, comments)
15. (opt) Home side panels (communities leaderboard)

#### Auth

- Setup unique username filter (firebase-admin setup) OK
- add error handling UI OK
- add password patterns OK
- add styled-components red on invalid inputs (:invalid or using state/classes) OK
- add login validation OK
- add validation messages OK
- code Verify email interface, once verified make it redirect to home OK
