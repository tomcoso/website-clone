# Coralit - Surf everything

Coralit is a social media platform based on [Reddit](https://www.reddit.com/). It was developed as a personal project to learn and put together the skills of a front-end developer.

## Technologies

- React
- Jest
- Redux

## Development

Study of Reddit's structure
<img src='./src/assets/documentation/reddit-study.png'/>

Database design for communities
<img src='./src/assets/documentation/community-db.png'/>

Order of business:

1. Setup Firebase auth and storage OK
2. Login & Register page OK
3. Setup Communities database OK
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

- add username pattern for no spaces or special charaacters! OK

#### Community

- setup create community page OK
- setup community page
  - setup /submit page (post creation) or /login redirect OK
  - setup firebase fn to get posts OK
  - create post panel OK
  - setup firebase fn to join comm and leave, use button OK
- add community banner picture to community creation fn in firebase app
- setup security rules to handle email verified users authority OK / also with posts and comments!
- finish all firebase community fns OK
- buff community creation OK and add editing features on admin OK
- update comm banner and profile to use url from settings OK
- add title and description settings OK
- change admin panel into sidebar with views OK

#### Posts

- setup post creation (/submit) OK
- add image or post sections, add spoiler tag OK
- post main page
  - populate page OK
  - style minimally OK
  - display images and slideshow OK
  - skeleton comments section OK
- post panel component OK
- post admin popup panel OK
- post admin options on mod admin page
- setup comment creation OK
- setup comment and post admin features OK (TODO ADMIN)
  - edit (no fn for now) OK
  - delete OK
  - report (no fn) OK

#### User profile page

#### Misc

- give nsfw warning on communities u are not member of
- reorganise firebase apps into separate topic modules OKish
- integrate prefers-color-scheme to autodetect desired theme
- populate dots menus for post and comments (delete options when owner)
- make comments collapsable and pagionation
- make upvote arrows orange
- comment and post SORT fn
