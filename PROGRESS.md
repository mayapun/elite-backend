## Day 1 – (Feb 10, 2026)

Time spent: 2 hours
What I built: created a skeleton, postgresql db, users table, inserted two users by creating an API to post users
Bugs I hit: nothing
Concepts learned: docker, container for db via docker, fast api, get_db session to get unique db session
Things I didn’t understand: all set with today's plan
Tomorrow’s focus: routers, schemas,password hashing, real signup/login, proper structure

Confidence (1–10): 8.5 

## Day 2 – (Feb 10, 2026)

Time spent: 1 hour
What I built: signup and login page, password hashing
Hardest part: making signup and login pages work
Concept learned: password hashing and routers and services
Confidence 1–10: 8

1. Why we use schemas instead of models
    We use schemas for data validation/serialization and for API input/output but we use models for database structure and DB operations
2. Why passwords are hashed
    To protect password with extra security
3. What service layer does
    It's for business logic and database operations(internal)
4. What router layer does
    It's for API endpoints and request handling 
5. Flow of signup request
    POST request -> router to endpoint -> DB session -> check email -> service creates user(hashes password, saves to DB) -> response with user info 


## Day 3 – (Feb 10, 2026)

Time spent: 1 hour
What I built: tokens, secret key, server using secret key generate tokens and later singed with secret to log them in, HTTPBearer to extract token from Authorization header
Hardest part: getting the /me work but turned out I was using the whole json output instead of just the token lol
Concept learned: login, login with token, secret key, authorization header with token and HTTPBearer to extract it
Confidence 1–10: 9


## Day 4 – (Feb 11, 2026)

Time spent: 1 hour
What I built: post creation, schemas, models, foreign key and backpopulates  
Hardest part: all easy but many new things to soak in
Concept learned: foreign key, models, shcemas, db, foreign key - enforces referential integrity, I can't create a post with a user_id that deosn't exist and it defines the relationship between the posts and users tables so joins/relationships make sense
Confidence 1–10: 8

## Day 5 – (Feb 11, 2026)

Time spent: 1 hour
What I built: get posts, delete posts, update posts 
Hardest part: testing in fast api docs haha 
Concept learned: models, schemas, lots of back and forth with routers and services, api testing, authorizattion vs Authentication

Authentication : Who are you?
Authorization: What can you do ? 
401 - unauthorized, 403 - don't exist, 404 - Not allowed 
Confidence 1–10: 9


Day 6

Time spent: 1 hr
Hardest concept: not the hardest but got more familiar with limit and offset
What clicked:limit and offset and pagination and why order_by matters
Confidence: 9.5!
